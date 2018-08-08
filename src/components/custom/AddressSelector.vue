<template>
    <el-cascader placeholder="选择或搜索住址信息" :options="options" filterable change-on-select></el-cascader>
</template>
<script>
export default {
  name: "AddressSelector",
  data() {
    return {
      options: [
        {
          value: "zhinan",
          label: "北京市",
          children: [
            {
              value: "shejiyuanze",
              label: "北京市市辖区",
              children: [
                {
                  value: "yizhi",
                  label: "东城区"
                },
                {
                  value: "fankui",
                  label: "西城区"
                }
              ]
            },
            {
              value: "daohang",
              label: "北京县区",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "密云县"
                },
                {
                  value: "dingbudaohang",
                  label: "延庆县"
                }
              ]
            }
          ]
        }
      ]
    };
  }
};
</script>