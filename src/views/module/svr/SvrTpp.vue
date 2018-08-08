<template>
  <div>
    <el-card>
      <template slot="header">
        <span>第三方平台管理</span>
        <div class="pull-right">
          <el-button type="primary" title="新增平台" icon="el-icon-fa-plus" @click.stop="doAdd"></el-button>
        </div>
      </template>
      <el-form inline :model="table.params" ref="queryForm">
        <el-form-item prop="tppname" label="平台名称">
          <el-input v-model="table.params.tppname"></el-input>
        </el-form-item>
        <el-form-item prop="diviscode" label="行政编码">
          <el-input v-model="table.params.diviscode"></el-input>
        </el-form-item>
        <el-form-item prop="divisname" label="行政地区">
          <el-input v-model="table.params.divisname"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>第三方平台列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" width="33" fixed='left'>
        </el-table-column>
        <el-table-column prop="tppname" label="平台名称" sortable width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="diviscode" label="行政编码" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="divisname" label="行政地区" width="180" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="tppstatus" label="启用状态" width="80">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.tppstatus" on-text="启用" off-text="禁用" active-value="1" inactive-value="0" on-color="#13ce66" off-color="#ff4949" @change="changetppstatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="contactinfo" label="联系信息" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="note" label="备注" show-overflow-tooltip>
          <template slot-scope="scope">
            <pre>{{scope.row.note}}</pre>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" fixed='right'>
          <template slot-scope="scope">
            <el-button type="primary" @click="doEdit(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click="doDelete(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body title="平台编辑" :visible.sync="editor.visible" size="tiny" :close-on-click-modal="true" :custom-class='customClass'>
      <PertTppFrom ref="editor" v-loading="editor.loading" element-loading-text="服务器连接中..." :uuid="editor.data.uuid" :data="editor.data" @submit="saveData" @cancel="cancelEditor" :error="editor.error" />
    </el-dialog>
  </div>
</template>
<script>
import PretTppApi from "@/api/svr/SvrTpp";
import Util from "@/libs/Util";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";
import PertTppFrom from "./SvrTppFrom";

export default {
  name: "tpp",
  mixins: [BaseViewCRUD],
  components: { PertTppFrom },
  data() {
    return {
      customClass: "customClass",
      table: {
        //  初始化参数,必须设置
        params: {
          divisname: null,
          diviscode: null,
          tppname: null,
          note: null
        }
      },
      editor: {
        //  编辑器默认数据
        data: {
          uuid: null,
          tppname: null,
          tppstatus: "1",
          diviscode: [],
          divisname: [],
          contactinfo: null,
          note: null
        }
      }
    };
  },
  methods: {
    //  重写删除方法
    doDelete(index, rowData) {
      this.confirm(rowData, "执行此操作,会级联删除对用的企业,客户端,请确认!") //  提示确认
        .then(this.deleteData) //  然后删除数据
        .then(this.queryData); // 然后查询数据
    },
    saveData(data) {
      this.editor.loading = true;
      this.editor.error = {}; // 还原错误信息(必须先还原)
      this.apiSaveOne(data) // 保存数据
        .then(this.queryData) // 查询数据
        // .then(this.$refs.editor.reset()) // 保存之后处理
        .catch(this.applyFormError) // 如果服务器校验错误,应用到表单上
        .then(this.cancelEditorLoading); // 最终要取消loading
    },
    //  加载一条
    apiLoadOne(uuid) {
      return PretTppApi.getTpp(uuid).then(resp => {
        //  行政区数据处理 字符串"-" 分割 转 数组
        resp.data.diviscode = resp.data.diviscode.split("-");
        resp.data.divisname = resp.data.divisname.split("-");
        return resp;
      });
    },
    //  保存一条
    apiSaveOne(data) {
      //  行政区数据处理 数组 转 字符串"-" 分割
      let divisname = Util.converts.areaCodeToText(data.diviscode);
      data.diviscode = data.diviscode.join("-");
      data.divisname = divisname.join("-");
      return PretTppApi.saveTpp(data).then(
        resp => (this.editor.data.uuid = resp.saveuuid)
      );
    },
    //  删除一条
    apiDeleteOne: PretTppApi.delTpp,
    //  查询列表
    apiQueryList: PretTppApi.queryTpp,
    //  快速修改启用状态
    changetppstatus: PretTppApi.saveTpp
  }
};
</script>
