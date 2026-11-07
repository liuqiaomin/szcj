<template>
  <div class="home-box">
    <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
  </div>
  <div class="home-box">
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
    Type: "get",
    Table: "products",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data)
    .then((res) => {
      loading.value = false;
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.data;
          total.value = Number(res.page_info.total_items);
        }, 200);
      } else {
        options.value = [];
        searchForm.selectedValue = "";
        ElMessage.error("无数据！");
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};
const add_LiSt = () => {
  router.push({
    path: "/warehouse/add",
    // query: row,
  });
};
const outexxx = async () => {
  loading.value = true;
  let p = {
    time: searchForm.value.time,
  };
  await api({ ...p, Type: 'exportProductStock' })
    .then((res) => {
      console.log(res);
      loading.value = false;
      if (res.status.error_code == 0) {
        ElMessage.success(res.status.error_msg);
        window.location.replace(res.data);
      } else {
        ElMessage.error(res.status.error_msg);
      }
    })
    .catch((err) => {
      loading.value = false;
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
