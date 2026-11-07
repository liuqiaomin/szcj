<template>
  <div class="user-info-container">
    <el-card class="print-box">
      <el-form :inline="true">
        <el-form-item label="客户名称：">
          <el-button text disabled>{{ form.customers_list.customer_name }}</el-button>
        </el-form-item>
        <el-form-item label="客户等级：">
          <el-button text disabled>{{ form.customers_list.customer_level }}</el-button>
        </el-form-item>

        <el-form-item label="客户电话：">
          <el-button text disabled>{{ form.customers_list.customer_phone }}</el-button>
        </el-form-item>
        <el-form-item label="客户地址：">
          <el-button text disabled>{{ form.customers_list.customer_address }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div>
        <div id="userInfoBox" class="user-info-box">
          <!-- 标题 -->
          <h2 class="title">深圳餐具--退货单</h2>
          <el-row :gutter="20">
            <el-col :span="4"
              ><div />
              客户： {{ form.customers_list.customer_name }}</el-col
            >
            <el-col :span="8"
              ><div />
              经手人:{{ form.customers_list.created_by }}</el-col
            >
            <el-col :span="10"
              ><div />
              订单日期:{{ form.customers_list.created_time }}</el-col
            >
          </el-row>
          <div class="body">
            <!-- 内容渲染表格 -->
            <el-table
              :data="tableData"
              v-loading="loading"
              element-loading-text="加载中..."
              border
              class="foot"
              show-summary
            >
              <el-table-column type="index" label="NO" align="center" width="80" />
              <el-table-column
                prop="product_name"
                label="货品名称"
                align="center"
                width="303"
              >
              </el-table-column>
              <el-table-column
                prop="product_specification"
                label="规格"
                align="center"
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="product_unit"
                label="单位"
                align="center"
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="product_quantity"
                label="数量"
                align="center"
                width="100"
              >
              </el-table-column>
              <el-table-column prop="level_price" label="单价" align="center" width="100">
              </el-table-column>
              <el-table-column prop="total_price" label="总价" align="center" width="100">
              </el-table-column>
              <el-table-column label="备注" align="center"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "accountDetail",
};
</script>
<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { api } from "@/api/api";
const route = useRoute();
const order_list_id = route.query.id;
const loading = ref(false);
const form = reactive({
  customers_list: []
});
onMounted(() => {
  order_list_xq();
});
/**
 * 获取开单详情列表
 */
const tableData = ref([]); //下单列表
const order_list_xq = async () => {
  let in_data = {
    Type: "id_get",
    Table: "orders_th",
    id: order_list_id,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        form.customers_list = res.data;
        tableData.value = JSON.parse(res.data.tableData);
        get_tableData();
      } else {
        ElMessage.error("查询失败！");
      }
    })
    .catch((err) => {});
};
</script>
<style lang="scss" scoped>
/* 设置表格文字大小 */
.el-table {
  font-size: 21px;
  font-weight: bold; /* 设置文字加粗 */
}

/* 设置表格文字颜色 */
.el-table th {
  color: #333;
}
::v-deep .el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
}
@media print {
  @page {
    /* 去掉页眉页脚*/
    margin-top: 0;
    margin-bottom: 0;
  }

  /*打印不显示打印按钮*/
  .print-button-container {
    display: none !important;
  }
}

.user-info-box {
  width: 1124px;
  margin: 0 auto;
  .title {
    text-align: center;
    margin-bottom: 10px;
  }
  .foot {
    margin-top: 42px;
  }
  .foot2 {
    margin-top: 9px;
    border: none !important;
    box-shadow: none !important;
    font-size: 15px;
  }
}
table {
  border-collapse: collapse; /* 折叠边框，使得表格单元格之间的边框不会重叠 */
  width: 70%; /* 表格宽度 */
}

th,
td {
  border: 8px solid black; /* 为表格头和单元格添加1px宽的黑色实线边框 */
  padding: 4px; /* 单元格内边距 */
  text-align: left; /* 文本左对齐 */
}

th {
  background-color: #f2f2f2; /* 表格头背景色，可选 */
}
/* 深作用域选择器用于自定义Element UI表格样式 */
::v-deep .el-table__body tr td,
::v-deep .el-table__body tr th,
::v-deep .el-table__header thead th {
  color: black;
}

/* 设置表格单元格的边框颜色 */
::v-deep .el-table::before,
::v-deep .el-table::after,
::v-deep .el-table tbody tr,
::v-deep .el-table tbody tr td,
::v-deep .el-table tbody tr th,
::v-deep .el-table thead tr,
::v-deep .el-table thead tr th {
  border: 1px solid black; /* 已经设置的边框颜色 */
}

/* 添加以下代码来设置表格四周的边框 */
::v-deep .el-table {
  border: 1px solid black; /* 这里设置边框宽度为1px，样式为实线，颜色为黑色 */
  border-top: 1px solid black; /* 如果需要单独设置顶部边框，可以添加这一行 */
  // border-right: 2px solid black; /* 如果需要单独设置右侧边框，可以添加这一行 */
  // border-bottom: 2px solid black; /* 如果需要单独设置底部边框，可以添加这一行 */
  // border-left: 2px solid black; /* 如果需要单独设置左侧边框，可以添加这一行 */
}

::v-deep .el-table__footer-wrapper tbody td.el-table__cell,
.el-table__header-wrapper tbody td.el-table__cell {
  background-color: var(--el-table-row-hover-bg-color);
  color: #030303;
}
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
