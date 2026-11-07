<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <div style="padding: 15px">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="searchForm.time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="warning" :icon="Plus" @click="outexxx">导出表格</el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="product_name" label="商品名" align="center" width="250">
        </el-table-column>
        <el-table-column prop="Receiptprice" label="入库价" align="center" width="90">
        </el-table-column>
        <el-table-column prop="totalcost" label="总成本" align="center" width="90">
        </el-table-column>
        <el-table-column prop="Totalprofit" label="总利润" align="center" width="90">
        </el-table-column>
        <el-table-column prop="level_price" label="单价" align="center" width="200">
        </el-table-column>
        <el-table-column
          prop="product_quantity"
          label="出售数量"
          align="center"
          width="120"
        >
        </el-table-column>

        <el-table-column
          prop="product_specification"
          label="规格"
          align="center"
          width="190"
        >
        </el-table-column>
        <el-table-column prop="product_unit" label="单位" align="center" width="120">
        </el-table-column>
        <el-table-column prop="total_price" label="总价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="下单时间" align="center" width="170">
        </el-table-column>
        <el-table-column prop="identifying" label="分店ID" align="center" width="170">
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
  time: "",
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
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "Jsearch",
    Table: "orders",
    ORDER_nane: "created_time",
    ORDER_da: "desc",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    condition_name1: "state",
    condition1: 0,
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
    await api({ ...p, Type: 'exportOrderShipment' })
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
