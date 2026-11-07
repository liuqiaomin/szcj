<template>
  <div class="home-box">
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="customer_name" label="客户名" align="center" width="200" />
        <el-table-column prop="order_total_price" label="订单总价" align="center" width="120" />
        <el-table-column prop="customer_level" label="客户等级" align="center" width="120" />
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="130" />
        <el-table-column prop="customer_address" label="客户地址" align="center" width="300" />
        <el-table-column prop="created_by" label="开单人" align="center" width="180" />
        <el-table-column prop="created_time" label="开单时间" align="center" width="180" />
        <el-table-column prop="print_id" label="打印次数" align="center" width="120" />
        <el-table-column prop="delivery_person" label="配送员" align="center" width="150" fixed="left" />
        <el-table-column label="转单" width="88" align="center" fixed="left">
          <template #default="{ row }">
            <el-button type="primary" plain @click="Transferorder_tcbu(row)">转单</el-button>
          </template>
        </el-table-column>
        <el-table-column label="交付图" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.receipt_photo" :preview-src-list="[row.receipt_photo]" preview-teleported />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="268" align="center" fixed="right">
          <template #default="{ row }">
            <el-button plain @click="up_bu(row)">编辑地址</el-button>
            <el-button type="primary" plain @click="onShowClick(row)">查看</el-button>
            <el-button plain @click="API_PHP_DEMObu(row)">打印</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size" @pagination="getListData" />
    </el-card>

    <!-- 编辑地址弹窗 -->
    <el-dialog v-model="up_dialogVisible" title="编辑地址" width="30%">
      <el-form label-position="top">
        <el-form-item label="收货店名">
          <el-input :model-value="searchForm.row?.customer_name" disabled />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="searchForm.row.customer_address" placeholder="请输入收货地址" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="up_dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="up">更新</el-button>
      </template>
    </el-dialog>

    <!-- 转单弹窗 -->
    <el-dialog v-model="Transferorder_tc" title="发起转单" width="30%">
      <el-form label-position="top">
        <el-form-item label="原配送员">
          <el-input :model-value="searchForm.row?.delivery_person" disabled />
        </el-form-item>
        <el-form-item label="选择新配送员">
          <el-radio-group v-model="searchForm.psy" @change="handleRadioChange">
            <el-radio v-for="item in pstableData" :key="item.id" :label="item.username" :value="item.username" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="收货店名">
          <el-input :model-value="searchForm.row?.customer_name" disabled />
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input :model-value="searchForm.row?.customer_address" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="Transferorder_tc = false">取消</el-button>
        <el-button type="primary" @click="Transferorder">确定转单</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { api } from "@/api/api";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const router = useRouter();

const searchForm = ref({
  page: 1,
  page_size: 10,
  row: null,
  psy: "",
  psitem: null,
});

const tableData = ref([]);
const pstableData = ref([]);
const total = ref(0);
const loading = ref(false);

// ==================== 列表 ====================
onMounted(() => {
  getListData();
  psData();
});

const getListData = async () => {
  loading.value = true;
  const in_data = {
    Type: "Jsearch",
    Table: "order_list",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "Warehouse_sh",
    condition1: 2,
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
    ElMessage.error("请求失败");
  } finally {
    loading.value = false;
  }
};

// ==================== 配送员列表 ====================
const psData = async () => {
  const in_data = {
    Type: "Jsearch",
    Table: "adminList",
    page: 1,
    page_size: 1000,
    condition_name1: "role_name",
    condition1: "配送员",
  };
  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      pstableData.value = res.data || [];
    }
  } catch (err) {
    console.error(err);
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
    ElMessage.error("请求失败");
  }
};

// ==================== 编辑地址 ====================
const up_dialogVisible = ref(false);
const up_bu = (row) => {
  searchForm.value.row = { ...row };
  up_dialogVisible.value = true;
};

const up = async () => {
  const in_data = {
    Type: "order_list_address",
    Table: "order_list",
    id: searchForm.value.row.id,
    customer_address: searchForm.value.row.customer_address,
  };
  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      ElMessage.success("更新成功");
      up_dialogVisible.value = false;
      getListData();
    } else {
      ElMessage.error("更新失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};

// ==================== 转单 ====================
const Transferorder_tc = ref(false);
const Transferorder_tcbu = (row) => {
  searchForm.value.row = { ...row };
  searchForm.value.psy = "";
  searchForm.value.psitem = null;
  Transferorder_tc.value = true;
};

const handleRadioChange = (value) => {
  const item = pstableData.value.find((i) => i.username === value);
  if (item) {
    searchForm.value.psitem = item;
  }
};

const Transferorder = async () => {
  if (!searchForm.value.psitem) {
    ElMessage.warning("请选择配送员");
    return;
  }
  const in_data = {
    Type: "Transferorder",
    Table: "order_list",
    id: searchForm.value.row.id,
    delivery_person_id: searchForm.value.psitem.id,
    delivery_person: searchForm.value.psitem.username,
  };
  try {
    const res = await api(in_data);
    if (res.status?.error_code === 0) {
      ElMessage.success(res.status?.error_msg || "转单成功");
      Transferorder_tc.value = false;
      getListData();
    } else {
      ElMessage.error(res.status?.error_msg || "转单失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
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