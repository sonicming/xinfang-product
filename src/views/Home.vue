<template>
  <el-container class="app-container" direction="vertical">
    <vue-progress-bar></vue-progress-bar>
    <Header/>
    <el-container>
      <Aside/>
      <Container/>
    </el-container>
    <el-dialog append-to-body v-draggable title="系统提示" :visible.sync="$store.state.base.sysLogin.timeout" :close-on-click-modal="false" :show-close="true" width="400px" style="z-index:999999">
      <LoginRe/>
    </el-dialog>
    <el-dialog append-to-body v-draggable title="修改密码" width="360px" :visible.sync="$store.state.base.sysLogin.changepwd" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="true" style="z-index:99999999">
      <ChangePw @cancel="$store.state.base.sysLogin.changepwd=false"></ChangePw>
    </el-dialog>
  </el-container>
</template>
<script>
import Vue from "vue";
import { Loading } from "element-ui";
import LoginRe from "@/views/other/LoginRe";
import ChangePw from "@/views/module/base/sysm/ChangePw";
import Container from "@/views/module/layout/Container";
import Aside from "@/views/module/layout/Aside";
import Header from "@/views/module/layout/Header";
import config from "../resources/config";
import CacheService from "../service/module/CacheService";
import Home from "@/views/Home.vue";

export default {
  components: { LoginRe, ChangePw, Container, Aside, Header },
  created() {
    //发现页面刷新的时候vue-router会保留to和form的路由信息，页面重载后tabs会保留form信息
    //所以进行手动清空
    this.$store.dispatch("base/closeAllTabPage");
    //刷新router-view标签
    this.$router.push({ path: "/" });
  },
  mounted() {
    let loading = Loading.service({
      lock: true,
      text: "服务器连接中...",
      spinner: "el-icon-loading",
      background: "rgba(0, 0, 0, 0.7)"
    });
    //TODO
    //无session情况下默认关闭loading蒙版
    loading.close();
    setTimeout(() => {
      let promiseGetLoginInfo = this.$store.dispatch("base/getLoginInfo");
      // let promiseGetQueryDesign = this.$store.dispatch("base/getQueryDesign");

      Promise.all([promiseGetLoginInfo])
        .then(data => {
          CacheService.repairWith(data.ttocpic, data.tversion);
          CacheService.repairWith(data.ctocpic, data.cversion);
          //动态添加路由
          // let queryRouter = [
          //   {
          //     path: "/query",
          //     component: Home,
          //     children: []
          //   }
          // ];
          // data[1].forEach((value, index) => {
          //   let m = Object.assign({}, t);
          //   m.name = value.queryname;
          //   queryRouter[0].children.push({
          //     path: value.queryname,
          //     name: value.queryname,
          //     meta: { title: value.querytitle },
          //     component: m
          //   });
          // });
          // this.$router.addRoutes(queryRouter);
          loading.close();
        })
        .catch(e => {
          //  loading.close();
          // this.$router.replace("/login");
        });
    }, 200);
  }
};
</script>


