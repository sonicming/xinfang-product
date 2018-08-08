import { Table } from "element-ui";

/**
 * 默认参数
 */
const defaultParams = {
  total: 0,
  pageNum: 1,
  pageSize: 10,
  orderField: null,
  orderDirection: null
};

export default {
  name: "PageTable",
  props: {
    ...Table.props,
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: "数据查询列表"
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    hideExport: {
      type: Boolean,
      default: false
    },
    autoLoad: {
      type: Boolean,
      default: false
    },
    autoHeight: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 10
    },
    height: {
      type: [Number, String]
    },
    rowKey: {
      type: String,
      default: "uuid"
    },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next"
    }
  },

  data() {
    return {
      isLoading: false,
      params: Object.assign({}, defaultParams, { pageSize: this.pageSize })
    };
  },
  mounted() {
    if (this.autoLoad) {
      this.load();
    }
  },
  methods: {
    // 代理原有方法
    setCurrentRow(row) {
      this.$refs.theTable.setCurrentRow(row);
    },

    toggleRowSelection(row, selected) {
      this.$refs.theTable.toggleRowSelection(row, selected);
    },

    clearSelection() {
      this.$refs.theTable.clearSelection();
    },
    /**
     * 还原参数信息
     */
    restore() {
      Object.assign(this.params, defaultParams);
    },
    changeSort({ column, prop, order }) {
      if (order) {
        this.params.orderField = prop;
        this.params.orderDirection = order.replace("ending", "");
      } else {
        this.params.orderField = null;
        this.params.orderDirection = null;
      }
      this.load();
    },
    changePage(page) {
      this.params.pageNum = page;
      this.load();
    },
    changeSize(size) {
      this.params.pageSize = size;
      this.params.pageNum = 0;
      this.load();
    },
    load(params) {
      this.isLoading = true;
      this.$emit("load-data", Object.assign(this.params, params), data => {
        this.params.total = data.totalRows;
        this.params.pageSize = data.pageSize;
        this.isLoading = false;
        return data;
      });
    },
    download(params) {
      params.agile = "export";
      let columns = [];
      this.$refs.theTable.$children.forEach(function(element) {
        if (element.prop && element.label) {
          columns.push({
            field: element.prop.trim(),
            label: element.label.trim()
          });
        }
      }, this);
      columns = JSON.stringify(columns);
      this.$emit(
        "load-data",
        Object.assign({ columns }, this.params, params),
        data => {
          return data;
        }
      );
    },
    currentChange(currentRow, oldCurrentRow) {
      this.currentRow = currentRow;
    }
  },
  render(h) {
    return (
      <div class="eport-table-wrap">
        {!this.hideTitle ? (
          <div class="table-header">
            <div class="table-header__title">{this.title}</div>
            <div class="table-header__buttons">{this.$slots.buttons}</div>
          </div>
        ) : null}
        <el-table
          ref="theTable"
          data={this.data}
          element-loading-text={this.$t("common.tableLoading")}
          onSort-change={this.changeSort}
          // 代理所有其他事件
          onRow-click={(...args) => {
            this.$emit("row-click", ...args);
          }}
          onSelect={(...args) => {
            this.$emit("select", ...args);
          }}
          onSelect-all={(...args) => {
            this.$emit("select-all", ...args);
          }}
          onSelection-change={(...args) => {
            this.$emit("selection-change", ...args);
          }}
          onCell-mouse-enter={(...args) => {
            this.$emit("cell-mouse-enter", ...args);
          }}
          onCell-mouse-leave={(...args) => {
            this.$emit("cell-mouse-leave", ...args);
          }}
          onCell-click={(...args) => {
            this.$emit("cell-click", ...args);
          }}
          onCell-dblclick={(...args) => {
            this.$emit("cell-dblclick", ...args);
          }}
          onRow-contextmenu={(...args) => {
            this.$emit("row-contextmenu", ...args);
          }}
          onRow-dblclick={(...args) => {
            this.$emit("row-dblclick", ...args);
          }}
          onHeader-click={(...args) => {
            this.$emit("header-click", ...args);
          }}
          onFilter-change={(...args) => {
            this.$emit("filter-change", ...args);
          }}
          onCurrent-change={(...args) => {
            this.$emit("current-change", ...args);
          }}
          onHeader-dragend={(...args) => {
            this.$emit("header-dragend", ...args);
          }}
          onExpand={(...args) => {
            this.$emit("expand", ...args);
          }}
          {...{ attrs: this.$props }}
          height={!this.autoHeight ? this.params.pageSize * 26 + 18 + 40 : null}
        >
          {this.$slots.default}
          {this.$slots.append}
        </el-table>
        <div class="table-footer">
          {!this.hideExport ? (
            <div class="table-actions">
              <el-button
                type="success"
                plain
                // class="font-green"
                icon="el-icon-fa-file-excel-o"
                onClick={() => {
                  this.download({ down: "xls", mode: "page" });
                }}
              >
                本页
              </el-button>
              <el-button
                type="success"
                plain
                // class="font-green"
                icon="el-icon-fa-file-excel-o"
                onClick={() => {
                  this.download({ down: "xls", mode: "full" });
                }}
              >
                全部
              </el-button>
              <el-button
                // class="font-red"
                type="danger"
                plain
                icon="el-icon-fa-file-pdf-o"
                onClick={() => {
                  this.download({ down: "pdf", mode: "page" });
                }}
              >
                本页
              </el-button>
              <el-button
                // class="font-red"
                type="danger"
                plain
                icon="el-icon-fa-file-pdf-o"
                onClick={() => {
                  this.download({ down: "pdf", mode: "full" });
                }}
              >
                全部
              </el-button>
            </div>
          ) : null}
          <el-pagination
            background
            onCurrent-change={this.changePage}
            onSize-change={this.changeSize}
            currentPage={this.params.pageNum}
            pageSize={this.params.pageSize}
            total={this.params.total}
            layout={this.pageLayout}
          />
        </div>
      </div>
    );
  }
};
