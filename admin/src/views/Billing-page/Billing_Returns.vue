<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_LiSt">新建销售退货</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="customer_name" label="客户名" align="center" width="200">
        </el-table-column>
        <el-table-column prop="order_total_price" label="退单总价" align="center" width="120">
        </el-table-column>
        <el-table-column prop="customer_level" label="客户等级" align="center" width="120">
        </el-table-column>
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="130">
        </el-table-column>
        <el-table-column prop="customer_address" label="客户地址" align="center" width="300">
        </el-table-column>
        <el-table-column prop="created_by" label="开单人" align="center" width="180">
        </el-table-column>
        <el-table-column prop="created_time" label="开单时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="操作" width="200" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" plain @click="print(row)">打印</el-button>
            <el-button type="primary" plain @click="onShowClick(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
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
  Regional_barcode: "",
  role: "",
  date: "",
  page: 1,
  page_size: 10,
  row: "",
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

// onMounted(() => {

// });
// watch(
//   () => router.currentRoute.value,
//   () => {
//     getListData();
//   }
// );
/**
 * 获取商品列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "Jsearch",
    Table: "orders_th",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "Warehouse_sh",
    condition1: 0,
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
      r;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getListData();
/**
 * 查看按钮点击事件
 */
//详情
const onShowClick = (row) => {
  let i = {
    id: row.id,
  };
  router.push({
    path: "/Billing/Billing_Returnsxq",
    query: i,
  });
};
//新建
const add_LiSt = () => {
  router.push({
    path: "/Billing/Billing_Returnsadd",
    // query: row,
  });
};
//打印
const print = async (row) => {
  let in_data = {
    id: row.id,
  };
  const confirmResult = await ElMessageBox.confirm(
    "确定要打印吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    await api({ ...in_data, Type: 'returnPrint' })
      .then((res) => {
        console.log(res);
        if (res.status.error_msg == "success") {
          ElMessage.success("发起打印成功");
        } else {
          ElMessage.error("发起打印失败！");
        }
      })
      .catch((err) => { });
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
