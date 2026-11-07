<template>
  <div class="diva">
    <div class="container">
      <el-form label-position="right" label-width="100px" :model="form" size="large">
        <!-- 商品名 -->
        <el-form-item label="商品名" prop="product_name">
          <el-input v-model="form.product_name" />
        </el-form-item>

        <!-- 商品排序 -->
        <el-form-item label="商品排序" prop="Sort">
          <el-input v-model="form.Sort" placeholder="值越小排名越高" />
        </el-form-item>

        <!-- 商品条码 -->
        <el-form-item label="商品条码" prop="Regional_barcode">
          <el-input v-model="form.Regional_barcode" />
        </el-form-item>

        <!-- 商品状态 -->
        <el-form-item label="商品状态" prop="product_status">
          <el-switch
            v-model="form.product_status"
            inline-prompt
            active-text="上架"
            inactive-text="下架"
          />
        </el-form-item>

        <!-- 主图 -->
        <el-form-item label="主图" prop="main_image">
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
              将 jpg / png / webp 图片拖到此处，或 <em>点击上传</em>
            </div>
          </el-upload>

          <!-- 主图预览 -->
          <div v-if="form.main_image" class="mt-2">
            <el-image
              :src="form.main_image"
              style="width: 120px; height: 120px"
              fit="cover"
            />
          </div>
        </el-form-item>

        <!-- 多图 -->
        <el-form-item label="多图" prop="multi_images">
          <el-upload
            action="/admin/upload"
            list-type="picture-card"
            :before-upload="before_upload"
            :on-preview="handlePictureCardPreview"
            :on-success="img_handle2"
            :on-remove="img_remove"
            multiple
          >
            <el-icon><Plus /></el-icon>
          </el-upload>

          <!-- 图片预览弹窗（必须有 v-model） -->
          <el-dialog v-model="dialogVisible">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </el-form-item>

        <!-- 规格 -->
        <el-form-item label="规格" prop="specification">
          <el-input v-model="form.specification" />
        </el-form-item>

        <!-- 单位 -->
        <el-form-item label="单位" prop="specification_quantity">
          <el-input v-model="form.specification_quantity" />
        </el-form-item>

        <!-- 库存 -->
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" />
        </el-form-item>

        <!-- 商品分类 -->
        <el-form-item label="商品分类" prop="category">
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

        <!-- 单价 -->
        <el-form-item label="单价" prop="unit_price">
          <el-input v-model="form.unit_price" />
        </el-form-item>

        <!-- 进货价 -->
        <el-form-item label="进货价" prop="Purchase_price">
          <el-input v-model="form.Purchase_price" />
        </el-form-item>

        <!-- 一级零售价 -->
        <el-form-item label="一级（零售）单价" prop="retail_price" label-width="150">
          <el-input v-model="form.retail_price" />
        </el-form-item>

        <!-- 二级餐厅价 -->
        <el-form-item label="二级餐厅单价" prop="grocery_price" label-width="150">
          <el-input v-model="form.grocery_price" />
        </el-form-item>

        <!-- 三级粮油价 -->
        <el-form-item label="三级粮油单价" prop="department_store_price" label-width="150">
          <el-input v-model="form.department_store_price" />
        </el-form-item>

        <!-- 四级内部优惠价 -->
        <el-form-item label="四级内部优惠单价" prop="wholesale_price" label-width="150">
          <el-input v-model="form.wholesale_price" />
        </el-form-item>

        <!-- 按件数设置价格一 -->
        <el-form-item label="按件数设置价格一" label-width="150">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="满多少件">
                <el-input v-model="form.full_list[0].a" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单价为多少">
                <el-input v-model="form.full_list[0].b" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 按件数设置价格二 -->
        <el-form-item label="按件数设置价格二" label-width="150">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="满多少件">
                <el-input v-model="form.full_list[1].a" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单价为多少">
                <el-input v-model="form.full_list[1].b" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 按件数设置价格三 -->
        <el-form-item label="按件数设置价格三" label-width="150">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="满多少件">
                <el-input v-model="form.full_list[2].a" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单价为多少">
                <el-input v-model="form.full_list[2].b" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 营销开关 -->
        <el-form-item label="营销开关" prop="marketingXY">
          <el-switch
            v-model="form.marketingXY"
            inline-prompt
            active-text="开"
            inactive-text="关"
          />
        </el-form-item>

        <!-- 营销文字 -->
        <el-form-item label="营销文字" prop="marketing">
          <el-input v-model="form.marketing" />
        </el-form-item>

        <!-- 商品详情 -->
        <el-form-item label="商品详情">
          <div class="mgb20" ref="editor"></div>
        </el-form-item>

        <el-row class="mb-1">
          <el-button type="primary" @click="adds">保存</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { api } from "@/api/api";
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import { useRouter } from "vue-router";
import WangEditor from "wangeditor";
import { UploadFilled, Plus } from "@element-plus/icons-vue";

const router = useRouter();

// ==================== 富文本 ====================
const editor = ref(null);
let wangEditorInstance = null;

onMounted(() => {
  wangEditorInstance = new WangEditor(editor.value);
  wangEditorInstance.config.zIndex = 1;
  wangEditorInstance.create();
  getListData();
});

onBeforeUnmount(() => {
  wangEditorInstance?.destroy();
  wangEditorInstance = null;
});

// 同步富文本内容到 form
const syncHTML = () => {
  if (wangEditorInstance) {
    form.fwb = wangEditorInstance.txt.html();
  }
};

// ==================== 表单 ====================
const form = reactive({
  Type: "products_add",
  Table: "products",
  product_name: "",
  Regional_barcode: "",
  product_status: true, // 开关用 boolean，提交时转 0/1
  main_image: "",
  multi_images: "",
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
  fileList: [], // 多图列表
  Sort: "",
  fwb: "",
  full_list: [
    { a: 5, b: 50 },
    { a: 15, b: 45 },
    { a: 30, b: 40 },
  ],
  marketingXY: false,
  marketing: "",
});

// ==================== 图片格式校验 ====================
const before_upload = (file) => {
  const isImage = ["image/jpeg", "image/png", "image/webp"].includes(
    file.type
  );
  if (!isImage) {
    ElMessage.error("请上传 jpg / png / webp 图片！");
  }
  return isImage;
};

// ==================== 主图上传成功 ====================
const img_handle = (response, uploadFile) => {
  console.log("主图上传返回:", response);

  if (response && response.code === 0) {
    // 后端返回 { code:0, data:{ url:'...' }, msg:'...' }
    form.main_image = response.data.url;
    uploadFile.url = response.data.url;
    ElMessage.success(response.msg || "主图上传成功");
  } else {
    ElMessage.error(response?.msg || "主图上传失败");
  }
};

// ==================== 多图上传成功 ====================
const img_handle2 = (response, uploadFile, uploadFiles) => {
  console.log("多图上传返回:", response);

  if (response && response.code === 0) {
    const url = response.data.url;
    uploadFile.url = url;
    form.fileList.push({ url });
    ElMessage.success(response.msg || "多图上传成功");
  } else {
    ElMessage.error(response?.msg || "多图上传失败");
  }
};

// ==================== 多图删除 ====================
const img_remove = (uploadFile, uploadFiles) => {
  // 同步更新 fileList
  form.fileList = uploadFiles
    .filter((file) => file.url)
    .map((file) => ({ url: file.url }));
};

// ==================== 图片预览 ====================
const dialogImageUrl = ref("");
const dialogVisible = ref(false);

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

// ==================== 提交 ====================
const adds = async () => {
  // ✅ 提交前先同步富文本
  syncHTML();

  const params = {
    ...form,
    product_status: form.product_status ? 1 : 0,
    marketingXY: form.marketingXY ? 1 : 0,
    full_list2: JSON.stringify(form.full_list),
    oo: JSON.stringify(form.fileList), // 多图 JSON 字符串
  };

  await api(params)
    .then((res) => {
      console.log("提交返回:", res);
      if (res.status?.error_msg === "success") {
        ElMessage.success("新建成功");
        router.push({
          path: "/Product/Product_List",
        });
      } else {
        ElMessage.error(res.status?.error_msg || "新建失败！");
      }
    })
    .catch((err) => {
      console.error(err);
      ElMessage.error("请求失败");
    });
};

// ==================== 获取分类列表 ====================
const tableData = ref([]);

const getListData = async () => {
  const in_data = {
    Type: "get",
    Table: "ProductCategory",
    ORDER_nane: "sort_order",
    ORDER_da: "ASC",
    page_size: 1000,
  };

  await api(in_data)
    .then((res) => {
      console.log("分类返回:", res);
      if (res.status?.error_msg === "success") {
        tableData.value = res.data || [];
      } else {
        ElMessage.error("分类查询失败！");
      }
    })
    .catch((err) => {
      console.error(err);
    });
};
</script>

<style lang="scss" scoped>
.diva {
  padding: 50px 200px 10px 200px;
  background-color: #ffffff;
  border-radius: 14px;
  box-shadow: var(--el-box-shadow);
}

.mt-2 {
  margin-top: 10px;
}
</style>