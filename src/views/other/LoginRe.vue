<template>
  <div class="login-dialog">
    <el-alert title="登录超时,请重新登录!" type="warning">
    </el-alert>
    <el-form :model="loginForm" :rules="rules" ref="loginForm" label-position="left" label-width="0px">
      <el-form-item prop="userid">
        <el-input type="text" v-model="sysUser.userId" auto-complete="off" placeholder="账号" readonly :disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="passwd">
        <el-input type="password" v-model="loginForm.passwd" auto-complete="off" placeholder="密码" :disabled="sysLogin.disLogin"></el-input>
      </el-form-item>
      <el-form-item prop="captcha" v-if="sysLogin.needCaptcha">
        <el-input type="text" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码" :disabled="sysLogin.disLogin">
          <img slot="prepend" class="captcha" @click="changeImg" :src="captchaUrl">
        </el-input>
      </el-form-item>
      <div style="width:100%;text-align:center;">
        <el-button style="width:45%;" type="primary" @click.native.prevent="relogin" :loading="sysLogin.loading">登录</el-button>
        <el-button style="width:45%;" @click.native.prevent="cancelRelogin">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import config from "../../resources/config";

export default {
  data() {
    return {
      captchaUrl: config.captchaUrl,
      loading: false,
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        checkPass: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "验证码不能为空" }]
      },
      loginForm: {
        userid: "",
        passwd: "",
        captcha: ""
      }
    };
  },
  computed: {
    sysLogin() {
      return this.$store.state.base.sysLogin;
    },
    sysUser() {
      return this.$store.state.base.sysUser;
    }
  },
  watch: {
    "sysLogin.timeout"() {
      let maskDom = document.querySelector(".el-loading-mask");
      if (maskDom) {
        maskDom.parentNode.removeChild(maskDom);
      }
    }
  },
  methods: {
    changeImg() {
      this.captchaUrl = `${config.captchaUrl}?_dc=${new Date().getTime()}`;
    },
    //  重新登录
    relogin() {
      Object.assign(this.loginForm, { userid: this.sysUser.userId });
      this.$store.dispatch("base/login", this.loginForm).then(() => {});
    },
    //  取消重新登录
    cancelRelogin() {
      this.$store.commit("SET_LOGIN", { loading: false, timeout: false });
    }
  }
};
</script>