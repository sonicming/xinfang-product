<template>
    <el-aside class="app-aside"  :height="'100px'" :width="$store.state.base.asideCollapsed?'auto':'180px'"  >
      <el-menu :collapse-transition="false" :router=" true" :collapse="$store.state.base.asideCollapsed" :default-active="$route.path" unique-opened>
        <template>
          <el-submenu v-for="(item,index) in  $router.options.routes" :key="item.uuid " v-if="item.children&&item.children.length>0&&item.hidden!=true" :index="index+''">
            <template slot="title">
              <i :class="'el-icon-fa-'+item.iconUrl"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item v-for="(child) in item.children" :index="child.path" :key="child.permCode">
              <span>{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
</template>

<script>
export default {
  data() {
    return {};
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
