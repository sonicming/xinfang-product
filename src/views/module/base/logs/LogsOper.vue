<!-- 交互日志管理页面 -->
<template>
  <div>
    <el-card class="flex-1">
      <template slot="header">
        <span>交互日志管理</span>
      </template>
      <el-form :model="queryform" ref="queryform">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="登陆账号" prop="svrName">
              <el-input v-model="queryform.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="服务器地址" prop="svrIp">
              <el-input v-model="queryform.svrIp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="访问者地址" prop="reqIp">
              <el-input v-model="queryform.reqIp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="操作描述" prop="actDesc">
              <el-input v-model="queryform.actDesc"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="会话标识" prop="sesId">
              <el-input v-model="queryform.sesId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="操作时间范围" prop="authappldate">
              <el-date-picker type="datetimerange" v-model="dateRange" placeholder="选择时间范围">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="flex-1">
      <template slot="header">
        <span>交互日志列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle ref="dataTable" :auto-load="true" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" fixed='left'></el-table-column>
        <el-table-column prop="userid" label="登录账号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrip" label="服务器地址" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrname" label="服务器名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="reqip" label="访问者地址" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actdesc" label="操作描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sesid" label="会话标识" width="250px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actsta" label="操作时间" :formatter="formatterDateTime" width='140px' show-overflow-tooltip></el-table-column>
        <el-table-column label="操作耗时" placement="top" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{(scope.row.actend-scope.row.actsta) / 1000+'s'}}
          </template>
        </el-table-column>
        <el-table-column label="处理结果" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{scope.row.respcode+':'+(scope.row.respcode=="000000"?"请求处理成功":scope.row.respcode=="000100"?"用户会话超时":scope.row.respcode=="000200"?"安全服务错误":scope.row.respcode=="000300"?"校验服务错误":scope.row.respcode=="000400"?"系统后台错误":scope.row.respcode=="000500"?"网络服务错误":"未知错误")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width='110'>
          <template slot-scope="scope">
            <el-button type="primary" @click="showData(scope.row.uuid)" icon="el-icon-fa-search" title="查看数据"></el-button>
            <el-button type="primary" @click="showServ(scope.row.uuid)" icon="el-icon-fa-info" title="查看服务"></el-button>
            <el-button type="primary" @click="showInfo(scope.row)" icon="el-icon-fa-eye" title="查看详情"></el-button>
            <el-button type="primary" v-if='scope.row.stakinfo' @click="showStak(scope.row.stakinfo)" icon="el-icon-fa-book" title="查看堆栈信息"></el-button>
          </template>
        </el-table-column>
      </PageTable>
    </el-card>

    <el-dialog append-to-body v-draggable title="查看数据" :visible.sync="editor.datashow" width="600px">
      <LogsOperData :uuid="editor.uuid"></LogsOperData>
    </el-dialog>

    <el-dialog append-to-body v-draggable title="查看详情" :visible.sync="currentInfo.visible" width="600px">
      <LogsOperInfo v-loading="currentInfo.loading" v-if="currentInfo.visible" :uuid="currentInfo.uuid" :error="currentInfo.error" />
    </el-dialog>

    <el-dialog append-to-body v-draggable title="查看堆栈信息" :visible.sync="editor.stakshow">
      <template>
        <el-input v-if="stakinfo" type="textarea" :rows="30" v-model="stakinfo" readonly></el-input>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import LogsOperInfo from "./LogsOperInfo";
import LogsOperData from "./LogsOperData";
import SessionServ from "./SessionServ";
import OperAPI from "@/api/base/logs/LogsOper";

export default {
  components: { LogsOperData, SessionServ, LogsOperInfo },
  data() {
    return {
      stakinfo: "",
      queryform: {
        userName: "",
        svrIp: "",
        reqIp: "",
        actDesc: "",
        sesId: "",
        actSta: "",
        actEnd: ""
      },
      //选取时间的范围
      dateRange: [],
      //详细信息dialog
      currentInfo: {
        loading: false,
        visible: false,
        uuid: "",
        error: {}
      },
      table: {
        data: []
      },
      editor: {
        uuid: null,
        datashow: false,
        stakshow: false,
        visible: false, //  编辑器-显示
        loading: true
      }
    };
  },
  methods: {
    //  打开画面
    showStak(stakinfo) {
      this.editor.stakshow = true;
      this.stakinfo = stakinfo;
    },
    showData(uuid) {
      this.editor.uuid = uuid;
      this.editor.datashow = true;
    },
    showServ(uuid) {
      this.$confirm("是否跳转至服务日志页面?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$router.push({
            path: "/logs/LogsServ",
            query: { uuid: uuid }
          });
        })
        .catch(resp => {});
    },
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
    acttypeFormatter(data) {
      return data.acttype == "1"
        ? "HTTP"
        : data.acttype == "2" ? "MQ" : "无请求类型";
    },
    //查看详情
    showInfo(row) {
      this.currentInfo.uuid = row.uuid;
      this.currentInfo.visible = true;
    },
    //加载form数据
    queryData() {
      this.$refs.dataTable.load(this.queryform);
    },
    //reset
    resetquery() {
      this.$refs.queryform.resetFields();
      this.dateRange = [];
    },
    dataTableLoad(params, resolve) {
      if (this.dateRange == null) {
        this.dateRange = [];
      } else {
        //开始时间
        this.queryform.actSta = this.dateRange[0];
        //结束时间
        this.queryform.actEnd = this.dateRange[1];
      }
      OperAPI.queryLogsOper(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    format: function(row, column) {
      var acttype = row[column.property];
      if (acttype === undefined) {
        return "";
      } else {
        if (acttype === "1") {
          return "HTTP协议";
        } else {
          return "错误数据";
        }
      }
    }
  }
};
</script>
