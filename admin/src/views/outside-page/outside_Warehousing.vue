<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <div style="padding: 15px">
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
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="getListData"><el-icon>
              <HelpFilled />
            </el-icon>重置</el-button>
        </el-form-item>

        <el-form-item label="选择日期">
          <el-date-picker v-model="searchForm.time" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
  <div class="home-box">
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
        <el-table-column label="操作" width="98" align="center" fixed="left">
          <template #default="{ row }">
            <el-button plain @click="up_bu(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />
    </el-card>
    <el-dialog v-model="up_dialogVisible" title="编辑" width="30%">
      <el-form label-position="top">
        <el-form-item label="入库单价" prop="unit_price">
          <el-input v-model="searchForm.row.unit_price" placeholder="请输入入库单价"></el-input>
        </el-form-item>
        <el-form-item label="入库数量" prop="quantity">
          <el-input v-model="searchForm.row.quantity" placeholder="请输入入库数量"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="up_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="up">保存更新</el-button>
        </span>
      </template>
    </el-dialog>
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

  time: "",
  page: 1,
  page_size: 100,

  row: ''
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
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
const outexxx = async () => {
  if (searchForm.value.time) {
    loading.value = true;
    let p = {
      time: searchForm.value.time,
    };
    await api({ ...p, Type: 'exportWarehouseEntry' })
      .then((res) => {
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
  } else {
    ElMessage.error("请输入时间！");
  }
};
//编辑账号
const up_dialogVisible = ref(false);
const up_bu = (row) => {
  searchForm.value.row = row;
  up_dialogVisible.value = true;
};
const up = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "warehouse_entry_application_form_up",
    Table: "warehouse_entry_application_form",
    id: searchForm.value.row.id,
    unit_price: searchForm.value.row.unit_price,
    quantity: searchForm.value.row.quantity,
  };
  loading.value = true;
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        up_dialogVisible.value = false;
        loading.value = false;
        getListData();
      } else {
        ElMessage.error("更新失败！");
      }
    })
    .catch((err) => { });
};
// 查询操作
const options = [
  {
    value: "product_name",
    label: "商品名",
  },
  {
    value: "supplier",
    label: "供应商",
  },
  {
    value: "product_category",
    label: "商品分类",
  },
  {
    value: "created_time",
    label: "创建时间",
  },
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "search",
      Table: "warehouse_entry_application_form",
      condition_name1: searchForm.value.field,
      condition1: searchForm.value.content,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
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
