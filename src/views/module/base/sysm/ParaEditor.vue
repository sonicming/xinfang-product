<template>
  <div>
    <el-form v-loading="loading" label-position="top" ref="form" :model="data" :rules="rules">
      <el-form-item label="参数名称" prop="paraname" :error="error.paraname">
        <el-input v-model="data.paraname"></el-input>
      </el-form-item>
      <el-form-item label="参数值" prop="paravalue" :error="error.paravalue">
        <el-input v-model="data.paravalue"></el-input>
      </el-form-item>
      <el-form-item label="参数描述" prop="paradesc" :error="error.paradesc">
        <el-input type="textarea" v-model="data.paradesc"></el-input>
      </el-form-item>
    </el-form>
    <HandleHistory class="margin-top-1 margin-bottom-1" v-if="data.uuid" :uuid="data.uuid" :cr-user-uuid="data.crUserUuid" :op-user-uuid="data.opUserUuid" :cr-time="data.crTime" :op-time="data.opTime" mode="plan" />
  </div>
</template>
<script>
import HandleHistory from "@/views/common/HandleHistory";
import ParaApi from "@/api/base/sysm/ParaAPI";

let dafaultData = {
  paraname: "",
  paravalue: "",
  paradesc: ""
};

export default {
  components: { HandleHistory },
  props: {
    // 一定要暴露一个UUID属性,用来做编辑操作.
    uuid: String,
    // 暴露出去一个属性用来显示服务器校验失败错误
    error: Object
  },
  data() {
    return {
      loading: false,
      data: Object.assign({}, dafaultData),
      rules: {
        paraname: [{ required: true, message: "请输入参数名称!" }],
        paravalue: [{ required: true, message: "请输入参数值!" }]
      }
    };
  },
  watch: {
    uuid(val) {
      this.loadData();
    }
  },
  mounted() {
    //  最开始显示的时候要加载数据
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
        ParaApi.getPara(this.uuid).then(respData => {
          this.data = respData;
          this.loading = false;
        });
      }
    }
  }
};
</script>
