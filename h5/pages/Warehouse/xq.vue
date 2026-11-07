<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">订单详情</block>
		</cu-custom>
		<view class="padding-sm" v-if="Original">
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					订单类型:{{ Original.XY == 1 ? '小程序订单' : Original.XY == 0 ? '后台线下订单' : Original.XY == 2 ? '手机端下单' : '小程序预售' }}---
					{{ Original.mode == 0 ? '配送' : '自提' }}
				</view>
			</view>
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					{{Original.customer_name}}
				</view>
				<view class="action">
					等级：{{Original.customer_level}}
				</view>
			</view>
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					电话：{{Original.customer_phone}}
				</view>
			</view>
			<view class="cu-bar bg-white by solid-bottom">
				<view class="action">
					地址：{{Original.customer_address}}
				</view>
			</view>
			<view v-if="Original.remarks">
				<view class="cu-form-group by">
					<textarea maxlength="-1" :placeholder="Original.remarks" class="text-red"></textarea>
				</view>
				<view style="padding-top: 10px;"></view>
			</view>
		</view>
		<view class="cu-bar by bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>商品列表
			</view>
			<view class="action">
				<view class="title">{{d_y?'小图':'大图'}}模式</view>
				<view class="padding-left-lg">
					<switch @change="d_yA" :class="d_y?'checked':''" :checked="d_y?true:false"></switch>
				</view>
			</view>
			<view class="action" @click="News" v-if="Original.Warehouse_sh==0 &&Original.XY != 1">
				<button class="cu-btn sm bg-orange shadow">新增</button>
			</view>
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

		<view v-if="d_y">
			<view v-for="(item,index) in tableData" :key="index">
				<view class="cu-list menu-avatar by">
					<view class="cu-item">
						<image @tap="ViewImageSH" :data-url="item.main_image_sh" class="cu-avatar by lg"
							:src="item.main_image_sh?item.main_image_sh:'../../static/logo.jpg'" mode="">
						</image>
						<view class="content flex-sub">
							<view class="text-grey">
								<text class="text-cut" style="width:220px"> {{item.product_name}}</text>
								<view class="action">
									<button class="cu-btn sm  shadow" @tap="duotu" :data-item="item">多图</button>
								</view>
								<view class="action" v-if="Original.XY != 1">
									<button class="cu-btn sm bg-red shadow" @tap="deletes" :data-item="item">删除</button>
								</view>
							</view>
							<view class="text-gray text-sm flex justify-between">
								{{item.product_quantity}} {{item.product_unit}}
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
		<view class="bg-white" v-else>
			<view v-for="(item,index) in tableData" :key="index">
				<view class="padding-sm flex-container" @tap="duotu" :data-item="item">
					<view class="2">
						<image style="width: 200px; height: 200px;" @tap="ViewImageSH" class="by"
							:data-url="item.main_image_sh"
							:src="item.main_image_sh?item.main_image_sh:'../../static/logo.jpg'" mode="">
						</image>
					</view>
					<view class="view-2">
						<view class="action">
							<text class="text-cut text-xl" style="width:220px"> {{item.product_name}}</text>
						</view>
						<view style="height: 20px;"></view>
						<view class="text-red text-xxl flex justify-between">
							{{item.product_quantity}} {{item.product_unit}}
						</view>
						<view style="height: 20px;"></view>
						<view class="action">
							<button class="cu-btn sm  shadow" @tap="duotu" :data-item="item">多图</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view style="padding: 100rpx;"></view>
		<view class="padding-sm new" @click="shs">
			<view class=" flex flex-direction">
				<button class="cu-btn bg-orange margin-tb-sm lg">{{Original.Warehouse_sh==0?'审核出库':'已出庫'}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				d_y: true,
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

			}
		},
		onLoad(e) {
			this.Original = uni.getStorageSync('items');
			this.Yid = e.Yid;
			console.log(this.Original);
			this.get_preorder()
		},
		methods: {
			d_yA(e) {
				this.d_y = e.detail.value
			},
			duotu(e) {
				let in_data = {
					Type: "id_get",
					Table: "products",
					id: e.currentTarget.dataset.item.product_id,
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						let it = JSON.parse(res.bizobj.multi_images);
						console.log(it)
						if (it.length == 0) {
							uni.showToast({
								title: '暂无多图',
								duration: 2000,
								icon: 'error'
							});
						} else {
							let ii = [];
							for (let i = 0; i < it.length; i++) {
								console.log(it[i].url);
								ii.push(it[i].url)
							}
							uni.previewImage({
								urls: ii,
								current: ii[0]
							});
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			ViewImage(e) {
				uni.previewImage({
					urls: e.currentTarget.dataset.item,
					current: e.currentTarget.dataset.url
				});
			},
			ViewImageSH(e) {
				uni.previewImage({
					urls: [e.currentTarget.dataset.url],
					current: e.currentTarget.dataset.url
				});
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
					page: 1,
					page_size: 10000
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
			//等级单价
			F_level_price(event) {
				let xz_shangpins = this.xz_shangpins;
				this.level2 = event.target.value
				this.Total_price = (this.F_shuliang2 * event.target.value).toFixed(2);
			},
			//发货数量 输入
			F_shuliang(event) {
				let that = this
				let xz_shangpins = that.xz_shangpins;
				let F_shuliang2 = event.target.value;
				that.F_shuliang2 = F_shuliang2
				that.Total_price = (F_shuliang2 * that.level2).toFixed(2);
			},


			//添加下单
			Y_add() {
				let that = this
				let sp = that.xz_shangpins;
				if (parseFloat(that.level2) < parseFloat(sp.Purchase_price)) {
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
				if (parseFloat(that.F_shuliang2) <= parseFloat(sp.stock)) {
					console.log('合理库存')
				} else {
					uni.showModal({
						title: '库存提示',
						content: '库存最多' + sp.stock + ',请重填！',
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
			},

			shs() {
				let that = this
				if (that.Original.Warehouse_sh == 0) {
					uni.showModal({
						title: '提示',
						content: '确定操作审核出库吗？',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								let in_data = {
									Type: "orders_Warehouse_sh_up",
									Table: "order_list",
									id: that.Original.id,
								};
								uni.$emit(
									'r',
									in_data,
									function(res2) {
										let res = res2.data;
										if (res.status.error_msg == "success") {
											uni.showToast({
												title: '出库成功',
												duration: 1000,
												icon: 'success'
											});
											uni.navigateBack(1)
										} else {
											uni.showToast({
												title: '出库失败',
												duration: 1000,
												icon: 'error'
											});
										}
									},
								);
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
			}
		},
	}
</script>

<style>
	/* 左右布局的容器样式 */
	.flex-container {
		display: flex;
		/* 使用flex布局 */
		justify-content: space-between;
		/* 子元素之间的间距平均分布 */
		align-items: center;
		/* 垂直居中对齐 */
	}

	/* 左侧图片区域样式 */
	.view-2 {
		flex: 1;
		/* 占据剩余空间 */
		margin-right: 10px;
		/* 与右侧区域的间距 */
	}

	/* 右侧文本区域样式 */
	.view-2:last-child {
		flex: 2;
		/* 占据更多空间，根据需要调整 */
		margin-left: 10px;
		/* 与左侧区域的间距 */
	}
</style>