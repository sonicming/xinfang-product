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
        name: "Home",
        component: () => import("@/views/Main.vue")
      },
      {
        path: "setting",
        name: "Setting",
        component: () => import("@/views/module/base/sysm/Setting.vue")
      }
      // {
      //   path: "query-:name",
      //   name: "Query",
      //   component: () => import("@/views/module/base/sysm/Query.vue")
      // }
    ]
  },
  {
    path: "/sysm",
    hidden: false,
    title: "系统管理",
    component: Home,
    children: [
      {
        path: "UserMgr",
        name: "UserMgr",
        component: () => import("@/views/module/base/usrm/UserMgr.vue")
      },
      {
        path: "RoleMgr",
        name: "RoleMgr",
        component: () => import("@/views/module/base/usrm/RoleMgr.vue")
      },
      {
        path: "OrgMgr",
        name: "OrgMgr",
        component: () => import("@/views/module/base/usrm/OrgMgr.vue")
      },
      {
        path: "PermMgr",
        name: "PermMgr",
        component: () => import("@/views/module/base/usrm/PermMgr.vue")
      },
      {
        path: "CodeMgr",
        name: "CodeMgr",
        component: () => import("@/views/module/base/sysm/CodeMgr.vue")
      },
      {
        path: "ParaMgr",
        name: "ParaMgr",
        component: () => import("@/views/module/base/sysm/ParaMgr.vue")
      }
      // {
      //   path: "QueryMgr",
      //   name: "QueryMgr",
      //   component: () => import("@/views/module/base/sysm/QueryMgr.vue")
      // }
    ]
  },
  {
    path: "/logs",
    hidden: false,
    title: "日志管理",
    component: Home,
    children: [
      {
        path: "LogsOper",
        name: "LogsOper",
        component: () => import("@/views/module/base/logs/LogsOper.vue")
      },
      {
        path: "LogsServ",
        name: "LogsServ",
        component: () => import("@/views/module/base/logs/LogsServ.vue")
      },
      {
        path: "LogsSign",
        name: "LogsSign",
        component: () => import("@/views/module/base/logs/LogsSign.vue")
      }
    ]
  },
  { path: "/login", hidden: true, component: Login },
  { path: "/404", hidden: true, component: NotFound }
];
