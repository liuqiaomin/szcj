<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</cu-custom>
		<view class="padding-sm" v-if="Original">
			<view class="cu-bar sby bg-white solid-bottom ">
				<view class="action">
					订单ID：{{Original.id}}
				</view>
				<view class="action" @click="copyText" :data-id="Original.id">
					<button class="cu-btn sm  shadow bg-white">复制</button>
				</view>
			</view>
			<view class="cu-bar bg-white  solid-bottom">
				<view class="action">
					{{Original.customer_name}}
				</view>
				<view class="action">
					等级：{{Original.customer_level}}
				</view>
				<!-- <view class="action">
					<view class="action">
						<button class="cu-btn sm bg-green shadow" @tap="showModal" data-target="gridModal">明细</button>
					</view>
				</view> -->
			</view>
			<view class="cu-bar bg-white  solid-bottom" v-if="Original.customer_phone">
				<view class="action">
					电话：{{Original.customer_phone}}
				</view>
			</view>
			<view class="cu-bar bg-white xby solid-bottom" v-if="Original.customer_address">
				<view class="action">
					地址：{{Original.customer_address}}
				</view>
			</view>
			<view style="padding-top: 10px;"></view>
			<view class="cu-bar bg-white sby solid-bottom">
				<view class="action">
					仓库出库审核
				</view>
				<view class="action">
					<button :class="Original.Warehouse_sh!=0?'bg-green':'bg-white'"
						class="cu-btn sm  shadow">{{Original.Warehouse_sh!=0?'已出库':'待出库'}}</button>
				</view>
			</view>
			<view class="cu-bar bg-white xby solid-bottom" v-if="Original.Warehouse_sh!=0">
				<view class="action">
					配送状态
				</view>
				<view class="action">
					<button
						class="cu-btn sm  shadow bg-white">{{Original.Warehouse_sh==1?'待抢单':Original.Warehouse_sh==2?'已抢单':Original.Warehouse_sh==3?'已完成':''}}</button>
				</view>
			</view>
			<view class="cu-bar bg-white xby solid-bottom" v-if="Original.delivery_person">
				<view class="action">
					配送员
				</view>
				<view class="action">
					<button class=" cu-btn sm bg-white ">{{Original.delivery_person}}</button>
				</view>
			</view>
			<view class="cu-bar bg-white xby solid-bottom">
				<view class="action">
					财务是否收款
				</view>
				<view class="action">
					<button :class="Original.is_paid==1?'bg-green':'bg-white'"
						class="cu-btn sm  shadow">{{Original.is_paid==1?'已收款':'未收款'}}</button>
				</view>
			</view>
			<view style="padding-top: 10px;" v-if="Original.Warehouse_sh==3">
				<view class="cu-bar by bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-titles text-blue "></text>签收图片
					</view>
				</view>
				<view class="padding-sm bg-white xby">
					<view class="grid flex-sub  padding-lr col-3 grid-square">
						<view class="bg-img only-img" :style="{ backgroundImage: `url(${item})` }"
							v-for="(item,index) in receipt_photo_list" :key="index" @tap="ViewImage" :data-url="item"
							:data-item="receipt_photo_list">
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="cu-bar by bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>商品列表
			</view>
			<view class="action" v-if="Original.Warehouse_sh==3">
				总价 {{Original.order_total_price}}
			</view>
			<!-- 			<view class="action" @click="News" v-if="Original.Warehouse_sh==0">
				<button class="cu-btn sm bg-orange shadow">新增</button>
			</view> -->
		</view>
		<view>
			<view class="cu-bar bg-white search " v-if="New">
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
					<!-- <image class="images" :src="xz_shangpins.main_image" mode=""></image> -->
					<view class="cu-bar bg-white by solid-bottom">
						<view class="action">
							<text class="text-black text-bold">{{xz_shangpins.product_name}}</text>
						</view>
						<view class="action">
							<text class="text-black text-bold">库存：{{xz_shangpins.stock}}</text>
						</view>
						<!-- <view class="action">
					<view class="action">
						<button class="cu-btn sm bg-green shadow" @tap="showModal" data-target="gridModal">明细</button>
					</view>
				</view> -->
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
							<text class="text-black text-bold"> 进货价：</text><text
								class="text-price text-red">{{xz_shangpins.Purchase_price}}</text>
						</view>
						<view class="action">
							<text class="text-black text-bold"> 原单价：</text></text><text
								class="text-price text-red">{{xz_shangpins.unit_price}}</text>
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
					<view class=" flex flex-direction" @click="Y_add">
						<button class="cu-btn bg-blue margin-tb-sm lg">添加</button>
					</view>

				</view>
			</view>

		</view>
		<view v-for="(item,index) in tableData" :key="index">
			<view class="cu-list menu-avatar">
				<view class="cu-item">
					<image class="cu-avatar by lg"
						:src="item.product_main_image?item.product_main_image:'../../static/logo.jpg'" mode=""></image>
					<view class="content flex-sub">
						<view class="text-grey">
							<text class="text-cut" style="width:220px"> {{item.product_name}}</text>
							<!-- 							<view style="padding-left: 40rpx;" v-if="Original.Warehouse_sh==0">
								<button class="cu-btn sm bg-red  " @tap="deletes" :data-item="item">删除</button>
							</view> -->
						</view>

						<view class="text-gray text-sm flex justify-between">
							数量 X {{item.product_quantity}}
							<view class="text-gray text-sm">
								<text class="text-price text-red">{{item.total_price}}</text>
							</view>
						</view>
					</view>

				</view>
			</view>
		</view>
		<view style="padding-top: 10px;"></view>
		<view v-if="Original.remarks">
			<view class="cu-bar by bg-white sby solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>备注
				</view>
			</view>
			<view class="cu-form-group xby">
				<textarea maxlength="-1" :placeholder="Original.remarks"></textarea>
			</view>

			<view style="padding-top: 10px;"></view>
		</view>
		<view v-if="Coupons_list">
			<view class="cu-bar sby bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>优惠
				</view>
			</view>
			<view v-for="(item,index) in Coupons_list" :key="index">
				<view class="cu-bar by  bg-white solid-bottom ">
					<view class="action">
						{{item}}
					</view>
				</view>
			</view>
			<view style="padding-top: 20px;"></view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				New: false,
				Yid: '',
				tableData: '',
				Original: '',
				shangpin2: '', //商品
				shangpins: '', //商品列表
				xz_shangpins: '', //选中商品
				level2: '', //等级单价
				F_shuliang2: '', //发货数
				Total_price: '', //總價
				receipt_photo_list: [],
				Coupons_list: [], //优惠列表

			}
		},
		onLoad(e) {
			const o = uni.getStorageSync('items');
			this.Original = o;
			this.Yid = e.Yid;
			this.Coupons_list = JSON.parse(o.Coupons_list);
			console.log(this.Coupons_list);
			if (o.Warehouse_sh == 3) {
				this.receipt_photo_list = JSON.parse(o.receipt_photo_list)
			}
			this.get_preorder()
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: e.currentTarget.dataset.item,
					current: e.currentTarget.dataset.url
				});
			},
			// 在页面的JS文件中
			copyText: function(e) {
				console.log()
				uni.setClipboardData({
					data: e.currentTarget.dataset.id,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'success',
							duration: 2000
						});
					},
					fail: function(err) {
						uni.showToast({
							title: '复制失败',
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			//获取用户商品
			get_preorder() {
				let that = this
				that.tableData = '';
				let in_data = {
					Type: "search",
					Table: "orders",
					condition_name1: "Yid",
					condition1: that.Yid,
					page_size: 10000,
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
			deletes(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.showModal({
					title: '提示',
					content: '确定要删除这个商品吗',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定', item);
							const in_data = {
								id: item.id, //删除ID
								Yid: item.Yid, //管鏈订单ID 重新计算库存
								product_id: item.product_id, //商品ID
								order_list_id: uni.getStorageSync('items').id, //原订单ID
								product_quantity: item.product_quantity, // 回退商品库存数
								Table: "orders",
								Type: "orders_delete",
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
			News() {
				this.New = true;
				this.xz_shangpins = '';
				this.shangpins = '';
				this.shangpin2 = '';
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
				this.New = false;
				this.djj()
			},
			djj() {
				let item = this.xz_shangpins;
				let level = this.Original.customer_level;
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
			},
			//等级单价输入
			F_level_price(event) {
				let xz_shangpins = this.xz_shangpins;
				let level2 = event.target.value;

				this.level2 = level2
				this.Total_price = (this.F_shuliang2 * level2).toFixed(2);


				// if (parseFloat(level2) < parseFloat(xz_shangpins.Purchase_price)) {
				// 	uni.showToast({
				// 		title: '等级单价不能小于进货价',
				// 		duration: 1000,
				// 		icon: 'error'
				// 	});
				// 	this.djj()
				// } else {
				// 	this.level2 = level2
				// 	this.Total_price = (this.F_shuliang2 * level2).toFixed(2);
				// }

			},
			//发货数量 输入
			F_shuliang(event) {
				let that = this
				let xz_shangpins = that.xz_shangpins;
				let F_shuliang2 = event.target.value;
				that.F_shuliang2 = F_shuliang2
				that.Total_price = (F_shuliang2 * that.level2).toFixed(2);


				// if (parseFloat(F_shuliang2) <= parseFloat(xz_shangpins.stock)) {} else {
				// 	uni.showToast({
				// 		title: '库存最多' + xz_shangpins.stock,
				// 		duration: 1000,
				// 		icon: 'error'
				// 	});
				// 	that.F_shuliang2 = 0;
				// 	that.Total_price = 0;
				// }

			},
			//添加下单
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
					return
				}
				let sp = that.xz_shangpins;
				let in_data = {
					order_list_id: uni.getStorageSync('items').id, //原订单ID
					Yid: that.Yid,
					product_id: sp.id, //商品ID
					product_name: sp.product_name, //商品名
					product_specification: sp.specification, //商品规格
					product_unit: sp.specification_quantity, //商品单位
					product_quantity: that.F_shuliang2, //商品数量
					level_price: that.level2, //商品原价
					total_price: that.Total_price, //商品总价
					Type: "orders_add",
					Table: "orders",
				}
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
			}
		},
	}
</script>

<style>

</style>