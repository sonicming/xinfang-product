<template>
  <div>
    <el-row>
      <el-card>
        <template slot="header">
          <span>信访人信息</span>
        </template>
        <el-form ref="form" :model="form" label-width="110px" label-suffix=":">
          <el-row>
            <el-col span="5">
              <el-form-item label="姓名" :rules="[{ required: true, message: '姓名不能为空'}]">
                <el-input v-model="form.name" placeholder="请输入内容">
                  <el-button slot="append" size="medium" icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span="3">
              <el-form-item label="是否匿名">
                <el-checkbox v-model="form.isNiMing"></el-checkbox>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="手机号码">
                <el-input v-model=" form.phone" placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="住址" :rules="[{ required: true, message: '住址不能为空'}]">
                <AddressSelector></AddressSelector>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="信件来源" :rules="[{ required: true, message: '信件来源不能为空'}]">
                <XinJianLaiYuanSelector></XinJianLaiYuanSelector>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="身份" :rules="[{ required: true, message: '身份不能为空'}]">
                <el-input v-model="form.laiYuan" placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span="5">
              <el-form-item label="受信人" :rules="[{ required: true, message: '受信人不能为空'}]">
                <AddressSelector></AddressSelector>
              </el-form-item>
            </el-col>
            <el-col span="3">
              <el-form-item label="涉及人数" label-width="80px" :rules="[{ required: true, message: '涉及人数不能为空'},{ type: 'number', message: '涉及人数必须为数字值'}]">
                <el-input v-model.number="form.laiYuan">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="国籍" :rules="[{ required: true, message: '受信人不能为空'}]">
                <el-input v-model="form.laiYuan" placeholder="请选择内容">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card>
        <template slot="header" shadow="never">
          <span>信访详情</span>
        </template>
        <el-form ref="form" :model="form" label-width="110px" label-suffix=":">
          <el-row>
            <el-col span="8">
              <el-form-item label="信访目的">
                <el-input v-model="form.name" placeholder="请输入内容">
                  <el-button slot="append" size="medium" icon="el-icon-search"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="内容分类">
                <el-input v-model=" form.phone" placeholder="请输入内容">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="产生原因">
                <AddressSelector></AddressSelector>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="问题属地">
                <XinJianLaiYuanSelector></XinJianLaiYuanSelector>
              </el-form-item>
            </el-col>
            <el-col span="16">
              <el-form-item label="三跨三分离标志">
                <el-checkbox v-model="form.isNiMing"></el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col span="8">
              <el-form-item label="信访日期">
                <el-date-picker v-model="form.xinFangDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col span="8">
              <el-form-item label="限办日期">
                <el-date-picker v-model="form.xianBanDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card>
        <template slot="header" shadow="never">
          <span>概况</span>
        </template>
        <el-form ref="form" :model="form" label-width="0px" label-suffix=":">
          <el-row>
            <el-form-item label="">
              <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="textarea" resize="none">
              </el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-collapse v-model="activeNames" @change="handleChange">
              <el-collapse-item title="拟办意见" name="1">
                <el-form-item label="">
                  <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="textarea" resize="none">
                  </el-input>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card>
        <template slot="header" shadow="never">
          <span>办理区域</span>
        </template>
        <el-form ref="form" :model="form">
          <el-row type="flex" justify="center">
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}">告知</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}">直接回复</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}">转送</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}"> 交办</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}">存</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" :style="{width:'90px'}">退回</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-table :data="tableData" border style="width: 100%;margin-top:10px;">
              <el-table-column prop="banLiDate" align="center" label="办理时间">
              </el-table-column>
              <el-table-column prop="banLiFangShi" align="center" label="办理方式">
              </el-table-column>
              <el-table-column prop="quXiang" align="center" label="办理去向">
              </el-table-column>
              <el-table-column prop="zhuangTai" align="center" label="办理状态">
              </el-table-column>
              <el-table-column prop="gongWenName" align="center" label="公文名称">
              </el-table-column>
            </el-table>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
    <el-row>
      <el-card>
        <el-form ref="form" :model="form">
          <el-row type="flex" justify="center">
            <el-col :span="2">
              <el-button type="success" size="mini" icon="el-icon-plus" :style="{width:'90px'}">新建</el-button>
            </el-col>
            <el-col :span="2">
              <el-button type="primary" size="mini" icon="el-icon-edit" :style="{width:'90px'}">保存</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-row>
  </div>
</template>
<script>
import AddressSelector from "@/components/custom/AddressSelector";
import XinJianLaiYuanSelector from "@/components/custom/XinJianLaiYuanSelector";
export default {
  name: "LaiXinDengJi",
  components: { AddressSelector, XinJianLaiYuanSelector },
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        laiYuan: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        xinFangDate: "",
        xianBanDate: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      },
      tableData: [
        {
          banLiDate: "2018-08-03",
          banLiFangShi: "存",
          quXiang: "辽宁省信访局",
          zhuangTai: "办理",
          gongWenName: "转送书"
        },
        {
          banLiDate: "2018-08-04",
          banLiFangShi: "交办",
          quXiang: "大连市信访局",
          zhuangTai: "办理",
          gongWenName: ""
        },
        {
          banLiDate: "2018-08-08",
          banLiFangShi: "不予受理告知",
          quXiang: "李思明",
          zhuangTai: "已签收",
          gongWenName: "不予受理告知书"
        }
      ]
    };
  },
  created() {},
  mounted() {},
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>