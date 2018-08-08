<!--登录日志会话操作页面-->
<template>
  <el-card class="flex-1">
    <PageTable ref="dataTable" :auto-load="false" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
      <el-table-column type="index" fixed='left'></el-table-column>
      <el-table-column prop="actdefn" label="操作定义" show-overflow-tooltip></el-table-column>
      <el-table-column prop="actdesc" label="操作描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="reqip" width="100px" label="请求者地址"></el-table-column>
      <el-table-column prop="actsta" label="登录开始时间" :formatter="formatterDateTime" width="150px"></el-table-column>
      <el-table-column prop="actend" label="登录结束时间" :formatter="formatterDateTime" width="150px"></el-table-column>
      <el-table-column prop="devtype" label="请求终端类型" show-overflow-tooltip></el-table-column>
      <el-table-column label="处理代码" show-overflow-tooltip>
        <template slot-scope='scope'>
          {{scope.row.respcode+':'+(scope.row.respcode=="000000"?"请求处理成功":scope.row.respcode=="000100"?"用户会话超时":scope.row.respcode=="000200"?"安全服务错误":scope.row.respcode=="000300"?"校验服务错误":scope.row.respcode=="000400"?"系统后台错误":scope.row.respcode=="000500"?"网络服务错误":"未知错误")}}
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed='right' width='100'>
        <template slot-scope="scope">
          <el-button type="primary" @click="showData(scope.row.uuid)" icon="el-icon-fa-search" title="查看数据"></el-button>
          <el-button type="primary" @click="showServ(scope.row.uuid)" icon="el-icon-fa-info" title="查看服务"></el-button>
          <el-button type="primary" v-if="scope.row.stakinfo" @click="showStak(scope.row.stakinfo)" icon="el-icon-fa-book" title="查看堆栈信息"></el-button>
        </template>
      </el-table-column>
    </PageTable>
    <el-dialog append-to-body v-draggable title="查看数据" :visible.sync="editor.datashow">
      <LogsOperData :uuid="editor.uuid"></LogsOperData>
    </el-dialog>
    <el-dialog append-to-body v-draggable title="查看服务" :visible.sync="editor.servshow">
      <SessionServ :opid="editor.opid" v-if="editor.servshow"></SessionServ>
    </el-dialog>
    <el-dialog append-to-body v-draggable title="查看堆栈信息" :visible.sync="editor.stakshow" readonly>
      <template>
        <el-input v-if="stakinfo" type="textarea" :rows="30" v-model="stakinfo"></el-input>
      </template>
    </el-dialog>
  </el-card>
</template>
<script>
import LogsOperData from "./LogsOperData";
import SessionServ from "./SessionServ";
import LogsSignAPI from "@/api/base/logs/LogsSign";

export default {
  components: { LogsOperData, SessionServ },
  props: {
    uuid: null
  },
  data() {
    return {
      stakinfo: "",
      table: {
        data: []
      },
      editor: {
        uuid: null,
        datashow: false,
        servshow: false,
        stakshow: false,
        visible: false, //  编辑器-显示
        loading: true
      }
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
    showStak(stakinfo) {
      this.editor.stakshow = true;
      this.stakinfo = stakinfo;
    },
    showData(uuid) {
      this.editor.uuid = uuid;
      this.editor.datashow = true;
    },
    showServ(opid) {
      this.editor.opid = opid;
      this.editor.servshow = true;
    },
    //  加载数据
    loadInfo(uuid) {
      this.$refs.dataTable.load({ sesId: uuid });
    },
    queryData() {},
    dataTableLoad(params, resolve) {
      LogsSignAPI.queryLogsOper(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    }
  }
};
</script>
