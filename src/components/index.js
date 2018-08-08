import PageTable from './my/PageTable'
import Selector from './my/Selector.vue'
import Panel from './my/Panel.vue'
import SysCode from './my/SysCode'
import mixin from './my/mixin'

export default {
  install(Vue, option) {
    Vue.component('PageTable', PageTable)
    Vue.component('SysCode', SysCode.component)
    Vue.component('Selector', Selector)
    Vue.component('Panel', Panel)
    Vue.directive('sysCode', SysCode.directive)
    Vue.mixin(mixin)
  },
}
