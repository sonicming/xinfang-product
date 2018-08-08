import Login from "@/views/Login.vue";
import NotFound from "@/views/other/404.vue";
import Home from "@/views/Home.vue";

export default [
  {
    path: "/",
    hidden: true,
    title: "Home",
    component: Home,
    children: [
      {
        path: "/",
        name: "首页",
        component: () => import("@/views/Main.vue")
      },
      {
        path: "/setting",
        name: "设置",
        component: () => import("@/views/module/base/sysm/Setting.vue")
      }
    ]
  },
  {
    path: "/System",
    hidden: false,
    title: "System",
    component: Home,
    name:"系统管理",
    children: [
      {
        path: "/User",
        name: "用户信息管理"
      },
      {
        path: "/Role",
        name: "角色权限管理"
      },
      {
        path: "/Organization",
        name: "所属机构管理"
      },
      {
        path: "/CodeTable",
        name: "代码表定制"
      }
    ]
  },
  { path: "/login", hidden: true, component: Login },
  { path: "/404", hidden: true, component: NotFound }
];
