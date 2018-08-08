import Store from "../../vuex/index";

let component = {
  props: {
    value: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      text: ""
    };
  },
  computed: {},
  render(h) {
    // 不然可能无法正常更新.
    let value = this.value;
    Store.dispatch("base/loadSysCode", this.type).then(code => {
      let c = (c = code.data.find(c => c.key == value));
      this.text = c.label;
    });
    return (
      <span>
        {this.text ? (
          this.text
        ) : (
          <span class="'font-red-error'"> {this.$t("ui.sysCode.noCode")} </span>
        )}
      </span>
    );
  }
};

let directive = {
  bind(el, binding, vnode, oldnode) {
    let codeType = binding.value;
    Store.dispatch("base/loadSysCode", codeType);
  }
};

export default { directive, component };
