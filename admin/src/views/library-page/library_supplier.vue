<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item label="公司名称">
        <el-input v-model="searchForm.company_name" placeholder="请输入公司名称" clearable />
      </el-form-item>
      <el-form-item label="电话">
        <el-input v-model="searchForm.phone" placeholder="请输入电话" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchEvent">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetSearch">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="warning" @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="id" label="公司ID" align="center" width="120" />
        <el-table-column prop="company_name" label="公司名称" align="center" width="200" />
        <el-table-column prop="phone" label="公司电话" align="center" width="130" />
        <el-table-column prop="wechat" label="微信" align="center" width="130" />
        <el-table-column prop="address" label="地址" align="center" width="200" />
        <el-table-column prop="created_time" label="创建时间" align="center" width="180" />
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="{ row }">
            <el-button plain @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增弹窗 -->
      <el-dialog v-model="add_dialogVisible" title="新增供应商" width="420px">
        <el-form label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="addForm.company_name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="addForm.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="addForm.wechat" placeholder="请输入微信" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="addForm.address" placeholder="请输入地址" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="add_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">新建</el-button>
        </template>
      </el-dialog>

      <!-- 编辑弹窗 -->
      <el-dialog v-model="up_dialogVisible" title="编辑供应商" width="420px">
        <el-form label-width="80px">
          <el-form-item label="名称">
            <el-input v-model="editForm.company_name" placeholder="请输入名称" />
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="editForm.phone" placeholder="请输入电话" />
          </el-form-item>
          <el-form-item label="微信">
            <el-input v-model="editForm.wechat" placeholder="请输入微信" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="editForm.address" placeholder="请输入地址" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="up_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="up">保存更新</el-button>
        </template>
      </el-dialog>

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
import { ref, reactive, onMounted } from "vue";
import { api } from "@/api/api";
import { ElMessageBox, ElMessage } from "element-plus";

// ==================== 数据 ====================
const showSearch = ref(true);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

// 搜索表单
const searchForm = ref({
  company_name: "",
  phone: "",
  page: 1,
  page_size: 10,
});

// 新增表单（独立）
const addForm = ref({
  company_name: "",
  phone: "",
  wechat: "",
  address: "",
});

// 编辑表单（独立）
const editForm = ref({
  id: 0,
  company_name: "",
  phone: "",
  wechat: "",
  address: "",
});

// ==================== 弹窗控制 ====================
const add_dialogVisible = ref(false);
const up_dialogVisible = ref(false);

const openAdd = () => {
  addForm.value = {
    company_name: "",
    phone: "",
    wechat: "",
    address: "",
  };
  add_dialogVisible.value = true;
};

const openEdit = (row) => {
  editForm.value = {
    id: row.id,
    company_name: row.company_name || "",
    phone: row.phone || "",
    wechat: row.wechat || "",
    address: row.address || "",
  };
  up_dialogVisible.value = true;
};

// ==================== 重置搜索 ====================
const resetSearch = () => {
  searchForm.value = {
    company_name: "",
    phone: "",
    page: 1,
    page_size: 10,
  };
  getListData();
};

// ==================== 列表 ====================
onMounted(() => {
  getListData();
});

const getListData = async () => {
  loading.value = true;
  const in_data = {
    Type: "get",
    Table: "suppliers",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
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

// ==================== 查询 ====================
const searchEvent = async () => {
  const { company_name, phone } = searchForm.value;

  // 无搜索条件 → 走列表
  if (!company_name && !phone) {
    searchForm.value.page = 1;
    getListData();
    return;
  }

  loading.value = true;
  const in_data = {
    Type: "suppliers_search",
    Table: "suppliers",
    company_name: company_name,
    phone: phone,
  };
  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      tableData.value = res.data || [];
      total.value = (res.data || []).length;
      ElMessage.success("查询成功");
    } else {
      tableData.value = [];
      total.value = 0;
      ElMessage.warning("无匹配数据");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("查询失败");
  } finally {
    loading.value = false;
  }
};

// ==================== 新增 ====================
const add = async () => {
  if (!addForm.value.company_name) {
    ElMessage.warning("请输入公司名称");
    return;
  }

  const in_data = {
    Type: "suppliers_add",
    Table: "suppliers",
    company_name: addForm.value.company_name,
    phone: addForm.value.phone,
    wechat: addForm.value.wechat,
    address: addForm.value.address,
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      ElMessage.success("新建成功");
      add_dialogVisible.value = false;
      getListData();
    } else {
      ElMessage.error(res.status?.error_msg || "新建失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};

// ==================== 更新 ====================
const up = async () => {
  if (!editForm.value.id) {
    ElMessage.warning("缺少ID");
    return;
  }

  const in_data = {
    Type: "suppliers_up",
    Table: "suppliers",
    id: editForm.value.id,
    company_name: editForm.value.company_name,
    phone: editForm.value.phone,
    wechat: editForm.value.wechat,
    address: editForm.value.address,
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      ElMessage.success("更新成功");
      up_dialogVisible.value = false;
      getListData();
    } else {
      ElMessage.error(res.status?.error_msg || "更新失败");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};

// ==================== 删除 ====================
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    `确定要删除【${row.company_name}】这个供应商吗？`,
    "警告",
    { type: "warning" }
  ).catch(() => false);

  if (!confirmResult) return;

  try {
    const res = await api({
      id: row.id,
      Table: "suppliers",
      Type: "delete",
    });
    if (res.status?.error_msg === "success") {
      ElMessage.success("删除成功");
      getListData();
    } else {
      ElMessage.error("删除失败");
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