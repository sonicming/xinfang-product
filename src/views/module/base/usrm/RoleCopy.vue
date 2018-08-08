<template>
  <div style='height: 600px;'>
    <el-alert type="warning" close-text="知道了" title='您可以选择指定海关下的指定角色,批量复制到目标海关中.'></el-alert>
    <div class="flex-h" style='height: 563px;'>
      <el-card class="flex-1 full  margin-1">
        <template slot="header">
          <span>选择海关</span>
          <div class="pull-right">
            <el-button type="primary" icon="el-icon-fa-expand" @click="expandRoleAll"></el-button>
          </div>
        </template>
        <el-tree style="min-height:400px" ref="roleTree" @node-click="handleCheckChange" :default-expand-all="expandedAll" node-key="uuid" lazy :current-node-key="currNode.uuid" :load="loadRoleTree" :expand-on-click-node="false" highlight-current :render-content="renderContentRole"></el-tree>
      </el-card>
      <el-card class="flex-1 full  margin-1">
        <template slot="header">
          <span>选择角色</span>
        </template>
        <el-tree ref="roleOrgTree" node-key="uuid" :default-expand-all="true" lazy :load="loadOrgRoleTree" current-node-key="currNode.uuid" :expand-on-click-node="false" highlight-current show-checkbox>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="data.roleName&&data.parRoleUuid==='none'">
              <i class="el-icon-fa el-icon-fa-user-circle margin-right-2 font-blue" />
              <span>{{data.roleName}}</span>
            </span>
            <span v-if="data.roleName&&data.parRoleUuid!=='none'">
              <i class="el-icon-fa el-icon-fa-user-o margin-right-2 font-yellow-casablanca" />
              <span>{{data.roleName}}</span>
            </span>
          </span>
        </el-tree>
      </el-card>
      <el-card class="flex-1 full  margin-1">
        <template slot="header">
          <span>目标复制海关</span>
          <div class="pull-right">
            <el-button type="primary" icon="el-icon-fa-expand" @click="expandAll"></el-button>
          </div>
        </template>
        <el-tree ref="orgTree" :default-expand-all="expandedAll" v-loading="saving" lazy :load="loadTree" node-key="uuid" :current-node-key="currNode.uuid" :expand-on-click-node="false" highlight-current :render-content="renderContent" @current-change="currentChange" show-checkbox :check-strictly="true"></el-tree>
      </el-card>
    </div>
  </div>
</template>
<script>
import OrgAPI from "@/api/base/usrm/OrgAPI";
import RoleAPI from "@/api/base/usrm/RoleAPI";

export default {
  data() {
    return {
      currParentNode: {},
      currNode: {
        data: null,
        orgUuid: null,
        roleUuid: null
      },
      saving: false,
      expandedAll: false,
      editor: {
        error: {}
      },
      rules: {
        name: [{ required: true, message: "角色名称不能为空!" }]
      }
    };
  },
  mounted() {
    // 读取系统菜单
    OrgAPI.getChildren().then(resp => {
      this.$refs.orgTree.root.setData(resp.data);
    });
    RoleAPI.getRoleChildren().then(resp => {
      // 角色表的第一位节点肯定是管区，禁用即可
      /*  resp.data.forEach((el) => { el.disabled = true }) */
      this.$refs.roleTree.root.setData(resp.data);
    });
  },
  submitForm(data) {
    this.$refs.form.validate(valid => {
      if (valid) {
        // 通知父类组件一个提交事件
        this.$emit("submit", this.data);
      } else {
        console.log("error submit!!");
        return false;
      }
    });
  },
  methods: {
    selectAll() {
      // console.log(this.$refs)
      this.$refs.roleOrgTree.setCheckedKeys();
    },
    // 提交数据
    onSubmit(roleuuid) {
      let newNode = {
        uuid: roleuuid,
        orgUuids: this.$refs.orgTree.getCheckedKeys(),
        roleUuids: this.$refs.roleOrgTree.getCheckedKeys()
      };
      RoleAPI.copyRoleNode(newNode);
    },
    handleCheckChange(data, checked, indeterminate) {
      RoleAPI.getCopyRoleTree(data.uuid).then(resp => {
        this.$refs.roleOrgTree.root.setData(resp.data);
      });
    },
    // 点击菜单树节点
    currentChange(data, node) {
      this.currParentNode = node.parent.data || {};
      this.currNode = data || {};
    },
    loadOrgRoleTree(node, resolve) {
      if (node.data) {
        RoleAPI.getOrgRoleTree(node.data.uuid)
          .then(resp => resp.data)
          .then(resolve);
      } else {
        resolve([]);
      }
    },
    loadRoleTree(node, resolve) {
      if (node.data) {
        OrgAPI.getChildren(node.data.uuid)
          .then(resp => resp.data)
          .then(resolve);
      } else {
        resolve([]);
      }
    },
    // 加载树内容
    loadTree(node, resolve) {
      if (node.data) {
        OrgAPI.getChildren(node.data.uuid)
          .then(resp => resp.data)
          .then(resolve);
      } else {
        resolve([]);
      }
    },
    // 刷新树
    refreshNode(node) {
      node.loaded = false;
      node.expand(() => {
        node.childNodes.forEach(element => {
          element.isLeaf = element.data.roleType === "1";
          element.loaded = element.data.roleType === "1";
        }, this);
      });
    },
    // 全部展开关区树
    expandAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(function(element) {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.orgTree.root);
    },
    expandRoleAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(function(element) {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.roleTree.root);
    },
    // 渲染树内容方法
    renderContent(h, { node, data, store }) {
      let refreshBtn = (
        <el-button
          icon="el-icon-fa-refresh"
          onClick={() => {
            this.refreshNode(node);
          }}
        />
      );
      return (
        <span>
          <span clasS={data.orgStat === "0" ? "removed-line-through" : ""}>
            {data.orgName}
          </span>
          <span style="position:absolute;right: 20px">
            <el-button-group>{refreshBtn}</el-button-group>
          </span>
        </span>
      );
    },
    renderContentRole(h, { node, data, store }) {
      let refreshBtn = (
        <el-button
          icon="el-icon-fa-refresh"
          onClick={() => {
            this.refreshNode(node);
          }}
        />
      );
      return (
        <span>
          <span clasS={data.orgStat === "0" ? "removed-line-through" : ""}>
            {data.orgName}
          </span>
          <span style="position:absolute;right: 20px">
            <el-button-group>{refreshBtn}</el-button-group>
          </span>
        </span>
      );
    }
  }
};
</script>
