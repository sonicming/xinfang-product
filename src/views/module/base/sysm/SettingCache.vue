<template>
  <div>
    <div v-loading="loading">
      <div>
        您可以手动管理以下缓存.
        <br> 本地缓存,不影响服务器,操作前,请保证网络通畅.
      </div>
      <div class="margin-bottom-1 margin-top-1 pull-right">
        <el-button type="primary" @click="loadCache" icon="el-icon-fa-search" title="加载"></el-button>
        <el-button type="warning" @click="doRefreshCache(tableData)" icon="el-icon-fa-refresh" title="刷新"></el-button>
        <el-button type="danger" @click="doRemoveCache(tableData)" icon="el-icon-fa-trash" title="清空"></el-button>
      </div>
      <el-table :data="tableData" border stripe>
        <el-table-column prop="key" label="可缓存字段" width="180"></el-table-column>
        <el-table-column prop="desc" label="字段描述"></el-table-column>
        <el-table-column label="有无值">
          <template slot-scope="props">
            <span v-if="props.row.value.length > 0 " class="font-green-success symbol success"></span>
            <span v-if="props.row.value.length === 0 " class="font-red-error symbol failure"></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed='right' width="180">
          <template slot-scope="scope">
            <el-button @click="doRefreshCache([scope.row])" class="yellow" icon="el-icon-fa-refresh" title="刷新"></el-button>
            <el-button @click="doRemoveCache([scope.row])" class="red" icon="el-icon-fa-trash" title="清空"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import CacheStores from "@/service/module/CacheStores";
import { Message } from "element-ui";
import config from "@/resources/config";

export default {
  data() {
    return {
      loading: false,
      tableData: []
    };
  },
  mounted() {
    this.loadCache();
  },
  methods: {
    // 加载缓存
    loadCache() {
      // 如果 codeMap 没有配置,就会在页面没有字段描述
      let codeMap = Object.assign({}, config.codeMap);
      let valueMap = {};
      CacheStores.codeListStore
        .iterate((value, key, iterationNumber) => {
          key = key.substr(0, key.indexOf(":"));
          valueMap[key] = value;
        })
        .then(() => {
          this.tableData = Object.keys(codeMap).map(key => {
            return {
              key,
              value: valueMap[key] || [],
              desc: config.codeMap[key]
            };
          });
        });
    },
    beginLoading() {
      this.loading = true;
    },
    endLoading() {
      this.loading = false;
    },
    // 刷新指定缓存
    doRefreshCache(caches) {
      this.beginLoading();
      let refreshQueue = caches.map(function(data) {
        let codeType = data.key;
        return this.$store
          .dispatch("base/refreshSysCode", codeType)
          .then(value => {
            data.value = value;
          });
      }, this);
      // 所有清理都处理完成
      return (
        Promise.all(refreshQueue)
          //  .then(this.loadCache)
          .then(() => {
            Message.success("缓存刷新完成");
          })
          .then(this.endLoading)
          .catch(() => {
            Message.error("应用异常,未能成功刷新缓存.");
          })
          .then(this.endLoading)
      );
    },
    // 删除缓存的画面操作
    doRemoveCache(caches) {
      this.confirm(
        caches,
        "您请清空所有缓存,请慎重考虑,如果不必要.请逐个操作!"
      ).then(this.removeCache);
    },
    // 删除缓存
    removeCache(caches) {
      let removeQueue = caches.map(function(data) {
        let codeType = data.key;
        this.$store.commit("REMOVE_SYSCODE", { codeType });
        return CacheStores.codeListStore.removeItem(data.key).then(() => {
          data.value = [];
        });
      }, this);
      // 所有清理都处理完成
      return Promise.all(removeQueue)
        .then(this.loadCache)
        .then(() => {
          Message.success("缓存清理完成");
        })
        .catch(() => {
          Message.error("应用异常,未能成功清理缓存.");
        });
    }
  }
};
</script>
