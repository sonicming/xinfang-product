<template>
  <el-card class="handle-detail margin-top-2" style='margin-top:10px;'>
    <template slot="header" class="clearfix">
      <span>经办详细</span>
      <div class="pull-right">
        <div v-show="this.data.length>0" style="display:inline-block;margin-right: 3px;">
          <el-popover placement="bottom" trigger="click" width="100">
            <el-checkbox v-model="columns.svrip">服务器IP</el-checkbox>
            <br>
            <el-checkbox v-model="columns.svrname">服务器名称</el-checkbox>
            <br>
            <el-checkbox v-model="columns.actdefn">操作定义</el-checkbox>
            <br>
            <el-checkbox v-model="columns.acttype">协议类型</el-checkbox>
            <br>
            <el-checkbox v-model="columns.reqip">请求者IP</el-checkbox>
            <br>
            <el-checkbox v-model="columns.devtype">请求终端类型</el-checkbox>
            <br>
            <div slot="reference">
              <el-button icon="el-icon-fa-list" type="primary"></el-button>
            </div>
          </el-popover>
        </div>
        <el-button type="primary" icon="el-icon-fa-search" @click="handleSee"></el-button>
        <el-button type="primary" icon="el-icon-fa-close" @click="handleClose"></el-button>
      </div>
    </template>
    <PageTable hideTitle page-layout="total, prev, pager, next" row-key="actend" v-show="showDetail" :page-size="10" auto-height :auto-load="true" ref="dataTable" @load-data="dataTableLoad" :data="data" highlight-current-row stripe border>
      <el-table-column width='50'>
        <template slot-scope="scope">
          <el-popover placement="left">
            <div style="max-height:600px;overflow: auto;">
              <table class=" el-table el-table--fit el-table--striped el-table--border  info-table  el-table--compact" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr v-for="item in scope.row.opdataArray" :key="item.key">
                    <td align="right" class="padding-right-2" style="background:#ccc;">{{item.key}}</td>
                    <td class="padding-left-2" :title="item.value"> <input type="text" :value="item.value" style="border:none;"> </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <el-button slot="reference" icon="el-icon-fa-eye"></el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="actdesc" label="操作描述"></el-table-column>
      <el-table-column show-overflow-tooltip prop="username" label="操作人">
        <template slot-scope="scope">
          <PopoverUserInfo :uuid="scope.row.opuseruuid">
            {{scope.row.username}}
          </PopoverUserInfo>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="optype" label="操作类型" :formatter="foemarOptype"></el-table-column>
      <el-table-column show-overflow-tooltip prop="svrip" label="服务器IP" v-if="columns.svrip"></el-table-column>
      <el-table-column show-overflow-tooltip prop="respcode" label="处理代码"></el-table-column>
      <el-table-column show-overflow-tooltip prop="svrname" label="服务器名称" v-if="columns.svrname"></el-table-column>
      <el-table-column show-overflow-tooltip prop="actdefn" label="操作定义" v-if="columns.actdefn"></el-table-column>
      <el-table-column show-overflow-tooltip prop="acttype" label="协议类型" v-if="columns.acttype" :formatter="foemarActtype"></el-table-column>
      <el-table-column show-overflow-tooltip prop="reqip" label="请求者IP" v-if="columns.reqip"></el-table-column>
      <el-table-column show-overflow-tooltip prop="devtype" label="请求终端类型" v-if="columns.devtype"></el-table-column>
      <el-table-column show-overflow-tooltip prop="actsta" label="操作开始时间" :formatter="formatterDateTime"></el-table-column>
      <el-table-column show-overflow-tooltip prop="actend" label="操作结束时间" :formatter="formatterDateTime"></el-table-column>
    </PageTable>
  </el-card>
</template>
<script>
/**
 * 显示经办历史字段:
 * attributes:
 *  mode:['popover'|'plan'] popover 则在悬浮提示中显示,使用slot作为渲染内容. plan 直接显示table
 *
 */
import ElScrollbar from "element-ui/lib/scrollbar";
import LogsOperAPI from "../../api/base/logs/LogsOper";
import moment from "moment";
import PopoverUserInfo from "./PopoverUserInfo";

export default {
  components: { ElScrollbar, PopoverUserInfo },
  props: {
    bizUuid: {
      type: String
    }
  },
  data() {
    return {
      showDetail: false,
      columns: {
        svrip: true,
        svrname: false,
        actdefn: false,
        acttype: false,
        reqip: true,
        devtype: false
      },
      data: []
    };
  },
  watch: {
    bizUuid(val) {
      this.data = [];
    }
  },
  methods: {
    foemarOpdata(jsonStr) {
      let data = JSON.parse(jsonStr);
      let dataArr = [];
      for (let key in data) {
        if (key.indexOf("uuid") === -1) {
          let value = data[key];
          if (value === null) {
            value = `null`;
          }
          // 判断是数字13位,表示是日期
          if (/^[\d]{11}|[\d]{13}$/.test(value)) {
            let _value =
              moment(value).format("L") + "  " + moment(value).format("LTS");
            if (_value !== "Invalid date") {
              value = _value;
            }
          }
          key = key.toLocaleUpperCase();
          dataArr.push({ key, value });
        }
      }
      return dataArr;
    },
    foemarOptype(row, column, cellValue) {
      let label = "unknow";
      switch (cellValue) {
        case "01":
          label = "新增";
          break;
        case "02":
          label = "修改";
          break;
        case "03":
          label = "删除";
          break;
      }
      return label;
    },
    foemarActtype(row, column, cellValue) {
      let label = "unknow";
      switch (cellValue) {
        case "1":
          label = "http://";
          break;
      }
      return label;
    },
    handleSee() {
      this.showDetail = true;
      this.$refs.dataTable.load();
    },
    handleClose() {
      this.showDetail = false;
    },
    dataTableLoad(params, resolve) {
      params.bizUuid = this.bizUuid;
      LogsOperAPI.queryQueryDataHis(params)
        .then(resolve)
        .then(respData => {
          this.data = respData.datarows;
          this.data.forEach(function(element) {
            try {
              element.opdataArray = this.foemarOpdata(element.opdata);
            } catch (e) {
              console.warn("JSON PARSE ERROR", e);
              element.opdataArray = [];
            }
          }, this);
        });
    }
  }
};
</script>
