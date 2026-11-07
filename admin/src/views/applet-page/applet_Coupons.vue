<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="coupon_name" label="优惠券名称" align="center" width="120">
        </el-table-column>
        <el-table-column prop="coupon_color" label="优惠券颜色" align="center" width="200">
        </el-table-column>
        <el-table-column prop="coupon_type" label="优惠券类型" align="center" width="100">
        </el-table-column>
        <el-table-column prop="discount_amount" label="减免金额" align="center" width="100">
        </el-table-column>
        <el-table-column prop="minimum_consume" label="最低消费金额	" align="center" width="180">
        </el-table-column>
        <el-table-column prop="expiration_time" label="优惠券到期时间	" align="center" width="180">
        </el-table-column>
        <el-table-column prop="total_quantity" label="优惠券发放总数量" align="center" width="180">
        </el-table-column>
        <el-table-column prop="sort_order" label="优惠券排序" align="center" width="180">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="操作" width="108" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增优惠券 -->
      <el-dialog v-model="add_dialogVisible" title="新增优惠券" width="40%">
        <el-form label-position="top"><el-form-item label="优惠券名称" prop="coupon_name">
            <el-input v-model="searchForm.coupon_name" placeholder="请输入优惠券名称 例如:满100减10"></el-input>
          </el-form-item>
          <el-form-item label="优惠券颜色" prop="coupon_color">
            <el-radio-group v-model="searchForm.coupon_color">
              <el-radio label="蓝色">蓝色</el-radio>
              <el-radio label="红色">红色</el-radio>
              <el-radio label="紫色">紫色</el-radio>
              <el-radio label="黄色">黄色</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券类型" prop="coupon_type">
            <el-radio-group v-model="searchForm.coupon_type">
              <el-radio label="满减"></el-radio>
              <el-radio label="直扣"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="减免金额" prop="discount_amount">
            <el-input v-model="searchForm.discount_amount" placeholder="请输入减免金额"></el-input>
          </el-form-item>
          <el-form-item label="最低消费金额" prop="minimum_consume">
            <el-input v-model="searchForm.minimum_consume" placeholder="请输入减免金额"></el-input>
          </el-form-item>
          <el-form-item label="优惠券到期时间" prop="expiration_time" label-width="130">
            <el-date-picker v-model="searchForm.expiration_time" type="datetime" placeholder="请输入到期时间"
              format="YYYY/MM/DD HH:mm:ss" value-format="YYYY-MM-DD HH:mm:ss" />
          </el-form-item>
          <el-form-item label="优惠券发放总数量" prop="total_quantity">
            <el-input v-model="searchForm.total_quantity" placeholder="请输入发放总数量"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="total_quantity">
            <el-input v-model="searchForm.sort_order" placeholder="请输入排序"></el-input>
          </el-form-item>
        </el-form>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="add_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="add">新建 </el-button>
          </span>
        </template>
      </el-dialog>
      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, reactive } from "vue";
import { api } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { switchServerUrl } from "@/utils/index";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

//数据源
const searchForm = ref({
  id: 0,
  company_name: "",
  phone: "",
  wechat: "",
  address: "",
  page: 1,
  page_size: 10,

  category: "",
  coupon_name: "",
  coupon_color: "",
  coupon_type: "",
  discount_amount: "",
  minimum_consume: "",
  expiration_time: "",
  total_quantity: "",
  sort_order: "",
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

//重置
const resetting = async () => {
  searchForm.value = {
    id: 0,
    company_name: "",
    phone: "",
    wechat: "",
    address: "",
    page: 1,
    page_size: 10,

    category: "",
    coupon_name: "",
    coupon_color: "",
    coupon_type: "",
    discount_amount: "",
    minimum_consume: "",
    expiration_time: "",
    total_quantity: "",
    sort_order: "",
  };
};
onMounted(() => {
  getListData();
});
/**
 * 获取公司列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "Coupons",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.data;
          total.value = Number(res.page_info.total_items);
          loading.value = false;
        }, 1000);
      } else {
        ElMessage.error("查询失败！");
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

//新增账号
const add_dialogVisible = ref(false);
const add = async () => {
  const in_data = {
    Type: "Coupons_add",
    Table: "Coupons",
    row: JSON.stringify(searchForm.value),
  };
  console.log(in_data);
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        add_dialogVisible.value = false;
        getListData();
        resetting();
      } else {
        ElMessage.error("新建失败！");
      }
    })
    .catch((err) => { });
};

/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.company_name + "】这个公司吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "Coupons",
      Type: "delete",
    };
    try {
      const response = await api(requestData);
      console.log(response);
      if (response.status.error_msg === "success") {
        ElMessage.success("删除成功");
        getListData();
      } else {
        ElMessage.error("删除失败！");
      }
    } catch (error) {
      console.error(error);
    }
  }
};
</script>

<style lang="scss" scoped>
.home-box {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }

  ::v-deep .el-tag {
    margin-right: 6px;
  }

  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 13%;
  }
}
</style>
