<!-- 登录日志管理页面 -->
<template>
  <div>
    <el-card class="flex-1">
      <template slot="header">
        <span>登录日志管理</span>
      </template>
      <el-form :model="queryform" ref="queryform">
        <el-row>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="服务器IP" prop="svrIp">
              <el-input v-model="queryform.svrIp"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="登录名" prop="userId">
              <el-input v-model="queryform.userId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="处理代码" prop="respCode">
              <el-input v-model="queryform.respCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :lg='4' :sm='12'>
            <el-form-item label="登录开始时间" prop="actSta">
              <el-date-picker type="date" v-model="queryform.actSta"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="flex-1">
      <template slot="header">
        <span>登录日志列表</span>
        <div class="pull-right">
          <el-button type="primary" @click="queryData" icon="el-icon-fa-search" title="查询"></el-button>
          <el-button type="primary" @click="resetquery" icon="el-icon-fa-reply-all" title="重置"></el-button>
        </div>
      </template>
      <PageTable hideTitle ref="dataTable" :auto-load="true" :page-size="10" @load-data="dataTableLoad" :data="table.data" highlight-current-row stripe border>
        <el-table-column type="index" fixed='left'></el-table-column>
        <el-table-column prop="userid" label="登录名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="username" label="用户名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrip" label="服务器地址" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="svrname" label="服务器名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="logtype" label="登录类型" :formatter="formater"></el-table-column>
        <el-table-column prop="acttype" label="协议类型" :formatter="format"></el-table-column>
        <el-table-column prop="reqip" label="请求者地址" width="100px" show-overflow-tooltip></el-table-column>
        <el-table-column prop="actsta" label="操作时间" :formatter="formatterDateTime" width="150px"></el-table-column>
        <el-table-column label="操作耗时" placement="top" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{(scope.row.actend==0||scope.row.actsta==0)?"0s":((scope.row.actend-scope.row.actsta)/ 1000) +'s'}}
          </template>
        </el-table-column>
        <el-table-column label="处理代码" show-overflow-tooltip>
          <template slot-scope='scope'>
            {{scope.row.respcode+':'+(scope.row.respcode=="000000"?"请求处理成功":scope.row.respcode=="000100"?"用户会话超时":scope.row.respcode=="000200"?"安全服务错误":scope.row.respcode=="000300"?"校验服务错误":scope.row.respcode=="000400"?"系统后台错误":scope.row.respcode=="000500"?"网络服务错误":"未知错误")}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width='100'>
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-fa-search" title="查看会话操作" @click="showSession(scope.row.sesid)"></el-button>
            <el-button type="primary" icon="el-icon-fa-info" title="查看会话服务" @click="showService(scope.row.sesid)"></el-button>
            <el-button type="primary" @click="showInfo(scope.row.uuid)" icon="el-icon-fa-eye" title="查看详情"></el-button>
          </template>
        </el-table-column>
      </PageTable>
      <el-dialog append-to-body v-draggable title="会话操作信息" :visible.sync="editor.doShow">
        <SessionOper :uuid="editor.uuid"></SessionOper>
      </el-dialog>
      <el-dialog append-to-body v-draggable title="会话服务信息" :visible.sync="editor.serShow">
        <SessionServ :uuid="editor.uuid"></SessionServ>
      </el-dialog>
      <el-dialog append-to-body v-draggable title="查看详情" :visible.sync="currentInfo.show" width="600px">
        <SignInfo :uuid="currentInfo.uuid" :error="currentInfo.error" v-if="currentInfo.show"></SignInfo>
      </el-dialog>

    </el-card>
  </div>
</template>
<script>
import SignInfo from "./LogsSignInfo";
import SessionOper from "./SessionOper";
import SessionServ from "./SessionServ";
import LogsSignAPI from "@/api/base/logs/LogsSign";

export default {
  components: { SessionOper, SessionServ, SignInfo },
  data() {
    return {
      queryform: {
        svrIp: "",
        userId: "",
        respCode: "",
        actSta: ""
      },
      table: {
        data: []
      },
      currentInfo: {
        error: {},
        uuid: "",
        show: false,
        loading: false
      },
      editor: {
        uuid: null,
        serShow: false,
        stakshow: false,
        doShow: false,
        visible: false, //  编辑器-显示
        loading: false
      }
    };
  },
  methods: {
    showInfo(uuid) {
      this.currentInfo.uuid = uuid;
      this.currentInfo.show = true;
    },
    queryData() {
      this.$refs.dataTable.load(this.queryform);
    },
    resetquery() {
      this.$refs.queryform.resetFields();
    },
    dataTableLoad(params, resolve) {
      LogsSignAPI.queryLogsSign(params)
        .then(resolve) //  让表格解析你提供的数据 (主要解析页码等)
        .then(respData => (this.table.data = respData.datarows)); // 本地也记录一下数据 (提供给表示显示的数据)
    },
    showSession(uuid) {
      this.editor.uuid = uuid;
      this.editor.doShow = true;
    },
    showService(uuid) {
      this.editor.uuid = uuid;
      this.editor.serShow = true;
    },
    /* 格式化数据 */
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
    },
    formater: function(row, column) {
      var logtype = row[column.property];
      var stat = "";
      if (this.sysCode.loginType === undefined) {
        this.refresh();
      }
      this.sysCode.loginType.forEach(val => {
        if (logtype === val.value) {
          stat = val.label;
          return;
        }
      });
      return stat;
    },
    refresh() {
      this.$store.dispatch("base/refreshSysCode", "loginType");
    }
  }
};
</script>
