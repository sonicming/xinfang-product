<template>
  <div>
    <el-form label-position="top" ref="form" :model="data" :rules="rules">
      <div class="flex-h">
        <el-form-item label="编码" prop="codeTypeValue" class="flex-1">
          <el-input disabled v-model="data.codeTypeValue"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="codeTypeName" class="flex-1">
          <el-input disabled v-model="data.codeTypeName"></el-input>
        </el-form-item>
      </div>
      <div class="lfex-h">
        <el-form-item label="代码名称" prop="codeValue" :error="error.codeValue">
          <el-input type="text" :minlength="6" v-model="data.codeValue"></el-input>
        </el-form-item>
        <el-form-item label="代码值" prop="codeName" :error="error.codeName">
          <el-input type="text" :minlength="6" v-model="data.codeName"></el-input>
        </el-form-item>
      </div>
      <div class="flex-h">
        <el-form-item class="flex-1" style="width:50%" label="排序级别" prop="ordeNo" :error="error.ordeNo">
          <el-input-number type="number" :minlength="6" v-model="data.ordeNo"></el-input-number>
        </el-form-item>
        <el-form-item label="启用状态" prop="enabled" class="flex-1">
          <el-radio-group v-model="data.enabled" :error="error.enabled">
            <el-radio label="0">禁用</el-radio>
            <el-radio label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item label="扩展数据" prop="extend" :error="error.extend">
        <el-input type="textarea" v-model="data.extend"></el-input>
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
        codeName: [{ required: true }],
        codeValue: [{ required: true }]
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
