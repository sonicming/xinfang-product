<!-- 参数管理 -->
<template>
  <div>
    <el-card v-loading="loading" class="flex-1">
      <template slot="header">
        <span>参数管理</span>
        <div class="pull-right">
          <el-button type="primary" @click="handleAdd" icon="el-icon-fa-plus" title="添加"></el-button>
        </div>
      </template>
      <el-form :model="searchForm" ref="queryForm">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="paraname" label="参数名称">
              <el-input v-model="searchForm.paraname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="paravalue" label="参数值">
              <el-input v-model="searchForm.paravalue"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card v-loading="loading" class="flex-1">
      <template slot="header">
        <span>参数列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-fa-reply-all" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle ref="dataTable" :auto-load="true" @load-data="dataTableLoad" :data="data" highlight-current-row stripe border>
        <el-table-column type="index" fixed='left'></el-table-column>
        <el-table-column prop="paraname" label="参数名称"></el-table-column>
        <el-table-column prop="paravalue" label="参数值"></el-table-column>
        <el-table-column prop="paradesc" label="参数描述"></el-table-column>
        <el-table-column label="操作" fixed='right' width="70">
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click="handleDelete(scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body v-draggable width="600px" title="客户端数据编辑" :visible.sync="editor.visible" :close-on-click-modal="false">
      <div class='dialog-button'>
        <el-button type="primary" plain :loading="editor.saving" @click="handleSubmit" icon="el-icon-fa-save" title="提交"></el-button>
      </div>
      <ParaEditor v-loading="editor.saving" v-if="editor.visible" ref="editor" :error="editor.error" :uuid="editor.uuid" />
    </el-dialog>
  </div>
</template>
<script>
import ParaApi from "@/api/base/sysm/ParaAPI";
import ParaEditor from "./ParaEditor";

export default {
  name: "ParaMgr",
  components: { ParaEditor },
  data() {
    return {
      loading: false,
      // 编辑器用到的所有数据
      editor: {
        saving: false,
        visible: false,
        error: {},
        uuid: ""
      },
      // 查询表单用到的数据
      searchForm: {
        paraname: "",
        paravalue: ""
      },
      data: []
    };
  },
  methods: {
    // 逻辑处理
    // 加载表格数据
    dataTableLoad(params, resolve) {
      ParaApi.queryPara(params)
        .then(resolve) // 让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    // 查询数据
    queryData() {
      this.$refs.dataTable.load(this.searchForm);
    },
    // 重置查询
    resetQuery() {
      this.$refs.queryForm.resetFields();
    },
    // 删除执行
    deleteParam(data) {
      this.loading = true;
      ParaApi.delPara(data.uuid)
        .then(() => {
          this.queryData();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    // 提交执行
    submitParam(data) {
      this.editor.saving = true;
      this.editor.error = {};
      ParaApi.savePara(data)
        .then(() => {
          this.queryData();
          this.editor.saving = false;
          this.editor.visible = false;
        })
        .catch(error => {
          this.editor.saving = false;
          this.editor.error = error.validError;
        });
    },
    //  下面的方法专门用于响应页面按钮点击 则为 handleXXXX
    // 响应[编辑按钮]
    handleEdit(data) {
      this.editor.visible = true;
      this.editor.uuid = data.uuid;
    },
    // 响应[提交按钮]
    handleSubmit() {
      this.$refs.editor.validate().then(this.submitParam);
    },
    // 响应[删除按钮]
    handleDelete(data) {
      this.confirm(data).then(this.deleteParam);
    },
    // 响应[添加按钮]
    handleAdd() {
      this.editor.visible = true;
      this.editor.uuid = "";
    }
  }
};
</script>
