<template>
  <div class="home-box">
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="product_name" label="商品名" width="330" align="r">
        </el-table-column>
        <el-table-column label="商品图" align="center" width="95">
          <template #default="{ row }">
            <el-image
              class="avatar"
              :src="row.product_image"
              :z-index="10"
              :preview-src-list="[row.product_image]"
              preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="原库存" width="130" align="center">
        </el-table-column>
        <el-table-column prop="stock2" label="盘点库存" width="130" align="center">
        </el-table-column>
        <el-table-column
          prop="product_specifications"
          label="规格"
          width="130"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="product_unit" label="单位" width="130" align="center">
        </el-table-column>
        <el-table-column prop="created_by" label="盘点人" width="130" align="center">
        </el-table-column>
        <el-table-column prop="created_time" label="盘点时间" width="200" align="center">
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
import { useRoute, useRouter } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
console.log(route.query.id);

let id = route.query.id;
//数据源
const searchForm = reactive({
  id: "",
  page: 1,
  page_size: 100,
});

onMounted(() => {
  getListData();
});
const tableData = ref([]);
const loading = ref(false);
const total = ref(0);
/**
 * 获取列表
 */
const getListData = async () => {
  loading.value = true;
  tableData.value = [];
  let in_data = {
    Type: "search",
    Table: "Inventory_lsit",
    condition_name1: "Inventory_id",
    condition1: route.query.id,
    page: searchForm.page,
    page_size: searchForm.page_size,
  };
  console.log(route.query.id);
  await api(in_data)
    .then((res) => {
      console.log(res);
      tableData.value = res.data;
      total.value = Number(res.page_info.total_items);
      setTimeout(() => {
        loading.value = false;

      }, 1000);
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
    border-radius: 5%;
  }
}
</style>
