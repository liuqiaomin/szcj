<template>
    <div class="home-box">


        <el-card>
            <h3>
                {{ route.query.distribution_name }}---业务员的商家发展列表
            </h3>
            <div style="padding-top: 10px;"></div>
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
                <el-table-column prop="grade" label="用户等级" align="center" width="100">
                </el-table-column>

                <el-table-column prop="Niche" label="呢称" align="center" width="100">
                </el-table-column>
                <el-table-column prop="name" label="店名" align="center" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" align="center" width="320">
                </el-table-column>

                <el-table-column prop="phone" label="客户电话" align="center" width="120">
                </el-table-column>
                <el-table-column prop="balance" label="客户余额" align="center" width="170">
                </el-table-column>
                <el-table-column prop="_openid" label="openid" align="center" width="170">
                </el-table-column>
                <el-table-column prop="T_openid" label="推广openid" align="center" width="170">
                </el-table-column>
                <el-table-column prop="created_time" label="注册时间" align="center" width="170">
                </el-table-column>
                <el-table-column label="编辑" width="125" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button plain @click="dd_bu(row)">订单列表</el-button>

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
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

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

onMounted(() => {
    getListData();

});

//监听路由变化时触发
watch(
    () => route.query._openid,
    () => {
        getListData();
    }
);


// console.log(route.query.i)
const getListData = async () => {
    loading.value = true;
    let in_data = {
        Type: "search2",
        Table: "xcx_User",
        condition_name1: 'T_openid',
        condition1: route.query._openid,
        page: searchForm.value.page,
        page_size: searchForm.value.page_size,
    };
    await api(in_data)
        .then((res) => {
            if (res.status.error_msg == "success") {
                setTimeout(() => {
                    tableData.value = res.data;
                    total.value = Number(res.page_info.total_items);
                    loading.value = false;
                }, 100);
            } else {
                ElMessage.error("暂无商家！");
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
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
