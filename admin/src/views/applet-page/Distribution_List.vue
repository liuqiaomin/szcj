<template>
  <div class="home-box">
    <el-card>
      <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
        <el-table-column label="是否审核" align="center" width="95">
          <template #default="{ row }">
            <el-button :type="row.SHXY == 1 ? 'danger' : 'success'" plain>{{
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
        <el-table-column prop="Niche" label="呢称" align="center" width="100">
        </el-table-column>
        <el-table-column label="头像" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.Avatar" :z-index="10" :preview-src-list="[row.Avatar]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="commission" label="佣金余额" align="center" width="100">
        </el-table-column>

        <el-table-column prop="distribution_name" label="姓名" align="center" width="100">
        </el-table-column>
        <el-table-column prop="distribution_phone" label="电话" align="center" width="120">
        </el-table-column>
        <el-table-column prop="distribution_phone" label="支付宝" align="center" width="120">
        </el-table-column>

        <el-table-column prop="distribution_bank_card" label="银行卡" align="center" width="120">
        </el-table-column>
        <el-table-column label="分销码" align="center" width="95">
          <template #default="{ row }">
            <el-image class="avatar" :src="row.distribution_ma" :z-index="10" :preview-src-list="[row.distribution_ma]"
              preview-teleported>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="distribution_status" label="分销状态" align="center" width="130">
        </el-table-column>
        <el-table-column prop="_openid" label="openid" align="center" width="300">
        </el-table-column>
        <el-table-column label="编辑" width="250" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" plain @click="fz_bu(row)">商家列表</el-button>
            <el-button plain @click="up_bu(row)">编辑&审核</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page" v-model:limit="searchForm.page_size"
        @pagination="getListData" />

      <!-- 编辑 -->
      <el-dialog v-model="up_dialogVisible" title="编辑" width="30%">
        <el-form label-position="top"><el-form-item label="店名" prop="customer_name">
            <el-input v-model="searchForm.row.name" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="呢称" prop="phone">
            <el-input disabled v-model="searchForm.row.Niche" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="余额" prop="balance">
            <el-input v-model="searchForm.row.balance" type="number" clearable placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="用户等级" prop="category">
            <el-radio-group v-model="searchForm.row.grade">
              <el-radio label="一级"></el-radio>
              <el-radio label="二级"></el-radio>
              <el-radio label="三级"></el-radio>
              <el-radio label="四级"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否拉黑" prop="product_status">
            <el-switch inline-prompt active-text="拉黑" inactive-text="未拉黑" v-model="searchForm.row.Block" />
          </el-form-item>
          <el-form-item label="是否审核" prop="product_status">
            <el-switch inline-prompt active-text="已审核" inactive-text="未审核" v-model="searchForm.row.SHXY" />
          </el-form-item>
          <el-form-item label="分销员状态" prop="category">
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
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const store = useStore();
const router = useRouter();
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
const loading = ref(false);;
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "search2",
    Table: "xcx_User",
    condition_name1: "distribution_status",
    condition1: "已通过",
    page_size: 10000,
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
    })
    .catch((err) => {
      loading.value = false;
    });
};
getListData();
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
//发展列表
const fz_bu = (row) => {
  router.push({
    path: "/applet/Distribution_List_user",
    query: row,
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
