<template>
  <el-card>
    <template slot="header">
      <span>系统管理</span>
    </template>
    <el-tabs type="border-card" v-model="activeName">
      <el-tab-pane label="字典缓存 " name="SettingCache">
        <SettingCache></SettingCache>
      </el-tab-pane>
      <el-tab-pane label="配置管理 " name="second ">配置管理</el-tab-pane>
    </el-tabs>
  </el-card>
</template>
<script>
import SettingCache from "./SettingCache";

export default {
  name: "Setting",
  components: { SettingCache },
  data() {
    return {
      activeName: "SettingCache"
    };
  }
};
</script>
