<!-- 参数管理 -->
<template>
  <div>
    <el-card v-loading="loading">
      <template slot="header">
        <span>业务类型维护</span>
        <div class="pull-right">
          <el-button type="primary" @click="handleAdd" icon="el-icon-fa-plus" title="添加"></el-button>
        </div>
      </template>
      <el-form inline :model="searchForm" ref="queryForm">
        <el-form-item prop="svrCode" label="服务代码">
          <el-input v-model="searchForm.svrCode"></el-input>
        </el-form-item>
        <el-form-item prop="note" label="服务描述">
          <el-input v-model="searchForm.note"></el-input>
        </el-form-item>
        <el-form-item label="服务状态" prop="svrStat">
          <el-select placeholder="服务状态" v-sys-code="'svrStat'" v-model="searchForm.svrStat" clearable>
            <el-option v-for="item in sysCode.svrStat" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>业务类型列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" @load-data="dataTableLoad" :data="data" highlight-current-row stripe border>
        <el-table-column type="index" width="33" fixed='left'>
        </el-table-column>
        <el-table-column prop="svrcode" label="服务代码"></el-table-column>
        <el-table-column prop="svrclaz" label="服务类"></el-table-column>
        <el-table-column prop="svrstat" label="服务状态" :formatter="statFormat" width="80"></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="操作" width="80" fixed='right'>
          <template slot-scope="scope">
            <el-button type="primary" @click="handleEdit(scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click="handleDelete(scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body title="业务类型维护" :visible.sync="editor.visible">
      <div class="dialog-button">
        <el-button plain type="primary" :loading="editor.saving" @click="handleSubmit" icon="el-icon-fa-save" title="提交"></el-button>
      </div>
      <SvrMaintForm v-if="editor.visible" v-loading="editor.saving" ref="editor" :error="editor.error" :uuid="editor.uuid" />
    </el-dialog>
  </div>
</template>
<script>
import SvrMaintApi from "@/api/svr/SvrMaint";
import SvrMaintForm from "./SvrMaintForm";

export default {
  name: "maintenance",
  components: { SvrMaintForm },
  data() {
    return {
      loading: false,
      //  编辑器用到的所有数据
      editor: {
        saving: false,
        visible: false,
        error: {},
        uuid: ""
      },
      //  查询表单用到的数据
      searchForm: {
        svrCode: "",
        note: "",
        svrStat: ""
      },
      data: []
    };
  },
  methods: {
    //  加载表格数据
    dataTableLoad(params, resolve) {
      SvrMaintApi.querySvrMaint(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    //  查询数据
    queryData() {
      this.$refs.dataTable.load(this.searchForm);
    },
    //  重置查询
    resetQuery() {
      this.$refs.queryForm.resetFields();
    },
    //  提交执行
    submitParam(data) {
      this.editor.saving = true;
      this.editor.error = {};
      SvrMaintApi.saveSvrMaint(data)
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
    //  删除执行
    deleteParam(data) {
      this.loading = true;
      SvrMaintApi.delSvrMaint(data.uuid)
        .then(() => {
          this.queryData();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //  响应[编辑按钮]
    handleEdit(data) {
      this.editor.visible = true;
      this.editor.uuid = data.uuid;
    },
    //  响应[提交按钮]
    handleSubmit() {
      this.$refs.editor.validate().then(data => {
        this.submitParam(data);
      });
    },
    //  响应[添加按钮]
    handleAdd() {
      this.editor.uuid = "";
      this.editor.visible = true;
    },
    //  响应[删除按钮]
    handleDelete(data) {
      this.confirm(data).then(this.deleteParam);
    },
    statFormat: function(row, column) {
      var stat = row[column.property];
      if (stat === undefined) {
        return "";
      } else if (stat === "0") {
        return "禁用";
      } else if (stat === "1") {
        return "启用";
      } else {
        return "错误数据";
      }
    }
  }
};
</script>
