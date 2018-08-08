import Home from "@/views/Home.vue";

export default [
  {
    path: "/svr",
    hidden: false,
    component: Home,
    children: [
      {
        path: "ent",
        name: "ent",
        component: () => import("@/views/module/svr/SvrEnt.vue")
      },
      {
        path: "msgtype",
        name: "msgtype",
        component: () => import("@/views/module/svr/SvrMsgtype.vue")
      },
      {
        path: "client",
        name: "client",
        component: () => import("@/views/module/svr/SvrClient.vue")
      },
      {
        path: "tpp",
        name: "tpp",
        component: () => import("@/views/module/svr/SvrTpp.vue")
      },
      {
        path: "maintenance",
        name: "maintenance",
        component: () => import("@/views/module/svr/SvrMaint.vue")
      }
    ]
  }
];
