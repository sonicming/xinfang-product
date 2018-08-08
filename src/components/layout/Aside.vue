<template>
  <div>
    <el-aside class="app-aside" :width="$store.state.asideCollapsed?'auto':'240px'">
      <el-menu :collapse-transition="false" :router=" false" :collapse="$store.state.asideCollapsed" :default-active="$route.path" unique-opened>
        <template>
          <el-submenu v-for="(item,index) in $store.state.sysMenus" :key="item.uuid " v-if="item.children&&item.children.length>0" :index="index+''">
            <template slot="title">
              <i :class="'el-icon-fa-'+item.iconUrl"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item v-for="(child) in item.children" @click="hanleSelectMenu(child)" :index="child.funcUrl" :key="child.permCode">
              <i :class="'el-icon-fa-'+child.iconUrl"></i>
              <span>{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <p class='version_btn'>
      <el-popover :placement="versionInfo.placement" :title="versionInfo.title" :width="versionInfo.width" trigger="hover" popper-class='popper_version'>
        <p>当前版本：{{versionInfo.currVer}}</p>
        <p>基于框架：{{versionInfo.currFrm}}</p>
        <p>关于版权</p>
        <p>{{versionInfo.aboutVer}}</p>
        <p>{{versionInfo.ver}}</p>
        <el-button slot="reference" size="small" icon='el-icon-more'></el-button>
      </el-popover>
    </p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapsed: false,
      versionInfo: {
        title: "版本信息",
        placement: "left-end",
        width: "250",
        currVer: "ASE-v1.0.0 pro",
        currFrm: "Vue 2.X + Element 2.x",
        aboutVer:
          "ASE 受国家计算机软件著作权保护（登记号：2018SR410669），未经官网正规渠道授权擅自公开产品源文件、以及直接对产品二次出售的，我们将保留追究法律责任的权利。",
        ver: "© 2018 ETONG.com 版权所有"
      }
    };
  },
  methods: {
    /**
     * 点击菜单处理
     */
    hanleSelectMenu(perm) {
      let tabName = perm.permCode;
      let tabLabel = perm.permName;
      let tabUrl = perm.funcUrl;
      this.$store.dispatch("openTab", { tabName, tabLabel, tabUrl });
    }
  }
};
</script>

<style>
</style>
