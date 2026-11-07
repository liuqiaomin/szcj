<template>
  <div class="home-box">
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <el-form-item label="搜索类型">
          <el-select v-model="searchForm.field" clearable placeholder="选择搜索类型">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="搜索内容" v-if="searchForm.field">
          <el-input
            v-model="searchForm.content"
            placeholder="请输入要搜索的内容"
            clearable
            @keyup.enter="remoteMethod"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="remoteMethod">查询搜索</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="id" label="订单ID" align="center" width="90" />
        <el-table-column prop="customer_name" label="客户名" align="center" width="200" />
        <el-table-column prop="order_total_price" label="订单总价" align="center" width="120" />
        <el-table-column prop="customer_level" label="客户等级" align="center" width="120" />
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="130" />
        <el-table-column prop="customer_address" label="客户地址" align="center" width="300" />
        <el-table-column prop="created_by" label="开单人" align="center" width="180" />
        <el-table-column prop="created_time" label="开单时间" align="center" width="180" />
        <el-table-column prop="print_id" label="打印次数" align="center" width="120" />
        <el-table-column prop="delivery_person" label="配送员" align="center" width="180" />
        <el-table-column label="交付图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.receipt_photo"
              :preview-src-list="[row.receipt_photo]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="168" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="onShowClick(row)">查看</el-button>
            <el-button plain @click="API_PHP_DEMObu(row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="searchForm.page"
        v-model:limit="searchForm.page_size"
        @pagination="onPagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/api/api";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();
const showSearch = ref(true);

const searchForm = ref({
  page: 1,
  page_size: 10,
  field: "",
  content: "",
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const options = [
  { value: "id", label: "订单ID" },
  { value: "customer_name", label: "客户名" },
  { value: "customer_phone", label: "客户电话" },
  { value: "created_by", label: "开单人" },
  { value: "delivery_person", label: "配送员" },
];

// ==================== 列表 ====================
onMounted(() => {
  getListData();
});

const getListData = async () => {
  loading.value = true;
  const in_data = {
    Type: "Billing_List3",
    Table: "order_list",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "Warehouse_sh",
    condition1: "3",
  };
  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      tableData.value = res.data || [];
      total.value = Number(res.page_info?.total_items || 0);
    } else {
      ElMessage.error("查询失败");
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ==================== 搜索 ====================
const remoteMethod = async () => {
  if (!searchForm.value.field) {
    ElMessage.warning("请选择搜索类型");
    return;
  }
  loading.value = true;
  searchForm.value.page = 1;
  tableData.value = [];

  const in_data = {
    Type: "Jsearch2",
    Table: "order_list",
    condition_name1: searchForm.value.field,
    condition1: searchForm.value.content,
    condition_name2: "Warehouse_sh",
    condition2: "3",
    page: 1,
    page_size: searchForm.value.page_size,
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      tableData.value = res.data || [];
      total.value = Number(res.page_info?.total_items || 0);
    } else {
      ElMessage.warning("无数据");
      total.value = 0;
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// ==================== 重置 ====================
const resetSearch = () => {
  searchForm.value.field = "";
  searchForm.value.content = "";
  searchForm.value.page = 1;
  getListData();
};

// ==================== 分页 ====================
const onPagination = () => {
  if (searchForm.value.field) {
    // 搜索状态下翻页，重新调搜索接口
    remoteMethod();
  } else {
    getListData();
  }
};

// ==================== 查看 ====================
const onShowClick = (row) => {
  router.push({
    path: "/Billing/Billing_xq",
    query: { id: row.id },
  });
};

// ==================== 打印 ====================
const API_PHP_DEMObu = async (row) => {
  try {
    const res = await api({ id: row.id, Type: 'orderListPrint' });
    if (res.status?.error_msg === "success") {
      ElMessage.success("发起打印成功");
    } else {
      ElMessage.error("发起打印失败");
    }
  } catch (err) {
    console.error(err);
  }
};
</script>

<style lang="scss" scoped>
.home-box {
  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 13%;
  }
}
</style>