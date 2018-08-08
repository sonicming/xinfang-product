<template>
  <div class="flex-h ">
    <el-card class="flex-2 full">
      <template slot="header">
        <span>系统组织机构一览</span>
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-fa-expand" @click="expandAll"></el-button>
          <el-button type="primary" icon="el-icon-fa-check-square-o" @click="checkNode" title="检查节点"></el-button>
          <el-button type="primary" icon="el-icon-fa-wrench" @click="repairNode" title="修复节点"></el-button>
        </div>
      </template>
      <el-tree ref="orgTree" :render-content="renderContent" :default-expand-all="expandedAll" v-loading="saving" lazy :load="loadTree" node-key="uuid" :current-node-key="currNode.uuid" :expand-on-click-node="false" highlight-current @current-change="currentChange" :props="treeProps">
      </el-tree>
    </el-card>
    <el-card header="组织机构编辑" class="flex-2 margin-left-3 full">
      <template slot="header" v-if='currNode.puuid!=="none"'>
        <span>组织机构编辑</span>
        <div class="pull-right">
          <el-button type="primary" @click="onSubmit" icon="el-icon-fa-save" v-if='currNode.puuid!=="none"&&currNode.uuid'></el-button>
        </div>
      </template>
      <el-form ref="form" :model="currNode" label-position='top' v-if='currNode.puuid!=="none"&&currNode.uuid'>
        <el-form-item label="组织机构编码" prop="orgCode" :error="editor.error.orgCode">
          <el-input v-model="currNode.orgCode"></el-input>
        </el-form-item>
        <el-form-item prop='puuid' label="上级组织机构">
          <Selector v-model="currNode.puuid" :init-label="currParentNode.orgName" :clearable="true" label-key="label" value-key="id" placeholder="隶属组织机构">
            <SelectorTree tree-key="orgTree" rootLabel="系统组织机构"></SelectorTree>
          </Selector>
        </el-form-item>
        <el-form-item label="组织机构名称" prop="orgName" :error="editor.error.orgName">
          <el-input v-model="currNode.orgName"></el-input>
        </el-form-item>
        <el-form-item label="负责人" prop="orgMast" :error="editor.error.orgMast">
          <el-input v-model="currNode.orgMast"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码" prop="orgPost" :error="editor.error.orgPost">
          <el-input v-model="currNode.orgPost"></el-input>
        </el-form-item>
        <el-form-item label="组织机构状态" prop="orgStat" :error="editor.error.orgStat">
          <el-radio-group v-model="currNode.orgStat">
            <el-radio label="1">可用</el-radio>
            <el-radio label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="组织机构简称" prop="orgBrfName" :error="editor.error.orgBrfName">
          <el-input type="textarea" v-model="currNode.orgBrfName"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="orgAddr" :error="editor.error.orgAddr">
          <el-input type="textarea" v-model="currNode.orgAddr"></el-input>
        </el-form-item>
        <el-form-item label="组织机构描述" prop="orgDesc" :error="editor.error.orgDesc">
          <el-input type="textarea" v-model="currNode.orgDesc"></el-input>
        </el-form-item>
      </el-form>
      <HandleHistory v-if='currNode.puuid!=="none"&&currNode.uuid' class="margin-top-2" :uuid="currNode.uuid" :cr-user-uuid="currNode.crUserUuid" :op-user-uuid="currNode.opUserUuid" :cr-time="currNode.crTime" :op-time="currNode.opTime" mode="plan">
      </HandleHistory>
    </el-card>
  </div>
</template>
<script>
import OrgAPI from "@/api/base/usrm/OrgAPI";
import HandleHistory from "@/views/common/HandleHistory";
import SelectorTree from "@/views/common/SelectorTree";

export default {
  name: "OrgMgr",
  components: { HandleHistory, SelectorTree },
  data() {
    return {
      currParentNode: {},
      currNode: {},
      saving: false,
      expandedAll: false,
      editor: {
        error: {}
      },
      rules: {
        name: [{ required: true, message: "角色名称不能为空!" }]
      },
      treeProps: {
        isLeaf: "isLeaf"
      }
    };
  },
  mounted() {},
  methods: {
    getTreeListen(orgId) {
      OrgAPI.getCopyRoleTree(orgId).then(resp => {
        if (this.$refs.roleTree) {
          this.$refs.roleTree.root.setData({ children: resp.data });
          if (this.data.arrRoles) {
            this.$refs.roleTree.setCheckedKeys(this.data.arrRoles, false);
          }
        }
      });
    },
    /**
     * 检查节点
     */
    repairNode() {
      OrgAPI.repairNode(this.currNode.uuid);
    },
    /**
     * 修复节点异常
     */
    checkNode() {
      OrgAPI.checkNode(this.currNode.uuid);
    },
    // 提交数据
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true;
          this.editor.error = {};
          OrgAPI.editNode(this.currNode)
            .then(data => {
              this.saving = false;
            })
            .catch(error => {
              this.editor.error = error.validError;
              this.saving = false;
            });
        }
      });
    },
    //  展开/关闭 全部
    expandAll() {
      this.expandedAll = true;
      let expandFn = (element, expand) => {
        element.childNodes.forEach(element => {
          if (!element.isLeaf) {
            element.expand(() => {
              expandFn(element);
            });
          }
        }, this);
      };
      expandFn(this.$refs.orgTree.root);
    },
    // 点击菜单树节点
    currentChange(data, node) {
      this.currParentNode = node.parent.data || {};
      this.currNode = data || {};
    },
    // 加载树内容
    loadTree(node, resolve) {
      let puuid = "none";
      if (node.data) {
        puuid = node.data.uuid;
      }
      OrgAPI.getChildren(puuid).then(resp => resp.data && resolve(resp.data));
    },
    // 添加菜单
    addNode(node) {
      let newNode = {
        orgName: "新建组织机构",
        orgCode: "请填写组织机构代码",
        orgStat: "1",
        puuid: node.data.uuid
      };
      this.saving = true;
      OrgAPI.editNode(newNode)
        .then(data => {
          Object.assign(newNode, {
            uuid: data.uuid,
            opUserUuid: this.$store.state.base.sysUser.uuid,
            crUserUuid: this.$store.state.base.sysUser.uuid
          }); // 合并刚才返回的UUID主键
          this.saving = false; // 保存结束
          node.insertChild({ data: newNode }); // 让当前节点追加一个新节点
          node.expand(() => {
            this.currNode = newNode;
          }); // 如果没拉取子节点,先拉取子节点,然后设置当前节点
        })
        .catch(() => {
          this.saving = false;
        });
    },
    // 删除菜单
    removeNode(node) {
      // 删除菜单实际要执行的方法
      let action = data => {
        this.saving = true;
        OrgAPI.delNode(data.uuid)
          .then(data => {
            this.saving = false;
            node.parent.removeChild(node);
          })
          .catch(() => {
            this.saving = false;
          });
      };
      // 单出提示,然后执行该方法
      this.confirm(node.data).then(action);
    },
    // 刷新菜单
    refreshNode(node) {
      node.loaded = false;
      node.expand(() => {});
    },
    // 树节点的内容区的渲染方法
    renderContent(h, { node, data, store }) {
      let addBtn = (
        <el-button icon="el-icon-fa-plus" onClick={() => this.addNode(node)} />
      );
      let refresh = (
        <el-button
          icon="el-icon-fa-refresh"
          onClick={() => this.refreshNode(node)}
        />
      );
      let deleteBtn = (
        <el-button
          icon="el-icon-fa-minus"
          onClick={() => {
            this.removeNode(node);
          }}
          disabled={data.puuid === "none"}
        />
      );
      return (
        <div>
          <span>
            <span class={"removed-line-through" + data.orgStat == "0"}>
              {data.orgName}
            </span>
          </span>
          <span style="position:absolute;right:20px;">
            <el-button-group>
              {refresh}
              {addBtn}
              {deleteBtn}
            </el-button-group>
          </span>
        </div>
      );
    }
  }
};
</script>
