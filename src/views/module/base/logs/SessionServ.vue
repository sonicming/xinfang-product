<!--登录日志会话服务页面-->
<template>
  <div>
    <PageTable ref="dataTable" :auto-load="false" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
      <el-table-column type="index" fixed='left'></el-table-column>
      <el-table-column prop="svrname" label="服务器名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="servdefn" label="服务器定义" show-overflow-tooltip></el-table-column>
      <el-table-column prop="servdesc" label="服务器信息" width="140px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="servsta" label="服务开始时间" :formatter="formatterDate" width="150px"></el-table-column>
      <el-table-column prop="servend" label="服务结束时间" :formatter="formatterDate" width="150px"></el-table-column>
      <el-table-column prop="respcode" label="处理代码" show-overflow-tooltip></el-table-column>
      <el-table-column prop="respdesc" label="处理描述" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" fixed='right' width='100'>
        <template slot-scope="scope">
          <el-button type="primary" @click="showData(scope.row.opuuid)" icon="el-icon-fa-search" title="查看数据"></el-button>
          <el-button type="primary" @click="showSQL(scope.row.uuid)" icon="el-icon-fa-info" title="查看SQL"></el-button>
          <el-button type="primary" v-if='scope.row.stakinfo' @click="showStak(scope.row.stakinfo)" icon="el-icon-fa-book" title="查看堆栈信息"></el-button>
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog append-to-body v-draggable title="查看数据" :visible.sync="editor.datashow">
      <LogsOperData :uuid="editor.uuid"></LogsOperData>
    </el-dialog>
    <el-dialog append-to-body v-draggable title="查看SQL" :visible.sync="editor.sqlshow">
      <LogsSqlData :seuuid="editor.seuuid">
      </LogsSqlData>
    </el-dialog>
    <el-dialog append-to-body v-draggable title="查看堆栈信息" :visible.sync="editor.stakshow" readonly>
      <template>
        <el-input :rows="30" v-if="stakinfo" v-model="stakinfo" type="textarea" readonly></el-input>
        <h1 v-if="!stakinfo" style="text-align: center;font-size: 6px;height: 300px;line-height: 300px;">暂无数据</h1>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import LogsOperData from "./LogsOperData";
import LogsSqlData from "./LogsSqlData";
import LogsSignAPI from "@/api/base/logs/LogsSign";

export default {
  components: { LogsOperData, LogsSqlData },
  props: {
    uuid: null,
    opid: null,
    seuuid: null
  },
  data() {
    return {
      stakinfo: "",
      sql: "",
      editor: {
        uuid: null,
        opid: null,
        seuuid: null,
        datashow: false,
        sqlshow: false,
        stakshow: false,
        visible: false, //  编辑器-显示
        loading: true
      },
      table: {
        data: []
      }
    };
  },
  mounted() {
    this.loadInfo(this.uuid, this.opid);
  },
  watch: {
    uuid(uuid) {
      this.loadInfo(uuid);
    },
    opid(opid) {
      this.loadInfo(opid);
    }
  },
  methods: {
    showStak(stakinfo) {
      this.editor.stakshow = true;
      this.stakinfo = stakinfo;
    },
    showSQL(seuuid) {
      this.editor.seuuid = seuuid;
      this.editor.sqlshow = true;
    },
    showData(uuid) {
      this.editor.uuid = uuid;
      this.editor.datashow = true;
    },
    //  加载数据
    loadInfo(uuid, opid) {
      this.$refs.dataTable.load({ opid: opid, sesId: uuid });
    },
    queryData() {},
    dataTableLoad(params, resolve) {
      LogsSignAPI.queryLogsServ(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    }
  }
};
</script>
