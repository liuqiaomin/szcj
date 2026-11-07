<template>
    <div class="home-box">
        <el-card>
            <el-table :data="tableData" show-summary v-loading="loading" element-loading-text="加载中..." border
                ref="multipleTable">
                <el-table-column prop="product_id" label="商品ID" align="center" width="80">
                </el-table-column>
                <el-table-column prop="product_name" label="商品名" align="center" width="200">
                </el-table-column>

                <el-table-column prop="product_quantity" label="选中数量" align="center" width="100">
                </el-table-column>
                <el-table-column prop="Regional_barcode" label="商品条码" align="center" width="120">
                </el-table-column>
                <el-table-column label="商品图" align="center" width="95">
                    <template #default="{ row }">
                        <el-image class="avatar" :src="row.product_main_image" :z-index="10"
                            :preview-src-list="[row.product_main_image]" preview-teleported>
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="level_price" label="单价" align="center" width="100">
                </el-table-column>
                <el-table-column prop="product_specification" label="规格" align="center" width="100">
                </el-table-column>
                <el-table-column prop="product_unit" label="单位" align="center" width="180">
                </el-table-column>
                <el-table-column prop="openid" label="客户openid" align="center" >
                </el-table-column>
                <el-table-column prop="created_time" label="选中时间" align="center" width="180">
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
        Table: "xcx_preorder",
        ORDER_nane: "created_time",
        ORDER_da: "ASC",
        page: searchForm.value.page,
        page_size: searchForm.value.page_size,
    };
    await api(in_data).then((res) => {
        loading.value = false;
        if (res.status.error_msg == "success") {
            tableData.value = [];
            tableData.value = res.bizobj;
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
        if (newRoute.path == "/library/library-xcx_preorder") {
            getListData();
        }
    },
    { immediate: true } // 立即执行一次回调函数
);
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
