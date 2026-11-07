<template>
    <div class="diva">
        <el-form label-position="top" :model="form" label-width="580px">
            <el-form-item label="门店名" prop="name">
                <el-input v-model="form.branch_name"></el-input>
            </el-form-item>

            <el-form-item label="门店地址" prop="address">
                <el-input v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="门店电话" prop="phone">
                <el-input v-model="form.phone"></el-input>
            </el-form-item>
            <el-form-item label="门店坐标latitude" prop="latitude">
                <el-link type="danger" href="https://lbs.qq.com/tool/getpoint/get-point.html">获取坐标地址</el-link>
                <el-input v-model="form.latitude"></el-input>
            </el-form-item>
            <el-form-item label="门店坐标longitude" prop="longitude">
                <el-input v-model="form.longitude"></el-input>
            </el-form-item>

            <el-form-item label="门店小程序公告" prop="Notice">
                <el-input v-model="form.Notice"></el-input>
            </el-form-item>
            <el-form-item label="门店小程序公告--背景色" prop="Notice_color">
                <el-color-picker v-model="form.Notice_color"></el-color-picker>
            </el-form-item>
            <el-form-item label="门店小程序公告--文字颜色" prop="Notice_text">
                <el-color-picker v-model="form.Notice_text"></el-color-picker>
            </el-form-item>
            <el-form-item label="门店小程序订单运费" prop="freight">
                <el-input v-model="form.freight"></el-input>
            </el-form-item>
            <el-form-item label="满多少减运费" prop="freight">
                <el-input v-model="form.freight_manjian_sum"></el-input>
            </el-form-item>
            <el-divider />
            <el-button type="primary" @click="addFreightManjian">添加一个</el-button>
            <div v-for="(item, index) in form.ColorList_list" :key="index" class="form-item-row">
                <el-form-item label="充值多少">
                    <el-input v-model="item.a"></el-input>
                </el-form-item>
                <el-form-item label="送多少">
                    <el-input v-model="item.b"></el-input>
                </el-form-item>
                <el-button type="danger" @click="removeFreightManjian(index)">删除</el-button>
            </div>
            <el-divider />
            <el-form-item label="门店小程序同城发布费" prop="freight">
                <el-input v-model="form.Same"></el-input>
            </el-form-item>
            <el-form-item label="门店协议">
                <el-input v-model="form.protocol" size="medium" type="textarea" />
            </el-form-item>
            <el-form-item label="退换货说明">
                <el-input v-model="form.Returns" size="medium" type="textarea" />
            </el-form-item>
            <el-form-item label="关于我们">
                <el-input v-model="form.About" size="medium" type="textarea" />
            </el-form-item>



            <h4 style="padding-bottom: 10px;">打印机</h4>
            <el-button type="primary" @click="printeraddFreightManjian">添加一个</el-button>
            <div style="padding-bottom: 10px;"></div>
            <div v-for="(item, index) in form.printer_list" :key="index" class="form-item-row">
                <el-form-item label="飞鹅云后台注册账号">
                    <el-input v-model="item.a"></el-input>
                </el-form-item>
                <el-form-item label="飞鹅云后台注册账号后生成的UKEY 【备注：这不是填打印机的KEY】">
                    <el-input v-model="item.b"></el-input>
                </el-form-item>
                <el-form-item label="飞鹅云打印机编号">
                    <el-input v-model="item.c"></el-input>
                </el-form-item>
                <el-button type="danger" @click="printerremoveFreightManjian(index)">删除</el-button>
            </div>
        </el-form>
        <el-button type="primary" @click="adds()">保存新增</el-button>
    </div>
</template>

<script setup>
import { ElMessageBox, ElMessage } from "element-plus";
import { api } from "@/api/api";
import { ref, onMounted, onBeforeUnmount, watch, reactive } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const form = reactive({
    Type: "branch_list_add",
    Table: "branch_list",
    branch_name: "", //门店名
    Notice: "", //门店名公告
    Notice_text: "",
    Notice_color: "",
    address: "", //门店地址
    phone: "", //门店电话
    latitude: "", //坐标
    longitude: "", //坐标
    freight: "", //运费
    Same: "", //同城
    id: "",
    freight_manjian_sum: "", //满多少减运费
    ColorList_list: [],//冲多少送列表
    printer_list: [],//打印机列表
    protocol: "",//门店协议
    Returns: "",//退换货说明
    About: "",//关于我们
});

//充值活动
//添加一个
const addFreightManjian = async () => {
    form.ColorList_list.push({ a: '', b: '', c: '' });
}

//删除一个
const removeFreightManjian = async (index) => {
    form.ColorList_list.splice(index, 1);

}

//打印机活动
//添加一个
const printeraddFreightManjian = async () => {

    form.printer_list.push({ a: '', b: '' });
}
//删除一个
const printerremoveFreightManjian = async (index) => {
    form.printer_list.splice(index, 1);
}


/**
 * 提交
 */
const adds = async () => {
    await api(form)
        .then((res) => {
            console.log(res);
            if (res.status.error_msg == "success") {
                ElMessage.success("新增成功");
                router.push({
                    path: "/branch/branch_list",
                    // query: row,
                });
            } else {
                ElMessage.error("新增失败！");
            }
        })
        .catch((err) => { });
};
</script>

<style lang="scss" scoped>
.diva {
    padding: 50px 200px 10px 200px;
    background-color: #ffffff;
    border-radius: 14px;
}

.form-item-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    /* 根据需要调整间距 */
}

.form-item-row .el-form-item {
    margin-right: 5px;
    /* 根据需要调整间距 */
}

.form-item-row .el-button {
    margin-left: auto;
    /* 将按钮推到最右边 */
}
</style>
