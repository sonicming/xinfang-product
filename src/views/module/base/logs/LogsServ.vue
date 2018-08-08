<!-- 服务日志管理页面 -->
<template>
  <div>
    <el-card class="flex-1">
      <template slot="header">
        <span>服务日志管理</span>
      </template>
      <el-form :model="queryform" ref="queryform">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="交互标识" prop="operUuid">
              <el-input v-model="queryform.operuuid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="服务器地址" prop="svrIp">
              <el-input v-model="queryform.svrIp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="处理代码" prop="respCode">
              <el-input v-model="queryform.respCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="登录名" prop="userid">
              <el-input v-model="queryform.userid"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="会话标识" prop="sesId">
              <el-input v-model="queryform.sesId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="操作时间范围" prop="authappldate">
              <el-date-picker type="datetimerange" v-model="dateRange" placeholder="选择时间范围"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="flex-1">
      <template slot="header">
        <span>服务日志列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle ref="dataTable" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" fixed='left'></el-table-column>
        <el-table-column prop="userid" label="登录名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrip" label="服务器地址" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrname" label="服务器名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="servdesc" label="服务描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sesid" label="会话标识" width="250px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="servsta" label="操作时间" width='140px' :formatter="formatterDateTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作耗时" placement="top" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{(scope.row.servend-scope.row.servsta) / 1000+'s'}}
          </template>
        </el-table-column>
        <el-table-column label="处理结果" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{scope.row.respcode+':'+(scope.row.respcode=="000000"?"请求处理成功":scope.row.respcode=="000100"?"用户会话超时":scope.row.respcode=="000200"?"安全服务错误":scope.row.respcode=="000300"?"校验服务错误":scope.row.respcode=="000400"?"系统后台错误":scope.row.respcode=="000500"?"网络服务错误":"未知错误")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width='110'>
          <template slot-scope="scope">
            <el-button type="primary" @click="showData(scope.row.opuuid)" icon="el-icon-fa-search" title="查看数据"></el-button>
            <el-button type="primary" @click="showSQL(scope.row.uuid)" icon="el-icon-fa-info" title="查看SQL"></el-button>
            <el-button type="primary" @click="showInfo(scope.row)" icon="el-icon-fa-eye" title="查看详情"></el-button>
            <el-button type="primary" v-if="scope.row.stakinfo" @click="showStak(scope.row.stakinfo)" icon="el-icon-fa-book" title="查看堆栈信息"></el-button>
          </template>
        </el-table-column>
      </PageTable>
      <el-dialog append-to-body v-draggable title="查看数据" :visible.sync="editor.datashow" width="600px">
        <LogsOperData :uuid="editor.uuid"></LogsOperData>
      </el-dialog>
      <el-dialog append-to-body v-draggable title="查看SQL" :visible.sync="editor.sqlshow">
        <LogsSqlData :seuuid="editor.seuuid">
        </LogsSqlData>
      </el-dialog>
      <el-dialog append-to-body v-draggable title="查看详情" :visible.sync="currentInfo.show" width="600px">
        <LogsServInfo v-if="currentInfo.show" :uuid="currentInfo.uuid" :error="currentInfo.error"></LogsServInfo>
      </el-dialog>
      <el-dialog append-to-body v-draggable title="查看堆栈信息" :visible.sync="editor.stakshow">
        <template>
          <el-input v-if="stakinfo" type="textarea" :rows="10" v-model="stakinfo" readonly></el-input>
          <h1 v-if="!stakinfo" style="text-align: center;font-size: 6px;height: 300px;line-height: 300px;">暂无数据</h1>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import LogsServInfo from "./LogsServInfo";
import LogsOperData from "./LogsOperData";
import LogsSqlData from "./LogsSqlData";
import ServAPI from "@/api/base/logs/LogsServ";

export default {
  components: { LogsOperData, LogsSqlData, LogsServInfo },
  data() {
    return {
      stakinfo: "",
      queryform: {
        svrIp: "",
        respCode: "",
        userid: "",
        servSta: "",
        sesId: "",
        operuuid: ""
      },
      dateRange: [],
      sql: "",
      table: {
        data: []
      },
      //详细信息dialog
      currentInfo: {
        loading: false,
        show: false,
        uuid: "",
        error: {}
      },
      editor: {
        uuid: null,
        seuuid: null,
        datashow: false,
        sqlshow: false,
        stakshow: false,
        visible: false, //  编辑器-显示
        loading: true
      }
    };
  },
  mounted() {
    this.$nextTick(() => {
      //加载页面取得opuuid，如果有的话
      this.getOpUuid();
      this.queryData();
    });
  },
  methods: {
    respcodeFormatter(data) {
      return (
        data.respcode +
        ":" +
        (data.respcode == "000000"
          ? "请求处理成功"
          : data.respcode == "000100"
            ? "用户会话超时"
            : data.respcode == "000200"
              ? "安全服务错误"
              : data.respcode == "000300"
                ? "校验服务错误"
                : data.respcode == "000400"
                  ? "系统后台错误"
                  : data.respcode == "000500" ? "网络服务错误" : "未知错误")
      );
    },
    //查看详情
    showInfo(row) {
      this.currentInfo.uuid = row.uuid;
      this.currentInfo.show = true;
    },
    showStak(stakinfo) {
      this.editor.stakshow = true;
      this.stakinfo = stakinfo;
    },
    showSQL(seuuid) {
      this.editor.seuuid = seuuid;
      this.editor.sqlshow = true;
    },
    showData(opUuid) {
      this.editor.uuid = opUuid;
      this.editor.datashow = true;
    },
    queryData() {
      this.$refs.dataTable.load(this.queryform);
    },
    resetquery() {
      this.$refs.queryform.resetFields();
    },
    dataTableLoad(params, resolve) {
      if (this.dateRange == null) {
        this.dateRange = [];
      } else {
        //开始时间
        this.queryform.servSta = this.dateRange[0];
        //结束时间
        this.queryform.servEnd = this.dateRange[1];
      }
      ServAPI.queryLogsServ(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    //取得交互日志传来的uuid
    getOpUuid() {
      this.queryform.operuuid = this.$route.query.uuid;
      this.queryform.sesId = this.$route.query.sesId;
      this.queryData();
    }
  }
};
</script> 
