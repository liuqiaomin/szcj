<template>
  <div class="home-box">
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <div style="padding: 15px">
          <el-form-item label="选择业务员" prop="company_name">
            <el-select
              v-model="searchForm.Customer_Name"
              filterable
              remote
              reserve-keyword
              placeholder="输入业务员名称 如 SZCJ马"
              :remote-method="customers_remoteMethod"
              style="width: 240px"
              clearable
              @change="handleSelectChange"
            >
              <el-option
                v-for="item in customersoptions"
                :key="item.id"
                :label="item.username"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="选择日期" v-if="searchForm.Customer_id">
            <el-date-picker
              v-model="searchForm.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              @change="timehandleSelectChange"
            />
          </el-form-item>

          <el-form-item v-if="searchForm.time">
            <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-card>

    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column fixed="left" prop="created_by" label="开单人" align="center" width="150">
        </el-table-column>
        <el-table-column prop="customer_name" label="客户名" align="center" width="220">
        </el-table-column>
        <el-table-column prop="customer_level" label="客户等级" align="center" width="90">
        </el-table-column>
        <el-table-column prop="customer_phone" label="客户电话" align="center" width="90">
        </el-table-column>
        <el-table-column prop="customer_address" label="客户地址" align="center" width="200">
        </el-table-column>
        <el-table-column prop="is_paid" label="是否付款" align="center" width="120">
        </el-table-column>
        <el-table-column prop="delivery_person" label="配送员" align="center" width="190">
        </el-table-column>
        <el-table-column prop="order_total_price" label="总价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="开单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="rob_time" label="抢单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="reach_time" label="送达时间" align="center" width="170">
        </el-table-column>
        <el-table-column label="交付图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.receipt_photo"
              :z-index="10"
              :preview-src-list="[row.receipt_photo]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="88" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="onShowClick(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <pagination
        v-show="total > 0"
        :total="total"
        v-model:page="searchForm.page"
        v-model:limit="searchForm.page_size"
        @pagination="getListData"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { api } from "@/api/api";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const store = useStore();
const router = useRouter();

const showSearch = ref(true);

// 搜索表单
const searchForm = ref({
  id: 0,
  time: "",
  page: 1,
  page_size: 20,
  Customer_Name: "", // 业务员名称（显示用）
  Customer_id: "",   // 业务员ID（传参用）
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const customersoptions = ref([]); // 业务员搜索结果

onMounted(() => {
  // 页面初始化
});

// 业务员远程搜索
const customers_remoteMethod = async (query) => {
  if (query) {
    loading.value = true;
    let in_data = {
      Type: "search",
      Table: "adminList",
      condition_name1: "username",
      condition1: query,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status && res.status.error_msg == "success") {
          customersoptions.value = res.data;
        } else {
          customersoptions.value = [];
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
        customersoptions.value = [];
      });
  } else {
    customersoptions.value = [];
  }
};

// 业务员选择变化
const handleSelectChange = (selectedItem) => {
  if (selectedItem && selectedItem.id) {
    searchForm.value.Customer_Name = selectedItem.username;
    searchForm.value.Customer_id = selectedItem.id;
    searchForm.value.time = "";     // 重置时间
    searchForm.value.page = 1;      // 重置分页
    tableData.value = [];
    total.value = 0;
  } else {
    // 清空
    searchForm.value.Customer_Name = "";
    searchForm.value.Customer_id = "";
    searchForm.value.time = "";
    customersoptions.value = [];
    tableData.value = [];
    total.value = 0;
  }
};

// 时间选择变化
const timehandleSelectChange = (selectedItem) => {
  if (selectedItem) {
    searchForm.value.page = 1;
    getListData();
  }
};

// 获取列表数据
const getListData = async () => {
  if (!searchForm.value.Customer_id) {
    ElMessage.warning("请先选择业务员");
    return;
  }

  loading.value = true;
  let in_data = {
    Type: "Jsearch_time",
    Table: "order_list",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    time: searchForm.value.time,
    created_by_id: searchForm.value.Customer_id,
    identifying: store.state.user.identifying, // 分店ID
  };

  await api(in_data)
    .then((res) => {
      loading.value = false;
      if (res.status && res.status.error_msg == "success") {
        tableData.value = res.data || [];
        total.value = Number(res.page_info?.total_items || 0);
      } else {
        tableData.value = [];
        total.value = 0;
        ElMessage.error(res.status?.error_msg || "无数据！");
      }
    })
    .catch((err) => {
      loading.value = false;
      tableData.value = [];
      total.value = 0;
    });
};

// 导出表格
const outexxx = async () => {
  // 校验
  if (!searchForm.value.Customer_id) {
    ElMessage.error("请先选择业务员！");
    return;
  }
  if (!searchForm.value.time || searchForm.value.time.length !== 2) {
    ElMessage.error("请选择时间范围！");
    return;
  }

  loading.value = true;
  let p = {
    time: searchForm.value.time,
    created_by_id: searchForm.value.Customer_id,
    identifying: store.state.user.identifying, // 分店ID
    downloadtp: 0, // 返回下载地址
  };

  await api({ ...p, Type: 'exportSalesmanOrder' })
    .then((res) => {
      loading.value = false;
      if (res.status && res.status.error_code == 0) {
        ElMessage.success(res.status.error_msg || "导出成功");
        // 下载文件
        if (res.data) {
          window.location.href = res.data;
        }
      } else {
        ElMessage.error((res.status && res.status.error_msg) || "导出失败");
      }
    })
    .catch((err) => {
      loading.value = false;
      ElMessage.error("导出异常，请重试");
    });
};

// 查看详情
const onShowClick = (row) => {
  router.push({
    path: "/Billing/Billing_xq",
    query: { id: row.id },
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