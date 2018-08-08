<template>
  <div>
    <el-form label-position="top" :model="data" v-loading="loading" ref="form ">
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="服务器地址 " prop="svrIp ">
            <el-input v-model="data.svrIp " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="服务器名称 " prop="svrName ">
            <el-input v-model="data.svrName " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="处理代码 " prop="respCode ">
            <el-input v-model="data.respCode " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="处理描述 " prop="respDesc ">
            <el-input v-model="data.respDesc " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="协议类型 " prop="acttype ">
            <el-input v-model="acttype " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="请求者地址 " prop="reqIp ">
            <el-input v-model="data.reqIp " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="操作开始时间 " prop="actSta ">
            <el-input v-model="actSta " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="操作结束时间 " prop="actEnd ">
            <el-input v-model="actEnd " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="会话标识 " prop="sesId ">
        <el-input v-model="data.sesId " disabled></el-input>
      </el-form-item>
      <el-form-item label="请求终端类型 " prop="devType ">
        <el-input v-model="data.devType " disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import OperAPI from "@/api/base/logs/LogsOper";
export default {
  components: { OperAPI },
  props: {
    // 一定要暴露一个UUID属性,用来做编辑操作.
    uuid: String,
    // 暴露出去一个属性用来显示服务器校验失败错误
    error: Object
  },
  data() {
    return {
      loading: false,
      data: Object.assign({}),
      acttype: "",
      actSta: "",
      actEnd: ""
    };
  },
  watch: {
    uuid(val) {
      this.loadData();
    }
  },
  mounted() {
    // 最开始显示的时候要加载数据
    this.loadData();
  },
  methods: {
    // 因为表单里面没有按钮,所以需要暴露方法
    // 提供一个校验方法 ,
    validate() {
      return this.$refs.form.validate().then(() => this.data);
    },
    // 加载数据方法,如果有UUID,就加载数据,如果没有,就重置表单
    loadData() {
      if (!this.uuid) {
        this.$refs.form.resetFields();
      } else {
        this.loading = true;
        OperAPI.getLogsOperByUuid(this.uuid)
          .then(respData => {
            this.data = respData.datarows;
            this.loading = false;
            this.acttype = this.acttypeFormatter(respData.datarows);
            this.actSta = this.formatterDateTime(
              null,
              null,
              respData.datarows.actSta
            );
            this.actEnd = this.formatterDateTime(
              null,
              null,
              respData.datarows.actEnd
            );
          })
          .catch(resp => {});
      }
    },
    acttypeFormatter(data) {
      return data.actType == "1"
        ? "HTTP"
        : data.actType == "2" ? "MQ" : "无请求类型";
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
