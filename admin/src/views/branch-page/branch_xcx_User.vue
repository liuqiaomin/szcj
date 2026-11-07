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
    </el-form>
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column label="是否审核" align="center" width="95">
          <template #default="{ row }">
            <el-button :type="row.SHXY == 1 ? 'success' : 'danger'" plain>{{
              row.SHXY == 1 ? "已审核" : "未审核"
              }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否拉黑" align="center" width="95">
          <template #default="{ row }">
            <el-button :type="row.Block == 1 ? 'danger' : 'success'" plain>{{
              row.Block == 1 ? "已拉黑" : "正常"
              }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="头像" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.Avatar" :z-index="10" :preview-src-list="[row.Avatar]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="门头" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.Doorsign" :z-index="10" :preview-src-list="[row.Doorsign]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="grade" label="用户等级" align="center" width="300">
        </el-table-column>

        <el-table-column prop="Niche" label="呢称" align="center" width="300">
        </el-table-column>
        <el-table-column prop="name" label="店名" align="center" width="120">
        </el-table-column>
        <el-table-column prop="address" label="地址" align="center" width="120">
        </el-table-column>

        <el-table-column prop="phone" label="客户电话" align="center" width="120">
        </el-table-column>
        <el-table-column prop="balance" label="客户余额" align="center" width="130">
        </el-table-column>

        <el-table-column prop="created_time" label="注册时间" align="center" width="200">
        </el-table-column>
        <el-table-column prop="UT_time" label="更新时间" align="center" width="200">
        </el-table-column>
        <el-table-column prop="_openid" label="openid" align="center" width="300">
        </el-table-column>
        <el-table-column prop="T_openid" label="推广openid" align="center" width="300">
        </el-table-column>

        <el-table-column label="编辑" width="185" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="dd_bu(row)">订单</el-button>
            <el-button plain @click="up_bu(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />

      <!-- 编辑 -->
      <el-dialog v-model="up_dialogVisible" title="编辑" width="60%">

        <el-form label-position="top">
          <el-form-item label="呢称" prop="Niche">
            <el-input disabled v-model="searchForm.row.Niche" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="店名" prop="name">
            <el-input v-model="searchForm.row.name" clearable placeholder="请输入店名"></el-input>
          </el-form-item>

          <el-form-item label="地址" prop="address">
            <el-input v-model="searchForm.row.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="余额" prop="balance">
            <el-input v-model="searchForm.row.balance" type="number" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="searchForm.row.phone" type="number" clearable placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="用户等级" prop="grade">
            <el-radio-group v-model="searchForm.row.grade">
              <el-radio label="一级"></el-radio>
              <el-radio label="二级"></el-radio>
              <el-radio label="三级"></el-radio>
              <el-radio label="四级"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否拉黑" prop="Block">
            <el-switch inline-prompt active-text="拉黑" inactive-text="未拉黑" v-model="searchForm.row.Block" />
          </el-form-item>
          <el-form-item label="是否审核" prop="SHXY">
            <el-switch inline-prompt active-text="已审核" inactive-text="未审核" v-model="searchForm.row.SHXY" />
          </el-form-item>
          <el-form-item label="分销员状态" prop="distribution_status">
            <el-radio-group v-model="searchForm.row.distribution_status">
              <el-radio label="未申请"></el-radio>
              <el-radio label="申请中"></el-radio>
              <el-radio label="已通过"></el-radio>
              <el-radio label="禁用"></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="up_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="up">更新</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { api } from "@/api/api";
import { useRouter, useRoute } from "vue-router";
import { ElMessageBox, ElMessage } from "element-plus";
const router = useRouter();
const route = useRoute();

const showSearch = ref(true);

//数据源
const searchForm = ref({
  id: 0,
  Regional_barcode: "",
  role: "",
  date: "",
  page: 1,
  page_size: 10,

  row: "",
  field: "",
  content: "",

});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get_N_identifying",
    Table: "xcx_User",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
    ORDER_nane: "created_time",
    ORDER_da: "desc",
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
const LH = async (row) => {
  const in_data = {
    Type: "xcx_User_up",
    Table: "xcx_User",
    id: row.id,
    Block: row.Block,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("更新成功");
        getListData();
      } else {
        ElMessage.error("更新失败！");
      }
      dialogVisible.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};

//编辑账号
const up_dialogVisible = ref(false);
const up_bu = (row) => {
  searchForm.value.row = row;
  up_dialogVisible.value = true;
  console.log(searchForm.value.row);
};

const up = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "xcx_User_up",
    Table: "xcx_User",
    row: JSON.stringify(searchForm.value.row),
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
    value: "Niche",
    label: "呢称",
  },
  {
    value: "phone",
    label: "电话",
  },
  {
    value: "name",
    label: "店名",
  },
];
const remoteMethod = async () => {
  if (searchForm.value.field) {
    loading.value = true;
    tableData.value = [];
    let in_data = {
      Type: "search2",
      Table: "xcx_User",
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
//订单列表
const dd_bu = (row) => {
  let i = {
    _openid: row._openid,
    name: row.name
  };
  router.push({
    path: "/applet/Distribution_List_order",
    query: i,
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
