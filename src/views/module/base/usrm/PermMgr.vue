<!--
  写在前面:
  系统功能树是一个全树,不是懒加载.
 -->
<template>
  <div class="flex-h ">
    <el-card class="flex-2 full">
      <template slot="header">
        <span>功能权限管理</span>
        <div class="pull-right">
          <el-button type="primary" icon="el-icon-fa-expand" @click="expandAll" title="展开全部节点"></el-button>
          <el-button type="primary" icon="el-icon-fa-refresh" @click="load" title="刷新数据"></el-button>
          <el-button type="primary" icon="el-icon-fa-sort-amount-asc" @click="autoAligned" title="修整数据"></el-button>
          <el-button type="primary" icon="el-icon-fa-cloud-download" @click="generateRouteJS" title="生成Route文件"></el-button>
        </div>
      </template>
      <el-tree draggable ref="permTree" v-loading="saving" :default-expand-all="expandedAll" node-key="uuid" :expand-on-click-node="false" :data="permTreeData" :current-node-key="currPerm.uuid" highlight-current :render-content="renderContent" @current-change="currentChange"></el-tree>
    </el-card>
    <el-card class="flex-2 margin-left-3 full">
      <template slot="header">
        <span>编辑权限</span>
        <div class="pull-right">
          <el-button type="primary" @click="onSubmit" icon="el-icon-fa-save"></el-button>
        </div>
      </template>
      <div v-if="currPerm.uuid!=='none'">
        <el-form ref="form" :model="currPerm" label-position="top" :rules="rules">
          <el-form-item label="功能名称" prop="permName">
            <el-input v-model="currPerm.permName" />
          </el-form-item>
          <el-form-item class="flex-1" label="功能编码" prop="permCode">
            <el-input v-model="currPerm.permCode"></el-input>
          </el-form-item>
          <el-form-item class="flex-2 " label="功能地址" prop="funcUrl">
            <el-input v-model="currPerm.funcUrl"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="permType">
            <el-radio-group v-model="currPerm.permType">
              <el-radio v-for="item in permTypes" :key="item.value" :label="item.label" :value="item.value"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="最低数据权限" prop="lowDataAuth">
            <el-select v-model="currPerm.lowDataAuth" placeholder="请选择">
              <el-option v-for="item in lowDataAuths" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="图标样式" prop="iconUrl">
            <el-input v-model="currPerm.iconUrl"></el-input>
          </el-form-item>
          <el-form-item label="顺序编号" prop="ordeCode">
            <el-input-number v-model="currPerm.ordeCode"></el-input-number>
          </el-form-item>
          <el-form-item label="组件" prop="permComp">
            <el-input v-model="currPerm.permComp"></el-input>
          </el-form-item>
          <el-form-item label="功能描述" prop="permDesc">
            <el-input type="textarea" v-model="currPerm.permDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <HandleHistory class="margin-top-1 margin-bottom-1" v-if="currPerm.uuid" :uuid="currPerm.uuid" :cr-user-uuid="currPerm.crUserUuid" :op-user-uuid="currPerm.opUserUuid" :cr-time="currPerm.crTime" :op-time="currPerm.opTime" mode="plan" />
    </el-card>
  </div>
</template>
<script>
import HandleHistory from "@/views/common/HandleHistory";
import PermApi from "@/api/base/usrm/PermAPI";
import config from "@/resources/config";

export default {
  name: "PermMgr",
  components: { HandleHistory },
  data() {
    return {
      aaaaa: "",
      currPerm: {},
      currParentPerm: {},
      permTreeData: [],
      saving: false,
      expandedAll: false,
      currNode: "",
      editor: {
        error: {}
      },
      rules: {
        permName: [{ required: true, message: "资源名称不能为空!" }],
        permCode: [{ required: true, message: "权限编码不能为空!" }],
        permType: [{ required: true, message: "权限类型不能为空!" }],
        lowDataAuths: [{ required: true, message: "最低数据权限不能为空!" }]
      },
      lowDataAuths: [
        { value: 0, label: "本人", disabled: true },
        { value: 1, label: "本组织" },
        { value: 2, label: "本组织及下属组织" },
        { value: 3, label: "所有组织" }
      ],
      permTypes: [{ value: "1", label: "菜单" }, { value: "2", label: "按钮" }]
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.currPerm = {};
      this.saving = true;
      // 读取系统菜单
      PermApi.loadPermTree().then(data => {
        this.permTreeData = data;
        this.saving = false;
      });
    },
    autoAligned() {
      this.confirm(
        null,
        "操作会自动排列菜单排序,以及功能编码,是否确定操作?"
      ).then(() => {
        this.saving = true;
        PermApi.autoAligned()
          .then(() => {
            this.saving = false;
          })
          .then(this.load);
      });
    },
    generateRouteJS() {
      window.open(config.ajaxUrl + `/usrm/usr/perm/generateRoute.js`);
    },
    addPerm(node) {
      let newPerm = {
        permName: "新建菜单",
        ordeCode: node.childNodes.length + 1,
        permCode: "",
        lowDataAuth: 0, // 服务器给的数据是字符串.
        parPermUuid: node.data.uuid,
        permType: "1",
        funcUrl: "/",
        iconUrl: "user"
      };
      this.saving = true;
      PermApi.savePerm(newPerm)
        .then(data => {
          Object.assign(newPerm, { uuid: data.uuid }); // 合并刚才返回的UUID主键
          this.saving = false; // 保存结束
          node.insertChild({ data: newPerm }); // 让当前节点追加一个新节点
          node.expand(() => {
            this.currPerm = newPerm;
          }); // 如果没拉取子节点,先拉取子节点,然后设置当前节点
        })
        .then(this.loadTree);
    },
    //  展开/关闭 全部
    expandAll() {
      let expandFn = (element, expand) => {
        element.childNodes.forEach(function(element) {
          element.expand(() => {
            expandFn(element);
          });
        }, this);
      };
      expandFn(this.$refs.permTree.root);
    },
    // 点击菜单树节点
    currentChange(data, node) {
      this.currParentPerm = node.parent.data || {};
      this.currPerm = data || {};
      this.currNode = node;
    },
    // 提交数据
    onSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saving = true;
          this.editor.error = {};
          PermApi.savePerm(this.currPerm)
            .then(data => {
              this.saving = false;
            })
            .catch(error => {
              this.editor.error = error.validError;
              this.saving = false;
            });
        }
      });
    },
    // 加载树内容
    loadTree(node, resolve) {
      if (node.data && node.data.permType !== "0") {
        PermApi.getPermByPID(node.data.uuid)
          .then(resp => resp.data)
          .then(resolve);
      } else {
        resolve([]);
      }
      this.saving = false;
    },
    // 删除菜单
    removePerm(node) {
      // 删除菜单实际要执行的方法
      let action = data => {
        this.saving = true;
        PermApi.deletePerm(data.uuid)
          .then(data => {
            this.saving = false;
            node.parent.removeChild(node);
          })
          .catch(() => {
            this.saving = false;
          });
      };
      // 单出提示,然后执行该方法
      this.confirm(node.data).then(action);
    },
    // 树节点的内容区的渲染方法
    renderContent(h, { node, data, store }) {
      let addBtn = (
        <el-button icon="el-icon-fa-plus" onClick={() => this.addPerm(node)} />
      );
      let deleteBtn = (
        <el-button
          icon="el-icon-fa-minus"
          onClick={() => {
            this.removePerm(node);
          }}
          disabled={data.uuid === "none"}
        />
      );
      return (
        <div>
          <span>
            <span>({data.ordeCode ? data.ordeCode : ""})</span>
            <span>
              {" "}
              {data.iconUrl ? (
                <i class={"el-icon-fa el-icon-fa-" + data.iconUrl} />
              ) : null}{" "}
              {data.permName}
            </span>
          </span>
          <span style="position:absolute;right:20px;">
            <span style="display:inline-block;width:200px;">
              <span style={{ marginLeft: (node.level - 2) * 15 + "px" }} />{" "}
              {data.funcUrl}
            </span>
            <span style="display:inline-block;width:100px;">
              {data.permCode}
            </span>
            <span style="display:inline-block;width:100px;">
              {data.permComp ? "√" : ""}
            </span>
            <el-button-group>
              {addBtn}
              {deleteBtn}
            </el-button-group>
          </span>
        </div>
      );
    }
  }
};
</script>
