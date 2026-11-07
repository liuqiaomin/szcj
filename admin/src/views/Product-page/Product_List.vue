<template>
  <div class="home-box">
    <el-card>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
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
          </el-button></el-form-item><el-form-item>
          <el-button @click="getListData"><el-icon>
              <HelpFilled />
            </el-icon>重置</el-button></el-form-item>
        <el-form-item>
          <el-button type="warning" @click="add_LiSt">新增</el-button>
        </el-form-item>
      </el-form>
      <el-form :inline="true" :model="searchForm" v-show="showSearch">
        <el-form-item label="批量改价百分比">
          <el-input style="width: 240px" v-model="searchForm.content2" placeholder="要增加还是减少的百分比 如 +10"
            class="handle-input mr10" clearable></el-input>%
        </el-form-item>
        <el-form-item>
          <el-button type="warning" @click="hides_homes">批量改价</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border ref="multipleTable"
        header-cell-class-name="table-header" @selection-change="handleSelectionChange">
        <el-table-column type="selection" fixed="left" width="55" />
        <el-table-column prop="Sort" label="排序" align="center" width="80">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名" align="center" width="200">
        </el-table-column>
        <el-table-column prop="Regional_barcode" label="商品条码" align="center" width="120">
        </el-table-column>
        <el-table-column label="商品图" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.main_image" :z-index="10" :preview-src-list="[row.main_image]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="商品分类" align="center" width="100">
        </el-table-column>
        <el-table-column prop="unit_price" label="单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="grocery_price" label="二级单价" align="center" width="100">
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
        <el-table-column prop="specification_quantity" label="规格数" align="center" width="180">
        </el-table-column>
        <el-table-column prop="created_time" label="操作时间" align="center" width="180">
        </el-table-column>
        <el-table-column label="活动操作" width="208" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="onShowClick(row)">查看/编辑</el-button>
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
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
  field: "", //搜索字段
  content: "", //搜索内容
  content2: "", //搜索内容
  page: 1,
  page_size: 10,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

/**
 * 获取商品列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "products",
    ORDER_nane: "Sort",
    ORDER_da: "ASC",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
  };
  await api(in_data).then((res) => {
    loading.value = false;
    if (res.status.error_msg == "success") {
      tableData.value = [];
      tableData.value = res.data;
      total.value = Number(res.page_info.total_items);
      ElMessage.success("查询了！");
    } else {
      ElMessage.error("查询失败！");
    }
  });
};
// 监听路由变化
watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    console.log(newRoute.path);
    // 当路由变化时，重新获取数据
    if (newRoute.path == "/Product/Product_List") {
      getListData();
    }
  },
  { immediate: true } // 立即执行一次回调函数
);
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
  {
    value: "main_image",
    label: "图片为空",
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
      page: 1,
      page_size: 10000,
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

//批量改价
const multipleSelection = ref([]);
const handleSelectionChange = (val) => {
  console.log(val);
  multipleSelection.value = val;
};
//批量隐藏
const hides_homes = () => {
  let o = multipleSelection.value;
  if (o.length == 0) {
    ElMessage.error("请选择一个商品");
    return;
  }
  // return;
  // 创建一个 promise 数组
  const promises = o.map((item) => {
    // 创建一个新的 promise
    return new Promise((resolve, reject) => {
      // 假设 searchForm.value.content 是一个百分比字符串，如 "-10%" 或 "10%"
      let percentageChange = searchForm.value.content2; // 获取百分比字符串

      // 去除百分号，并将字符串转换为小数
      let percentageAsDecimal = parseFloat(percentageChange.replace("%", "")) / 100;

      // 计算新的 unit_price
      let grocery_price = item.grocery_price;
      if (!isNaN(percentageAsDecimal)) {
        // 确保转换后的百分比是有效的数字
        grocery_price = grocery_price * (1 + percentageAsDecimal); // 应用百分比变化
      }
      let grocery_price2 = grocery_price.toFixed(2);
      //  ElMessage.warning(grocery_price2); // 使用 toFixed(2) 保留两位小数并显示

      //return;
      const data = {
        Type: "products_up_change",
        Table: "products",
        id: item.id,
        grocery_price: grocery_price2,
      };

      // 调用 api 函数，并在 then 或 catch 中处理结果
      api(data)
        .then((res) => {
          if (res.status.error_code == 0) {
            resolve(undefined); // 如果成功，则解析这个 promise，并传递 undefined 作为结果
            ElMessage.success(grocery_price2); // 使用 toFixed(2) 保留两位小数并显示
            remoteMethod();
          } else {
            ElMessage.Error(grocery_price2); // 使用 toFixed(2) 保留两位小数并显示
            reject(new Error("API 请求成功但返回了错误状态码")); // 也可以在这里提供一个具体的错误对象
          }
        })
        .catch((error) => {
          reject(error); // 如果 api 调用本身失败，也拒绝这个 promise
        });
    });
  });

  // 使用 Promise.all 等待所有的 promise 完成
  Promise.all(promises)
    .then(() => {
      ElMessage.success("更新完成");
      getListData();
    })
    .catch((error) => {
      // 如果有任何一个 promise 被拒绝，这里会被调用
      console.error("An error occurred:", error);
      // 根据业务需求，你可以选择在这里调用或不调用 getData()
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
