<template>
  <div class="home-box">
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
        <el-button type="warning" @click="add_dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column prop="customer_name" label="客户名" align="center" width="200">
        </el-table-column>
        <el-table-column prop="phone" label="电话" align="center" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center" width="180">
        </el-table-column>
        <el-table-column prop="wechat" label="微信" align="center" width="120">
        </el-table-column>
        <el-table-column prop="type" label="等级描述" align="center" width="180">
        </el-table-column>
        <el-table-column prop="level" label="等级" align="center" width="180">
        </el-table-column>

        <el-table-column prop="created_time" label="注册时间" align="center" width="200">
        </el-table-column>
        <el-table-column prop="identifying" label="分店ID" align="center" width="180">
        </el-table-column>
        <el-table-column label="操作" width="208" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
            <el-button plain @click="up_bu(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />
    </el-card>
    <!-- 新增 -->
    <el-dialog v-model="add_dialogVisible" title="新增" width="30%">
      <el-form label-position="top"><el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="searchForm.customer_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="客户微信" prop="wechat">
          <el-input v-model="searchForm.wechat" placeholder="请输入微信"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="searchForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="客户等级">
          <el-radio-group v-model="searchForm.level">
            <el-radio label="一级"></el-radio>
            <el-radio label="二级"></el-radio>
            <el-radio label="三级"></el-radio>
            <el-radio label="四级"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="add_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="add">新建 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑 -->
    <el-dialog v-model="up_dialogVisible" title="编辑" width="30%">
      <el-form label-position="top"><el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="searchForm.customer_name" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="客户电话" prop="phone">
          <el-input v-model="searchForm.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="客户微信" prop="wechat">
          <el-input v-model="searchForm.wechat" placeholder="请输入微信"></el-input>
        </el-form-item>
        <el-form-item label="客户地址" prop="address">
          <el-input v-model="searchForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        <el-form-item label="客户等级">
          <el-radio-group v-model="searchForm.level">
            <el-radio label="一级"></el-radio>
            <el-radio label="二级"></el-radio>
            <el-radio label="三级"></el-radio>
            <el-radio label="四级"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <el-table-column prop="created_time" label="注册时间" align="center" width="200">
      </el-table-column>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="up_dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="up">更新</el-button>
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
  id: 0,
  customer_name: "",
  wechat: "",
  phone: "",
  address: "",
  type: "",
  level: "",
  page: 1,
  page_size: 20,

  field: "", //搜索字段
  content: "", //搜索内容
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
    Table: "customers",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    ORDER_da: " DESC",
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          tableData.value = res.data;
          total.value = Number(res.page_info.total_items);
          loading.value = false;
        }, 1000);
      } else {
        ElMessage.error("查询失败！");
      }
      loading.value = false;
      r;
    })
    .catch((err) => {
      loading.value = false;
    });
};

getListData();

/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
  const confirmResult = await ElMessageBox.confirm(
    "确定要删除【" + row.customer_name + "】这个客户吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "customers",
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
//新增账号
const add_dialogVisible = ref(false);
const add = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "customers_add",
    Table: "customers",
    customer_name: ii.customer_name,
    phone: ii.phone,
    wechat: ii.wechat,
    address: ii.address,
    type: ii.type,
    level: ii.level,
  };
  console.log(in_data);
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
//编辑账号
const up_dialogVisible = ref(false);
const up_bu = (row) => {
  searchForm.value.customer_name = row.customer_name;
  searchForm.value.phone = row.phone;
  searchForm.value.wechat = row.wechat;
  searchForm.value.address = row.address;
  searchForm.value.type = row.type;
  searchForm.value.level = row.level;
  searchForm.value.id = row.id;
  up_dialogVisible.value = true;
  console.log(searchForm.value);
};

const up = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "customers_up",
    Table: "customers",
    customer_name: ii.customer_name,
    phone: ii.phone,
    wechat: ii.wechat,
    address: ii.address,
    type: ii.type,
    level: ii.level,
    id: ii.id,
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
    .catch((err) => {});
};
// 查询操作
const options = [
  {
    value: "customer_name",
    label: "客户名",
  },
  {
    value: "phone",
    label: "电话",
  },
  {
    value: "address",
    label: "地址",
  },
  {
    value: "wechat",
    label: "微信",
  },
  {
    value: "level",
    label: "用户等级",
  },
  
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "search",
      Table: "customers",
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
