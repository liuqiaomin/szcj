<template>
  <div class="home-box">
    <el-form :inline="true" :model="searchForm" v-show="showSearch">
      <el-form-item>
        <el-button type="warning" @click="add_dialogVisible = true">新增</el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="tableData"
        v-loading="loading"
        element-loading-text="加载中..."
        border
      >
        <el-table-column prop="id" label="ID" align="center" width="120">
        </el-table-column>
        <el-table-column
          prop="Inventory_name"
          label="任务名称"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column label="是否启用(可操作)" align="center" width="175">
          <template #default="scope">
            <el-button
              :type="scope.row.XY == 1 ? 'success' : scope.row.XY == 0 ? 'danger' : ''"
              plain
              @click="up(scope.row)"
              >{{ scope.row.XY == 1 ? "启用" : "停止" }}</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column prop="XY" label="是否启用" align="center" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.XY" />
          </template>
        </el-table-column> -->
        <el-table-column label="活动操作" width="308" align="center" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
            <el-button type="primary" plain @click="viewdata(row)">查看数据</el-button>
            <el-button type="warning" @click="outexxx(row)">导出表格</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 新增 -->
      <el-dialog v-model="add_dialogVisible" title="新增" width="30%">
        <el-form label-position="top"
          ><el-form-item label="任务名称" prop="Inventory_name">
            <el-input
              v-model="searchForm.Inventory_name"
              placeholder="请输入任务名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="Inventory_name">
            <el-switch v-model="searchForm.XY" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="add_dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="add">新建 </el-button>
          </span>
        </template>
      </el-dialog>
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
import { ref, onMounted, reactive } from "vue";
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
  Inventory_name: "",
  XY: true,

  page: 1,
  page_size: 10,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

//重置
const resetting = async () => {
  searchForm.value = {
    id: 0,
    Inventory_name: "",
    XY: true,

    page: 1,
    page_size: 10,
  };
};
onMounted(() => {
  getListData();
});
/**
 * 获取列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "get",
    Table: "Inventory",
    page: searchForm.value.page,
    page_size: searchForm.value.page_size,
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

//新增账号
const add_dialogVisible = ref(false);
const add = async () => {
  let ii = searchForm.value;
  const in_data = {
    Type: "Inventory_add",
    Table: "Inventory",
    Inventory_name: ii.Inventory_name,
    XY: ii.XY,
  };
  await api(in_data)
    .then((res) => {
      console.log(res);
      if (res.status.error_msg == "success") {
        ElMessage.success("新建成功");
        add_dialogVisible.value = false;
        getListData();
        resetting();
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
    "确定要删除【" + row.Inventory_name + "】这个盘点任务吗",
    {
      type: "warning",
    }
  ).catch((err) => {
    console.error(err);
  });

  if (confirmResult) {
    const requestData = {
      id: row.id,
      Table: "Inventory",
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
//任务详情
const viewdata = (row) => {
  let i = {
    id: row.id,
  };
  router.push({
    path: "/Inventory/xq",
    query: i,
  });
};
const outexxx = async (row) => {
  loading.value = true;
  let p = {
    id: row.id,
  };
  await api({ ...p, Type: 'Inventory' })
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
};
const up = async (row) => {
  if (row.XY == 1) {
    const in_data = {
      Type: "Inventory_up",
      Table: "Inventory",
      id: row.id,
      XY: row.XY,
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
  } else {
    ElMessage.error("已停止，并已更新过库存");
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
