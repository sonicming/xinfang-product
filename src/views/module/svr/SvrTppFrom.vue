<template>
  <div>
    <div class="dialog-button">
      <el-button type="primary" @click="submit" icon="el-icon-fa-save" plain></el-button>
    </div>
    <el-alert title="请先进行基本信息的保存，再进行客户端的管理！" type="warning">
    </el-alert>
    <el-tabs v-model="activeName2" type="border-card">
      <el-tab-pane label="基本信息" name="first">
        <el-form label-position="top" ref="form" :model="data" :rules="rules">
          <el-row>
            <el-col :span='12'>
              <el-form-item label="平台名称" prop="tppname" :error="error.tppname">
                <el-input v-model="data.tppname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="启用状态" prop="tppstatus" :error="error.tppstatus">
                <el-radio-group v-model="data.tppstatus" class="border-bottom">
                  <el-radio label="1">启用</el-radio>
                  <el-radio label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="行政地区" prop="diviscode" :error="error.diviscode">
                <el-cascader :options="ChinaAreaData.provinceAndCityData" v-model="data.diviscode"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span='12'>
              <el-form-item label="联系信息" prop="contactinfo" :error="error.contactinfo">
                <el-input :minlength="6" v-model="data.contactinfo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span='24'>
              <el-form-item label="备注" prop="note" :error="error.note">
                <el-input v-model="data.note"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="客户端管理" name="three" :disabled='tppshow'>
        <el-card>
          <template slot="header">
            <span>客户端列表</span>
            <div class="pull-right">
              <el-button type="primary" title="新增DXP" icon="el-icon-plus" @click.stop="fastAddData"></el-button>
              <el-button type="primary" @click="queryData" icon="el-icon-refresh" title="刷新"></el-button>
            </div>
          </template>
          <PageTable hideTitle ref="dataTable" :auto-load="false" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border title="客户端列表" hideExport>
            <el-table-column type="index" width="33" fixed='left'>
            </el-table-column>
            <el-table-column prop="clitoken" label="客户端授权">
              <template slot-scope="scope">
                <el-input v-if="scope.row.$editing" v-model="scope.row.clitoken"></el-input>
                <span v-if="!scope.row.$editing">{{scope.row.clitoken}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="clistatus" label="状态" width="60">
              <template slot-scope="scope">
                <el-switch v-if="scope.row.$editing" v-model="scope.row.clistatus" on-text="启用" off-text="禁用" active-value="1" inactive-value="0" on-color="#13ce66" off-color="#ff4949"></el-switch>
                <span v-if="!scope.row.$editing">{{scope.row.clistatus==='1'?'启用':'禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="备注">
              <template slot-scope="scope">
                <el-input v-if="scope.row.$editing" v-model="scope.row.note"></el-input>
                <span v-if="!scope.row.$editing">{{scope.row.note}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed='right'>
              <template slot-scope="scope">
                <el-button type="primary" v-if="!scope.row.$editing" @click="fastEditData(scope.row)" icon="el-icon-fa-edit" title="编辑"></el-button>
                <el-button type="primary" v-if="scope.row.$editing" @click="SaveData(scope.row)" icon="el-icon-fa-check" title="完成"></el-button>
                <el-button type="primary" v-if="scope.row.$editing" @click="closeFastEdit(scope.row)" icon="el-icon-fa-close" title="取消"></el-button>
                <el-button type="primary" v-if="scope.row.uuid" @click="doDelete( scope.$index, scope.row)" icon="el-icon-fa-trash" title="删除"></el-button>
              </template>
            </el-table-column>
          </PageTable>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import PretClientAPI from "@/api/svr/SvrClient";
// 最新县及县以上行政区划代码（截止2016年7月31日）
import * as ChinaAreaData from "element-china-area-data";
import BaseForm from "@/views/common/BaseForm";

let dafaultData = {
  tppstatus: "1",
  uuid: null
};

export default {
  mixins: [BaseForm],
  data() {
    return {
      tppshow: true,
      activeName2: "first",
      ChinaAreaData,
      data: Object.assign({}, dafaultData),
      rules: {
        tppname: [{ required: true, message: "请输入平台名称!" }],
        diviscode: [{ required: true, message: "请选择行政区域!" }]
      },
      table: {
        params: {
          clistatus: null,
          clitoken: null,
          biztppuuid: null,
          note: null
        }
      }
    };
  },
  props: {
    uuid: String
  },
  watch: {
    uuid: function(val) {
      this.showppt(val);
    }
  },
  methods: {
    showppt(val) {
      if (val) {
        this.data.uuid = val;
        this.table.params.biztppuuid = val;
        this.queryData();
        this.tppshow = false;
      } else {
        this.table.params.biztppuuid = null;
        this.tppshow = true;
      }
    },
    queryData() {
      this.$refs.dataTable.load(this.table.params);
    },
    SaveData(data) {
      data.biztppuuid = this.data.uuid;
      this.fastSaveData(data);
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
