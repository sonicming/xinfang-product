<template>
  <div>

    <div class="dialog-button">
      <el-button @click="submit" icon="el-icon-fa-save" type="primary" title="保存" plain></el-button>
    </div>

    <el-form label-position="top" ref="form" :model="data" :rules="rules">
      <el-form-item label="客户端授权" prop="clitoken" :error="error.clitoken">
        <el-input v-model="data.clitoken"></el-input>
      </el-form-item>
      <div class="flex-h">
        <el-form-item class="flex-1" label="第三方平台" prop="biztppuuid" :error="error.biztppuuid">
          <Selector v-model="data.biztppuuid" :clearable="true" label-key="tppname" value-key="uuid" :init-label="data.biztppname" placeholder="第三方平台">
            <SelectorTpp></SelectorTpp>
          </Selector>
        </el-form-item>
        <el-form-item class="flex-1" prop="clistatus" label="客户端状态" :error="error.clistatus">
          <el-select placeholder="状态" v-sys-code="'clistatus'" v-model="data.clistatus" clearable>
            <el-option v-for="item in sysCode.clistatus" :key="item.key" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item label="备注" prop="note">
        <el-input v-model="data.note"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import SelectorTpp from "@/views/common/SelectorTpp";
import BaseForm from "@/views/common/BaseForm";

export default {
  mixins: [BaseForm],
  components: { SelectorTpp },
  data() {
    return {
      rules: {
        clistatus: [{ required: true, message: "请选择客户端状态!" }],
        clitoken: [{ required: true, message: "请输入客户端授权!" }],
        biztppuuid: [
          {
            required: true,
            message: "请输入第三方平台名称!",
            trigger: "change"
          }
        ]
      }
    };
  }
};
</script>
