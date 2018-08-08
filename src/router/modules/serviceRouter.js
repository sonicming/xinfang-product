import Home from "@/views/Home.vue";

export default [
  {
    path: "/shiXiangDengJi", // 第一层路由用来作为模块切换按钮使用
    iconCls: "fa fa-file-text fa-fw",
    component: Home, // 路由引用的组件实际上的意思就是，在该连接中渲染的内容为引用组件+他的父层组件内容
    name:"事项登记",
    children: [
      {
        path: "/laiXinDengJi",
        name: "来信登记",
        component: () => import("@/views/module/shiXiangDengJi/LaiXinDengJi.vue")
      },
      {
        path: "/laiFangDengJi",
        name: "来访登记",
        component: () => import("@/views/module/shiXiangDengJi/LaiFangDengJi.vue")
       }
    ]
  },
  {
    path: "/shiXiangDaiBan",
    iconCls: "fa fa-clock-o fa-fw",
    component: Home,
    name: "事项待办",
    children: [
      {
        path: "/geRenDaiBan",
        name: "个人待办"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/buMenDaiBan",
        name: "部门待办"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      }
    ]
  },
  {
    path: "/duChaDuBan",
    iconCls: "fa fa-eye fa-fw",
    component: Home,
    title: "duChaDuBan",
    name: "督查督办",
    children: [
      {
        path: "/duBanLiXiang",
        name: "督办立项"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      }
    ]
  },
  {
    path: "/chaXunTongJi",
    iconCls: "fa  fa-bar-chart fa-fw",
    //component: Main,
    name: "查询统计",
    children: [
      {
        path: "/gongGongShouCang",
        name: "公共收藏"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/buMenShouCang",
        name: "部门收藏"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/geRenShouCang",
        name: "个人收藏"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/xinFangJianChaXun",
        name: "信访件查询"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/xinFangRenChaXun",
        name: "信访人查询"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/tongJiFenXiLingDaoJueCe",
        name: "统计分析领导决策"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      }
    ]
  },
  {
    path: "/zongHeGuanLi",
    iconCls: "fa fa-server fa-fw",
    //component: Main,
    name: "综合管理",
    children: [
      {
        path: "/shenFenZhengBuQuan",
        name: "身份证补全登记"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/duanXinJiLu",
        name: "短信记录查询"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/duanXinMoBan",
        name: "短信模板管理"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/zhanNeiXinShouJianXiang",
        name: "站内信收件箱管理"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/gongZuoWeiTuo",
        name: "工作委托"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/chuangKouXinXi",
        name: "窗口信息管理"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/wenShuChaXun",
        name: "文书查询"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      },
      {
        path: "/wenShuGuanLi",
        name: "文书管理"
        //component: ShiXiangDengJiMain, // 进入第一层后调用的模块内主页面，可以再模块内继续添加第二层路由
      }
    ]
  }
];
