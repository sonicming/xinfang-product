<!-- 交互日志管理页面 -->
<template>
  <div>
    <PageTable ref="dataTable" :auto-load="false" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border height='607px'>
      <el-table-column type="index" fixed='left'></el-table-column>
      <el-table-column prop="opname" label="操作表名" show-overflow-tooltip></el-table-column>
      <el-table-column prop="optype" label="操作类型" :formatter="optypeFormat" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed='right' width="50">
        <template slot-scope="scope">
          <el-button type="primary" @click="showData(scope.row)" title="查看详情" icon="el-icon-view"></el-button>
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog append-to-body v-draggable title="查看详情" :visible.sync="detailedData" width="600px">
      <div class='showDataDialog' v-html='this.data'></div>
    </el-dialog>
  </div>
</template>
<script>
import OperDataAPI from "@/api/base/logs/LogsOper";

export default {
  props: {
    uuid: null
  },
  data() {
    return {
      table: {
        data: []
      },
      detailedData: false,
      data: {},
      opdata: []
    };
  },
  mounted() {
    this.loadInfo(this.uuid);
  },
  watch: {
    uuid(uuid) {
      this.loadInfo(this.uuid);
    }
  },
  methods: {
    //  加载数据
    loadInfo(uuid) {
      this.$refs.dataTable.load({ opid: uuid });
    },
    dataTableLoad(params, resolve) {
      OperDataAPI.queryLogsOperData(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    showData(row) {
      this.opdata = [];
      this.data = this.jsonFormatter(JSON.parse(row.opdata));
      row.opdata
        .substring(1, row.opdata.length - 1)
        .split(",")
        .forEach(value => {
          this.opdata.push(value);
        });
      this.detailedData = true;
    },
    jsonFormatter(msg) {
      var rep = "~";
      var jsonStr = JSON.stringify(msg, null, rep);
      var str = "";
      for (let i = 0; i < jsonStr.length; i++) {
        var text2 = jsonStr.charAt(i);
        if (i > 1) {
          var t = jsonStr.charAt(i - 1);
          if (rep != t && rep == text2) {
            str += "<br/>";
          }
        }
        str += text2;
      }
      jsonStr = "";
      for (let i = 0; i < str.length; i++) {
        var text = str.charAt(i);
        if (rep == text)
          jsonStr += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        else {
          jsonStr += text;
        }
        if (i == str.length - 2) jsonStr += "<br/>";
      }
      return jsonStr;
    },
    optypeFormat: function(row, column) {
      var par = row[column.property];
      var stat = "";
      //没有字典缓存 则刷新
      if (this.sysCode.operDataOpType === undefined) {
        this.refresh();
      }
      this.sysCode.operDataOpType.forEach(val => {
        if (par == val.value) {
          stat = val.label;
          return;
        }
      });
      return stat;
    },
    refresh() {
      this.$store.dispatch("base/refreshSysCode", "operDataOpType");
    }
  }
};
</script>
<style>
.showDataDialog {
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
}
</style>

