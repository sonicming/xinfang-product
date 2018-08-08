<!--DXP数据管理-->
<template>
  <el-card class="flex-1">
    <template slot="header">
      <span>DXP数据管理</span>
      <div class="pull-right">
        <el-button title="新增DXP" icon="el-icon-fa-plus" @click.stop="doAdd"></el-button>
      </div>
    </template>
    <el-form inline :model="table.params" ref="queryForm">
      <el-form-item prop="bizentuuid" label="所属企业">
        <Selector v-model="table.params.bizentuuid" clearable label-key="copname" value-key="uuid" placeholder="">
          <SelectorEnt></SelectorEnt>
        </Selector>
      </el-form-item>
      <el-form-item prop="dxpid" label="企业DXP编号">
        <el-input v-model="table.params.dxpid" placeholder=""></el-input>
      </el-form-item>
    </el-form>
    <PageTable ref="dataTable" :auto-load="false" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
      <template slot="buttons">
        <el-button @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
        <el-button @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
      </template>
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="copname" label="企业名称" sortable></el-table-column>
      <el-table-column prop="dxpid" label="DXPID"></el-table-column>
      <el-table-column prop="dxpdesc" label="描述"></el-table-column>
      <el-table-column prop="note" label="备注"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button @click="doEdit(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
          <el-button @click="doDelete(scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog append-to-body width="600px" title="DXP数据编辑" :visible.sync="editor.visible" size="tiny" :show-close="true" :close-on-click-modal="true">
      <PertDXPForm ref="editor" v-loading="editor.loading" element-loading-text="服务器连接中..." :data="editor.data" @submit="saveData" @cancel="cancelEditor" :error="editor.error" />
    </el-dialog>
  </el-card>
</template>
<script>
import PretDXPAPI from "@/api/svr/SvrDXP";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";
import SelectorEnt from "../selector/SelectorEnt";
import PertDXPForm from "./SvrDXPForm";

export default {
  extends: { ...BaseViewCRUD },
  components: { PertDXPForm, SelectorEnt },
  data() {
    return {
      queryForm: {
        ents: []
      },
      table: {
        params: {
          bizentuuid: null,
          dxpid: null,
          dxpdesc: null,
          note: null
        }
      },
      editor: {
        data: {
          bizentname: null,
          bizentuuid: null,
          dxpid: null,
          dxpdesc: null,
          note: null
        }
      }
    };
  },
  methods: {
    //  加载一条
    apiLoadOne: PretDXPAPI.getDxp,
    //  保存一条
    apiSaveOne: PretDXPAPI.saveDxp,
    //  删除一条
    apiDeleteOne: PretDXPAPI.delDxp,
    //  查询列表
    apiQueryList: PretDXPAPI.queryDxp
  }
};
</script>
