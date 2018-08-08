<template>
  <div v-loading='loading'>
    <el-alert title="请选择时间范围为一周以内!" type="info" :closable="true">
    </el-alert>
    <el-row :gutter="3" style='margin-bottom:10px'>
      <el-col :span="20">
        <el-date-picker class="daterange" v-model="timeRange" type="daterange" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-button @click.stop='queryLazyData' type="primary" icon="el-icon-search" style="width: 100%;"></el-button>
      </el-col>
    </el-row>
    <el-alert v-if="timeLine.length===0" title="该用户目前没有进行任何操作 !" type="info" :closable="false">
    </el-alert>
    <el-alert v-if="!userUuid" title="组件不可用，必须传入初始的userUuid值 !" type="error" :closable="false">
    </el-alert>
    <div class="timeline" :style="'max-height:'+height" v-if="!(timeLine.length===0)">
      <el-steps space='50px' direction="vertical" :active="999">
        <el-step v-for="(item, index) in timeLine" :key='index' icon="el-icon-location" :description="item.actDesc">
          <template slot='title'>
            <span>{{item.opTime|date('%Y-%m-%d %T')}}</span>
            <span class='margin-left-4'>
              <el-tag :type="(item.logType==='1'||item.logType==='2')?'success':item.logType==='3'?'warning':'danger'"> {{formatLogType(item.logType)}}</el-tag>
            </span>
          </template>
          <template slot='description'>
            <span v-if='!(calTime(index)===0)'>
              <el-tag type="info">耗时:{{calTime(index)}} m</el-tag>
              <el-tag class='margin-left-2' type="info" title="查看详情" style='cursor: pointer;'>
                <i @click="showLoginHis(item)" class="el-icon-more"></i>
              </el-tag>
            </span>
          </template>
        </el-step>
      </el-steps>
    </div>
  </div>
</template>

<script>
import UserAPI from "../../api/base/usrm/UserAPI";

export default {
  props: {
    userUuid: {
      type: String,
      default: ""
    },
    height: {
      type: String,
      default: "400px"
    }
  },
  mounted: function() {
    this.initload(this.userUuid);
  },
  watch: {
    userUuid(val) {
      this.initload(val);
    }
  },
  data() {
    return {
      loading: false,
      timeLine: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      timeRange: []
    };
  },
  methods: {
    calTime(index) {
      let t = 0;

      if (this.timeLine[index].logType !== "1") {
        if (this.timeLine.length - 1 === index) {
          return t;
        } else {
          if (this.timeLine[index + 1].logType === "1") {
            let mss =
              this.timeLine[index].opTime - this.timeLine[index + 1].opTime;
            return (mss / 1000 / 60).toFixed(3);
          } else {
            return 0;
          }
        }
      } else {
        return t;
      }
    },
    formatLogType(logType) {
      if (logType === "1") {
        return "登入";
      } else if (logType === "2") {
        return "登出";
      } else if (logType === "3") {
        return "超时退出";
      } else if (logType === "4") {
        return "踢出";
      } else {
        return "未知";
      }
    },
    showLoginHis(item) {
      this.$confirm("即将跳转到 '交互日志' 页面, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$emit("closeDia");
          this.$router.push({
            path: "/logs/LogsServ",
            query: { sesId: item.sesId }
          });
        })
        .catch(() => {});
    },
    initload(val) {
      if (val) {
        this.loading = true;
        let t = new Date().getTime();
        let ranTime = {
          startTime: t - 3600 * 1000 * 24 * 7,
          endTime: t
        };
        UserAPI.getTimeLine({
          uuid: this.userUuid
        }).then(resp => {
          this.timeLine = resp;
          this.loading = false;
        });
      }
    },
    queryLazyData() {
      this.loading = true;
      if (this.timeRange && this.timeRange.length > 0) {
        let ranTime = {
          startTime: this.timeRange[0].getTime(),
          endTime: this.timeRange[1].getTime()
        };
        if (ranTime.endTime - ranTime.startTime > 3600 * 1000 * 24 * 7) {
          this.$message.error("请选择合适的时间范围! (最大长度为一周)");
          this.loading = false;
        } else {
          UserAPI.getTimeLine(
            Object.assign(
              {
                uuid: this.userUuid
              },
              ranTime
            )
          ).then(resp => {
            this.timeLine = resp;
            this.loading = false;
          });
        }
      } else {
        this.$message.error("请选择时间范围!");
        this.loading = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.timeline {
  overflow: auto;
  padding: 20px 20px 0px 20px;
}
.daterange {
  width: 100%;
}
</style>