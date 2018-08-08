<template>
  <el-card v-loading="view.loading" element-loading-text="查询加载中...">
    <template slot="header">
      <span>{{view.queryInfo.title}}</span>
      <div class="pull-right">
        <el-button type="primary" icon="el-icon-fa-refresh" @click="handleRefreshView"></el-button>
      </div>
    </template>

    <el-card header="查询条件">
      <el-form inline :model="queryform" ref="queryform">
        <template v-for="field in view.queryInfo.searchFields">
          <el-form-item :key="field.name" :label="field.label" :prop="field.name">
            <el-input v-if="field.type==='text'" v-model="queryform[field.name]" :placeholder="field.label"></el-input>
            <el-date-picker v-if="field.type==='dateRange'" v-model="queryform[field.name]" :placeholder="field.label" type="daterange"></el-date-picker>
            <el-date-picker v-else-if="field.type==='date'" v-model="queryform[field.name]" :placeholder="field.label" type="date"></el-date-picker>
            <el-select v-else-if="field.type==='dict'" v-model="queryform[field.name]" v-sys-code="field.dictName" clearable>
              <el-option v-for="item in sysCode[field.dictName]" :key="item.key" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </template>
      </el-form>
    </el-card>

    <PageTable ref="dataTable" @load-data="hanleLoadData" :data="table.data" highlight-current-row stripe border>
      <div slot="buttons">
        <el-button icon="el-icon-fa-search" @click="handleQuery"></el-button>
      </div>

      <el-table-column type="index" fixed='left'></el-table-column>
      <template v-for="column in view.queryInfo.tableColumns">
        <el-table-column :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width"></el-table-column>
      </template>
    </PageTable>
  </el-card>
</template>
<script>
import { mapGetters } from "vuex";
import QueryAPI from "@/api/base/sysm/QueryAPI";

export default {
  name: "Query",
  data() {
    return {
      view: {
        showForm: false,
        queryInfo: "",
        loading: false
      },
      queryform: {},
      table: {
        data: []
      }
    };
  },
  mounted() {
    this.loadQueryInfo();
  },
  methods: {
    // 加载查询页面
    loadQueryInfo() {
      if (this.$route.name) {
        this.view.loading = true;
        this.table.data = [];
        QueryAPI.loadQueryInfo(this.$route.name)
          .then(queryInfo => {
            this.view.queryInfo = queryInfo;
            this.view.loading = false;
            this.queryform = {};
            queryInfo.searchFields.forEach(function(element) {
              this.$set(this.queryform, element.name, "");
            }, this);
          })
          .catch(() => {
            this.view.loading = false;
          });
      } else {
      }
    },
    // [按钮处理] - 刷新页面
    handleRefreshView() {
      this.loadQueryInfo();
    },
    // [按钮处理] - 查询
    handleQuery() {
      this.$refs.dataTable.load(this.queryform);
    },
    // 加载数据
    hanleLoadData(params, resolve) {
      QueryAPI.query(this.$route.name, params)
        .then(resolve)
        .then(respData => (this.table.data = respData.datarows));
    }
  }
};
</script>
