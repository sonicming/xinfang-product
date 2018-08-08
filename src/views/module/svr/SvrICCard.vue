<!-- 云签名-IC卡管理 -->
<template>
  <el-card class="flex-1">
    <template slot="header">
      <span>IC卡管理</span>
      <div class="pull-right">
        <el-button title="添加IC卡" icon="el-icon-fa-plus" @click.stop="doAdd"></el-button>
      </div>
    </template>
    <el-form inline :model="table.params" ref="queryForm">
      <el-form-item prop="cardno" label="卡号">
        <el-input v-model="table.params.cardno" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="cardkeyname" label="证书号">
        <el-input v-model="table.params.cardkeyname" placeholder=""></el-input>
      </el-form-item>
      <el-form-item prop="bizentuuid" label="所属企业">
        <Selector v-model="table.params.bizentuuid" :clearable="true" label-key="copname" value-key="uuid" placeholder="">
          <SelectorEnt></SelectorEnt>
        </Selector>
      </el-form-item>
    </el-form>
    <PageTable ref="dataTable" :auto-load="false" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
      <template slot="buttons">
        <el-button @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
        <el-button @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
      </template>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="cardno" label="卡号" :sortable="true" width="180"></el-table-column>
      <el-table-column prop="cardkeyname" label="证书号" width="180"></el-table-column>
      <el-table-column prop="cardcert" label="证书" show-overflow-tooltip></el-table-column>
      <el-table-column prop="copname" label="所属企业"></el-table-column>
      <el-table-column prop="optime" :formatter="formatterDateTime" label="最后修改时间" width="180"> </el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="doEdit(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
          <el-button @click="doDelete( scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog append-to-body width="600px" title="IC卡数据编辑" :visible.sync="editor.visible" size="tiny" :close-on-click-modal="true" :show-close="true">
      <PertICCardForm ref="editor" :valid-on-load="true" v-loading="editor.loading" :element-loading-text="$t('common.serverReceiving')" :data="editor.data" @submit="saveData" @cancel="cancelEditor" :error="editor.error" />
    </el-dialog>
  </el-card>
</template>
<script>
import PretIccardAPI from "@/api/svr/SvrIccard";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";
import SelectorEnt from "../selector/SelectorEnt";
import PertICCardForm from "./SvrICCardForm";

export default {
  extends: { ...BaseViewCRUD },
  components: { PertICCardForm, SelectorEnt },
  data() {
    return {
      selector: {
        ents: []
      },
      table: {
        params: {
          bizentuuid: null,
          cardno: null,
          cardkeyname: null,
          note: null
        }
      },
      editor: {
        //  编辑器默认数据
        data: {
          bizentname: null,
          bizentuuid: null,
          cardcert: null,
          cardkeyname: null,
          cardno: null,
          note: null
        }
      }
    };
  },
  methods: {
    //  加载一条
    apiLoadOne: PretIccardAPI.getIccard,
    //  保存一条
    apiSaveOne: PretIccardAPI.saveIccard,
    //  删除一条
    apiDeleteOne: PretIccardAPI.deleteIccard,
    //  查询列表
    apiQueryList: PretIccardAPI.queryIccard
  }
};
</script>
