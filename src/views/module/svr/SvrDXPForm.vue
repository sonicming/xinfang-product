<template>
  <el-form class="etong" label-position="top" ref="form" :model="data" :rules="rules">
    <el-form-item>
      <el-button @click="submit" icon="el-icon-fa-save"></el-button>
      <el-button @click="reset" icon="el-icon-fa-refresh"></el-button>
    </el-form-item>
    <el-row>
      <el-col :span="24">
        <el-form-item label="企业名称" prop="bizentuuid" :error="error.bizentuuid">
          <Selector v-model="data.bizentuuid" clearable label-key="copname" value-key="uuid" :init-label="data.bizentname" placeholder="所属企业">
            <SelectorEnt></SelectorEnt>
          </Selector>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="DXPID" prop="dxpid" :error="error.dxpid">
          <el-input v-model="data.dxpid"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="描述" prop="dxpdesc">
          <el-input type="dxpdesc" :minlength="6" v-model="data.dxpdesc"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注" prop="note">
          <el-input v-model="data.note"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import BaseForm from "../../views/common/BaseForm";
import SelectorEnt from "../selector/SelectorEnt";

export default {
  extends: BaseForm,
  components: { SelectorEnt },
  data() {
    return {
      rules: {
        dxpid: [{ required: true, message: "请输入DXPID!" }]
      }
    };
  }
};
</script>
