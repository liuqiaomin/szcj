<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item label="搜索类型" prop="Regional_barcode ">
        <el-select v-model="searchForm.field" clearable placeholder="选择搜索类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="搜索的内容" v-if="searchForm.field">
        <el-input
          v-model="searchForm.content"
          placeholder="请输入要搜索的内容"
          class="handle-input mr10"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="remoteMethod" style="margin-left: -16px"
          >查询搜索
        </el-button></el-form-item
      ><el-form-item>
        <el-button @click="getListData"
          ><el-icon><HelpFilled /></el-icon>重置</el-button
        ></el-form-item
      >
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_LiSt">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="Sort" label="排序" align="center" width="80">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名" align="center" width="200">
        </el-table-column>
        <el-table-column
          prop="Regional_barcode"
          label="商品条码"
          align="center"
          width="120"
        >
        </el-table-column>
        <el-table-column label="商品图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.main_image"
              :z-index="10"
              :preview-src-list="[row.main_image]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="商品分类" align="center" width="100">
        </el-table-column>
        <el-table-column prop="unit_price" label="单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="Purchase_price" label="进货价" align="center" width="100">
        </el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <span>{{ row.product_status == "1" ? "下架" : "上架" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" align="center" width="180">
        </el-table-column>
        <el-table-column prop="specification" label="规格" align="center" width="180">
        </el-table-column>
        <el-table-column
          prop="specification_quantity"
          label="规格数"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column prop="created_time" label="操作时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="活动操作" width="208" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="onShowClick(row)"
              >查看/编辑</el-button
            >
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
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
  field: "", //搜索字段
  content: "", //搜索内容
  page: 1,
  page_size: 100,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
watch(
  () => router.currentRoute.value,
  () => {
    getListData();
  }
);
/**
 * 获取商品列表
 */
const getListData = async () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
  tableData.value = [];
  let in_data = {
    Type: "get",
    Table: "products",
    ORDER_nane: "Sort",
    ORDER_da: "ASC",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data).then((res) => {
    if (res.status.error_msg == "success") {
      tableData.value = res.data;
      total.value = Number(res.page_info.total_items);
    } else {
      ElMessage.error("查询失败！");
    }
  });
};
const add_LiSt = () => {
  router.push({
    path: "/Product/Product_add",
    // query: row,
  });
};
/**
 * 查看按钮点击事件
 */
const onShowClick = (row) => {
  let i = {
    id: row.id,
  };
  router.push({
    path: "/Product/Product_xq",
    query: i,
  });
};
/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.product_name + "】这个商品吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "products",
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
// 查询操作
const options = [
  {
    value: "product_name",
    label: "商品名",
  },
  {
    value: "Regional_barcode",
    label: "商品条码",
  },
  {
    value: "category",
    label: "商品分类",
  },
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "search",
      Table: "products",
      condition_name1: searchForm.value.field,
      condition1: searchForm.value.content,
    };
    await api(in_data)
      .then((res) => {
        setTimeout(() => {
          loading.value = false;
        }, 3000);
        if (res.status.error_msg == "success") {
          tableData.value = res.data;
          total.value = 0;
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
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
