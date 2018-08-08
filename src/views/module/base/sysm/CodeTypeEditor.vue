<template>
  <div>
    <el-form label-position="top" ref="form" :model="data" :rules="rules">
      <el-form-item label="名称" prop="codeTypeName" :error="error.codeTypeName">
        <el-input v-model="data.codeTypeName"></el-input>
      </el-form-item>
      <el-form-item label="编码" prop="codeTypeValue" :error="error.codeTypeValue">
        <el-input v-model="data.codeTypeValue"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="codeKind" :error="error.codeKind">
        <el-radio-group v-model="data.codeKind">
          <el-radio label="1">列表</el-radio>
          <el-radio label="2">树状</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <HandleHistory class="margin-top-1 margin-bottom-1" v-if="data.uuid" :uuid="data.uuid" :cr-user-uuid="data.crUserUuid" :op-user-uuid="data.opUserUuid" :cr-time="data.crTime" :op-time="data.opTime" mode="plan" />
  </div>
</template>
<script>
import HandleHistory from "@/views/common/HandleHistory";

export default {
  components: { HandleHistory },
  props: {
    data: Object,
    error: Object
  },
  data() {
    return {
      rules: {
        codeTypeName: [{ required: true, message: "请输入代码标识!" }],
        codeTypeValue: [{ required: true, message: "请输入代码名称!" }]
      }
    };
  },
  methods: {
    // 因为表单里面没有按钮,所以需要暴露方法
    // 提供一个校验方法 ,
    validate() {
      return this.$refs.form.validate().then(() => this.data);
    }
  }
};
</script>
