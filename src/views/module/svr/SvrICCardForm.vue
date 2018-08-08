<template>
  <el-form label-position="top" ref="form" :model="data" :rules="rules">
    <el-form-item>
      <el-button @click="submit" icon="el-icon-fa-save"></el-button>
      <el-button @click="reset" icon="el-icon-fa-refresh"></el-button>
    </el-form-item>
    <el-form-item label="所属企业" prop="bizentuuid" :error="error.bizentuuid">
      <Selector v-model="data.bizentuuid" clearable label-key="copname" value-key="uuid" :init-label="data.bizentname" placeholder="所属企业">
        <SelectorEnt></SelectorEnt>
      </Selector>
    </el-form-item>
    <el-form-item label="卡号" prop="cardno" :error="error.cardno">
      <el-input v-model="data.cardno"></el-input>
    </el-form-item>
    <el-form-item label="证书号" prop="cardkeyname" :error="error.cardkeyname">
      <el-input v-model="data.cardkeyname"></el-input>
    </el-form-item>
    <el-form-item label="证书" prop="cardcert" :error="error.cardcert">
      <el-input v-model="data.cardcert"></el-input>
    </el-form-item>
    <el-form-item label="备注" prop="note">
      <el-input v-model="data.note" type='textarea'></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
import BaseForm from '../common/BaseForm'
import SelectorEnt from '../selector/SelectorEnt'

export default {
  extends: BaseForm,
  components: { SelectorEnt },
  data () {
    return {
      rules: {
        cardno: [{ required: true, message: '请输入卡号!' }],
        cardkeyname: [{ required: true, message: '请输入证书号!' }],
        cardcert: [{ required: true, message: '请输入证书!' }]
      }
    }
  }
}
</script>
