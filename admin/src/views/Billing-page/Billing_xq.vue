<template>
  <div class="user-info-container">
    <el-card class="order-card">
      <el-form :inline="true" :model="form">
        <el-form-item label="请输入订单ID">
          <el-input size='medium' v-model="form.order_list_id" placeholder="请输入订单ID" class="handle-input mr10"
            clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="order_list_xq" style="margin-left: -16px">查询
          </el-button>
        </el-form-item>
      </el-form>
      <div class="header">
        <h1>订单状态：{{ form.order_list_data.state == 0 ? '待分配' : form.order_list_data.state == 2 ? '配送中'
          : form.order_list_data.state == 3 ? '已完成' : form.order_list_data.state == 5 ? '退货中' :
          form.order_list_data.state
          == 6 ? '退单申请中' : form.order_list_data.state == 7 ? '已取消' : '其他' }}</h1>
        <div style="padding-top: 10px;"></div>
        <div class="info-item">
          订单号： {{ form.order_list_data.id }}
        </div>
        <div class="info-item">
          订单类型： {{ form.order_list_data.XY == 0 ? '线下订单' : '小程序订单' }}--- {{ form.order_list_data.mode == 0 ? '配送' : '自提'
          }}
        </div>
        <div class="info-item">
          下单时间： {{ form.order_list_data.created_time }}---{{ form.order_list_data.created_by }}
        </div>
        <div class="info-item">
          抢单时间： {{ form.order_list_data.rob_time }}---{{ form.order_list_data.delivery_person }}
        </div>
        <div class="info-item">
          送达时间： {{ form.order_list_data.reach_time }}---{{ form.order_list_data.delivery_person }}
        </div>
        <div class="info-item" v-if="form.order_list_data.is_paid_name">
          财务收款审核： {{ form.order_list_data.is_paid_time }}---{{ form.order_list_data.is_paid_name }}
        </div>
        <div class="info-item" v-if="form.order_list_data.out_trade_num">
          微信支付订单号： {{ form.order_list_data.out_trade_num }}
        </div>

      </div>
    </el-card>

    <el-card class="print-box">
      <el-form :model="form" width="auto" style="max-width: 600px">
        <el-form-item label="第一行">
          <el-input v-model="form.foot21" />
        </el-form-item>
        <el-form-item label="第二行">
          <el-input v-model="form.foot22" />
        </el-form-item>
      </el-form>

      <el-row :gutter="38">
        <el-col :span="28">
          <el-form-item label="表头控制">
            <el-row :gutter="21">
              <el-col :span="3">
                <el-form-item label="序号">
                  <el-switch v-model="form.switchs_list.a" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="名称">
                  <el-switch v-model="form.switchs_list.b" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="规格">
                  <el-switch v-model="form.switchs_list.c" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="单位">
                  <el-switch v-model="form.switchs_list.d" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="数量">
                  <el-switch v-model="form.switchs_list.e" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="单价">
                  <el-switch v-model="form.switchs_list.f" />
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item label="总价">
                  <el-switch v-model="form.switchs_list.g" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-button type="primary" v-print="printObj" :loading="printLoading">打印</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <div>
        <div id="userInfoBox" class="user-info-box">
          <!-- 标题 -->
          <h2 class="title">深圳餐具发货单</h2>
          <el-descriptions>
            <el-descriptions-item label="订单ID：">{{ form.order_list_id }}</el-descriptions-item>
            <el-descriptions-item label="订单类型：">
              <el-tag size="small"> {{ form.order_list_data.XY == 0 ? '线下订单' : '小程序订单' }}--- {{
                form.order_list_data.mode == 0 ? '配送' :
                '自提'
                }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="经手人:">{{ form.order_list_data.created_by }}</el-descriptions-item>
            <el-descriptions-item label="订单日期">{{ form.order_list_data.created_time }}</el-descriptions-item>
            <el-descriptions-item label="客户：">{{ form.order_list_data.customer_name }}</el-descriptions-item>
            <el-descriptions-item label="客户地址：">{{ form.order_list_data.customer_address }}</el-descriptions-item>
          </el-descriptions>
          <div style="padding-top: 15px;"></div>
          <div class="body">
            <!-- 内容渲染表格 -->
            <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border class="foot"
              show-summary>
              <el-table-column v-if="form.switchs_list.a" type="index" label="序号" width="103" align="center" />
              <el-table-column v-if="form.switchs_list.b" prop="product_name" label="名称" align="center" width="303">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.b" prop="Regional_barcode" label="编码" align="center">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.c" prop="product_specification" label="规格" align="center">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.d" prop="product_unit" label="单位" align="center">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.e" prop="product_quantity" label="数量" align="center">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.f" prop="level_price" label="单价" align="center">
              </el-table-column>
              <el-table-column v-if="form.switchs_list.g" prop="total_price" label="总价" align="center">
              </el-table-column>
              <el-table-column label="备注" align="center"> </el-table-column>
            </el-table>
          </div>
          <div class="header">
            <div class="foot2">
              <h1>订单总价 ： {{ form.order_list_data.order_total_price }}</h1>
            </div>

            <div class="foot2">
              优惠信息： <div v-for="(item, index) in form.Coupons_list" :key="index">{{ item }}</div>
            </div>
            <div class="foot2">
              订单备注： {{ form.order_list_data.remarks }}
            </div>
            <div class="foot2">
              {{ form.foot21 }}
            </div>
            <div class="foot2">
              {{ form.foot22 }}
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="order-card">
      <h5 class="title">签收图片</h5>
      <el-row :gutter="10">
        <el-col :span="4" v-for="(item, index) in form.receipt_photo_list" :key="index" class="image-col">
          <el-image class="image-item" style="width: 100%; height: auto" :src="item"
            :preview-src-list="form.receipt_photo_list"></el-image>
        </el-col>
      </el-row>
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

const loading = ref(false);
const form = reactive({
  receipt_photo_list: [],
  Coupons_list: [],
  foot21: "请核对规格和数量无误后签名，付款，谢谢！",
  foot22: "如遇搞错型号或质量问题，请于两天内来电核查更换！TEL：13510398108",
  order_list_data: [],
  switchs_list: {
    a: true,
    b: true,
    c: true,
    d: true,
    e: true,
    f: true,
    g: true,
    h: true,
  },
  order_list_id: ""
})
onMounted(() => {
  form.order_list_id = route.query.id;
  order_list_xq();
});
/**
 * 获取开单详情列表
 */
const order_list_xq = async () => {
  if (!form.order_list_id) {
    ElMessage.error("请输入订单ID！");
    return
  }
  let in_data = {
    Type: "id_get",
    Table: "order_list",
    id: form.order_list_id,
  };
  await api(in_data)
    .then((res) => {
      if (res.status.error_msg == "success") {

        const o = res.data;
        form.order_list_data = o;
        form.time = res.status.time;
        form.receipt_photo_list = o.receipt_photo_list ? JSON.parse(o.receipt_photo_list) : '';
        form.Coupons_list = o.Coupons_list ? JSON.parse(o.Coupons_list) : '';
        get_tableData();
      } else {
        ElMessage.error("查询失败！");
      }
    })
    .catch((err) => { });
};
/**
 * 获取预下单列表
 */
const tableData = ref([]); //下单列表
const get_tableData = async () => {
  loading.value = true;
  let in_data = {
    Type: "search",
    Table: "orders",
    condition_name1: "Yid",
    condition1: form.order_list_data.order_list_id,
    page_size: 10000,

  };
  await api(in_data)
    .then((res) => {
      loading.value = false;
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = [];
          tableData.value = res.data;
        }, 600);
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};
// 打印相关
const printLoading = ref(false);
const printObj = {
  // 打印区域
  id: "userInfoBox",
  // 打印标题
  popTitle: "深圳餐具",
  // 打印前
  beforeOpenCallback(vue) {
    printLoading.value = true;
  },
  // 执行打印
  openCallback(vue) {
    printLoading.value = false;
  },
};
</script>
<style lang="scss" scoped>
.order-card {
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header {
  padding: 15px;
  background-color: #f9f9f9;
  border-bottom: 1px solid #ebeef5;
}

.info-item {
  margin-bottom: 10px;
  color: #606266;
  font-size: 14px;
}

.title {
  padding: 0 15px;
  margin: 0;
  color: #333;
  font-weight: normal;
}

.image-col {
  padding: 5px;
}

.image-item {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.image-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image-item {
  margin: 5px;
}

/* 设置表格文字大小 */
.el-table {
  font-size: 20px; // 指定具体像素值
  font-weight: bold;
  /* 设置文字加粗 */
}

/* 设置表格文字颜色 */
.el-table th {
  color: #333;
}

::v-deep .el-table .cell {
  box-sizing: border-box;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; // 设置为 nowrap 以配合 text-overflow: ellipsis;
  word-break: break-all;
  line-height: 20px;
}

.print-box {
  margin-bottom: 20px;
  text-align: right;
}

.user-info-box {
  width: 100%; // 调整为100%以适应打印
  margin: 0 auto;

  .title {
    text-align: center;
    margin-bottom: 10px;
  }

  .foot {
    margin-top: 2px;
  }

  .foot2 {
    margin-top: 9px;
    border: none !important;
    box-shadow: none !important;
    font-size: 15px;
  }
}

table {
  border-collapse: collapse;
  /* 折叠边框，使得表格单元格之间的边框不会重叠 */
  width: 100%; // 调整为100%以适应打印
}

th,
td {
  border: 4px solid black;
  /* 为表格头和单元格添加1px宽的黑色实线边框 */
  padding: 8px;
  /* 单元格内边距 */
  text-align: left;
  /* 文本左对齐 */
}

th {
  background-color: #f2f2f2;
  /* 表格头背景色，可选 */
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
  border: 1px solid black;
  /* 已经设置的边框颜色 */
}

/* 添加以下代码来设置表格四周的边框 */
::v-deep .el-table {
  border: 1px solid black;
  /* 这里设置边框宽度为1px，样式为实线，颜色为黑色 */
  border-top: 1px solid black;
  /* 如果需要单独设置顶部边框，可以添加这一行 */
  border-right: 1px solid black;
  /* 如果需要单独设置右侧边框，可以添加这一行 */
  border-bottom: 1px solid black;
  /* 如果需要单独设置底部边框，可以添加这一行 */
  border-left: 1px solid black;
  /* 如果需要单独设置左侧边框，可以添加这一行 */
}

::v-deep .el-table__footer-wrapper tbody td.el-table__cell,
.el-table__header-wrapper tbody td.el-table__cell {
  background-color: var(--el-table-row-hover-bg-color);
  color: #030303;
}

/* 设置打印样式 */
@media print {
  @page {
    size: a5 landscape;
    margin: 10mm;
  }

  /* 隐藏非必要内容 */
  .no-print {
    display: none !important;
  }

  /* 调整标题样式 */
  .title {
    font-size: 12px;
    margin-bottom: 5px;
  }

  /* 调整表格样式 */
  .el-table {
    font-size: 7px; // 进一步减小字体大小
    border: 0.2px solid black; // 减小边框宽度
  }

  .el-table th,
  .el-table td {
    padding: 0.5px; // 进一步减小单元格内边距
    border: 0.2px solid black; // 减小边框宽度
  }

  /* 调整行高和单元格内边距 */
  .el-table__body tr td,
  .el-table__header tr th {
    line-height: 1.2;
  }

  /* 控制分页 */
  .el-table__body tr {
    page-break-inside: avoid;
  }

  /* 强制每页表格开始时都打印表头 */
  .el-table__header {
    display: table-header-group;
    page-break-before: always;
  }

  /* 调整底部信息样式 */
  .foot2 {
    font-size: 7px;
    margin-top: 5px;
  }
}
</style>