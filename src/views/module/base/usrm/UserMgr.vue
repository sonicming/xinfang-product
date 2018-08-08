<template>
  <div>
    <el-card>
      <template slot="header">
        <span>用户管理</span>
        <div class="pull-right">
          <el-button type="primary" @click="doAdd()" icon="el-icon-fa-plus" title="新增用户"></el-button>
        </div>
      </template>
      <el-form :model="queryform" ref="queryform">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="用户名称" prop="username">
              <el-input v-model="queryform.username" />
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="用户工号" prop="usercode">
              <el-input v-model="queryform.usercode" />
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="状态" prop="userstat">
              <el-select placeholder="状态" v-sys-code="'userstat'" v-model="queryform.userstat" clearable>
                <el-option v-for="item in sysCode.userstat" :key="item.key" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="隶属机构" prop="orgId">
              <Selector v-model="queryform.orgId" :clearable="true" label-key="label" value-key="id" placeholder="隶属组织机构">
                <SelectorTree tree-key="orgTree" searchField="ORG_NAME" rootLabel="组织机构" />
              </Selector>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="crtime" label="创建时间">
              <el-date-picker v-model="queryform.crtime" type="datetimerange" placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>用户数据列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryUserData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
          <el-button type="primary" :disabled="!multipleSelection.length>0" icon="el-icon-fa-lock" @click="lockAndOpenUsers(true)" title="批量锁定"></el-button>
          <el-button type="primary" :disabled="!multipleSelection.length>0" icon="el-icon-fa-unlock" @click="lockAndOpenUsers(false)" title="批量解锁"></el-button>
          <el-button type="primary" :disabled="!multipleSelection.length>0" icon="el-icon-fa-key" @click="resetUserPw" title="批量重置密码"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" @load-data="dataTableLoad" @selection-change="handleSelectionChange" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="selection" width="33" fixed='left'>
        </el-table-column>
        <el-table-column type="index" width="33" fixed='left'></el-table-column>
        <el-table-column prop="userid" label="登陆账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="用户名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="usercode" label="用户工号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userstat" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <SysCode :type="'userstat'" :value="scope.row.userstat"></SysCode>
          </template>
        </el-table-column>
        <el-table-column prop="orgname" label="隶属机构" show-overflow-tooltip></el-table-column>
        <el-table-column prop="crtime" :formatter="formatterDateTime" label="创建时间" show-overflow-tooltip></el-table-column>
        <el-table-column prop="optime" :formatter="formatterDateTime" label="最后修改时间" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" fixed='right' width="80" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-fa-edit" title="修改" @click="doEdit(scope.$index, scope.row)"></el-button>
            <el-button type="primary" title="登陆时间轴" icon="el-icon-location" @click="showTimeLine(scope.row)"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>

    <el-dialog append-to-body v-draggable :visible.sync="editor.show" title="用户管理" :close-on-click-modal="false">
      <div class="dialog-button">
        <el-button-group>
          <el-button type="primary" plain icon="el-icon-fa-save" @click="doSubmit()" title="保存修改" :disabled="editor.stat=='6' ||editor.stat=='9'"></el-button>
          <el-button type="primary" plain icon="el-icon-fa-key" @click="resetPwd()" title="重置密码" :disabled="!editor.uuid||editor.stat!=='5'"></el-button>
          <el-button type="primary" plain icon="el-icon-fa-trash" @click="doShut()" title="注销" :disabled="!editor.uuid||editor.stat=='9'"></el-button>
        </el-button-group>
        <el-button-group>
          <el-button type="primary" plain icon="el-icon-fa-lock" @click="doClose()" title="锁定" :disabled="!editor.uuid||editor.stat=='6' ||editor.stat=='9'"></el-button>
          <el-button type="primary" plain icon="el-icon-fa-unlock" @click="doOpen()" title="解锁" :disabled="!editor.uuid||editor.stat=='5' ||editor.stat=='9'"></el-button>
        </el-button-group>
      </div>
      <UserEditor style="min-height:250px" v-if="editor.show" ref="userEditor" :uuid="editor.uuid" @submit="saveUser"></UserEditor>
    </el-dialog>

    <el-dialog append-to-body v-draggable :visible.sync="timeline" title="用户登录时间轴" :close-on-click-modal="false">
      <time-line @closeDia='timeline=!timeline' :user-uuid='timelineuuid'></time-line>
    </el-dialog>

  </div>
</template>
<script>
import UserEditor from "./UserEditor";
import SelectorTree from "@/views/common/SelectorTree";
import UserAPI from "@/api/base/usrm/UserAPI";
import TimeLine from "@/views/common/TimeLine";
export default {
  name: "UserMgr",
  components: { UserEditor, SelectorTree, TimeLine },
  data() {
    return {
      timeline: false,
      timelineuuid: "",
      queryform: {
        usercode: null,
        username: null,
        userstat: null,
        orgId: null,
        crtime: null
      },
      table: {
        data: []
      },
      editor: {
        show: false,
        uuid: null,
        visible: false, // 编辑器-显示
        loading: false,
        stat: ""
      },
      multipleSelection: []
    };
  },
  methods: {
    //批量重置用户密码
    resetUserPw() {
      let uuids = [];
      this.multipleSelection.forEach((value, index) => {
        uuids.push(value.uuid);
      });
      if (uuids.length > 0)
        UserAPI.resetUserPw({ uuids: uuids }).then(() => this.queryUserData());
    },
    //显示登陆时间轴
    showTimeLine(row) {
      this.timelineuuid = row.uuid;
      this.timeline = true;
    },
    // 重置密码
    resetPwd(data) {
      this.$confirm("是否重置该用户密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.editor.loading = true;
        this.editor.error = {}; // 还原错误信息(必须先还原)
        UserAPI.resetPwd(this.$refs.userEditor.data) // 保存数据
          .then(this.queryUserData) // 查询数据
          .then(this.cancelEditorLoading); // 最终要取消loading
      });
    },
    // 注销
    doShut(data) {
      this.$confirm("是否注销该用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.editor.loading = true;
        this.editor.error = {}; // 还原错误信息(必须先还原)
        UserAPI.shutUser(this.$refs.userEditor.data)
          .then(this.queryUserData) // 查询数据
          .then(this.cancelEditorLoading); // 最终要取消loading
      });
    },
    // 解锁
    doOpen(data) {
      this.$confirm("是否解锁该用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.editor.loading = true;
        this.editor.error = {}; // 还原错误信息(必须先还原)
        UserAPI.openUser(this.$refs.userEditor.data)
          .then(this.queryUserData) // 查询数据
          .then(this.cancelEditorLoading); // 最终要取消loading
      });
    },
    // 锁定
    doClose(data) {
      this.$confirm("是否锁定该用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.editor.loading = true;
        this.editor.error = {}; // 还原错误信息(必须先还原)
        UserAPI.lockUser(this.$refs.userEditor.data)
          .then(this.queryUserData) // 查询数据
          .then(this.cancelEditorLoading); // 最终要取消loading
      });
    },
    // 打开编辑页面
    doEdit(index, rowData) {
      this.editor.show = true;
      this.editor.uuid = rowData.uuid;
      this.editor.stat = rowData.userstat;
    },
    // 打开新建画面
    doAdd() {
      this.editor.show = true;
      this.editor.uuid = null;
      this.editor.stat = "";
    },
    doSubmit(data) {
      this.$refs.userEditor.submitForm();
    },
    saveUser(data) {
      this.editor.loading = true;
      this.editor.error = {}; // 还原错误信息(必须先还原)
      UserAPI.saveUser(this.$refs.userEditor.data) // 保存数据
        .then(this.queryUserData) // 查询数据
        .then(this.cancelEditorLoading); // 最终要取消loading
    },
    // 重置方法
    reset() {
      this.$refs.form.resetFields();
    },
    cancelEditorLoading() {
      this.editor.show = false;
      this.editor.loading = false;
    },
    queryUserData() {
      if (this.queryform.crtime == null) {
        this.queryform.crtime = [];
      }
      this.queryform.startTime = this.queryform.crtime[0];
      this.queryform.endTime = this.queryform.crtime[1];
      delete this.queryform.crtime;
      this.$refs.dataTable.load(this.queryform);
    },
    resetquery() {
      this.$refs.queryform.resetFields();
    },
    dataTableLoad(params, resolve) {
      UserAPI.queryUser(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量解锁或锁定用户
    lockAndOpenUsers(b) {
      let uuids = [];
      this.multipleSelection.forEach((value, index) => {
        uuids.push(value.uuid);
      });
      if (uuids.length > 0)
        if (b) {
          UserAPI.lockAndOpenUsers({ uuids: uuids, opType: "1" }).then(() =>
            this.queryUserData()
          );
        } else {
          UserAPI.lockAndOpenUsers({ uuids: uuids, opType: "0" }).then(() =>
            this.queryUserData()
          );
        }
    }
  }
};
</script>
