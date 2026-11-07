<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">开单</block>
		</cu-custom>
		<view class="cu-bar bg-white search ">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" @input="customers" placeholder="搜索客户" :value="customers2"
					confirm-type="search"></input>
			</view>
		</view>
		<view class="padding-sm" v-if="customersoptions">
			<view class="by cu-bar bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>选择客户
				</view>
			</view>
			<view v-for="(item,index) in customersoptions" :key="index">
				<view @click="XKH" :data-item="item" class="cu-bar bg-white by solid-bottom">
					<view class="action">
						{{item.customer_name}}
					</view>
				</view>
			</view>
		</view>
		<view class="margin-top" v-if="kh">
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					{{kh.customer_name}}
				</view>
				<view class="action">
					等级：{{kh.level}}
				</view>
				<!-- <view class="action">
					<view class="action">
						<button class="cu-btn sm bg-green shadow" @tap="showModal" data-target="gridModal">明细</button>
					</view>
				</view> -->
			</view>
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					电话：{{kh.phone}}
				</view>
			</view>
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					地址：{{kh.address}}
				</view>
			</view>
		</view>

		<view v-if="kh">
			<view class="cu-bar bg-white search margin-top">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input type="text" @input="shangpin" :value="shangpin2" placeholder="搜索商品"
						confirm-type="search"></input>
				</view>
			</view>
			<view class="padding-sm" v-if="shangpins">
				<view v-for="(item,index) in shangpins" :key="index">
					<view @click="xz_sp" :data-item="item" class="cu-bar bg-white by solid-bottom">
						<view class="action">
							{{item.product_name}}
						</view>
					</view>
				</view>
			</view>
			<view v-else>
				<view class="padding-sm" v-if="xz_shangpins">
					<image class="images" :src="xz_shangpins.main_image" mode="widthFix"></image>
					<view class="cu-bar bg-white by solid-bottom">
						<view class="action">
							<text class="text-black text-bold">{{xz_shangpins.product_name}}</text>
						</view>

					</view>
					<view class="cu-bar bg-white by solid-bottom">
						<view class="action">
							<text class="text-black text-bold"> 规格：</text>{{xz_shangpins.specification}}
						</view>
						<view class="action">
							<text class="text-black text-bold"> 单位：</text>{{xz_shangpins.specification_quantity}}
						</view>
					</view>
					<view class="cu-bar bg-white by solid-bottom">
						<view class="action">
							<text class="text-black text-bold"> 原单价：</text></text><text
								class="text-price text-red">{{xz_shangpins.unit_price}}</text>
						</view>
						<view class="action">
							<text class="text-black text-bold">库存：{{xz_shangpins.stock}}</text>
						</view>
					</view>
					<view class="cu-form-group">
						<view class="title text-black text-bold">等级单价</view>
						<input placeholder="最终单价" type="digit" name="input" @input="F_level_price"
							:value="level2"></input>
					</view>
					<view class="cu-form-group">
						<view class="title text-black text-bold">发货数量：</view>
						<input placeholder="请输入发货数量" type="number" :value="F_shuliang2" @input="F_shuliang"
							name="input"></input>
					</view>
					<view class="cu-bar bg-white by solid-bottom">
						<view class="action">
							<text class="text-black text-bold"> 总价：</text><text
								class="text-price text-red">{{Total_price}}</text>
						</view>
					</view>
					<view v-if="orders_customers_list">
						<view class="cu-bar by bg-white solid-bottom ">
							<view class="action">
								<text class="cuIcon-titles text-orange "></text>历史订单
							</view>
						</view>
						<view class="cu-bar by bg-white solid-bottom ">
							<view class="action">{{orders_customers_list.created_time}}
							</view>
							<view class="action">
								<text class="text-black text-bold">单价：</text><text
									class="text-price text-red">{{orders_customers_list.level_price}}</text>
							</view>
							<view class="action">
								<text class="text-black text-bold">数量：</text><text
									class="">{{orders_customers_list.product_quantity}}</text>

							</view>
							<view class="action">
								<text class="text-black text-bold">总价：</text><text
									class="text-price text-red">{{orders_customers_list.total_price}}</text>
							</view>
						</view>
					</view>
					<view class=" flex flex-direction" @click="Y_add">
						<button class="cu-btn bg-blue margin-tb-sm lg">添加</button>
					</view>
				</view>
			</view>

			<view v-if="tableData" class="margin-top">
				<view class="cu-bar by bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-titles text-orange "></text>商品列表
					</view>
				</view>
				<view v-for="(item,index) in tableData" :key="index">
					<view class="cu-bar by bg-white solid-bottom ">
						<view class="action">
							<text class="cuIcon-title text-orange "></text>{{item.product_name}}
						</view>
						<view class="action">
							数量 X {{item.product_quantity}}
						</view>
						<view class="action">
							<button class="cu-btn sm bg-red shadow" @tap="deletes" :data-item="item">删除</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="kh" class="margin-top">
			<view class="cu-bar by bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>优惠添加
				</view>
			</view>
			<view class="cu-form-group ">
				<view class="title">优惠描述</view>
				<input placeholder="请输入优惠描述  如:优惠10元" @input="Coupons_ms_ou" :value="Coupons_ms"></input>
			</view>
			<view class="cu-form-group ">
				<view class="title">优惠金额</view>
				<input placeholder="请输入优惠金额" @input="Coupons_number_ou" :value="Coupons_number" type="number"></input>
			</view>
			<view class="cu-form-group margin-top">
				<textarea maxlength="-1" @input="beizhu_ou" :value="beizhu" placeholder="请输入备注"></textarea>
			</view>
		</view>
		<view class="padding flex flex-direction" v-if="tableData">
			<button class="cu-btn bg-yellow margin-tb-sm lg" @click="order_list_add">提交开单</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				modalName: null,
				customers2: '', //客户
				shangpin2: '', //商品
				customersoptions: '', //客户列表
				shangpins: '', //商品列表
				kh: '', //选中客户
				xz_shangpins: '', //选中商品
				level2: '', //等级单价
				F_shuliang2: '', //发货数
				Total_price: 0, //商品总价
				tableData: '', //预下单列表
				beizhu: '', //备注
				Coupons_ms: '', //优惠
				Coupons_number: '', //优惠
				Coupons_list: [],
				orders_customers_list: '' //历史订单
			}
		},
		onLoad() {

		},
		methods: {
			//备注
			beizhu_ou(e) {
				this.beizhu = e.detail.value
			},
			//优惠描述
			Coupons_ms_ou(e) {
				this.Coupons_ms = e.detail.value
			},
			//优惠金额
			Coupons_number_ou(e) {
				this.Coupons_number = e.detail.value
			},

			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			customers(event) {
				let that = this
				that.kh = '';
				that.orders_customers_list = '';
				that.xz_shangpins = '';
				that.level2 = ''; //等级单价
				that.F_shuliang2 = ''; //发货数
				that.Total_price = 0; //商品总价
				that.shangpins = '';
				that.shangpin2 = '';
				that.customers2 = event.target.value
				if (event.target.value.length == 0) {
					that.customersoptions = '';
				} else {
					let in_data = {
						Type: "search",
						Table: "customers",
						condition_name1: "customer_name",
						condition1: event.target.value,
						page_size: 100
					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							if (res.status.error_msg == "success") {
								that.customersoptions = res.bizobj;
							}
						},
						function(error) {
							console.error(error);
						}
					);
				}
			},
			XKH(e) {
				console.log(e.currentTarget.dataset.item);
				this.kh = e.currentTarget.dataset.item
				this.customersoptions = '';
				this.customers2 = '';
				this.get_preorder()
			},
			//获取用户商品
			get_preorder() {
				let that = this
				let khs = this.kh;
				that.tableData = '';
				let in_data = {
					Type: "search",
					Table: "preorder",
					condition_name1: "Yid",
					page_size: 10000,
					condition1: khs.id + uni.getStorageSync('login').admin_id,
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = res.bizobj;
							console.log(that.tableData);
						};
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//搜索商品
			shangpin(event) {
				let that = this
				that.shangpin2 = event.target.value
				if (event.target.value.length == 0) {
					that.shangpins = '';
				} else {
					let in_data = {
						Type: "search",
						Table: "products",
						condition_name1: "product_name",
						condition1: event.target.value,
						page_size: 10000
					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							if (res.status.error_msg == "success") {
								that.shangpins = res.bizobj;
							}
						},
						function(error) {
							console.error(error);
						}
					);
				}
			},
			//商品选中
			xz_sp(e) {
				let item = e.currentTarget.dataset.item
				this.xz_shangpins = item;
				this.shangpins = '';
				this.shangpin2 = '';
				let that = this;
				//查询用户据最近下单
				let in_data = {
					Type: "orders_customers_id",
					Table: "orders",
					customers_id: that.kh.id, //客户ID
					product_id: item.id, //商品ID
					page_size: 1
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						console.log(res2);
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.orders_customers_list = res.bizobj;
						}
						that.djj()
					},
					function(error) {
						console.error(error);
					}
				);

			},
			//等级单价
			djj() {
				//盘点是否有历史订单
				if (this.orders_customers_list) {
					//有
					this.level2 = this.orders_customers_list.level_price;
				} else {
					let item = this.xz_shangpins;
					let level = this.kh.level;
					if (level == "一级") {
						this.level2 = item.retail_price;
					} else if (level == "二级") {
						this.level2 = item.grocery_price;
					} else if (level == "三级") {
						this.level2 = item.department_store_price;
					} else if (level == "四级") {
						this.level2 = item.wholesale_price;
					}
					console.log(this.level2);
				}
			},
			//等级单价输入
			F_level_price(event) {
				let xz_shangpins = this.xz_shangpins;
				let level2 = event.target.value;

				this.level2 = level2
				this.Total_price = (this.F_shuliang2 * level2).toFixed(2);


			},
			//发货数量 输入
			F_shuliang(event) {
				let that = this
				let xz_shangpins = that.xz_shangpins;
				let F_shuliang2 = event.target.value;
				that.F_shuliang2 = F_shuliang2
				that.Total_price = (F_shuliang2 * that.level2).toFixed(2);
			},

			//预下单
			Y_add() {
				let that = this
				let xz_shangpins = that.xz_shangpins;
				if (parseFloat(that.level2) < parseFloat(xz_shangpins.Purchase_price)) {
					uni.showModal({
						title: '等级单价提示',
						content: '等级单价不能小于进货价,请重填！',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					that.djj()
					return
				}
				if (that.F_shuliang2 == 0) {
					uni.showToast({
						title: '请输入下单数量!',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				if (parseFloat(that.F_shuliang2) <= parseFloat(xz_shangpins.stock)) {
					console.log('合理库存')
				} else {
					uni.showModal({
						title: '库存提示',
						content: '库存最多' + xz_shangpins.stock + ',请重填！',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					that.F_shuliang2 = 0;
					that.Total_price = 0;
					return;
				}

				let khs = that.kh;
				let sp = that.xz_shangpins;
				console.log('商品', sp);
				let in_data = {
					customers_id: that.kh.id, //客户ID
					Yid: khs.id + uni.getStorageSync('login').admin_id,
					product_id: sp.id, //商品ID
					product_name: sp.product_name, //商品名
					product_img: sp.main_image,
					product_specification: sp.specification, //商品规格
					product_unit: sp.specification_quantity, //商品单位
					product_quantity: that.F_shuliang2, //商品数量
					level_price: that.level2, //商品原价
					total_price: that.Total_price, //商品总价
					Regional_barcode: sp.Regional_barcode, //商品名
					Type: "preorder_add",
					Table: "preorder",
				}
				console.log('预下单信息', in_data);
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							uni.showToast({
								title: '添加成功',
								duration: 1000,
								icon: 'success'
							});
							that.orders_customers_list = '';
							that.xz_shangpins = '';
							that.level2 = ''; //等级单价
							that.F_shuliang2 = ''; //发货数
							that.Total_price = 0; //商品总价
							that.get_preorder();
						} else {

							uni.showToast({
								title: '添加失败',
								duration: 1000,
								icon: 'error'
							});
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			deletes(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.showModal({
					title: '提示',
					content: '确定要删除这个商品吗',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							const in_data = {
								id: item.id, //预下单ID
								product_id: item.product_id, //商品ID
								product_quantity: item.product_quantity, // 回退库存数
								Table: "preorder",
								Type: "preorder_delete",
							};
							uni.$emit(
								'r',
								in_data,
								function(res2) {
									let res = res2.data;
									if (res.status.error_msg === "success") {
										uni.showToast({
											title: '删除成功',
											duration: 1000,
											icon: 'success'
										});
										that.xz_shangpins = '';
										that.get_preorder();
									} else {
										uni.showToast({
											title: '删除失败',
											duration: 1000,
											icon: 'error'
										});
									}
								},
								function(error) {
									console.error(error);
								}
							);

						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			},
			order_list_add() {
				let that = this;
				const pl = that.tableData; //商品列表
				const cl = that.kh; //客户详情
				const ui = uni.getStorageSync('login'); //开单人详情
				const Couponss = that.Coupons_ms;
				const Coupons_list = [Couponss];
				console.log(Coupons_list)
				if (pl.length > 0) {
					uni.showLoading({
						title: '开单中'
					});
					let in_data = {
						customer_name: cl.customer_name, //客户名
						customer_id: cl.id, //客户ID
						customer_level: cl.level, //客户等级
						customer_phone: cl.phone, //客户电话
						customer_address: cl.address, //客户地址
						order_date: new Date().toISOString().split("T")[0], //开单日期
						created_by: ui.username, //开单人
						created_by_id: ui.admin_id, //开单人ID
						order_list_id: cl.id + ui.admin_id + Date.now(), //客户名ID+开单人ID+时间戳, //订单列表ID
						Yid: cl.id + uni.getStorageSync('login').admin_id, //预下单列表ID
						Type: "order_list_add",
						Table: "order_list",
						Coupons_number: that.Coupons_number, //优惠金额
						Coupons_list: JSON.stringify(Coupons_list), //优惠列表
						beizhu: that.beizhu, //备注

					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							setTimeout(function() {
								uni.hideLoading();
							}, 2000);
							let res = res2.data;
							if (res.status.error_msg == "success") {
								uni.showToast({
									title: '开单成功',
									duration: 1000,
									icon: 'success'
								});
								that.modalName = null;
								that.customers2 = ''; //客户
								that.shangpin2 = ''; //商品
								that.customersoptions = ''; //客户列表
								that.shangpins = ''; //商品列表
								that.kh = ''; //选中客户
								that.xz_shangpins = ''; //选中商品
								that.level2 = ''; //等级单价
								that.F_shuliang2 = ''; //发货数
								that.Total_price = 0; //商品总价
								that.tableData = ''; //预下单列表
								that.beizhu = ''; //备注
								that.Coupons_ms = ''; //优惠
								that.Coupons_number = ''; //优惠
								that.Coupons_list = [];
								that.orders_customers_list = ''; //历史订单

								setTimeout(function() {
									uni.navigateTo({
										url: '/pages/Billing/Billing_List'
									})
								}, 2000);

							} else {
								uni.showToast({
									title: '开单失败',
									duration: 1000,
									icon: 'error'
								});
							}
						},
						function(error) {
							console.error(error);
						}
					);
				} else {
					uni.showToast({
						title: '请选择商品！',
						duration: 1000,
						icon: 'error'
					});
				}
			}
		}
	}
</script>

<style>
	.images {
		width: 100%;
	}
</style>