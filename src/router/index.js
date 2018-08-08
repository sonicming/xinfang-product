import Vue from "vue";
import VueRouter from "vue-router";
import BaseRouter from "./modules/baseRouter";
import SvrRouter from "./modules/svrRouter";
import config from "../resources/config";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [].concat(BaseRouter).concat(SvrRouter)
});

router.beforeEach((to, from, next) => {
  //  直接允许到login页面
  if (to.path === "/login") {
    window.localStorage.removeItem(config.loginToken);
    next();
    return;
  }

  //  没有登录,载入非login页面,转到login
  // let logined = window.localStorage.getItem(config.loginToken);
  // if (!logined && to.path !== "/login") {
  //   //   next({ path: '/login' })
  //   // return
  // }

  //通过路由拦截进行tabs分页信息的获取
  if (to.path !== "/login" && to.path !== "/home") {
    if (to.name && to.path) {
      router.app.$store.dispatch("base/addTabPagesName", {
        name: to.name,
        path: to.path
      });
    } else {
      console.log("请给路径:" + to.path + " 添加name属性！");
      return;
    }
  }

  //判断是否为动态添加的路由，页面刷新前动态添加的路由会丢失,页面初始化后页面会重新加载路由
  //场景：在动态路由页面进行刷新时会出现找不到页面的情况
  if (to.matched.length === 0) {
    next({ path: "/" });
    return;
  }

  next();
});

export default router;
