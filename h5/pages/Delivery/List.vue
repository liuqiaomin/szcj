<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">配送中心</block>
		</cu-custom>
		<view class="new">
			<scroll-view scroll-x class=" bg-blue  nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?' text-bold text-xl  text-black cur':''"
						v-for="(item,index) in TabCur_list" :key="index" @tap="tabSelect" :data-id="index">
						{{item}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="padding-sm">
			<view v-if="TabCur==0">
				<view class="" v-for="(item,index)  in tableData" :key="index">
					<view class="cu-bar sby bg-white solid-bottom ">
						<view class="action">
							<text class="text-blue text-bold  text-xxl">{{item.customer_name}}</text>
						</view>
						<view class="action">
							<button class="cu-btn  sm shadow" @tap="Details"
								:data-i="item.id">详情</button>
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom ">
						<view class="action">
							{{item.customer_address}}
						</view>
						<view class="action">
							<button class="cu-btn sm bg-green shadow" @tap="GrabOrder" :data-item="item">抢单</button>
						</view>
					</view>
					<view class="cu-bar xby  bg-white solid-bottom ">
						<view class="action">
							下单时间
						</view>
						<view class="action">
							{{item.created_time}}
						</view>
					</view>
					<view class="fgx"></view>
				</view>
			</view>
			<view v-if="TabCur==1">
				<view class="" v-for="(item,index)  in tableData" :key="index">
					<view class="cu-bar sby bg-white solid-bottom ">
						<view class="action">
							<text class="text-blue text-bold  text-xxl">{{item.customer_name}}</text>
						</view>
						<view class="action">
							<button class="cu-btn bg-gradual-blue sm shadow" @tap="Details"
								:data-i="item.id">详情</button>
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom ">
						<view class="action">
							{{item.customer_phone}}
						</view>
						<view class="action">
							<button class="cu-btn sm shadow" @tap="MakeCall" :data-ph="item.customer_phone">拨打</button>
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom ">
						<view class="action">
							{{item.customer_address}}
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom ">
						<view class="action">
							下单时间
						</view>
						<view class="action">
							{{item.created_time}}
						</view>
					</view>
					<view class="cu-bar xby  bg-white solid-bottom " v-if="item.rob_time">
						<view class="action">
							抢单时间
						</view>
						<view class="action">
							{{item.rob_time}}
						</view>
					</view>
					<view class="fgx"></view>
				</view>
			</view>
			<view v-if="TabCur==2">
				<view class="" v-for="(item,index)  in tableData" :key="index">
					<view class="cu-bar sby bg-white solid-bottom ">
						<view class="action">
							订单ID：{{item.id}}
						</view>
						<view class="action" @click="copyText" :data-id="item.id">
							<button class="cu-btn sm bg-white ">复制</button>
						</view>
					</view>
					<view class="cu-bar  bg-white solid-bottom ">
						<view class="action">
							<text class="text-blue text-bold  text-xxl">{{item.customer_name}}</text>
						</view>
						<view class="action">
							<button class="cu-btn bg-gradual-blue sm shadow" @tap="Details"
								:data-i="item.id">详情</button>
						</view>
					</view>

					<view class="cu-bar   bg-white solid-bottom " v-if="item.customer_phone">
						<view class="action">
							{{item.customer_phone}}
						</view>
						<view class="action">
							<button class="cu-btn sm shadow" @tap="MakeCall" :data-ph="item.customer_phone">拨打</button>
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom " v-if="item.customer_address">
						<view class="action">
							{{item.customer_address}}
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom " v-if="item.created_time">
						<view class="action">
							下单时间
						</view>
						<view class="action">
							{{item.created_time}}
						</view>
					</view>
					<view class="cu-bar   bg-white solid-bottom " v-if="item.rob_time">
						<view class="action">
							抢单时间
						</view>
						<view class="action">
							{{item.rob_time}}
						</view>
					</view>
					<view class="cu-bar xby  bg-white solid-bottom " v-if="item.reach_time">
						<view class="action">
							完成时间
						</view>
						<view class="action">
							{{item.reach_time}}
						</view>
					</view>
					<view class="fgx"></view>
				</view>
			</view>
		</view>
		<view style="padding: 100rpx;"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				TabCur_list: [
					'大厅', '配送中', '已完成',
				],
				TabCur: 0,
				scrollLeft: 0,
				page: 1,
				total: 0,
				tableData: [],
				page_size: 10
			}
		},
		onLoad(e) {
			if (e.TabCur) {
				this.TabCur = e.TabCur;
				this.get_order_list_3()
			} else {
				this.get_order_list();
			}
		},
		// 下拉刷新
		onReachBottom() {
			console.log('下拉刷新', this.tableData.length, this.total)
			if (this.tableData.length == this.total) {
				uni.showToast({
					icon: 'none',
					title: '全部在这了',
					duration: 2000
				})
				return
			}
			this.page = this.page + 1
			if (this.TabCur == 0) {
				this.get_order_list();
			}
			if (this.TabCur == 1) {
				this.get_order_list_2();
			}

			if (this.TabCur == 2) {
				this.get_order_list_3();
			}
			setTimeout(() => {
				// ...  这里写刷新时需要完成的数据加载
				uni.stopPullDownRefresh(); //停止刷新
			}, 1000)
		},
		methods: {
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
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.page = 1;
				this.tableData = [];
				this.page_size = 10;
				this.total = 0;
				// 
				if (e.currentTarget.dataset.id == 0) {
					this.get_order_list();
				}
				if (e.currentTarget.dataset.id == 1) {
					this.get_order_list_2();
				}

				if (e.currentTarget.dataset.id == 2) {
					this.get_order_list_3();
				}
			},
			//获取未分配配送员的订单
			get_order_list: function(e) {
				let that = this;
				let in_data = {
					Type: "order_list_PS_DT",
					Table: "order_list",
					page: that.page,
					page_size: that.page_size,
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {

						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = that.tableData.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);
							if (res.bizobj.length == 0) {
								uni.showToast({
									title: '暂无订单!',
									duration: 1000,
									icon: 'error'
								});
							}
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//获取分配当前配送员的订单 未完成的订单
			get_order_list_2: function(e) {
				console.log(uni.getStorageSync('login'));
				let that = this;
				let in_data = {
					Type: "order_list_PS_DT_wwc",
					Table: "order_list",
					ORDER_nane: 'created_time',
					ORDER_da: 'desc',
					page: that.page,
					page_size: that.page_size,
					delivery_person_id: uni.getStorageSync('login').admin_id
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {

						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = that.tableData.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);
							if (res.bizobj.length == 0) {
								uni.showToast({
									title: '暂无订单!',
									duration: 1000,
									icon: 'error'
								});
							}
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//获取分配当前配送员的订单 完成的订单
			get_order_list_3: function(e) {
				let that = this;
				let in_data = {
					Type: "order_list_PS_DT_wc",
					Table: "order_list",
					page: that.page,
					ORDER_nane: 'reach_time',
					ORDER_da: 'DESC',
					page_size: that.page_size,
					delivery_person_id: uni.getStorageSync('login').admin_id
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {

						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = that.tableData.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);
							if (res.bizobj.length == 0) {
								uni.showToast({
									title: '暂无订单!',
									duration: 1000,
									icon: 'error'
								});
							}
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//抢单
			GrabOrder(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.showModal({
					title: '提示',
					content: '确定要抢【' + item.customer_name + '】,这个订单吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定', item);
							// return
							let in_data = {
								Type: "orders_DistributeDelivery_up",
								Table: "order_list",
								id: item.id,
								delivery_person_id: uni.getStorageSync('login').admin_id,
								delivery_person: uni.getStorageSync('login').username
							};
							uni.$emit(
								'r',
								in_data,
								function(res2) {

									let res = res2.data;
									if (res.status.error_msg == '抢单成功') {
										uni.showToast({
											title: res.status.error_msg,
											duration: 1000,
											icon: 'success'
										});
										that.page = 1;
										that.tableData = [];
										that.page_size = 10;
										that.total = 0;
										that.get_order_list()
									} else {
										uni.showToast({
											title: res.status.error_msg,
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
			//拨打电话
			MakeCall(e) {
				let that = this
				uni.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.ph //仅为示例
				});
			},
			//详情
			Details(e) {
				console.log(e);
				let that = this
				uni.navigateTo({
					url: '/pages/Delivery/Details?i=' + e.currentTarget.dataset.i
				})
			}
		}
	}
</script>

<style>
	.new {
		width: 100%;
		position: fixed;
		bottom: 0rpx;
		z-index: 99;
	}
</style>