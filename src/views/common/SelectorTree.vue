<template>
  <div v-loading="loading">
    <el-form inline :model="table.params" ref="queryForm">
      <el-form-item prop="keyword">
        <el-input v-model="table.params.keyword" placeholder="搜索..."></el-input>
      </el-form-item>
      <el-button-group class="pull-right" style="margin: 4px;">
        <el-button icon="el-icon-fa-refresh" @click="resetQuery"></el-button>
        <el-button icon="el-icon-fa-search" @click="queryData"></el-button>
        <el-button icon="el-icon-fa-expand" @click="expandAll"></el-button>
      </el-button-group>
    </el-form>
    <div style="max-height:400px;overflow-y:auto;">
      <div v-show="noData" style="text-align:center;margin-bottom:10px;">没有数据...</div>
      <el-tree v-show="!noData" ref="orgTree" lazy :load="loadTree" node-key="uuid" :expand-on-click-node="false" highlight-current :render-content="renderContent"></el-tree>
    </div>
  </div>
</template>
<script>
import BaseSelector from "../common/BaseSelector";
import SysAPI from "../../api/base/sysm/SysAPI";

export default {
  extends: BaseSelector,
  props: {
    // 树类型
    treeKey: {
      type: String,
      required: true
    },
    // 查询字段(数据库对应)
    searchField: {
      type: String,
      required: false
    },
    // 树的根节点命名
    rootLabel: {
      type: String,
      default: "请选择数据"
    }
  },
  data() {
    return {
      loading: false,
      noData: false,
      table: {
        data: [],
        params: {
          keyword: ""
        }
      }
    };
  },
  mounted() {},
  methods: {
    // [按钮]点击查询
    queryData() {
      this.$refs.orgTree.root.childNodes.forEach(element => {
        element.loaded = false;
        element.expand();
      }, this);
    },
    // [按钮]重置查询
    resetQuery() {
      this.noData = false;
      this.$refs.queryForm.resetFields();
      this.queryData();
    },
    // 懒加载树节点
    loadTree(node, resolve) {
      let pid;
      if (node.data) {
        pid = node.data.id;
      }
      let keyWord = this.table.params.keyword;
      SysAPI.getTree(this.treeKey, pid, keyWord, this.searchField, true)
        .then(data => {
          resolve(data);
          if (keyWord && data.length === 0) {
            this.noData = true;
          } else {
            node.childNodes.forEach(element => {
              let isLeaf = this.table.params.keyword
                ? true
                : element.data.isLeaf;
              element.isLeaf = isLeaf;
              element.loaded = isLeaf;
            }, this);
            this.noData = false;
          }
        })
        .catch(resolve);
    },
    // 展开/关闭 全部
    expandAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(element => {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.orgTree.root);
    },
    // 自定义JSX渲染
    renderContent(h, { node, data, store }) {
      return (
        <span>
          {data.pid !== "none" ? (
            <span>
              <a
                onClick={() => {
                  this.selectTableRow(data);
                }}
                class="href"
              >
                {data.label}
              </a>
            </span>
          ) : (
            <span>{data.label}</span>
          )}
        </span>
      );
    }
  }
};
</script>
