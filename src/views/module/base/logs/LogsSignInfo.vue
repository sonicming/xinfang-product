<template>
  <div>
    <el-form label-position="top" :model="data" v-loading="loading" ref="form ">
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="登录名 " prop="userid ">
            <el-input v-model="data.userid " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="用户名 " prop="username ">
            <el-input v-model="data.username " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="服务器地址 " prop="svrip ">
            <el-input v-model="data.svrip " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="服务器名称 " prop="respDesc ">
            <el-input v-model="data.svrname " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="处理代码 " prop="respcode ">
            <el-input v-model="data.respcode " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="处理描述 " prop="respdesc ">
            <el-input v-model="data.respdesc " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="请求地址 " prop="reqip ">
            <el-input v-model="data.reqip " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="登录类型 " prop="logtype ">
            <el-input v-model="logtype " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="操作开始时间 " prop="actsta ">
            <el-input v-model="actsta " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="操作结束时间 " prop="actend ">
            <el-input v-model="actend " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="请求终端类型 " prop="devtype ">
        <el-input v-model="data.devtype " disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SignAPI from "@/api/base/logs/LogsSign";
export default {
  components: { SignAPI },
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
      logtype: "",
      actsta: "",
      actend: ""
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
        SignAPI.getLogsSignByUuid(this.uuid)
          .then(respData => {
            this.data = respData.datarows[0];
            this.loading = false;
            this.logtype = this.loginFormat(this.data.logtype);
            this.actsta = this.formatterDateTime(
              null,
              null,
              respData.datarows[0].actsta
            );
            this.actend = this.formatterDateTime(
              null,
              null,
              respData.datarows[0].actend
            );
          })
          .catch(resp => {});
      }
    },
    //登录类型
    loginFormat(par) {
      var stat = "";
      if (this.sysCode.loginType === undefined) {
        this.refresh();
      }
      this.sysCode.loginType.forEach(val => {
        if (par === val.value) {
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
<style lang="scss" scoped>
</style>
