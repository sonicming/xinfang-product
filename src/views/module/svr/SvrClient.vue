<!-- Client 管理 -->
<template>
  <div>
    <el-card>
      <template slot="header">
        <span>客户端管理</span>
        <div class="pull-right">
          <el-button type="primary" title="新增客户端" icon="el-icon-fa-plus" @click.stop="doAdd"></el-button>
        </div>
      </template>
      <el-form inline :model="table.params" ref="queryForm">
        <el-form-item prop="clitoken" label="客户端授权">
          <el-input v-model="table.params.clitoken"></el-input>
        </el-form-item>
        <el-form-item prop="biztppuuid" label="第三方平台">
          <Selector v-model="table.params.biztppuuid" :clearable="true" label-key="tppname" value-key="uuid" placeholder="">
            <SelectorTpp></SelectorTpp>
          </Selector>
        </el-form-item>
        <el-form-item prop="clistatus" label="客户端状态">
          <el-select placeholder="状态" v-sys-code="'clistatus'" v-model="table.params.clistatus" clearable>
            <el-option v-for="item in sysCode.clistatus" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <template slot="header">
        <span>客户端管理列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetQuery" icon="el-icon-fa-refresh" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle :auto-load="true" ref="dataTable" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" width="33" fixed='left'>
        </el-table-column>
        <el-table-column prop="clitoken" label="客户端授权"></el-table-column>
        <el-table-column prop="clistatus" label="客户端状态" :formatter="statFormat" show-overflow-tooltip></el-table-column>
        <el-table-column prop="tppname" label="第三方平台"></el-table-column>
        <el-table-column prop="optime" :formatter="formatterDateTime" label="最后修改时间" width="180"> </el-table-column>
        <el-table-column prop="note" label="备注"></el-table-column>
        <el-table-column label="操作" width="80" fixed='right'>
          <template slot-scope="scope">
            <el-button type="primary" @click="doEdit(scope.$index, scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
            <el-button type="primary" @click="doDelete( scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>
    <el-dialog append-to-body title="客户端数据编辑" :visible.sync="editor.visible">
      <SvrClientForm ref="editor" :valid-on-load="true" v-loading="editor.loading" element-loading-text="服务器连接中..." :data="editor.data" @submit="saveData" @cancel="cancelEditor" :error="editor.error" />
    </el-dialog>
  </div>

</template>

<script>
import PretClientAPI from "@/api/svr/SvrClient";
import BaseViewCRUD from "@/views/common/BaseViewCRUD";
import SelectorTpp from "@/views/common/SelectorTpp";
import SvrClientForm from "./SvrClientForm";

export default {
  name: "client",
  mixins: [BaseViewCRUD],
  components: { SvrClientForm, SelectorTpp },
  data() {
    return {
      queryForm: {
        ents: []
      },
      selector: {
        tpps: []
      },
      table: {
        params: {
          clistatus: null,
          clitoken: null,
          biztppuuid: null,
          note: null
        }
      },
      clistates: [
        {
          value: "1",
          label: "启用"
        },
        {
          value: "0",
          label: "禁用"
        }
      ],
      editor: {
        //  编辑器默认数据
        data: {
          biztppname: null,
          biztppuuid: null,
          clistatus: null,
          clitoken: null,
          tppname: null,
          note: null
        }
      }
    };
  },
  methods: {
    //  状态转换
    statFormat: function(row, column) {
      var stat = row[column.property];
      if (stat === undefined) {
        return "";
      } else if (stat === "1") {
        return "启用";
      } else if (stat === "0") {
        return "禁用";
      } else {
        return "错误数据";
      }
    },
    //  加载一条
    apiLoadOne: PretClientAPI.getClient,
    //  保存一条
    apiSaveOne: PretClientAPI.saveClient,
    //  删除一条
    apiDeleteOne: PretClientAPI.deleteClient,
    //  查询列表
    apiQueryList: PretClientAPI.initlist
  }
};
</script>
