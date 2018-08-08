import "babel-polyfill"; //支持IE9 等低版本浏览器不支持ES6
import Vue from 'vue'
import Vuex from "vuex";
import ElementUI from "element-ui";
import VueProgressBar from "vue-progressbar";
import DlgDraggable from "vue-element-dialog-draggable";
import Vue2Filters from "vue2-filters";
import VueMoment from "vue-moment";

import App from './App.vue'
import router from './router'
import store from './vuex'
import "element-ui/lib/theme-chalk/index.css";
import "./styles/index.scss";

Vue.config.productionTip = false;
ElementUI.Dialog.props.closeOnClickModal.default = false;

Vue.use(ElementUI, {
  size: "compact",
  zIndex: 3000
});

Vue.use(Vuex);
Vue.use(Vue2Filters);
Vue.use(ElementUI);
Vue.use(VueMoment);
Vue.use(VueProgressBar, { thickness: "3px" });
Vue.use(DlgDraggable);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
