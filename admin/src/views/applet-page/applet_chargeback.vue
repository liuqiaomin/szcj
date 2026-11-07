<template>
  <div class="home-box">
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <el-form-item label="搜索类型" prop="Regional_barcode ">
          <el-select v-model="searchForm.field" clearable placeholder="选择搜索类型">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索的内容" v-if="searchForm.field">
          <el-input v-model="searchForm.content" placeholder="请输入要搜索的内容" class="handle-input mr10" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="remoteMethod" style="margin-left: -16px">查询搜索
          </el-button></el-form-item><el-form-item>
          <el-button @click="getListData"><el-icon>
              <HelpFilled />
            </el-icon>重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column  label="审核状态" align="center" width="100">
          <el-button type="warning">待审核</el-button>
        </el-table-column>

        <el-table-column prop="customer_name" label="客户名" align="center" width="200">
        </el-table-column>
        <el-table-column prop="order_total_price" label="订单总价" align="center" width="120">
        </el-table-column>
        <el-table-column label="财务是否收款" width="120" align="center">
          <template #default="{ row }">
            <span>{{ row.is_paid == "1" ? "已收" : "待收" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="130">
        </el-table-column>
        <el-table-column prop="customer_address" label="客户地址" align="center" width="300">
        </el-table-column>
        <el-table-column prop="created_time" label="申请时间" align="center" width="180">
        </el-table-column>
        <el-table-column prop="print_id" label="打印次数" align="center" width="120">
        </el-table-column>
        <el-table-column prop="delivery_person" label="配送员" align="center" width="180">
        </el-table-column>

        <el-table-column label="交付图" align="center" width="105">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.receipt_photo" :z-index="10" :preview-src-list="[row.receipt_photo]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" align="center" fixed="right">
          <template #default="{ row }">

            <el-button type="success" @click="UP(row, 7)">通过</el-button>
            <el-button type="danger" @click="UP(row, 0)">驳回 </el-button>
            <el-button type="primary" plain @click="onShowClick(row)">查看</el-button>
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

  field: "", //搜索字段
  content: "", //搜索内容
  content2: "", //搜索内容
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

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
    Table: "order_list",
    condition_name1: "state",
    condition1: 6,
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
      r;
    })
    .catch((err) => {
      loading.value = false;
    });
};
getListData();


const UP = async (row, i) => {
  if (row.state != 6) {
    ElMessage.error("用户未申请退单")
    return
  }
  const in_data = {
    Type: "applet_chargeback_up",
    Table: "order_list",
    id: row.id,
    XY: i
  };
  loading.value = true;
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_code == 0) {
        ElMessage.success(res.status.error_msg);
        loading.value = false;
        getListData();
      } else {
        ElMessage.error(res.status.error_msg);
      }
    })
    .catch((err) => { });
};

// 查询操作
const options = [
  {
    value: "customer_name",
    label: "客户名",
  },
  {
    value: "customer_phone",
    label: "客户电话",
  },
  {
    value: "customer_address",
    label: "客户地址",
  },
  {
    value: "delivery_person",
    label: "配送员",
  },
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      condition_name2: 'state',
      condition2: 6,
      Type: "Jsearch2",
      Table: "order_list",
      condition_name1: searchForm.value.field,
      condition1: searchForm.value.content,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          tableData.value = res.data;
          total.value = Number(res.page_info.total_items);
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
/**
 * 查看按钮点击事件
 */
const onShowClick = (row) => {
  let i = {
    id: row.id,
  };
  router.push({
    path: "/Billing/Billing_td_xq",
    query: i,
  });
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
