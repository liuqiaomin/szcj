<template>
  <div class="user-info-container">
    <el-card>
      <el-form :inline="true">
        <el-form-item label="选择客户" prop="company_name">
          <el-select v-model="form.Customer_Name" filterable remote reserve-keyword placeholder="输入客户名称"
            :remote-method="customers_remoteMethod" :loading="loading" style="width: 240px" clearable
            @change="handleSelectChange">
            <el-option v-for="item in customersoptions" :key="item.id" :label="item.customer_name"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户等级：" v-if="form.customers_list">
          <el-button text disabled>{{ form.customers_list.level }}</el-button>
        </el-form-item>
        <el-form-item label="客户类型：" v-if="form.customers_list">
          <el-button text disabled>{{ form.customers_list.type }}</el-button>
        </el-form-item>
        <el-form-item label="客户电话：" v-if="form.customers_list">
          <el-button text disabled>{{ form.customers_list.phone }}</el-button>
        </el-form-item>
        <el-form-item label="客户地址：" v-if="form.customers_list">
          <el-button text disabled>{{ form.customers_list.address }}</el-button>
        </el-form-item>
      </el-form>

      <el-divider v-if="form.customers_list" border-style="dashed" />
      <el-image v-if="form.product_list.main_image" :src="form.product_list.main_image" class="main_image"></el-image>
      <el-form :inline="true" v-if="form.customers_list">
        <el-form-item label="选择商品" prop="form.products_Name">
          <el-select v-model="form.products_Name" filterable remote reserve-keyword placeholder="搜索商品"
            :remote-method="products_remoteMethod" :loading="loading" clearable style="width: 240px"
            @change="products_handleSelectChange">
            <el-option v-for="item in productsoptions" :key="item.id" :label="item.product_name"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货数量：" v-if="form.product_list">
          <el-input-number placeholder="发货数量" v-model="form.product_list.F_stocks" :min="0"
            :max="parseInt(form.product_list.stock)" @change="F_stock" />
        </el-form-item>

        <el-form-item v-if="form.product_list">
          <el-button type="warning" @click="add">添加</el-button>
        </el-form-item>
        <el-form-item v-if="form.product_list">
          <el-form-item label="规格：">
            <el-button text disabled>{{ form.product_list.specification }}</el-button>
          </el-form-item>

          <el-form-item label="单位：">
            <el-button text disabled>{{
              form.product_list.specification_quantity
              }}</el-button>
          </el-form-item>
          <el-form-item label="库存数量：">
            <el-button text disabled>{{ form.product_list.stock }}</el-button>
          </el-form-item>
          <el-form-item label="原单价：">
            <el-button text disabled>{{ form.product_list.unit_price }}</el-button>
          </el-form-item>
          <el-form-item label="等级单价：" v-if="form.product_list">
            <el-input-number placeholder="等级单价" :min="0" v-model="form.product_list.level_price"
              @change="F_level_price" />
          </el-form-item>
          <el-form-item label="总价：">
            <el-button text type="danger">{{ form.product_list.Total_price }}</el-button>
          </el-form-item></el-form-item>
      </el-form>
      <el-divider v-if="form.CX_list" border-style="dashed" />
      <el-form :inline="true" v-if="form.CX_list">
        <el-form-item label="最近订单"></el-form-item>
        <el-form-item v-if="form.CX_list">
          <el-form-item label="名称">
            <el-button text disabled>{{ form.CX_list.product_name }}</el-button>
          </el-form-item>

          <el-form-item label="数量">
            <el-button text disabled>{{ form.CX_list.product_quantity }}</el-button>
          </el-form-item>
          <el-form-item label="下单价格：">
            <el-button text disabled>{{ form.CX_list.level_price }}</el-button>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-button text type="danger">{{ form.CX_list.created_time }}</el-button>
          </el-form-item></el-form-item>
      </el-form>
    </el-card>

    <el-card class="print-box" v-if="form.customers_list">
      <el-card class="print-box" v-if="form.customers_list">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="优惠描述">
              <el-input v-model="form.Coupons_ms" placeholder="请输入优惠描述  如:优惠10元" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="优惠金额">
              <el-input tp v-model="form.Coupons_number" placeholder="请输入优惠金额" type='number' clearable></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="28">
          <el-col>
            <el-form-item label="订单备注" prop="remarks">
              <el-input v-model="form.remarks" type="textarea" :rows="4"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <div><el-switch v-model="form.mode" active-text="客户自提" inactive-text="线下配送">
              </el-switch></div>
            <el-button type="warning" @click="order_list_add" style="margin-left: -16px">下单</el-button>
          </el-col>
        </el-row>
      </el-card>
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
              <el-col :span="3">
                <el-form-item label="操作">
                  <el-switch v-model="form.switchs_list.h" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>


      <div id="userInfoBox" class="user-info-box border">
        <!-- 标题 -->
        <h2 class="title">发货单</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="开单日期" align="center">{{
            form.Invoice_date
            }}</el-descriptions-item>
          <el-descriptions-item label="开单人" align="center">{{
            store.getters.userInfo.admin_nick_name
            }}</el-descriptions-item>
          <el-descriptions-item label="客户名称" align="center">{{
            form.customers_list.customer_name
            }}</el-descriptions-item>
          <el-descriptions-item label="客户手机号" align="center">{{
            form.customers_list.phone
            }}</el-descriptions-item>
          <el-descriptions-item label="客户地址" :span="2">{{
            form.customers_list.address
            }}</el-descriptions-item>
        </el-descriptions>

        <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border show-summary>
          <el-table-column v-if="form.switchs_list.a" type="index" label="序号" align="center" />
          <el-table-column v-if="form.switchs_list.b" prop="product_name" label="货品名称" align="center">
          </el-table-column>
          <el-table-column v-if="form.switchs_list.b" prop="Regional_barcode" label="编码" align="center">
          </el-table-column>
          <el-table-column v-if="form.switchs_list.c" prop="product_specification" label="规格" align="center"
           >
          </el-table-column>
          <el-table-column v-if="form.switchs_list.d" prop="product_unit" label="单位" align="center">
          </el-table-column>
          <el-table-column v-if="form.switchs_list.e" prop="product_quantity" label="数量" align="center">
          </el-table-column>
          <el-table-column v-if="form.switchs_list.f" prop="level_price" label="单价" align="center">
          </el-table-column>
          <el-table-column v-if="form.switchs_list.g" prop="total_price" label="总价" align="center">
          </el-table-column>
          <el-table-column label="操作" v-if="form.switchs_list.h" width="108" align="center" fixed="right">
            <template #default="{ row }">
              <el-button type="danger" plain @click="deletes(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Billing_application",
};
</script>
<script setup>
import { useRoute, useRouter } from "vue-router";
import { ref, reactive, onMounted } from "vue";
import { ElMessageBox, ElMessage } from "element-plus";
import { api } from "@/api/api";
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
console.log(store.getters.userInfo);
const loading = ref(false);
const form = reactive({
  mode: false,//0 配送  1  自取
  CX_level: "",
  CX_list: "",
  customers_list: "",
  Customer_Name: "", //客户名称
  products_Name: "", //客户名称
  product_list: "",
  Invoice_date: new Date().toISOString().split("T")[0], //开单日期
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
  Coupons_ms: '',
  Coupons_number: '',
  remarks: ''//订单备注
});
onMounted(() => {
  // let o = {};
  // tableData.value.push(o);
});

//客户搜索
const customersoptions = ref([]); //搜索结果
const tableData = ref([]); //下单列表
const customers_remoteMethod = async (query) => {
  if (query) {
    productsoptions.value = "";
    form.customers_list = "";
    form.product_list = "";

    loading.value = true;
    let in_data = {
      Type: "search",
      Table: "customers",
      condition_name1: "customer_name",
      condition1: query,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          customersoptions.value = res.data;
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
//客户选择
const handleSelectChange = (selectedItem) => {
  if (selectedItem) {
    form.customers_list = selectedItem;
    form.Customer_Name = selectedItem.customer_name;
    get_preorder();
  } else {
    form.customers_list = "";
    customersoptions.value = "";
  }
};

/**
 * 获取预下单列表
 */
const get_preorder = async () => {
  loading.value = true;
  tableData.value = [];
  let in_data = {
    Type: "search",
    Table: "preorder",
    condition_name1: "Yid",
    condition1: form.customers_list.id + store.getters.userInfo.admin_id,
    page_size: 1000,
  };
  await api(in_data)
    .then((res) => {
      loading.value = false;
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.data;
        }, 500);
      }
    })
    .catch((err) => {
      loading.value = false;
    });
};

//商品搜索
const productsoptions = ref([]); //搜索结果
const products_remoteMethod = async (query) => {
  if (query) {
    productsoptions.value = "";
    form.product_list = "";
    loading.value = true;
    let in_data = {
      Type: "product_name_search",
      Table: "products",
      condition_name1: "product_name",
      condition1: query,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          productsoptions.value = res.data;
        } else {
          ElMessage.error("无数据！");
        }
      })
      .catch((err) => {
        loading.value = false;
      });
  }
};
//商品选择
const products_handleSelectChange = (selectedItem) => {
  if (selectedItem) {
    let level = form.customers_list.level;
    let tp;
    orders_customers_id(form.customers_list.id, selectedItem.id);
    if (level == "一级") {
      tp = selectedItem.retail_price;
    } else if (level == "二级") {
      tp = selectedItem.grocery_price;
    } else if (level == "三级") {
      tp = selectedItem.department_store_price;
    } else if (level == "四级") {
      tp = selectedItem.wholesale_price;
    }
    let o = {
      product_id: selectedItem.id, //商品ID
      Purchase_price: selectedItem.Purchase_price, //商品入库价
      product_name: selectedItem.product_name, //商品名
      specification: selectedItem.specification, //规格
      specification_quantity: selectedItem.specification_quantity, //单位
      stock: selectedItem.stock, //总库存
      unit_price: selectedItem.unit_price, //原价
      main_image: selectedItem.main_image, //图片
      level_price: tp, //等级价
      Total_price: tp, //总价
      Regional_barcode: selectedItem.Regional_barcode, //商品编码
      F_stocks: 1,
    };

    form.product_list = o;

    form.products_Name = selectedItem.product_name;
  } else {
    productsoptions.value = "";
    form.product_list = "";
  }
};

//查询最近下单
const orders_customers_id = async (a, s) => {
  form.CX_level = "";
  form.CX_list = "";
  const p = {
    Type: "orders_customers_id",
    Table: "orders",
    customers_id: a,
    product_id: s,
  };
  await api(p)
    .then((res) => {
      if (res.status.error_msg == "success") {
        form.CX_level = res.data.level_price;
        form.CX_list = res.data;
        form.product_list.level_price = res.data.level_price; //等级价
        form.product_list.Total_price = res.data.level_price; //总价

        console.log("无购买记录11", res.data.level_price, form.product_listlevel_price);
      } else {
        return false;
        console.log("无购买记录");
      }
    })
    .catch((err) => { });
};
//输入框
const F_stock = () => {
  let p = form.product_list;
  if (p.F_stocks) {
    let p = form.product_list;
    if (parseInt(p.F_stocks) <= parseInt(p.stock)) {
      p.Total_price = (p.F_stocks * p.level_price).toFixed(2);
      // 数量小于等于库存
    } else {
      ElMessage.error("库存数不足");
    }
  } else {
    p.Total_price = 0;
  }
};
//下单价格输入框
const F_level_price = () => {
  let p = form.product_list;
  console.log(p.level_price);
  p.Total_price = (p.F_stocks * p.level_price).toFixed(2);
};
//写入预下单
const add = async () => {
  const sp = form.product_list;
  const p = {
    Yid: form.customers_list.id + store.getters.userInfo.admin_id,
    customers_id: form.customers_list.id,
    product_id: sp.product_id, //商品ID
    product_name: sp.product_name, //商品名
    product_specification: sp.specification, //商品规格
    product_unit: sp.specification_quantity, //商品单位
    product_quantity: sp.F_stocks, //商品数量
    level_price: sp.level_price, //商品原价
    total_price: sp.Total_price, //商品总价

    Receiptprice: sp.Purchase_price, //入库价
    totalcost: sp.Purchase_price * sp.F_stocks, //总成本
    Totalprofit: sp.Total_price - sp.Purchase_price * sp.F_stocks, //	总利润
    Regional_barcode: sp.Regional_barcode, //商品编码
    product_main_image: sp.main_image, //商品图
    Type: "preorder_add",
    Table: "preorder",
  };
  await api(p)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("添加成功");
        form.CX_list = '';
        get_preorder();
      } else {
        ElMessage.error("添加失败！");
      }
    })
    .catch((err) => { });
};

/**
 * 删除预下单
 */
const deletes = async (row) => {
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
      id: row.id, //预下单ID
      product_id: row.product_id, //商品ID
      product_quantity: row.product_quantity, // 回退库存数
      Table: "preorder",
      Type: "preorder_delete",
    };

    try {
      const response = await api(requestData);
      console.log(response);
      if (response.status.error_msg === "success") {
        ElMessage.success("删除成功");
        productsoptions.value = "";
        get_preorder();
      } else {
        ElMessage.error("删除失败！");
      }
    } catch (error) {
      console.error(error);
    }
  }
};

//完整下单
const order_list_add = async () => {
  if (tableData.value.length > 0) {
    const pl = form.product_list; //商品列表
    const cl = form.customers_list; //客户详情
    const ui = store.getters.userInfo; //开单人详情
    const Couponss = form.Coupons_ms;
    const Coupons_list = [Couponss];

    const p = {
      customer_name: cl.customer_name, //客户名
      customer_id: cl.id, //客户ID
      customer_level: cl.level, //客户等级
      customer_phone: cl.phone, //客户电话
      customer_address: cl.address, //客户地址
      order_date: new Date().toISOString().split("T")[0], //开单日期
      created_by: ui.admin_nick_name, //开单人
      created_by_id: ui.admin_id, //开单人ID
      // order_total_price: sum, //订单总价
      order_list_id:
        form.customers_list.id + store.getters.userInfo.admin_id + Date.now(), //客户名ID+开单人ID+时间戳, //订单列表ID
      Yid: form.customers_list.id + store.getters.userInfo.admin_id, //预下单列表ID
      Type: "order_list_add",
      Table: "order_list",
      mode: form.mode,//自取还是配送
      Coupons_number: form.Coupons_number, //优惠金额
      Coupons_list: JSON.stringify(Coupons_list), //优惠列表
      remarks: form.remarks//订单备注
    };
    await api(p)
      .then((res) => {
        console.log(res);
        if (res.status.error_msg == "success") {
          ElMessage.success("下单成功");
          router.push({
            path: "/Billing/Billing_List",
          });
        } else {
          ElMessage.error("下单失败！");
        }
      })
      .catch((err) => { });
  } else {
    ElMessage.error("请选择商品");
  }
};

// 打印相关
const printLoading = ref(false);
const printObj = {
  // 打印区域
  id: "userInfoBox",
  // 打印标题
  popTitle: "深圳餐具-小程序管理后台",
  // 打印前

  beforeOpenCallback(vue) {
    printLoading.value = true;
  },
  // 执行打印
  openCallback(vue) {
    printLoading.value = false;
    form.switchs_list.g = true;
  },
};
</script>
<style lang="scss" scoped>
@media print {
  .userInfoBox {
    color: #000000 !important;
    /* 黑色或其他深色 */
    background-color: #ffffff !important;
    /* 白色或其他浅色背景 */
    /* 其他打印样式 */
  }
}

.print-box {
  margin-bottom: 20px;
  text-align: right;
}

.user-info-box {
  width: 1024px;
  margin: 0 auto;

  .title {
    text-align: center;
    margin-bottom: 18px;
  }

  .header {
    display: flex;

    ::v-deep .el-descriptions {
      flex-grow: 1;
    }

    .remark {
      margin-right: 32px;
    }
  }

  .body {
    ul {
      list-style: none;

      li {
        span {
          margin-right: 62px;
        }
      }
    }
  }

  .foot {
    margin-top: 42px;
    text-align: right;
  }

  .border {
    border: 100px solid #ccc;
    padding: 40px;
  }
}

.main_image {
  width: 300px;
  height: 300px;
}
.user-info-box {
  width: 100%; // 调整为100%以适应打印
  margin: 0 auto;
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
</style>
