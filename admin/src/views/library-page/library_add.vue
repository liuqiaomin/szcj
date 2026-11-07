<template>
  <div class="home-box">
    <div class="print-box">
      <!-- <el-button type="primary" @click="add_dialogVisible = true">新增入库商品</el-button> -->
      <el-button type="primary" @click="add_dialogVisible = true">新增入库商品</el-button>
    </div>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="creator" label="创建人" fixed="left" align="center" width="102">
        </el-table-column>
        <el-table-column prop="state" label="审核状态" fixed="left" align="center" width="90">
        </el-table-column>

        <el-table-column prop="supplier" label="供应商" align="center" width="100">
        </el-table-column>
        <el-table-column prop="supplier_id" label="供应商ID" align="center" width="90">
        </el-table-column>
        <el-table-column prop="product_name" label="商品名" align="center" width="150">
        </el-table-column>
        <el-table-column prop="product_id" label="商品ID" align="center" width="90">
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
        <el-table-column prop="specification" label="规格" align="center" width="100">
        </el-table-column>
        <el-table-column prop="specification_number" label="单位" align="center" width="100">
        </el-table-column>
        <el-table-column prop="unit_price" label="入库单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="Purchase_price" label="原入库单价" align="center" width="100">
        </el-table-column>
        <el-table-column prop="quantity" label="入库数量" align="center" width="100">
        </el-table-column>
        <el-table-column prop="total" label="金额" align="center" width="100">
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间" align="center" width="100">
        </el-table-column>

        <el-table-column label="操作" width="108" align="center" fixed="right">
          <template #default="{ row }">
            <!-- <el-button type="primary" plain @click="onShowClick(row)"
              >查看/编辑</el-button
            > -->
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增" width="40%">
        <el-form label-position="top">
          <el-row>
            <el-col :span="12">
              <div class="grid-content ep-bg-purple" />
              <el-form-item label="选择供应商" prop="company_name">
                <el-select v-model="searchForm.suppliers_Name" filterable remote reserve-keyword placeholder="输入供应商"
                  :remote-method="remoteMethod" :loading="loading" style="width: 240px" clearable
                  @change="suppliers_handleSelectChange">
                  <el-option v-for="item in options" :key="item.id" :label="item.company_name"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="searchForm.suppliers_list">
                <el-form-item label="供应商" prop="phone">
                  <el-text class="mx-1" size="large" type="info">{{
                    searchForm.suppliers_list.company_name
                    }}</el-text>
                </el-form-item>
                <el-form-item label="供应商ID" prop="phone">
                  <el-text class="mx-1" size="large" type="info">{{
                    searchForm.suppliers_list.id
                    }}</el-text>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="12">
              <div class="grid-content ep-bg-purple-light" />
              <el-form-item label="选择商品" prop="company_name">
                <el-select v-model="searchForm.products_Name" filterable remote reserve-keyword placeholder="输入商品"
                  :remote-method="sp_remoteMethod" :loading="loading" style="width: 240px" clearable
                  @change="products_handleSelectChange">
                  <el-option v-for="item in spoptions" :key="item.id" :label="item.product_name"
                    :value="item"></el-option>
                </el-select>
              </el-form-item>
              <div v-if="searchForm.product_list">
                <el-form-item label="商品名" prop="product_name">
                  <el-text class="mx-1" size="small " type="info">{{
                    searchForm.product_list.product_name
                    }}</el-text>
                </el-form-item>
                <el-form-item label="商品ID" prop="id">
                  <el-text class="mx-1" size="small" type="info">{{
                    searchForm.product_list.id
                    }}</el-text>
                </el-form-item>
                <el-form-item label="商品分类" prop="category">
                  <el-text class="mx-1" size="small" type="info">{{
                    searchForm.product_list.category
                    }}</el-text>
                </el-form-item>
                <el-form-item label="规格" prop="category">
                  <el-text class="mx-1" size="small" type="info">{{
                    searchForm.product_list.specification
                    }}</el-text>
                </el-form-item>
                <el-form-item label="单位" prop="specification_quantity">
                  <el-text class="mx-1" size="small" type="info">{{
                    searchForm.product_list.specification_quantity
                    }}</el-text>
                </el-form-item>
                <el-form-item label="原入库单价" prop="specification_quantity">
                  <el-text class="mx-1" type="danger" size="small">{{
                    searchForm.product_list.Purchase_price
                    }}</el-text>
                </el-form-item>
              </div>
            </el-col>
          </el-row>
          <el-form-item label="入库单价" prop="phone">
            <el-input v-model="searchForm.unit_price" placeholder="请输入入库单价"></el-input>
          </el-form-item>
          <el-form-item label="入库数量" prop="wechat">
            <el-input v-model="searchForm.quantity" placeholder="请输入入库数量"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="add_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="adds">保存 </el-button>
          </span>
        </template>
      </el-dialog>

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
console.log(store.getters.userInfo.admin_nick_name);
const showSearch = ref(true);

//数据源
const searchForm = reactive({
  id: 0,
  page: 1,
  page_size: 10,
  creator: store.getters.userInfo.admin_nick_name,
  selectedValue: "", //供应商
  unit_price: "", //入库单价
  Purchase_price: "", //原入库单价
  quantity: "", //入库数量
  suppliers_list: "",
  suppliers_Name: "", //供应商名称
  products_Name: "", //商品名称
  product_list: "",
});

const options = ref([]);
const spoptions = ref([]);
const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

onMounted(() => {
  getListData();
});
/**
 * 获取预审核列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "Warehousing_add_get",
    Table: "warehouse_entry_application_form",
    page: searchForm.page,
    page_size: searchForm.page_size,
  };
  await api(in_data)
    .then((res) => {
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.data;
          total.value = Number(res.page_info.total_items);
          loading.value = false;
        }, 1000);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};
//供应商搜索
const remoteMethod = async (query) => {
  console.log(query);
  if (query) {
    loading.value = true;
    let in_data = {
      Type: "search",
      Table: "suppliers",
      condition_name1: "company_name",
      condition1: query,
    };
    await api(in_data)
      .then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
          setTimeout(() => {
            options.value = res.data;
            searchForm.selectedValue = "";
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
  }
};
//供应商选择
const suppliers_handleSelectChange = (selectedItem) => {
  if (selectedItem) {
    searchForm.suppliers_list = selectedItem;
    searchForm.suppliers_Name = selectedItem.company_name;
  } else {
  }
};

//商品搜索
const sp_remoteMethod = async (query) => {
  if (query) {
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
          setTimeout(() => {
            spoptions.value = res.data;
            searchForm.spselectedValue = "";
          }, 200);
        } else {
          spoptions.value = [];
          searchForm.selectedValue = "";
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
    searchForm.product_list = selectedItem;
    searchForm.products_Name = selectedItem.product_name;
  } else {
  }
};

//新增账号
const add_dialogVisible = ref(false);

const adds = async () => {
  let a = searchForm.suppliers_list;
  let b = searchForm.product_list;
  console.log(a, b);
  const in_data = {
    Type: "warehouse_entry_application_form_add",
    Table: "warehouse_entry_application_form",
    supplier: a.company_name, //供应商名称
    supplier_id: a.id, //供应商ID
    product_name: b.product_name, //商品名称
    product_id: b.id, //商品ID
    product_image: b.main_image, //商品图片
    product_category: b.category, ///商品分类
    specification: b.specification, //规格
    specification_number: b.specification_quantity, //单位
    Purchase_price: b.Purchase_price, //原入库单价
    unit_price: searchForm.unit_price, //入库单价
    quantity: searchForm.quantity, //入库数量
    creator: searchForm.creator, //创建人
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        add_dialogVisible.value = false;
        getListData();
      } else {
        ElMessage.error("新建失败！");
      }
    })
    .catch((err) => {});
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
      Table: "warehouse_entry_application_form",
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
.print-box {
  margin-bottom: 20px;
  text-align: right;
}
</style>
