<template>
  <div class="et-selector" v-clickoutside="handleClose" @keydown.esc.stop.prevent="handleClose">
    <el-input ref="reference" v-model="value" @focus="handleFocus" :on-icon-click="handleIconClick" @mousedown.native="handleMouseDown" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :size="size" type="text" :placeholder="placeholder" :name="name" :disabled="disabled" readonly :validate-event="false" :icon="iconClass"></el-input>
    <transition name="el-zoom-in-top" @after-leave="doDestroy">
      <el-select-menu class="et-selector__picker" ref="popper" v-show="visible">
        <div class="margin-top-1 margin-bottom-1">
          <el-button title="确定" icon="el-icon-fa-check" class="font-green" @click="format"></el-button>
        </div>
        <AceEditor v-model="content" lang="json" theme="monokai" width="500" height="400"></AceEditor>
      </el-select-menu>
    </transition>
  </div>
</template>
<script>
import Emitter from "element-ui/lib/mixins/emitter";
import Locale from "element-ui/lib/mixins/locale";
import Clickoutside from "element-ui/lib/utils/clickoutside";
import { t } from "element-ui/lib/locale";
import Select from "element-ui/lib/select";
import { PopupManager } from "element-ui/lib/utils/popup";

let ElSelectMenu = Select.components.ElSelectMenu;

/**
 * 数据选择器输入框
 * 具体看demo吧.
 * 2017年7月25日19:28:20
 */
export default {
  name: "EtSelector",
  componentName: "EtSelector",
  mixins: [Emitter, Locale],
  directives: { Clickoutside },
  components: { ElSelectMenu },
  props: {
    size: String,
    name: String,
    disabled: Boolean,
    clearable: Boolean,
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default() {
        return t("el.select.placeholder");
      }
    }
  },
  data() {
    return {
      cleared: false,
      inputHovering: false,
      visible: false,
      content: ""
    };
  },
  computed: {
    iconClass() {
      let criteria =
        this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        ((this.value !== undefined && this.value !== "") ||
          (this.selected !== undefined && this.selected.length > 0));
      return criteria ? "circle-close is-show-close" : "search";
    }
  },
  mounted() {},
  watch: {
    visible(val) {
      if (!val) {
        this.broadcast("ElSelectDropdown", "destroyPopper");
        this.$refs.reference.$el.querySelector("input").blur();
        this.broadcast("ElSelectDropdown", "destroyPopper");
      } else {
        this.broadcast("ElSelectDropdown", "updatePopper");
        if (this.$refs.popper) {
          this.$refs.popper.$el.style.zIndex = PopupManager.nextZIndex();
        }
      }
    }
  },
  methods: {
    format() {
      let a = this.content;
      try {
        this.content = JSON.stringify(JSON.parse(a), null, 2);
        this.$emit("input", this.content);
      } catch (e) {
        this.$message.error("JSON格式错误!");
      }
    },
    handleClose() {
      this.visible = false;
      this.dispatch("base/ElFormItem", "el.form.blur", [this.selectedValue]);
    },
    handleShow() {
      this.visible = true;
    },
    toggleMenu() {
      this.visible = !this.visible;
    },
    handleFocus() {
      this.visible = true;
    },
    handleMouseDown() {
      if (event.target.tagName !== "INPUT") return;
      if (this.visible) {
        this.handleClose();
        event.preventDefault();
      }
    },
    doDestroy() {
      this.$refs.popper && this.$refs.popper.doDestroy();
    },
    handleIconClick(event) {
      if (this.iconClass.indexOf("circle-close") > -1) {
        this.content = "";
        this.$emit("input", this.content);
      } else {
        this.toggleMenu();
      }
    }
  }
};
</script>
