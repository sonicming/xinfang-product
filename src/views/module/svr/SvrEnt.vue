<!--企业数据管理-->
<template>
  <div>
    <el-card>
      <template slot="header">
        <span>企业数据</span>
        <div class="pull-right">
          <el-button type="primary" title="新增企业" icon="el-icon-fa-plus" @click.stop="doAdd"></el-button>
        </div>
      </template>
      <el-form :model="table.params" ref="queryForm">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="biztppuuid" label="第三方平台">
              <Selector v-model="table.params.biztppuuid" :clearable="true" label-key="tppname" value-key="uuid">
                <SelectorTpp></SelectorTpp>
              </Selector>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="copname" label="企业名称">
              <el-input v-model="table.params.copname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item prop="copcode" label="企业编码">
              <el-input v-model="table.params.copcode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>企业数据列表</span>
        <div class="pull-right">
          <el-button @click="queryData" title="查询" icon="el-icon-fa-search" type="primary"></el-button>
          <el-button @click="resetQuery" title="重置" icon="el-icon-fa-refresh" type="primary"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" v-loading="loading" @load-data="dataTableLoad" :data="data" highlight-current-row stripe border>
        <el-table-column type="index" width="33" fixed='left'>
        </el-table-column>
        <el-table-column prop="copname" label="企业名称" sortable></el-table-column>
        <el-table-column prop="copcode" label="企业编码"></el-table-column>
        <el-table-column prop="tppname" label="第三方平台"></el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="操作" width="80" fixed='right'>
          <template slot-scope="scope">
            <el-button @click="doEdit(scope.row)" icon="el-icon-fa-edit" title="编辑" type="primary"></el-button>
            <el-button @click="doDelete(scope.row)" icon="el-icon-fa-trash" title="删除" type="primary"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body title="企业编辑" :visible.sync="editor.visible" :show-close="true" v-draggable>
      <div class="dialog-button">
        <el-button :loading="editor.saving" @click="saveData" type="primary" icon="el-icon-fa-save" title="保存" plain></el-button>
      </div>
      <SvrEntForm v-if="editor.visible" ref="editor" :error="editor.error" :uuid="editor.uuid" />
    </el-dialog>
  </div>
</template>
<script>
import PretEntAPI from "@/api/svr/SvrEnt";
import SelectorTpp from "@/views/common/SelectorTpp";
import SvrEntForm from "./SvrEntForm";

export default {
  name: "ent",
  components: { SvrEntForm, SelectorTpp },
  data() {
    return {
      loading: false,
      queryForm: {
        tpps: []
      },
      table: {
        params: {
          biztppuuid: null,
          copname: null,
          copcode: null
        }
      },
      editor: {
        uuid: "",
        visible: false,
        saving: false,
        data: {
          biztppname: "",
          biztppuuid: "",
          copname: "",
          copcode: "",
          note: ""
        },
        loading: false
      },
      data: []
    };
  },
  methods: {
    //  加载表格数据
    dataTableLoad(params, resolve) {
      PretEntAPI.queryEnt(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    //  查询数据
    queryData() {
      this.$refs.dataTable.load(this.table.params);
    },
    //  重置查询
    resetQuery() {
      this.$refs.queryForm.resetFields();
    },
    //  响应[编辑按钮]
    doEdit(data) {
      this.editor.visible = true;
      this.editor.uuid = data.uuid;
    },
    //  响应[提交按钮]
    saveData() {
      this.$refs.editor.validate().then(this.submitParam);
    },
    //  响应[删除按钮]
    doDelete(data) {
      this.confirm(data).then(this.deleteParam);
    },
    //  删除执行
    deleteParam(data) {
      this.loading = true;
      PretEntAPI.delEnt(data.uuid)
        .then(() => {
          this.queryData();
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    //  提交执行
    submitParam(data) {
      this.editor.saving = true;
      this.editor.error = {};
      this.$refs.editor.getTreeList();
      PretEntAPI.saveEnt(data)
        .then(resp => {
          this.queryData();
          this.editor.saving = false;
          this.editor.uuid = resp.saveuuid;
        })
        .catch(error => {
          this.editor.saving = false;
          this.editor.error = error.validError;
        });
    },
    //  响应[添加按钮]
    doAdd() {
      this.editor.visible = true;
      this.editor.uuid = "";
    }
  }
};
</script>
