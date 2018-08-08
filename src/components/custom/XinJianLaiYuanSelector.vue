<template>
  <el-select v-model="value" filterable placeholder="请选择或搜索信件来源">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: "XinJianLaiYuanSelector",
  data() {
    return {
      options: [
        {
          value: "1",
          label: "邮局"
        },
        {
          value: "2",
          label: "重要领导批示交办"
        },
        {
          value: "3",
          label: "部领导批示交办"
        },
        {
          value: "4",
          label: "办公厅"
        },
        {
          value: "5",
          label: "国家信访局"
        },
        {
          value: "6",
          label: "国家信访局"
        },
        {
          value: "7",
          label: "其他部门"
        }
      ],
      value: ""
    };
  }
};
</script>