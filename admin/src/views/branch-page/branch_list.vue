<template>
    <div class="home-box">
        <el-card>
            <el-form :inline="true" :model="searchForm" v-show="showSearch">
                <el-form-item>
                    <el-button type="warning" :icon="Plus" @click="add_LiSt()">新增</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
                <el-table-column prop="branch_name" label="分店名" align="center" width="200">
                </el-table-column>
                <el-table-column prop="identifying" label="分店ID" align="center" width="120">
                </el-table-column>
                <el-table-column prop="phone" label="分店电话" align="center" width="130">
                </el-table-column>
                <el-table-column prop="address" label="分店地址" align="center" width="300">
                </el-table-column>
                <el-table-column label="图" align="center" width="95">
                    <template #default="{ row }">
                        <el-image class="avatar" :src="row.branch_logo" :z-index="10"
                            :preview-src-list="[row.branch_logo]" preview-teleported>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="created_time" label="更新时间" align="center" width="180">
                </el-table-column>
                <el-table-column label="操作" width="268" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button type="primary" plain @click="onShowClick(row)">查看/编辑</el-button>
                        <el-button type="danger" plain @click="onRemoveClick(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页组件-->
            <pagination v-show="total > 0" :total="total" v-model:page="searchForm.page"
                v-model:limit="searchForm.page_size" @pagination="getListData" />
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
    page: 1,
    page_size: 10,

});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);

// onMounted(() => {

// });
// watch(
//   () => router.currentRoute.value,
//   () => {
//     getListData();
//   }
// );
/**
 * 获取商品列表
 */
const getListData = async () => {
    loading.value = true;
    let in_data = {
        Type: "branch_get",
        Table: "branch_list",
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
getListData();
const add_LiSt = () => {
    router.push({
        path: "/branch/branch_add",
        // query: row,
    });
};
/**
 * 查看按钮点击事件
 */
const onShowClick = (row) => {
    let i = {
        id: row.identifying,
    };
    router.push({
        path: "/branch/branch_up",
        query: i,
    });
};
/**
 * 删除按钮点击事件
 */
const onRemoveClick = async (row) => {
    const confirmResult = await ElMessageBox.confirm(
        "确定要删除【" + row.branch_name + "】这个分店吗",
        {
            type: "warning",
        }
    ).catch((err) => {
        console.error(err);
    });

    if (confirmResult) {
        const requestData = {
            id: row.id,
            Table: "branch_list",
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
</style>
