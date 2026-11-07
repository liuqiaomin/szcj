<template>
  <div class="diva">
    <el-form label-position="top" :model="form" label-width="580px">
      <el-form-item label="门店名" prop="name">
        <el-input disabled v-model="form.branch_name"></el-input>
      </el-form-item>

      <el-form-item label="门店地址" prop="address">
        <el-input v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="门店电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="门店坐标latitude" prop="latitude">
        <el-link type="danger" href="https://lbs.qq.com/tool/getpoint/get-point.html">获取坐标地址</el-link>
        <el-input v-model="form.latitude"></el-input>
      </el-form-item>
      <el-form-item label="门店坐标longitude" prop="longitude">
        <el-input v-model="form.longitude"></el-input>
      </el-form-item>

      <el-form-item label="门店小程序公告" prop="Notice">
        <el-input v-model="form.Notice"></el-input>
      </el-form-item>
      <el-form-item label="门店小程序公告--背景色" prop="Notice_color">
        <el-color-picker v-model="form.Notice_color"></el-color-picker>
      </el-form-item>
      <el-form-item label="门店小程序公告--文字颜色" prop="Notice_text">
        <el-color-picker v-model="form.Notice_text"></el-color-picker>
      </el-form-item>
      <el-form-item label="门店小程序订单运费" prop="freight">
        <el-input v-model="form.freight"></el-input>
      </el-form-item>
      <el-form-item label="满多少减运费" prop="freight">
        <el-input v-model="form.freight_manjian_sum"></el-input>
      </el-form-item>
      <el-divider />
      <el-button type="primary" @click="addFreightManjian">添加一个</el-button>
      <div v-for="(item, index) in form.ColorList_list" :key="index" class="form-item-row">
        <el-form-item label="充值多少">
          <el-input v-model="item.a"></el-input>
        </el-form-item>
        <el-form-item label="送多少">
          <el-input v-model="item.b"></el-input>
        </el-form-item>
        <el-button type="danger" @click="removeFreightManjian(index)">删除</el-button>
      </div>
      <el-divider />
      <el-form-item label="门店小程序同城发布费" prop="freight">
        <el-input v-model="form.Same"></el-input>
      </el-form-item>
      <el-form-item label="门店协议">
        <el-input v-model="form.protocol" size="medium" type="textarea" />
      </el-form-item>
      <el-form-item label="退换货说明">
        <el-input v-model="form.Returns" size="medium" type="textarea" />
      </el-form-item>
      <el-form-item label="关于我们">
        <el-input v-model="form.About" size="medium" type="textarea" />
      </el-form-item>
    </el-form>
    <el-button type="primary" @click="adds()">保存更新</el-button>
  </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { api } from "@/api/api";
import { ref, onMounted, onBeforeUnmount, watch, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const form = reactive({
  Type: "branch_list_up",
  Table: "branch_list",
  branch_name: "", //门店名
  Notice: "", //门店名公告
  Notice_text: "",
  Notice_color: "",
  address: "", //门店地址
  phone: "", //门店电话
  latitude: "", //坐标
  longitude: "", //坐标
  freight: "", //运费
  Same: "", //同城
  id: "",
  freight_manjian_sum: "", //满多少减运费
  ColorList_list: [],//冲多少送列表
  protocol: "",//门店协议
  Returns: "",//退换货说明
  About: "",//关于我们
});

onMounted(() => {
  getListData();
});

/**
 * 获取商品列表
 */
const getListData = async () => {
  let in_data = {
    Type: "branch_list_get",
    Table: "branch_list",
  };
  await api(in_data)
    .then((res) => {
      console.log(res.data);
      if (res.status.error_msg == "success") {
        let o = res.data;
        form.id = o.id;
        form.branch_name = o.branch_name;
        form.Notice = o.Notice; //门店名公告
        form.Notice_text = o.Notice_text;
        form.Notice_color = o.Notice_color;
        form.address = o.address; //门店地址
        form.phone = o.phone; //门店电话
        form.latitude = o.latitude; //坐标
        form.longitude = o.longitude; //坐标
        form.freight = o.freight; //运费

        form.ColorList_list = JSON.parse(o.ColorList_list); //运费
        form.freight_manjian_sum = o.freight_manjian_sum; //满多少减运费
        form.Same = o.Same; //同城运费


        form.protocol = o.protocol;//门店协议
        form.Returns = o.Returns;//退换货说明
        form.About = o.About;//关于我们
      } else {
        ElMessage.error("查询失败！");
      }
    })
    .catch((err) => { });
};


//添加一个
const addFreightManjian = async () => {

  form.ColorList_list.push({ a: '', b: '' });
}
//删除一个
const removeFreightManjian = async (index) => {

  form.ColorList_list.splice(index, 1);
}


/**
 * 提交
 */
const adds = async () => {
  await api(form)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
      } else {
        ElMessage.error("更新失败！");
      }
    })
    .catch((err) => { });
};
</script>

<style lang="scss" scoped>
.diva {
  padding: 50px 200px 10px 200px;
  background-color: #ffffff;
  border-radius: 14px;
}

.form-item-row {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  /* 根据需要调整间距 */
}

.form-item-row .el-form-item {
  margin-right: 5px;
  /* 根据需要调整间距 */
}

.form-item-row .el-button {
  margin-left: auto;
  /* 将按钮推到最右边 */
}
</style>
