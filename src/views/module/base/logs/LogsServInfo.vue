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
          <el-form-item label="服务定义 " prop="reqIp ">
            <el-input v-model="data.servDefn " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="服务描述 " prop="acttype ">
            <el-input v-model="data.servDesc " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12 ">
          <el-form-item label="操作开始时间 " prop="actSta ">
            <el-input v-model="servSta " disabled></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12 ">
          <el-form-item label="操作结束时间 " prop="actEnd ">
            <el-input v-model="servEnd " disabled></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="会话标识 " prop="sesId ">
        <el-input v-model="data.sesId " disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import ServAPI from "@/api/base/logs/LogsServ";
export default {
  components: { ServAPI },
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
      servSta: "",
      servEnd: ""
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
        ServAPI.getLogsServByUuid(this.uuid)
          .then(respData => {
            this.data = respData.data;
            this.loading = false;
            this.servSta = this.formatterDateTime(
              null,
              null,
              respData.data.servSta
            );
            this.servEnd = this.formatterDateTime(
              null,
              null,
              respData.data.servEnd
            );
          })
          .catch(resp => {});
      }
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
