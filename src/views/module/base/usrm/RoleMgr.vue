<template>
  <div class="flex-h">
    <el-card class="flex-1 full">
      <template slot="header">
        <span>系统角色管理</span>
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-fa-expand" @click="expandAll"></el-button>
          <el-button type="primary" icon="el-icon-fa-refresh" @click="refresh"></el-button>
          <el-button type="primary" icon="el-icon-fa-copy" title="角色复制" @click="doAdd"></el-button>
        </div>
      </template>
      <el-tree ref="roleTree" :default-expand-all="expandedAll" lazy :current-node-key="current.roleUuid" :load="loadTree" node-key="uuid" :expand-on-click-node="false" highlight-current @current-change="currentChange">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span v-if="data.orgName">
            <i class="el-icon-fa el-icon-fa-sitemap margin-right-2 font-green-success" />
            <span>{{data.orgName}}</span>
          </span>
          <span v-if="data.roleName&&data.parRoleUuid==='none'&&data.roleType==='1'">
            <i class="el-icon-fa el-icon-fa-user-o margin-right-2 font-blue" />
            <span>{{data.roleName}}</span>
          </span>
          <span v-if="data.roleName&&data.parRoleUuid==='none'&&data.roleType==='2'">
            <i class="el-icon-fa el-icon-fa-folder-open margin-right-2 font-yellow-gold" />
            <span>{{data.roleName}}</span>
          </span>
          <span v-if="data.roleName&&data.parRoleUuid!=='none'">
            <i class="el-icon-fa el-icon-fa-user-o margin-right-2 font-blue" />
            <span>{{data.roleName}}</span>
          </span>
          <el-button-group>
            <el-button icon="el-icon-fa-refresh" @click="refreshNode(node)" />
            <el-button :disabled='$store.state.base.sysUser.graUser==="0"' icon="el-icon-fa-plus" @click="addNode(node)" />
            <el-button icon="el-icon-fa-minus" @click="removeNode(node)" :disabled="!!data.orgName||$store.state.base.sysUser.graUser==='0'" />
          </el-button-group>
        </span>
      </el-tree>
    </el-card>
    <div class="flex-2 flex-h  margin-left-3">
      <el-card class="flex-1 full">
        <template slot="header">
          <span>角色信息编辑</span>
          <div class="pull-right">
            <el-button :disabled='$store.state.base.sysUser.graUser==="0"' type="primary" @click="submit" icon="el-icon-fa-save" title="保存" v-show="current.roleUuid"></el-button>
          </div>
        </template>
        <RoleEditor class="full-height" @onsave="onsave" ref="roleEditor" v-show="current.roleUuid" :uuid="current.roleUuid" :org-uuid="current.orgUuid"></RoleEditor>
      </el-card>
      <el-dialog append-to-body v-draggable width="800px" :visible.sync="editor.show" title="角色复制">
        <div class="dialog-button">
          <el-button-group>
            <el-button type="primary" plain icon="el-icon-fa-save" @click="doSubmit()" title="复制"></el-button>
          </el-button-group>
        </div>
        <CopyEditor v-if="editor.show" ref="userEditor" :uuid="editor.uuid"></CopyEditor>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import RoleAPI from "@/api/base/usrm/RoleAPI";
import RoleEditor from "./RoleEditor";
import CopyEditor from "./RoleCopy";

export default {
  name: "RoleMgr",
  components: { RoleEditor, CopyEditor },
  data() {
    return {
      view: {
        loading: false
      },
      current: {
        data: null,
        orgUuid: null,
        roleUuid: null
      },
      editor: {
        error: {},
        show: false,
        uuid: null,
        visible: false,
        loading: false
      },
      expandedAll: false
    };
  },
  mounted() {
    this.refresh();
  },
  methods: {
    // 角色复制保存
    doSubmit() {
      this.$refs.userEditor.onSubmit(this.current.roleUuid);
      this.cancelEditorLoading();
    },
    // 打开新建画面
    doAdd() {
      this.editor.show = true;
    },
    // 关闭加载页面
    cancelEditorLoading() {
      this.editor.show = false;
      this.editor.loading = false;
    },
    // 刷新树节点
    refresh() {
      this.view.loading = true;
      this.current.roleUuid = null;
      RoleAPI.getRoleChildren()
        .then(resp => resp.data)
        .then(data => {
          this.$refs.roleTree.root.children = data;
          this.view.loading = false;
        });
    },
    // 提交角色编辑页信息
    submit() {
      this.$refs.roleEditor.submit();
    },
    // 保存角色编辑页信息
    onsave() {
      if (this.current.data) {
        Object.assign(this.current.data, this.$refs.roleEditor.data);
      }
    },
    //  展开/关闭 全部
    expandAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(function(element) {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.roleTree.root);
    },
    // 点击菜单树节点
    currentChange(data, node) {
      this.current.roleUuid = null;
      if (data.roleName) {
        this.current.roleUuid = data.uuid;
        this.current.orgUuid = node.parent.data.uuid;
        this.current.data = data;
      }
    },
    // 加载树内容
    loadTree(node, resolve) {
      let puuid;
      if (node.data) {
        puuid = node.data.uuid;
      }
      RoleAPI.getRoleChildren(puuid).then(resp => {
        resp.data && resolve(resp.data);
      });
    },
    // 添加菜单
    addNode(node) {
      this.view.loading = true;
      let data = node.data;
      let newNode = {
        roleType: "1",
        roleName: "新建角色"
      };
      if (data.roleName) {
        // 表示是角色
        newNode.parRoleUuid = data.uuid;
      } else {
        // 表示是关区
        newNode.orgUuid = data.uuid;
      }
      node.expand(() => {
        RoleAPI.editRoleNode(newNode).then(data => {
          newNode.uuid = data.uuid;
          node.insertChild({ data: newNode }); // 让当前节点追加一个新节点
          this.current.roleUuid = data.uuid;
          this.current.orgUuid = newNode.orgUuid;
          this.current.data = newNode;
          this.view.loading = false;
        });
      }, this);
    },
    // 删除菜单
    removeNode(node) {
      // 删除菜单实际要执行的方法
      let action = data => {
        this.view.loading = true;
        RoleAPI.delRoleNode(data.uuid)
          .then(data => {
            node.parent.removeChild(node);
            this.view.loading = false;
          })
          .catch(() => {
            this.view.loading = false;
          });
      };
      // 单出提示,然后执行该方法
      this.confirm(node.data).then(action);
    },
    // 刷新菜单
    refreshNode(node) {
      node.loaded = false;
      node.expand();
    }
  }
};
</script>
