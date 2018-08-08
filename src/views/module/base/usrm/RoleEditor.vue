<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane label="角色编辑">
        <el-form class="etong" ref="form" :model="data" label-position="top" :rules="rules">
          <div class="flex-h ">
            <el-form-item class="flex-1" label="角色名称" prop="roleName" :error="error.roleName">
              <el-input v-model="data.roleName"></el-input>
            </el-form-item>
            <el-form-item class="flex-1" label="角色类型" prop="roleType" :error="error.roleType">
              <el-select v-model="data.roleType" placeholder="请选择类型">
                <el-option v-for="item in roleTypes" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="flex-1 " label="数据权限" prop="dataAuth" :error="error.dataAuth">
              <el-select v-model="data.dataAuth" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="角色描述" prop="roleDesc" :error="error.roleDesc">
            <el-input type="textarea" v-model="data.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <HandleHistory :uuid="data.uuid" :cr-user-uuid="data.crUserUuid" :op-user-uuid="data.opUserUuid" :cr-time="data.crTime" :op-time="data.opTime" mode="plan"></HandleHistory>
      </el-tab-pane>
      <el-tab-pane label="分配用户">
        <el-form :inline="true" :model="queryform" ref="queryform">
          <el-form-item label="登录账号" prop="userid">
            <el-input v-model="queryform.userid" placeholder="登录账号"></el-input>
          </el-form-item>
          <el-form-item label="用户名称" prop="username">
            <el-input v-model="queryform.username" placeholder="用户名称"></el-input>
          </el-form-item>
        </el-form>
        <PageTable ref="multipleTable" row-key="uuid" border @load-data="dataTableLoad" :auto-load="false" :data="table.data" @selection-change="handleSelectionChange">
          <template slot="buttons">
            <el-button type="primary" @click="queryUserData" icon="el-icon-fa-search" title="查询"></el-button>
            <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
          </template>
          <el-table-column type="selection" :reserve-selection="true"></el-table-column>
          <el-table-column type="index" fixed='left'></el-table-column>
          <el-table-column prop="userid" label="登录账号"></el-table-column>
          <el-table-column prop="username" label="用户名称"></el-table-column>
          <el-table-column prop="usercode" label="用户工号"></el-table-column>
          <el-table-column prop="orgname" label="隶属机构" show-overflow-tooltip></el-table-column>
          <el-table-column prop="crtime" :formatter="formatterDateTime" label="创建时间" show-overflow-tooltip></el-table-column>
          <el-table-column prop="optime" :formatter="formatterDateTime" label="最后修改时间" show-overflow-tooltip></el-table-column>
        </PageTable>
      </el-tab-pane>
      <el-tab-pane label="功能分配">
        <el-tree ref="permTree" node-key="uuid" :data="permTreeData" :props="permTreeProp" :default-expand-all="true" highlight-current show-checkbox></el-tree>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import RoleAPI from "@/api/base/usrm/RoleAPI";
import PermApi from "@/api/base/usrm/PermAPI";
import UserAPI from "@/api/base/usrm/UserAPI";
import HandleHistory from "@/views/common/HandleHistory";

let dafaultData = {
  uuid: "",
  orgUuid: "",
  roleName: "",
  roleDesc: "",
  roleType: "",
  parRoleUuid: "",
  dataAuth: null
};

export default {
  components: { HandleHistory },
  props: {
    uuid: {
      type: String,
      default: null
    },
    orgUuid: {
      type: String,
      default: null
    }
  },
  watch: {
    uuid(uuid) {
      if (uuid) {
        this.loadInfo();
      } else {
        this.data = Object.assign({}, dafaultData);
      }
    }
  },
  data() {
    return {
      dirty: false,
      multipleSelection: [],
      data: Object.assign({}, dafaultData),
      roleTypes: [{ value: "1", label: "角色" }, { value: "2", label: "目录" }],
      permTreeData: [],
      view: {
        loading: false
      },
      queryform: {
        username: "",
        userid: "",
        uuid: this.uuid
      },
      table: {
        data: []
      },
      error: {},
      rules: {
        name: [{ required: true, message: "角色名称不能为空!" }]
      },
      permTreeProp: { label: "permName", children: "children" },
      options: [
        { value: 0, label: "本人" },
        { value: 1, label: "本关区" },
        { value: 2, label: "本关区及下属关区" },
        { value: 3, label: "所有关区" }
      ]
    };
  },
  mounted() {
    // 读取系统菜单
    PermApi.loadPermTree().then(data => {
      this.permTreeData = data;
    });
  },
  methods: {
    resetquery() {
      this.$refs.queryform.resetFields();
    },
    queryUserData() {
      this.$refs.multipleTable.load(this.queryform);
    },
    dataTableLoad(params, resolve) {
      params.orgUuid = this.data.orgUuid;
      UserAPI.getRoleUserByOrgId(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    // 获取选中值
    handleSelectionChange(val) {
      this.data.userIds = [];
      val.forEach(element => {
        this.data.userIds.push(element.uuid);
      }, this);
    },
    // 加载编辑器需要的信息
    loadInfo() {
      this.view.loading = true;
      this.$refs.multipleTable.clearSelection();
      this.data.userIds = [];
      this.queryform.uuid = this.uuid;
      RoleAPI.loadRoleEditInfo(this.uuid).then(data => {
        this.data = data;
        this.view.loading = false;
        // 在功能页上回显数据
        this.$refs.permTree.setCheckedKeys([]);
        data.permIds.forEach(uuid => {
          this.$refs.permTree.setChecked(uuid, true, false);
        });

        data.userIds.forEach(uuid => {
          this.$refs.multipleTable.toggleRowSelection({ uuid }, true);
        });
        this.queryUserData();
      });
    },
    // 提交数据
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.view.loading = true;
          this.error = {};
          let data = Object.assign({}, this.data);
          if (this.orgUuid) {
            data.orgUuid = this.orgUuid;
          }
          let permTree = this.$refs.permTree;
          data.permIds = permTree
            .getCheckedKeys()
            .concat(permTree.getHalfCheckedKeys())
            .filter(uuid => uuid !== "none");

          // 处理选中节点的数组，遍历，把uuid放入userIds才可以
          return RoleAPI.editRoleNode(data)
            .then(data => {
              this.view.loading = false;
              this.$emit("onsave", this.data);
              return data;
            })
            .catch(error => {
              this.error = error.validError;
              this.view.loading = false;
            });
        }
      });
    }
  }
};
</script>
