<template>
  <div>
    <el-card>
      <el-tabs style="display: flex; justify-content: center;" v-model="searchForm.activeName" type="card"
        class="demo-tabs" @tab-change="handlegetListData2Click">
        <el-tab-pane label="今日数据" name="1"></el-tab-pane>
        <el-tab-pane label="昨日数据" name="2"></el-tab-pane>
        <el-tab-pane label="本月数据" name="3"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="2" class="fdr">
        <el-col>
          <!-- 1排 -->
          <el-container class="fdc">
            <el-row :gutter="24" class="fdr">
              <el-col :span="8" @click="tourl('/Billing/Billing_all')">
                <el-card shadow="hover" class="box-card c1 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">总订单数</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.a }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/applet/applet_List')">
                <el-card shadow="hover" class="box-card c1 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">小程序订单数</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.b }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/Billing/Billing_all')">
                <el-card shadow="hover" class="box-card c1 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">线下订单数</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.c }}</h3>
                </el-card>
              </el-col>
            </el-row>
          </el-container>

          <!-- 2排 -->
          <el-container class="fdc" style="margin-top: 10px" @click="tourl('/Billing/Billing_all')">
            <el-row :gutter="24" class="fdr">
              <el-col :span="8">
                <el-card shadow="hover" class="box-card c2 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">总营业额</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.d }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/applet/applet_List')">
                <el-card shadow="hover" class="box-card c2 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">小程序营业额</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.e }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/Product/Product_List')">
                <el-card shadow="hover" class="box-card c2 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">线下订单营业额</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.f }}</h3>
                </el-card>
              </el-col>
            </el-row>
          </el-container>


          <!-- 3排 -->
          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="8">
                <el-card shadow="hover" class="box-card c3 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">总客户</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ Number(searchForm.home2.h) + Number(searchForm.home2.i) }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/applet/xcx_User')">
                <el-card shadow="hover" class="box-card c3 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">小程序新增数</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.h }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/Billing/Billing_user_list')">
                <el-card shadow="hover" class="box-card c3 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">线下新增数</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.i }}</h3>
                </el-card>
              </el-col>
            </el-row>
          </el-container>


          <!-- 4排 -->
          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="8" @click="tourl('/Billing/Billing_List1')">
                <el-card shadow="hover" class="box-card c4 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">未分配</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.j }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/Billing/Billing_List2')">
                <el-card shadow="hover" class="box-card c4 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px"> 配送中</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.k }}</h3>
                </el-card>
              </el-col>
              <el-col :span="8" @click="tourl('/Billing/Billing_List3')">
                <el-card shadow="hover" class="box-card c4 center-content">
                  <template #header>
                    <h3 style="margin-top: 10px">已完成</h3>
                  </template>
                  <h3 style="margin-top: 10px">{{ searchForm.home2.l }}</h3>
                </el-card>
              </el-col>
            </el-row>
          </el-container>
        </el-col>
      </el-row>
    </el-card>
    <el-card>
      <h1 style="display: flex; justify-content: center;">总看板</h1>
      <el-row :gutter="20" class="fdr">
        <el-col>
          <!-- 1排 -->
          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="6" @click="tourl('/Product/Product_List')">
                <el-card shadow="hover" class="box-card c1">
                  <template #header>
                    <h3 class="t1">库存数</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.a" color="#000000">
                    <template #default="{ percentage }">
                      <span class="percentage-value t1">{{ searchForm.a }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Product/Product_List')">
                <el-card shadow="hover" class="box-card c1">
                  <template #header>
                    <h3 class="t1">商品数</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.b" color="#000000">
                    <template #default="{ percentage }">
                      <span class="percentage-value t1">{{ searchForm.b }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/library/library_supplier')">
                <el-card shadow="hover" class="box-card c1">
                  <template #header>
                    <h3 class="t1">供应商数</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.c" color="#000000">
                    <template #default="{ percentage }">
                      <span class="percentage-value t1">{{ searchForm.c }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Billing/Billing_user_list')">
                <el-card shadow="hover" class="box-card c1">
                  <template #header>
                    <h3 class="t1">客户数</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.d" color="#000000">
                    <template #default="{ percentage }">
                      <span class="percentage-value t1">{{ searchForm.d }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
            </el-row>
          </el-container>
          <!-- //2排 -->

          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="6" @click="tourl('/Billing/Billing_List1')">
                <el-card shadow="hover" class="box-card c3">
                  <template #header>
                    <h3 class="t3">待抢单</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.e" color="#e6a23c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t3">{{ searchForm.e }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Billing/Billing_List2')">
                <el-card shadow="hover" class="box-card c3">
                  <template #header>
                    <h3 class="t3">配送中</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.f" color="#e6a23c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t3">{{ searchForm.f }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Billing/Billing_List3')">
                <el-card shadow="hover" class="box-card c3">
                  <template #header>
                    <h3 class="t3">已完成</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.g" color="#e6a23c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t3">{{ searchForm.g }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Billing/Billing_List4')">
                <el-card shadow="hover" class="box-card c3">
                  <template #header>
                    <h3 class="t3">待退货</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.h" color="#e6a23c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t3">{{ searchForm.h }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
            </el-row>
          </el-container>
          <!-- //3排 -->
          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="6" @click="tourl('/Billing/Billing_List')">
                <el-card shadow="hover" class="box-card c2">
                  <template #header>
                    <h3 class="t2">待出库</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.i" color="#409eff">
                    <template #default="{ percentage }">
                      <span class="percentage-value t2">{{ searchForm.i }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/Billing/Billing_List5')">
                <el-card shadow="hover" class="box-card c2">
                  <template #header>
                    <h3 class="t2">待收款</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.j" color="#409eff">
                    <template #default="{ percentage }">
                      <span class="percentage-value t2">{{ searchForm.j }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>

              <el-col :span="6" @click="tourl('/library/library_careful')">
                <el-card shadow="hover" class="box-card c2">
                  <template #header>
                    <h3 class="t2">入库审核</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.k" color="#409eff">
                    <template #default="{ percentage }">
                      <span class="percentage-value t2">{{ searchForm.k }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/library/library-Preview')">
                <el-card shadow="hover" class="box-card c4">
                  <template #header>
                    <h3 class="t4">库存小于2</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.l" color="#f56c6c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t4">{{ searchForm.l }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
            </el-row>
          </el-container>

          <!-- //4排 -->
          <el-container class="fdc" style="margin-top: 10px">
            <el-row :gutter="24" class="fdr">
              <el-col :span="6" @click="tourl('/applet/applet_chargeback')">
                <el-card shadow="hover" class="box-card c4">
                  <template #header>
                    <h3 class="t4">退单申请</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.m" color="#f56c6c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t4">{{ searchForm.m }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
              <el-col :span="6" @click="tourl('/applet/applet_Withdrawal')">
                <el-card shadow="hover" class="box-card c4">
                  <template #header>
                    <h3 class="t4">提现申请</h3>
                  </template>
                  <el-progress type="dashboard" :percentage="searchForm.n" color="#f56c6c">
                    <template #default="{ percentage }">
                      <span class="percentage-value t4">{{ searchForm.n }}</span>
                    </template>
                  </el-progress>
                </el-card>
              </el-col>
            </el-row>
          </el-container>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { api } from "@/api/api";
import { ref, onMounted, computed, watch, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const loading = ref(false);
const store = useStore();
const router = useRouter();
onMounted(() => {
  getListData();
  getListData2();
});
//数据源
const searchForm = reactive({
  home2: '',
  activeName: 1,
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0,
  h: 0,
  i: 0,
  j: 0,
  k: 0,
  l: 0,
  m: 0,
  n: 0
});
/**
 * 获取账号列表
 */
const getListData = async () => {
  loading.value = true;
  let in_data = {
    Type: "home2",
    activeName: searchForm.activeName
  };
  await api(in_data)
    .then((res) => {
      console.log(res.data);
      if (res.status.error_msg == "success") {
        searchForm.home2 = res.data;
      } else {
        ElMessage.error("查询失败！");
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
    });
};


/**
 * 获取账号列表2
 */
const getListData2 = async () => {
  loading.value = true;
  let in_data = {
    Type: "home"
  };
  await api(in_data)
    .then((res) => {
      console.log(res.data);
      if (res.status.error_msg == "success") {
        setTimeout(() => {
          searchForm.a = Number(res.data.a);
          searchForm.b = Number(res.data.b);
          searchForm.c = Number(res.data.c);
          searchForm.d = Number(res.data.d);
          searchForm.e = Number(res.data.e);
          searchForm.f = Number(res.data.f);
          searchForm.g = Number(res.data.g);
          searchForm.h = Number(res.data.h);
          searchForm.j = Number(res.data.j);
          searchForm.k = Number(res.data.k);
          searchForm.l = Number(res.data.l);
          searchForm.m = Number(res.data.m);
          searchForm.n = Number(res.data.n);
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
const tourl = (e) => {
  console.log(e)
  router.push({
    path: e,
  });
};
const handlegetListData2Click = (tab) => {
  console.log('当前选中的标签页 name:', tab);

  searchForm.activeName = tab
  console.log(searchForm.activeName)
  getListData();
};

</script>

<style lang="scss" scoped>
@import "@/styles/mixin.scss";
@import "@/styles/variables.module.scss";
$info: #000000;
$success: #67c23a;
$warning: #e6a23c;
$danger: #f56c6c;
$primary: #409eff;

p {
  font-size: 16px;
  line-height: 30px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
}

.box-card {
  margin-bottom: 13px;
  height: 10rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.c1 {
  -webkit-box-shadow: 3px 3px 10px $info;
  box-shadow: 3px 3px 10px $info;
}

.t1 {
  color: $info;
  width: 1rem;
}


.c2 {
  -webkit-box-shadow: 3px 3px 10px $primary;
  box-shadow: 3px 3px 10px $primary;
}

.t2 {
  color: $primary;
  width: 1rem;
}

.c3 {
  -webkit-box-shadow: 3px 3px 10px $warning;
  box-shadow: 3px 3px 10px $warning;
}

.c4 {
  -webkit-box-shadow: 3px 3px 10px $danger;
  box-shadow: 3px 3px 10px $danger;
}

.t3 {
  color: $warning;
  width: 1rem;
}

.fdr {
  display: flex;
  flex-direction: row;
}

.fdc {
  display: flex;
  flex-direction: column;
}

.t3 {
  color: $warning;
  width: 1rem;
}

.t4 {
  color: $danger;
  width: 1rem;
}

#main {
  min-height: 40rem;
  width: 100;
}

.center-content {
  align-items: center;
  display: flex;
  flex-direction: column;

  justify-content: center;
  height: 100%;
  /* 确保 .center-content 填满整个卡片的高度 */
}
</style>
