<template>
  <div class="diva">
    <div class="container">
      <el-form
        label-position="right"
        label-width="120px"
        :model="form"
        size="large"
      >
        <!-- 商品名 -->
        <el-form-item label="商品名">
          <el-input v-model="form.product_name" />
        </el-form-item>

        <!-- 商品条码 -->
        <el-form-item label="商品条码">
          <el-input v-model="form.Regional_barcode" />
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序">
          <el-input v-model="form.Sort" placeholder="值越小越靠前" />
        </el-form-item>

        <!-- 状态 -->
        <el-form-item label="商品状态">
          <el-switch
            v-model="form.product_status"
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>

        <!-- ✅ 主图（与新增页完全一致） -->
        <el-form-item label="主图">
          <el-upload
            class="upload-demo"
            drag
            action="/admin/upload"
            :show-file-list="false"
            :before-upload="before_upload"
            :on-success="img_handle"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖入 jpg / png / webp 或 <em>点击上传</em>
            </div>
          </el-upload>

          <div v-if="form.main_image" class="mt-2">
            <el-image
              :src="form.main_image"
              style="width:120px;height:120px"
              fit="cover"
            />
          </div>
        </el-form-item>

        <!-- ✅ 多图（与新增页完全一致） -->
        <el-form-item label="多图">
          <el-upload
            action="/admin/upload"
            list-type="picture-card"
            :file-list="form.fileList"
            :before-upload="before_upload"
            :on-success="img_handle2"
            :on-remove="img_remove"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview" />
          </el-dialog>
        </el-form-item>

        <!-- 规格 / 单位 / 库存 -->
        <el-form-item label="规格">
          <el-input v-model="form.specification" />
        </el-form-item>

        <el-form-item label="单位">
          <el-input v-model="form.specification_quantity" />
        </el-form-item>

        <el-form-item label="库存">
          <el-input v-model="form.stock" />
        </el-form-item>

        <!-- 分类 -->
        <el-form-item label="商品分类">
          <el-radio-group v-model="form.category">
            <el-radio
              v-for="item in tableData"
              :key="item.id"
              :label="item.category_name"
            >
              {{ item.category_name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 价格 -->
        <el-form-item label="单价">
          <el-input v-model="form.unit_price" />
        </el-form-item>

        <el-form-item label="进货价">
          <el-input v-model="form.Purchase_price" />
        </el-form-item>

        <el-form-item label="零售价">
          <el-input v-model="form.retail_price" />
        </el-form-item>

        <el-form-item label="餐厅价">
          <el-input v-model="form.grocery_price" />
        </el-form-item>

        <el-form-item label="粮油价">
          <el-input v-model="form.department_store_price" />
        </el-form-item>

        <el-form-item label="内部优惠价">
          <el-input v-model="form.wholesale_price" />
        </el-form-item>

        <!-- 按件数价格 -->
        <el-form-item
          v-for="(item, index) in form.full_list"
          :key="index"
          label="按件数设置价格"
        >
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input v-model="item.a" placeholder="满多少件" />
            </el-col>
            <el-col :span="12">
              <el-input v-model="item.b" placeholder="单价" />
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 营销 -->
        <el-form-item label="营销开关">
          <el-switch v-model="form.marketingXY" />
        </el-form-item>

        <el-form-item label="营销文字">
          <el-input v-model="form.marketing" />
        </el-form-item>

        <!-- 详情 -->
        <el-form-item label="商品详情">
          <div ref="editor" class="mgb20"></div>
        </el-form-item>

        <el-button type="primary" @click="submit">保存</el-button>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { api } from "@/api/api";
import WangEditor from "wangeditor";
import { UploadFilled, Plus } from "@element-plus/icons-vue";

const route = useRoute();
const router = useRouter();

const editor = ref(null);
let wangEditor = null;

/* 表单 */
const form = reactive({
  Type: "products_up",
  id: "",
  product_name: "",
  Regional_barcode: "",
  Sort: "",
  product_status: true,
  main_image: "",
  fileList: [],
  specification: "",
  specification_quantity: "",
  stock: "",
  category: "",
  unit_price: "",
  Purchase_price: "",
  retail_price: "",
  grocery_price: "",
  department_store_price: "",
  wholesale_price: "",
  full_list: [{ a: "", b: "" }],
  marketingXY: false,
  marketing: "",
  fwb: "",
});

/* 图片预览 */
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

/* 富文本 */
onMounted(() => {
  wangEditor = new WangEditor(editor.value);
  wangEditor.config.zIndex = 1;
  wangEditor.create();
  getCategory();
  getDetail();
});

onBeforeUnmount(() => wangEditor?.destroy());

const syncHTML = () => {
  form.fwb = wangEditor.txt.html();
};

/* 图片上传（✅ 与新增页完全一致） */
const before_upload = (file) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.type);
  if (!ok) ElMessage.error("仅支持 jpg / png / webp");
  return ok;
};

const img_handle = (res) => {
  if (res?.code === 0) {
    form.main_image = res.data.url;
    ElMessage.success("主图上传成功");
  }
};

const img_handle2 = (res) => {
  if (res?.code === 0) {
    form.fileList.push({ url: res.data.url });
    ElMessage.success("多图上传成功");
  }
};

const img_remove = (file, list) => {
  form.fileList = list.filter((f) => f.url);
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

/* 获取详情 */
const getDetail = async () => {
  if (!route.query.id) return;

  const res = await api({
    Type: "id_get",
    Table: "products",
    id: route.query.id,
  });

  if (res.status?.error_msg === "success") {
    const d = res.data;
    Object.assign(form, {
      ...d,
      product_status: d.product_status == 1,
      marketingXY: d.marketingXY == 1,
      full_list: JSON.parse(d.full_list2 || "[{a:'',b:''}]"),
      fileList: JSON.parse(d.multi_images || "[]"),
    });
    wangEditor.txt.html(d.fwb || "");
  }
};

/* 分类 */
const tableData = ref([]);
const getCategory = async () => {
  const res = await api({
    Type: "get",
    Table: "ProductCategory",
    page_size: 1000,
  });
  if (res.status?.error_msg === "success") {
    tableData.value = res.data;
  }
};

/* 提交 */
const submit = async () => {
  syncHTML();

  const params = {
    ...form,
    product_status: form.product_status ? 1 : 0,
    marketingXY: form.marketingXY ? 1 : 0,
    full_list2: JSON.stringify(form.full_list),
    oo: JSON.stringify(form.fileList),
  };

  const res = await api(params);

  if (res.status?.error_msg === "success") {
    ElMessage.success("更新成功");
    router.push("/Product/Product_List");
  } else {
    ElMessage.error(res.status?.error_msg || "更新失败");
  }
};
</script>

<style lang="scss" scoped>
.diva {
  padding: 40px 200px;
  background: #fff;
  border-radius: 14px;
  box-shadow: var(--el-box-shadow);
}
.mt-2 {
  margin-top: 10px;
}
</style>