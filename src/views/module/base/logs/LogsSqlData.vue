<template>
  <PageTable ref="dataTable" :auto-load="false" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
    <el-table-column type="expand">
      <template slot-scope="scope">
        <pre style="white-space: pre-wrap; white-space: -moz-pre-wrap; white-space: -pre-wrap;white-space: -o-pre-wrap; word-wrap: break-word;">{{scope.row.sesql}}</pre>
      </template>
    </el-table-column>
    <el-table-column prop="optime" label="操作时间" :formatter="formatterDate" show-overflow-tooltip></el-table-column>
    <el-table-column prop="sesqlelap" label="执行时间（毫秒）" show-overflow-tooltip></el-table-column>
  </PageTable>
</template>
<script>
import LogsServAPI from "@/api/base/logs/LogsServ";

export default {
  props: {
    seuuid: String
  },
  data() {
    return {
      table: {
        data: []
      }
    };
  },
  mounted() {
    this.loadInfo(this.seuuid);
  },
  watch: {
    seuuid(seuuid) {
      this.loadInfo(this.seuuid);
    }
  },
  methods: {
    //  加载数据
    loadInfo(uuid) {
      this.$refs.dataTable.load({ seid: uuid });
    },
    dataTableLoad(params, resolve) {
      LogsServAPI.queryLogsSqlData(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    }
  }
};
</script>
