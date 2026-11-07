<template>
    <div class="home-box">
        <el-card>
            <el-table :data="tableData" v-loading="loading" element-loading-text="加载中..." border>
                <el-table-column prop="nickname" label="发布呢称" align="center" width="100">
                </el-table-column>
                <el-table-column label="发布头像" align="center" width="95">
                    <template #default="{ row }">
                        <el-image class="avatar" :src="row.avatar" :z-index="10" :preview-src-list="[row.avatar]"
                            preview-teleported>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="timestamp" label="发布时间" align="center" width="220">
                </el-table-column>
                <el-table-column label="预览图" align="center" width="95">
                    <template #default="{ row }">
                        <el-image class="avatar" :src="row.image" :z-index="10" :preview-src-list="[row.image]"
                            preview-teleported>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="108" align="center" fixed="right">
                    <template #default="{ row }">
                        <el-button :type="row.XY == 0 ? 'danger' : 'success'" plain @click="SH(row)">{{ row.XY == 0 ?
                            "待审核" : "通过" }}</el-button>
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
    Regional_barcode: "",
    role: "",
    date: "",
    page: 1,
    page_size: 10,
});

const tableData = ref([]);
const total = ref(0);
const loading = ref(false);
const roleList = ref([]);
const getListData = async () => {
    loading.value = true;
    let in_data = {
        Type: "get_N_identifying",
        Table: "xcx_city_list",
        page: searchForm.value.page,
        page_size: searchForm.value.page_size,
        ORDER_nane: "timestamp",
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
const SH = async (row) => {
    const in_data = {
        Type: "xcx_city_list_up",
        Table: "xcx_city_list",
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
