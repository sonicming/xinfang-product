<template>
  <div class="et-selector" v-clickoutside="handleClose" @keydown.esc.stop.prevent="handleClose">

    <el-input ref="reference" v-model="selectedLabel" @focus="handleFocus" :on-icon-click="handleIconClick" @mousedown.native="handleMouseDown" @mouseenter.native="inputHovering = true" @mouseleave.native="inputHovering = false" :size="size" type="text" :placeholder="placeholder" :name="name" :disabled="disabled" readonly :validate-event="false">
      <i slot="suffix" :class="iconClass" @click="handleIconClick"></i>
    </el-input>

    <transition name="el-zoom-in-top" @after-leave="doDestroy">
      <el-select-menu class="et-selector__picker" ref="popper" v-show="visible">
        <slot></slot>
      </el-select-menu>
    </transition>
  </div>
</template>

<script>
import Emitter from 'element-ui/lib/mixins/emitter'
import Locale from 'element-ui/lib/mixins/locale'
import Clickoutside from 'element-ui/lib/utils/clickoutside'
import { t } from 'element-ui/lib/locale'
import { getValueByPath } from 'element-ui/lib/utils/util'
import Select from 'element-ui/lib/select'
import { PopupManager } from 'element-ui/lib/utils/popup'

let ElSelectMenu = Select.components.ElSelectMenu

/**
 * 数据选择器输入框
 * 具体看demo吧.
 * 2017年7月25日19:28:20
 */
export default {
  name: 'EtSelector',
  componentName: 'EtSelector',
  mixins: [Emitter, Locale],
  directives: { Clickoutside },
  components: { ElSelectMenu },
  props: {
    size: String,
    name: String,
    disabled: Boolean,
    clearable: Boolean,
    loading: Boolean,
    valueKey: String,
    labelKey: String,
    initLabel: String,
    title: String,
    value: {
      required: true
    },
    placeholder: {
      type: String,
      default () {
        return t('el.select.placeholder')
      }
    }
  },
  data () {
    return {
      cleared: false,
      selectedLabel: '',
      selectedValue: '',
      inputHovering: false,
      visible: false
    }
  },
  computed: {
    iconClass () {
      let criteria =
        this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        ((this.value !== undefined && this.value !== '') ||
          (this.selected !== undefined && this.selected.length > 0))
      return criteria ? 'el-icon-circle-close is-show-close' : 'el-icon-search'
    }
  },
  mounted () {
    this.$on('selectTableRow', this.selectTableRow)
    this.$on('selectTable', this.selectTable)
    this.showDefault()
    if (this.$refs.popper) {
      this.$refs.popper.$el.style.zIndex = PopupManager.nextZIndex()
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.broadcast('ElSelectDropdown', 'destroyPopper')
        this.$refs.reference.$el.querySelector('input').blur()
        this.broadcast('ElSelectDropdown', 'destroyPopper')
      } else {
        this.broadcast('ElSelectDropdown', 'updatePopper')
        if (this.$refs.popper) {
          this.$refs.popper.$el.style.zIndex = PopupManager.nextZIndex()
        }
      }
    },
    initLabel (val) {
      this.showDefault()
    },
    value (val) {
      if (!val) {
        this.showDefault()
      }
    }
  },

  methods: {
    handleClose () {
      this.visible = false
      this.dispatch('ElFormItem', 'el.form.blur', [this.selectedValue])
    },
    handleShow () {
      this.visible = true
    },
    toggleMenu () {
      this.visible = !this.visible
    },
    handleFocus () {
      this.visible = true
    },
    handleMouseDown () {
      if (event.target.tagName !== 'INPUT') return
      if (this.visible) {
        this.handleClose()
        event.preventDefault()
      }
    },
    showDefault () {
      if (this.initLabel && !this.cleared) {
        this.selectedLabel = this.initLabel
      } else if (this.value) {
        this.selectedLabel = this.value
      } else {
        this.selectedLabel = ''
      }
    },
    doDestroy () {
      this.$refs.popper && this.$refs.popper.doDestroy()
    },
    handleMenuEnter () {},
    handleIconClick (event) {
      if (this.iconClass.indexOf('el-icon-circle-close') > -1) {
        this.deleteSelected(event)
      } else {
        this.toggleMenu()
      }
    },
    deleteSelected (event) {
      event.stopPropagation()
      this.selectedLabel = ''
      this.cleared = true
      this.handleClose()
      this.$emit('clear')
      this.$emit('input', this.selectedLabel)
      this.dispatch('ElFormItem', 'el.form.change', [this.selectedValue])
      this.dispatch('ElFormItem', 'el.form.blur', [this.selectedValue])
    },
    getValueKey (item) {
      const type = typeof item
      if (type === 'number' || type === 'string') {
        return item
      } else {
        return getValueByPath(item, this.labelKey)
      }
    },
    selectTableRow (row) {
      this.selectedLabel = getValueByPath(row, this.labelKey)
      this.selectedValue = this.valueKey
        ? getValueByPath(row, this.valueKey)
        : row
      this.handleClose()
      this.$emit('select', row, this.selectedValue, this.selectedLabel)
      this.$emit('input', this.selectedValue)
      this.dispatch('ElFormItem', 'el.form.change', [this.selectedValue])
      this.dispatch('ElFormItem', 'el.form.blur', [this.selectedValue])
    }
  }
}
</script>

<style  lang="scss">
@import '../../styles/vars';

.et-selector {
  .el-input__inner {
    cursor: pointer;
  }
  &__tags {
    min-width: 180px;
    display: block;
    .el-input {
      &__inner {
        display: block;
        margin: 0;
        height: initial;
        min-height: 26px;
      }
    }
    .el-tag {
      margin: 1px 2px;
      height: 18px;
      line-height: 18px;
      box-sizing: border-box;
    }
  }
  &__picker {
    margin-top: 10px;
    padding: 3px;
  }
}
</style>
