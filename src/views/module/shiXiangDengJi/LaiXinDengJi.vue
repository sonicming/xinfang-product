<template>
  <el-row>
    <el-col>
      <el-card>
        <template slot="header" shadow="always">
          <span>信访人信息</span>
        </template>
        <el-form ref="form" :model="form" label-width="80px">
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="form.name" placeholder="请输入内容">
                <el-button slot="append" size="medium" icon="el-icon-search"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="手机号码">
              <el-input v-model=" form.name " placeholder="请输入内容 ">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="住址">
              <el-input v-model="form.name " placeholder="请输入内容 ">
              </el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header " shadow="hover ">
          <span>信访详情</span>
        </template>
        <el-form ref="form " :model="form " label-width="80px ">

        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header " shadow="hover ">
          <span>概况</span>
        </template>
        <el-form ref="form " :model="form " label-width="80px ">

        </el-form>
      </el-card>
    </el-col>
    <el-col>
      <el-card>
        <template slot="header " shadow="hover ">
          <span>办理区域</span>
        </template>
        <el-form ref="form " :model="form " label-width="80px ">

        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
export default {
  name: "laiXinDengJi",
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>