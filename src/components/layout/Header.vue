<template>
  <el-header class="app-top">
    <img class="logo" src="" width="188" height="42" />
    <div style="float:right;">
      <el-select v-model="$store.state.lang" placeholder="请选择" @change="changeLang" style="width:100px;" class="select-lang">
        <el-option v-for="item in langs" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
      <el-dropdown trigger="click" size="small">
        <span class="el-dropdown-link userinfo-inner">
          <el-button type="text" icon="el-icon-fa-user">{{$store.state.sysUser.userName}}</el-button>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item> 我的消息</el-dropdown-item>
          <el-dropdown-item @click.native="$store.state.sysLogin.changepwd=true">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="text" icon="el-icon-fa-sun-o" title="系统设置" @click.native="handleOpenTab('Setting','系统设置','/setting')"></el-button>
      <el-button type="text" icon="el-icon-more" @click="$store.dispatch('asideCollapsed')"></el-button>
    </div>

  </el-header>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import Locales from "../../locale";
import config from '../../config'
import AcesAPI from "../../api/base/sysm/AcesAPI";


export default {
  computed: {
    langs() {
      return Object.keys(Locales).map((localeName, locale) => {
        return { label: Locales[localeName]["title"], value: localeName };
      });
    }
  },
  watch: {
    "$store.state.lang"(lang) {
      Vue.config.lang = lang;
      moment.locale(lang);
    }
  },
  mounted() {
    let lang = window.localStorage.getItem("lang") || navigator.language;
    this.$store.commit("updateState", { lang });
  },
  methods: {
    handleOpenTab(tabName, tabLabel, tabUrl) {
      this.$store.dispatch("openTab", { tabName, tabLabel, tabUrl });
    },
    changeLang(lang) {
      window.localStorage.setItem("lang", lang);
      this.$store.commit("updateState", { lang });
    },
    logout() {
      this.$confirm("确认退出吗?", "提示", { type: "warning" }).then(() => {
        AcesAPI.logout().then(() => {
          window.localStorage.removeItem(config.loginToken);
          window.location.reload();
        });
      });
    }
  }
};
</script>

<style>
</style>
