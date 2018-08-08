<template>
  <el-tabs v-loading="loadingEur" elemeur-loading-text="正在读取数据..." type="card">
    <el-tab-pane label="基本信息">
      <el-form :model="data" ref="form" :rules="rules" label-position='top'>
        <el-row>
          <el-col :span='8'>
            <el-form-item label="登录账号" prop="userId">
              <el-input v-model="data.userId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="data.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="用户工号" prop="userCode">
              <el-input v-model="data.userCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item prop='orgId' label="隶属机构">
              <Selector v-model="data.orgId" :init-label="data.orgName" :clearable="true" label-key="label" value-key="id" placeholder="隶属组织机构">
                <SelectorTree tree-key="orgTree" searchField="ORG_NAME" rootLabel="海关"></SelectorTree>
              </Selector>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="分级管理员" prop="graUser">
              <el-radio-group v-model="data.graUser">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="性别">
              <el-radio-group v-model="data.userGend" class="border-bottom">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="地址">
              <el-input v-model="data.userAddr"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="邮箱" prop="userEMail">
              <el-input v-model="data.userEMail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="固定电话">
              <el-input v-model="data.userPhon"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item label="移动电话" prop="userMobl">
              <el-input v-model="data.userMobl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <HandleHistory :uuid="data.uuid" :cr-user-uuid="data.crUserUuid" :op-user-uuid="data.opUserUuid" :cr-time="data.crTime" :op-time="data.opTime" mode="plan"></HandleHistory>
    </el-tab-pane>
    <el-tab-pane label="角色选择" v-if="data.orgId">
      <el-tree ref="roleTree" node-key="uuid" :default-checked-keys="data.arrRoles" default-expand-all lazy :load="loadRole" current-node-key="currNode.roleuuid" highlight-current show-checkbox>
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
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import UserAPI from "@/api/base/usrm/UserAPI";
import RoleAPI from "@/api/base/usrm/RoleAPI";
import SelectorTree from "@/views/common/SelectorTree";
import HandleHistory from "@/views/common/HandleHistory";

let dafaultData = {
  uuid: "",
  userName: "",
  userCode: "",
  userId: "",
  userStat: "",
  userAddr: "",
  userEMail: "",
  userGend: "1",
  graUser: "0",
  userPhon: "",
  userMobl: "",
  orgId: "",
  arrRoles: [],
  cardId: ""
};
export default {
  components: { SelectorTree, HandleHistory },
  props: {
    uuid: "",
    error: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      options: [
        { value: 5, label: "生效" },
        { value: 6, label: "锁定" },
        { value: 9, label: "注销" }
      ],
      currParentNode: {},
      currNode: {},
      loadingEur: false,
      data: Object.assign({}, dafaultData),
      roles: [],
      rules: {
        userId: [{ required: true, message: "请输入用户登录账号" }],
        userName: [{ required: true, message: "请输入用户名称" }],
        userCode: [{ required: true, message: "请输入用户工号" }],
        orgId: [{ required: true, message: "请选择隶属机构" }],
        graUser: [{ required: true, message: "请选择是否为分级管理员" }]
      }
    };
  },
  mounted() {
    this.loadInfo(this.uuid);
  },
  watch: {
    "data.orgId"(val) {
      this.getTreeListen(val);
    }
  },
  methods: {
    // 提交表单数据
    submitForm(data) {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.data.arrRoles = this.$refs.roleTree.getCheckedKeys(); // 将树选择的节点数组放到表单中
          // 通知父类组件一个提交事件
          this.$emit("submit", this.data);
        } else {
          return false;
        }
      });
    },
    expandAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(element => {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.roleTree.root);
    },
    // 监听角色树判断
    getTreeListen(orgId) {
      if (this.$refs.roleTree) {
        this.$refs.roleTree.root.loaded = false;
        this.$refs.roleTree.root.expand();
      }
    },
    loadRole(node, resolve) {
      if (node.level === 0) {
        RoleAPI.getCopyRoleTree(this.data.orgId).then(resp => {
          resp.data && resolve(resp.data);
        });
      } else {
        RoleAPI.getRoleChildren(node.data.uuid).then(resp => {
          resp.data && resolve(resp.data);
        });
      }
    },
    loadInfo(uuid) {
      if (uuid) {
        UserAPI.getUser(uuid).then(resp => {
          this.data = Object.assign({}, resp.data.data);
          this.loadingEur = false;
        });
      } else {
        if (this.data.orgId) {
          this.getTreeListen(this.data.orgId);
        }
      }
    }
  }
};
</script>
