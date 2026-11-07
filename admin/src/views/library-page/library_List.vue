<template>
  <div class="home-box">
    <!-- <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" :icon="Plus" @click="add_LiSt">新增</el-button>
      </el-form-item>
    </el-form> -->
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="creator" label="创建人" align="center" width="102">
        </el-table-column>
        <el-table-column prop="state" label="审核状态" fixed="left" align="center" width="90">
        </el-table-column>

        <el-table-column prop="supplier" label="供应商" align="center" width="200">
        </el-table-column>
        <el-table-column prop="supplier_id" label="供应商ID" align="center" width="120">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名" align="center" width="120">
        </el-table-column>
        <el-table-column prop="product_id" label="商品ID" align="center" width="120">
        </el-table-column>
        <el-table-column label="商品图" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.product_image" :z-index="10" :preview-src-list="[row.product_image]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="product_category" label="商品分类" align="center" width="100">
        </el-table-column>
        <el-table-column prop="specification" label="规格" align="center" width="180">
        </el-table-column>
        <el-table-column prop="specification_number" label="规格数" align="center" width="180">
        </el-table-column>
        <el-table-column prop="unit_price" label="入库单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="quantity" label="入库数量" align="center" width="180">
        </el-table-column>
        <el-table-column prop="total" label="金额" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="170">
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
    Table: "warehouse_entry_application_form",
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
// const add_LiSt = () => {
//   router.push({
//     path: "/library/library_add",
//     // query: row,
//   });
// };

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
