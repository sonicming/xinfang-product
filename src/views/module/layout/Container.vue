<template>
  <el-container id="app-container" direction="vertical">
    <el-tabs class='hidcon' v-model="tabPagesName.curr" type="card" @tab-remove="removeTab" @tab-click="clickTab">
      <el-tab-pane v-for="item in tabPagesName.data" :key="item.path" :label="item.path.indexOf('/query')>-1?formatQueryCode(item.name):$t('router.'+item.name)" :name="item.path" :closable='item.path!=="/"'></el-tab-pane>
    </el-tabs>
    <el-dropdown size="mini" trigger="click">
      <el-button>
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="$store.dispatch('base/closeOtherTabPage')">关闭其它标签</el-dropdown-item>
        <el-dropdown-item @click.native="$store.dispatch('base/closeRightTabPage')">关闭右侧标签</el-dropdown-item>
        <el-dropdown-item @click.native="closeAllTabPage">关闭全部标签</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="app-main" style='height: calc(100% - 28px);margin-top: 28px;z-index: 999;'>
      <keep-alive :include='keepRouters'>
        <router-view></router-view>
      </keep-alive>
    </div>
  </el-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["tabPagesName", "keepRouters"])
  },
  name: "Container",
  componentName: "Container",
  methods: {
    formatQueryCode(code) {
      let title;
      this.$store.state.base.queryDesign.forEach((value, index) => {
        if (value.queryname === code) title = value.querytitle;
      });
      return title;
    },
    closeAllTabPage() {
      this.$store.dispatch("base/closeAllTabPage");
      this.$router.push({ path: "/" });
    },
    //点击tab标签
    clickTab(targetObj) {
      this.$router.push({ path: targetObj.name });
    },
    //移除tab标签
    removeTab(targetPath) {
      this.$store
        .dispatch("base/delTabPagesName", {
          path: targetPath
        })
        .then(value => {
          this.$router.push({ path: value });
        });
    }
  }
};
</script>

<style>
#app-container {
  padding: 6px;
}
#app-container > .el-tabs {
  box-sizing: border-box;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  box-shadow: 0 10px 10px 0 #0000001f, 0 0 6px 0 #0000000a;
}
#app-container > .el-tabs .el-tabs__header {
  margin: 0px;
  padding-right: 30px;
}
#app-container > .el-tabs .el-tabs__content {
  height: 100%;
  padding: 6px;
}
#app-container > .el-tabs .el-tab-pane {
  height: 100%;
}
#app-container .el-dropdown {
  position: absolute;
  right: 10px;
  margin-top: 3px;
}
</style>