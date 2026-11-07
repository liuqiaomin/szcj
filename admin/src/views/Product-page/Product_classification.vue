<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" @click="openAdd">新增</el-button>
      </el-form-item>
    </el-form>

    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="category_name" label="分类名" align="center" width="120" />
        <el-table-column label="分类图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.image"
              :z-index="10"
              :preview-src-list="[row.image]"
              preview-teleported
            />
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="分类排序" align="center" width="95" />
        <el-table-column prop="created_time" label="创建时间" align="center" width="180" />
        <el-table-column label="操作" width="178" align="center" fixed="right">
          <template #default="{ row }">
            <el-button plain @click="openEdit(row)">编辑</el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增弹窗 -->
      <el-dialog v-model="add_dialogVisible" title="新增分类" width="30%">
        <el-form label-width="80px">
          <el-form-item label="分类名">
            <el-input v-model="searchForm.category_name" placeholder="请输入分类名" />
          </el-form-item>
          <el-form-item label="分类图">
            <el-upload
              class="upload-demo"
              drag
              action="https://sc.szhxch.com/admin/upload"
              :show-file-list="false"
              :before-upload="before_upload"
              :on-success="img_handle"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将jpg/png/webp图片拖到此处，或 <em>点击上传</em>
              </div>
            </el-upload>
            <div v-if="searchForm.image" class="mt-2">
              <el-image
                :src="searchForm.image"
                style="width: 120px; height: 120px"
                fit="cover"
              />
            </div>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="searchForm.sort_order" placeholder="值越小排名越高" />
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button @click="add_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">新建</el-button>
        </template>
      </el-dialog>

      <!-- 编辑弹窗 -->
      <el-dialog v-model="up_dialogVisible" title="编辑分类" width="30%">
        <el-form label-width="80px">
          <el-form-item label="分类名">
            <el-input v-model="searchForm.category_name" placeholder="请输入分类名" />
          </el-form-item>
          <el-form-item label="分类图">
            <el-upload
              class="upload-demo"
              drag
              action="https://sc.szhxch.com/admin/upload"
              :show-file-list="false"
              :before-upload="before_upload"
              :on-success="img_handle"
            >
              <el-icon class="el-icon--upload"><upload-filled /></el-icon>
              <div class="el-upload__text">
                将jpg/png/webp图片拖到此处，或 <em>点击上传</em>
              </div>
            </el-upload>
            <div v-if="searchForm.image" class="mt-2">
              <el-image
                :src="searchForm.image"
                style="width: 120px; height: 120px"
                fit="cover"
              />
            </div>
          </el-form-item>
          <el-form-item label="排序">
            <el-input v-model="searchForm.sort_order" placeholder="值越小排名越高" />
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
import { UploadFilled } from "@element-plus/icons-vue";

// ==================== 数据 ====================
const showSearch = ref(true);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);

const searchForm = reactive({
  id: 0,
  category_name: "",
  sort_order: "",
  image: "",
  page: 1,
  page_size: 10,
});

// ==================== 弹窗控制 ====================
const add_dialogVisible = ref(false);
const up_dialogVisible = ref(false);

const openAdd = () => {
  resetting();
  add_dialogVisible.value = true;
};

const openEdit = (row) => {
  searchForm.id = row.id;
  searchForm.category_name = row.category_name;
  searchForm.sort_order = row.sort_order;
  searchForm.image = row.image;
  up_dialogVisible.value = true;
};

// ==================== 重置 ====================
const resetting = () => {
  searchForm.id = 0;
  searchForm.category_name = "";
  searchForm.sort_order = "";
  searchForm.image = "";
  searchForm.page = 1;
  searchForm.page_size = 10;
};

// ==================== 列表 ====================
onMounted(() => {
  getListData();
});

const getListData = async () => {
  loading.value = true;
  const in_data = {
    Type: "get",
    Table: "ProductCategory",
    ORDER_nane: "sort_order",
    ORDER_da: "ASC",
    page: searchForm.page,
    page_size: searchForm.page_size,
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      tableData.value = res.data || [];
      total.value = Number(res.page_info?.total_items || 0);
    } else {
      ElMessage.error("查询失败！");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  } finally {
    loading.value = false;
  }
};

// ==================== 图片上传 ====================
const before_upload = (file) => {
  const isImage = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!isImage) {
    ElMessage.error("请上传 jpg / png / webp 图片！");
  }
  return isImage;
};

const img_handle = (response) => {
  console.log("上传返回:", response);
  if (response && response.code === 0) {
    searchForm.image = response.data.url;
    ElMessage.success(response.msg || "上传成功");
  } else {
    ElMessage.error(response?.msg || "上传失败");
  }
};

// ==================== 新增 ====================
const add = async () => {
  if (!searchForm.category_name) {
    ElMessage.warning("请输入分类名");
    return;
  }

  const in_data = {
    Type: "ProductCategory_add",
    Table: "ProductCategory",
    category_name: searchForm.category_name,
    sort_order: searchForm.sort_order || 0,
    image: searchForm.image || "",
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      ElMessage.success("新建成功");
      add_dialogVisible.value = false;
      resetting();
      getListData();
    } else {
      ElMessage.error(res.status?.error_msg || "新建失败！");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};

// ==================== 更新 ====================
const up = async () => {
  if (!searchForm.id) {
    ElMessage.warning("缺少分类ID");
    return;
  }

  const in_data = {
    Type: "ProductCategory_up",
    Table: "ProductCategory",
    id: searchForm.id,
    category_name: searchForm.category_name,
    sort_order: searchForm.sort_order || 0,
    image: searchForm.image || "",
  };

  try {
    const res = await api(in_data);
    if (res.status?.error_msg === "success") {
      ElMessage.success("更新成功");
      up_dialogVisible.value = false;
      resetting();
      getListData();
    } else {
      ElMessage.error(res.status?.error_msg || "更新失败！");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};

// ==================== 删除 ====================
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    `确定要删除【${row.category_name}】这个分类吗？`,
    "警告",
    { type: "warning" }
  ).catch(() => false);

  if (!confirmResult) return;

  try {
    const res = await api({
      id: row.id,
      Table: "ProductCategory",
      Type: "delete",
    });
    if (res.status?.error_msg === "success") {
      ElMessage.success("删除成功");
      getListData();
    } else {
      ElMessage.error("删除失败！");
    }
  } catch (err) {
    console.error(err);
    ElMessage.error("请求失败");
  }
};
</script>

<style lang="scss" scoped>
.home-box {
  .mt-2 {
    margin-top: 10px;
  }

  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 13%;
  }
}
</style>