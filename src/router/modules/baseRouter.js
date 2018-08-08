import Login from "@/views/Login.vue";
import NotFound from "@/views/other/404.vue";
import Home from "@/views/Home.vue";

export default [
  {
    path: "/",
    hidden: true,
    title: "Home",
    name:"首页",
    component: Home,
    children: [
      {
        path: "/",
        name: "首页",
        component: () => import("@/views/Main.vue")
      },
      {
        path: "setting",
        name: "设置",
        component: () => import("@/views/module/base/sysm/Setting.vue")
      }
    ]
  },
  {
    path: "/sysm",
    hidden: false,
    title: "System",
    name:"系统管理",
    component: Home,
    children: [
      {
        path: "UserMgr",
        name: "用户信息管理",
        component: () => import("@/views/module/base/usrm/UserMgr.vue")
      },
      {
        path: "RoleMgr",
        name: "角色管理",
        component: () => import("@/views/module/base/usrm/RoleMgr.vue")
      },
      {
        path: "OrgMgr",
        name: "所属机构管理",
        component: () => import("@/views/module/base/usrm/OrgMgr.vue")
      },
      {
        path: "PermMgr",
        name: "代码表定制(高级)",
        component: () => import("@/views/module/base/usrm/PermMgr.vue")
      }
    ]
  },
  { path: "/login", hidden: true, component: Login },
  { path: "/404", hidden: true, component: NotFound }
];
