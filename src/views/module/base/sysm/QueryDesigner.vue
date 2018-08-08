<template>
  <div class="flex-h  qdes" v-loading="view.loading.all">
    <el-card class="table-list m-shadow">
      <div slot="header">
        <span>选择数据表</span>
        <div class="pull-right">
          <el-button icon="el-icon-fa-refresh " class="blue" @click="handleRefreshTable"></el-button>
          <el-button icon="el-icon-fa-close " class="red" @click="handleDisselect"></el-button>
        </div>
      </div>
      <el-checkbox-group v-model="meta.selectedTables" v-loading="view.loading.tables" :min="1" :max="7">
        <el-checkbox v-for="tableInfo in meta.tables " :key="tableInfo.tableName" :label="tableInfo">{{tableInfo.tableName}}</el-checkbox>
      </el-checkbox-group>
    </el-card>
    <el-card class="workspace margin-left-1 flex-1">
      <div slot="header">
        <span>查询路径 -
          <input v-model="queryName" placeholder="查询路径" :disabled="!!meta.uuid" />
        </span>
        查询标题:
        <input v-model="queryTitle" />
        <div class="pull-right">
          <el-button icon="el-icon-fa-save" class="blue" @click="handleSave"></el-button>
        </div>
      </div>
      <div class="table-selected-list  bg-green" style="overflow-y: auto;">
        <div class="waterfall_">
          <div class="item padding-1 pull-left" v-for="(tableInfo,index) in meta.selectedTables" :key="tableInfo.tableName">
            <el-card class="table-info-card">
              <div slot="header">
                <el-checkbox v-model="tableInfo.selectedAll" @change="checkAll(tableInfo)">
                  <span v-if="tableInfo.isMaster">
                    <b class="font-red">{{tableInfo.tableName}}</b>
                  </span>
                  <span v-if="!tableInfo.isMaster">{{tableInfo.tableName}}</span>
                </el-checkbox>
              </div>
              <el-button @click="setMaster(tableInfo,index)">主表</el-button>
              <el-button @click="remove(tableInfo,index)">移除</el-button>
              <el-checkbox-group v-model="tableInfo.selectedTableColumns">
                <el-checkbox v-for="col in tableInfo.tableColumns" :key="col.tableName" :label="col">{{col.columnName}}</el-checkbox>
              </el-checkbox-group>
            </el-card>
          </div>
        </div>
      </div>
      <el-popover ref="popover1" placement="top-start" title="标题" width="200" trigger="click">
      </el-popover>
      <div class="flex-1" style="min-height: 400px;">
        <div>
          <el-card class=" margin-top-1" header="表格预览">
            <el-table border :data="tableData">
              <el-table-column v-for="column in selectedColumns" :key="column.columnName" :prop="column.columnName" :label="tableLabel(column)" width="150"></el-table-column>
            </el-table>
          </el-card>
        </div>
        <div class="flex-h flex-1  margin-top-1">
          <el-card class="flex-1  show-sql">
            <div style="overflow:auto;">
              <div slot="header">
                <span title="仅供参考">SQL预览</span>
                <div class="pull-right">
                  <el-button icon="el-icon-fa-copy" ref="copySqlButton"></el-button>
                  <el-button icon="el-icon-fa-bug" class="green-meadow" @click="handleDebug"></el-button>
                </div>
              </div>
              <div style="position:absolute;left:-50000px;">
                <pre ref="sqlPreview">{{sql}}</pre>
              </div>
              <div>
                <div>
                  <span class="font-red">SELECT</span>
                </div>
                <div class="slect-column" v-for="(column,index) in selectedColumns" :key="index">
                  <span style="width:90px">{{column.tableName | alias}}</span>
                  <span style="width:20px;font-weight: bold;" class="text-center">.</span>
                  <span style="width:120px" class="font-blue">{{column.columnName}}</span>
                  <span style="width:40px" class="font-red" lass="text-center">AS</span>
                  <span style="width:100px">{{column.columnName+'_'+index |lowercase}} </span>
                  <span v-if="index!=selectedColumns.length-1">,</span>
                </div>
                <div>
                  <span class="font-red">FROM</span>
                </div>
                <div class="select-from" v-for="(table,index) in selectedTables" :key="table.tableName">
                  <span v-if="index!==0">LEFT JOIN </span>
                  <span> {{table.tableName}} </span>
                  <span> {{table.alias}} </span>
                  <div v-if="index!==0">
                    <span>ON</span>
                    <el-input style="width:400px;" v-model="table.on"></el-input>
                  </div>
                </div>
                <div>
                  <span class="font-red">WHERE</span>
                  <el-button type="text" icon="el-icon-fa-plus" @click="addWhere"></el-button>
                </div>
                <div class="select-where">
                  <span>1=1</span>
                </div>
                <div class="select-where" v-for="(where,index) in wheres" :key="where.left.tableName">
                  <div>
                    <el-select v-model="where.concat" style="width:100px;">
                      <el-option label="AND" value="AND"></el-option>
                      <el-option label="OR" value="OR"></el-option>
                      <el-option label="AND NOT" value="AND_NOT "></el-option>
                      <el-option label="OR NOT" value="OR_NOT"></el-option>
                    </el-select>
                  </div>
                  <span class="text-right where-select " @click="handleSlectColumn(where,where.left)">
                    <span class="font-grey-salsa" v-if="!where.left.columnName && !where.left.text"> &lt;-&nbsp;-&nbsp;-&nbsp;-&gt; </span>
                    <span v-if="!where.left.text"> {{where.left.tableName | alias}}.{{where.left.columnName}} </span>
                    <span v-if="where.left.text"> {{where.left.text}} </span>
                  </span>
                  <el-select v-model="where.compare" style="width:70px;">
                    <el-option label="=" value="eq"></el-option>
                    <el-option label="<>" value="not"></el-option>
                    <el-option label=">" value="gt" disabled></el-option>
                    <el-option label=">=" value="gte" disabled></el-option>
                    <el-option label="<" value="lt" disabled></el-option>
                    <el-option label="<=" value="lte" disabled></el-option>
                    <el-option label="like" value="like"></el-option>
                    <el-option label="notlike" value="notlike"></el-option>
                    <el-option label="in" value="in" disabled></el-option>
                  </el-select>
                  <span class="text-left where-select" @click="handleSlectColumn(where,where.right)">
                    <span class=" font-grey-salsa" v-if="!where.right.columnName && !where.right.text"> &lt;-&nbsp;-&nbsp;-&nbsp;-&gt; </span>
                    <span v-if=" !where.right.text"> {{where.right.tableName | alias}}.{{where.right.columnName}} </span>
                    <span v-if="where.right.text"> {{where.right.text}} </span>
                  </span>
                  <el-button type="text" icon="el-icon-fa-trash" @click="removeWhere(where,index)"></el-button>
                </div>
                <el-input type="textarea" v-model="cnd" placeholder="追加条件"></el-input>
              </div>
            </div>
          </el-card>
          <el-dialog append-to-body v-draggable width="400px" top="200px" :visible.sync="columnSelector.show" title="条件编辑">
            <el-tabs type="card" class="column-selector">
              <el-tab-pane label="列表">
                <ul class="column-list">
                  <li v-for="(column,index) in selectedColumns" :key="index" @click="selectColumntoWehre(column)">
                    <span style="width:90px">{{column.tableName | alias}}</span>
                    <span style="width:20px;font-weight: bold;" class="text-center">.</span>
                    <span style="width:120px" class="font-blue">{{column.columnName}}</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="编辑">
                <el-input type="textarea" v-model="columnSelector.lr.text"></el-input>
              </el-tab-pane>
              <div class="margin-1 text-right">
                <el-button icon="el-icon-fa-check" @click="selectTexttoWehre()"></el-button>
                <el-button icon="el-icon-fa-close" @click="columnSelector.show=false"></el-button>
              </div>
            </el-tabs>
          </el-dialog>
          <el-card class=" margin-left-1 " header="字段设计">
            <div style="overflow: auto;">
              <fieldset v-for="(table,index) in meta.selectedTables" :key="table.tableName" v-if="table.selectedTableColumns.length > 0">
                <legend>{{table.tableName}}</legend>
                <div v-for="column in table.selectedTableColumns" :key="column.columnName">
                  <span style="width:200px;display:inline-block;">{{column.columnFullName}}</span>
                  <el-input style="width:200px;display:inline-block;" placeholder="列名" v-model="labelData[column.columnFullName]" :index="index"></el-input>
                  <el-select style="width:100px;display:inline-block;" v-model="column.cndType" placeholder="不可查询" :clearable="true">
                    <el-option label="text" value="text"></el-option>
                    <el-option label="dict" value="dict"></el-option>
                    <el-option label="date" value="date" disabled></el-option>
                    <el-option label="dateRange" value="dateRange" disabled></el-option>
                    <el-option label="numberRange" value="numberRange" disabled></el-option>
                  </el-select>
                  <el-input style="width:100px;display:inline-block;" class="margin-left-1" placeholder="字典名" v-if="column.cndType==='dict'" v-model="column.dictName"></el-input>
                  <el-select style="width:100px;display:inline-block;" class="margin-left-1" v-model="column.compare" placeholder="不可查询" :clearable="true" v-if="column.cndType==='text'">
                    <el-option label="=" value="eq"></el-option>
                    <el-option label="<>" value="not"></el-option>
                    <el-option label=">" value="gt" disabled></el-option>
                    <el-option label=">=" value="gte" disabled></el-option>
                    <el-option label="<" value="lt" disabled></el-option>
                    <el-option label="<=" value="lte" disabled></el-option>
                    <el-option label="like" value="like"></el-option>
                    <el-option label="notlike" value="notlike"></el-option>
                    <el-option label="in" value="in" disabled></el-option>
                  </el-select>
                </div>
              </fieldset>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import Clipboard from "clipboard";
import QueryDesignerAPI from "@/api/base/sysm/QueryDesignerAPI";

function tf(str) {
  var arr = str.split("_");
  for (var i = 1; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
  }
  return arr.join("");
}

export default {
  filters: {
    alias(val) {
      return tf(val.toLowerCase());
    }
  },
  props: {
    uuid: String
  },
  data() {
    return {
      queryName: "",
      queryTitle: "",
      sql: "",
      meta: {
        uuid: "",
        tables: [],
        selectedTables: []
      },
      view: {
        lastTable: "",
        loading: {
          all: false,
          tables: false
        }
      },
      labelData: {},
      cnd: "",
      columnSelector: {
        lr: {
          text: "",
          tableName: "",
          tableColumn: ""
        },
        show: false
      },
      wheres: []
    };
  },
  watch: {
    uuid() {
      this.initLoad();
    }
  },
  computed: {
    //  选中的列
    selectedColumns() {
      let columns = [];
      /* eslint-disable */
      this.meta.selectedTables.forEach(table => {
        table.selectedTableColumns.forEach(col => {
          columns.push({
            tableName: table.tableName,
            columnName: col.columnName,
            columnFullName: col.columnFullName
          });
          this.$set(
            this.labelData,
            col.columnFullName,
            this.labelData[col.columnFullName] ||
              (col.columnComment || col.columnFullName)
          );
        });
      });
      return columns;
    },
    //  选中的表
    selectedTables() {
      let tables = [];
      this.meta.selectedTables.forEach(table => {
        if (table.selectedTableColumns.length > 0) {
          tables.push(table);
        }
      });
      return tables;
    },
    tableData() {
      let columnHeader = {};
      this.selectedColumns.forEach(col => {
        columnHeader[col.columnName] = col.columnFullName;
      });
      return [columnHeader];
    }
  },
  mounted() {
    this.initLoad();
    this.initCopySQl();
  },
  methods: {
    initLoad() {
      this.meta.uuid = this.uuid;
      this.loadTable().then(this.loadDesign);
    },
    initCopySQl() {
      let sqlPreviewDom = this.$refs.sqlPreview;
      let clip = new Clipboard(this.$refs.copySqlButton.$el, {
        target(trigger) {
          return sqlPreviewDom;
        }
      });
      clip.on("success", e => {
        this.$message.success("复制成功");
      });
    },
    loadTable() {
      this.view.loading.all = true;
      this.meta.selectedTables = [];
      return QueryDesignerAPI.loadAllTable()
        .then(data => {
          data.forEach(table => {
            table.selectedTableColumns = [];
            table.on = "";
            table.alias = tf(table.tableName.toLowerCase());
            table.tableColumns.forEach(col => {
              col.columnFullName = table.tableName + "." + col.columnName;
              col.cndType = "";
              col.dictName = "";
              col.compare = "";
            });
          }, this);
          this.meta.tables = data;
          this.view.loading.all = false;
        })
        .catch(() => {
          this.view.loading.all = false;
        });
    },
    handleRefreshTable() {
      this.initLoad();
    },
    handleDisselect() {
      this.meta.selectedTables = [];
      this.meta.wheres = [];
      this.loadTable();
    },
    handleCheckColumn(table, columns, index) {},
    handlePreviewData() {},
    tableLabel(col) {
      return this.labelData[col.columnFullName];
    },
    checkAll(tableInfo) {
      if (tableInfo.selectedAll) {
        tableInfo.selectedTableColumns = [];
        tableInfo.tableColumns.forEach(col => {
          tableInfo.selectedTableColumns.push(col);
        });
      } else {
        tableInfo.selectedTableColumns = [];
      }
    },
    setMaster(tableInfo, index) {
      let tmp = this.meta.selectedTables[0];
      this.$set(this.meta.selectedTables, 0, this.meta.selectedTables[index]);
      this.$set(this.meta.selectedTables, index, tmp);
      this.meta.selectedTables.forEach(function(table, iid) {
        table.isMaster = false;
      }, this);
      this.$set(tableInfo, "isMaster", true);
    },
    remove(tableInfo, index) {
      this.meta.selectedTables.splice(index, 1);
    },
    handleSave() {
      if (this.selectedColumns.length === 0) {
        return this.$message.error("请先设计!");
      }
      if (this.queryName) {
        return this.doSave();
      }
      this.$prompt("请为您的查询命名!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputValue: this.queryName
      }).then(({ value }) => {
        this.queryName = value;
        if (this.queryName) {
          this.doSave();
        }
      });
    },
    handleSlectColumn(where, lr) {
      this.columnSelector.show = true;
      this.columnSelector.lr = lr;
    },
    selectColumntoWehre(column) {
      this.columnSelector.lr.tableName = column.tableName;
      this.columnSelector.lr.columnName = column.columnName;
      this.columnSelector.lr.text = "";
      this.columnSelector.show = false;
    },
    selectTexttoWehre(column) {
      this.columnSelector.lr.tableName = "";
      this.columnSelector.lr.columnName = "";
      this.columnSelector.show = false;
    },
    addWhere() {
      this.wheres.push({
        compare: "eq",
        concat: "AND",
        left: {
          text: "",
          tableName: "",
          columnName: ""
        },
        right: {
          text: "",
          tableName: "",
          columnName: ""
        }
      });
    },
    removeWhere(where, index) {
      this.wheres.splice(index, 1);
    },
    loadDesign() {
      this.meta.selectedTables = [];
      this.queryName = "";
      this.wheres = [];
      if (this.uuid) {
        this.view.loading.all = true;
        QueryDesignerAPI.loadDesign(this.uuid).then(data => {
          this.wheres = data.wheres;
          this.labelData = data.labelData;
          this.queryName = data.queryName;
          this.queryTitle = data.queryTitle;
          this.cnd = data.cnd;
          this.meta.tables.forEach(function(table) {
            let tableName = table.tableName;
            if (data.selectedTables[tableName]) {
              table.on = data.selectedTables[tableName].on;
              table.tableColumns.forEach(function(col) {
                let columnName = col.columnName;
                if (data.selectedTables[tableName][columnName]) {
                  Object.assign(
                    col,
                    data.selectedTables[tableName][columnName]
                  );
                  table.selectedTableColumns.push(col);
                }
              }, this);
              this.meta.selectedTables.push(table);
            }
          }, this);
          this.view.loading.all = false;
        });
      }
    },
    handleSaveData() {
      this.view.loading.all = true;
      let tableInfos = [];
      // 这里多传一个定义,是把页面所有数据保存下来,下次打开编辑的时候快速还原.
      let define = {
        selectedTables: {},
        queryName: this.queryName,
        queryTitle: this.queryTitle,
        labelData: this.labelData,
        wheres: this.wheres,
        cnd: this.cnd
      };
      this.meta.selectedTables[0].isMaster = true;
      this.meta.selectedTables.forEach(table => {
        let _data = {};
        _data.alias = table.alias;
        _data.tableName = table.tableName;
        _data.isMaster = table.isMaster;
        _data.on = table.on;
        define.selectedTables[table.tableName] = { on: table.on };
        _data.tableColumns = table.selectedTableColumns.map(col => {
          //  保存定义的列内容
          define.selectedTables[table.tableName][col.columnName] = {
            columnName: col.columnName,
            cndType: col.cndType ? col.cndType : null,
            dictName: col.dictName,
            compare: col.compare ? col.compare : null
          };
          return define.selectedTables[table.tableName][col.columnName];
        });
        tableInfos.push(_data);
      });
      define = JSON.stringify(define);
      return {
        uuid: this.meta.uuid,
        wheres: this.wheres,
        cnd: this.cnd,
        queryName: this.queryName,
        queryTitle: this.queryTitle,
        tableInfos,
        define,
        labelData: this.labelData
      };
    },
    doSave() {
      let data = this.handleSaveData();
      return QueryDesignerAPI.saveDesign(data)
        .then(resp => {
          this.view.loading.all = false;
          this.meta.uuid = resp.uuid;
        })
        .catch(() => {
          this.view.loading.all = false;
        });
    },
    //  处理测试
    handleDebug() {
      let data = this.handleSaveData();
      return QueryDesignerAPI.debugDesign(data)
        .then(resp => {
          this.sql = resp.sql;
          this.view.loading.all = false;
          this.meta.uuid = resp.uuid;
        })
        .catch(() => {
          this.view.loading.all = false;
        });
    }
  }
};
</script>
<style  lang="scss">
.qdes {
  .table-list {
    border: 1px solid #ccc;
    width: 200px;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    .el-card {
      display: flex;
      flex-direction: column;
    }
    .el-card__body {
      flex: 1;
      background-color: #d9f3e5 !important;
    }
    .el-checkbox {
      display: block;
      margin-left: 0px;
      padding: 0 3px;
      text-transform: uppercase;
      transition: 0.2s background-color;
      &:hover {
        background-color: #ccc;
        font-weight: bold;
      }
    }
  }

  .workspace {
    overflow: auto;
    border: 1px solid #ccc;
    .waterfall {
      column-gap: 5px;
      column-count: 7;
      .item {
        page-break-inside: avoid;
        -webkit-column-break-inside: avoid;
        break-inside: avoid;
      }
    }
  }

  .show-sql {
    .slect-column {
      display: block;
      margin-left: 1em;
      cursor: default;
      line-height: 1.2em;
      height: 1.2em;
      white-space: nowrap;
      & > span {
        display: inline-block;
      }
    }
    .select-from {
      margin-left: 1em;
      line-height: 1.2em;
      white-space: nowrap;
      & > span {
        line-height: 1.2em;
        height: 1.2em;
        display: inline-block;
        margin-right: 10px;
      }
    }
    .select-where {
      margin-left: 1em;
      white-space: nowrap;
      & > span {
        display: inline-block;
        margin-right: 10px;
      }
    }
    .where-select {
      cursor: pointer;
      &:hover {
        color: gray;
      }
    }
  }

  .el-card.table-info-card {
    .el-card__header {
      text-transform: uppercase;
      font-weight: bold;
      height: 24px;
      line-height: 24px;
    }
    .el-card__body {
      padding: 0;
    }
    .el-checkbox-group {
      padding: 0px;
    }
    .el-checkbox {
      display: block;
      margin-left: 0px;
      text-transform: uppercase;
      transition: 0.2s background-color;
      &:hover {
        background-color: #ccc;
        font-weight: bold;
      }
    }
  }

  .el-input {
    .el-input__inner {
      background-color: white !important;
      border-width: 0;
      border-bottom: 1px solid #ccc;
    }
  }
}

.column-selector {
  .el-tabs__header {
    margin-bottom: 0;
  }
  .column-list {
    padding: 0;
    margin: 0;
  }
  .column-list li {
    display: block;
    cursor: pointer;
    height: 20px;
    line-height: 20px;
    &:hover {
      background-color: #ccc;
    }
  }
}
</style>
