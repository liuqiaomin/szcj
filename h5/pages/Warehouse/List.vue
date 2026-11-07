<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">审核列表</block>
		</cu-custom>
		<view class="cu-bar bg-white search ">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" @input="IDs" placeholder="搜索订单ID" :value="ID" confirm-type="search"></input>
				<text class="cuIcon-delete" v-if="ID" @click="empty"></text>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur
				 round" @click="search">搜索</button>
			</view>
		</view>
		<view class="cu-bar bg-white search ">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" @input="customer_name_in" placeholder="搜索商家名" :value="customer_name"
					confirm-type="search"></input>
				<text class="cuIcon-delete" v-if="customer_name" @click="empty"></text>
			</view>
			<view class="action">
				<button class="cu-btn bg-green shadow-blur
				 round" @click="customer_name_ou2">搜索</button>
			</view>
		</view>
		<scroll-view scroll-x class="bg-white nav">
			<view class="flex text-center">
				<view class="cu-item flex-sub" :class="index==TabCur?'text-orange cur':''"
					v-for="(item,index) in TabCur_list" :key="index" @tap="tabSelect" :data-id="index">
					{{item}}
				</view>
			</view>
		</scroll-view>
		<view class="padding-sm" v-if="TabCur==0">
			<view class="margin-top"></view>
			<view class="" v-for="(item,index)  in tableData" :key="index">
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="text-blue text-bold  text-xxl">{{item.customer_name}}</text>
					</view>
					<view class="action">
						<text class="cuIcon-title text-orange "></text>ID {{item.id}}
					</view>
				</view>
				<view class="cu-bar  bg-white solid-bottom ">
					<view class="action">
						总价 {{item.order_total_price}}
					</view>
				</view>
				<view class="cu-bar xby  bg-white solid-bottom ">
					<view class="action">
						下单时间：{{item.created_time}}
					</view>
					<view class="action">
						<button :class="item.Warehouse_sh==0?'bg-orange':'bg-white'" class="cu-btn sm " @tap="chakan"
							:data-item="item">{{item.Warehouse_sh==0?'去审核':'已审核'}}</button>
					</view>
					<view class="action" v-if="item.order_total_price==0">
						<button class="cu-btn sm bg-red shadow" @tap="deletes" :data-item="item">删除</button>
					</view>
				</view>
				<view class="fgx"></view>
			</view>
		</view>
		<view class="padding-sm" v-else>
			<view v-if="item.refund==1" class="" v-for="(item,index)  in tableData" :key="index">
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="text-blue text-bold  text-xxl">{{item.customer_name}}</text>
					</view>
					<view class="action">
						<text class="cuIcon-title text-orange "></text>ID {{item.id}}
					</view>
				</view>
				<view class="cu-bar  bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>配送员{{item.delivery_person}}
					</view>
					<view class="action">
						最终价 {{item.order_total_price}}
					</view>
				</view>
				<view class="cu-bar xby  bg-white solid-bottom ">
					<view class="action">
						{{item.created_time}}
					</view>
					<view class="action">
						<button class="cu-btn sm bg-white shadow" @tap="returnApprovals" :data-item="item">去审核</button>
					</view>
				</view>
				<view class="fgx"></view>
			</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				ID: '',
				customer_name: '',


				switchA: false,
				TabCur_list: [
					'出库审核', '退货审核'
				],
				TabCur: 0,
				scrollLeft: 0,
				page: 1,
				tableData: [],
				page_size: 10,
				Table: "order_list",
			}
		},
		onShow() {
			this.cz();
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
			this.get_order_list()
			setTimeout(() => {
				// ...  这里写刷新时需要完成的数据加载
				uni.stopPullDownRefresh(); //停止刷新
			}, 1000)
		},
		methods: {
			// 隐藏已审核
			SwitchA(e) {
				this.switchA = e.detail.value
			},
			deletes(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.showModal({
					title: '提示',
					content: '确定要删除【' + item.customer_name + '】这个订单吗',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定', item);
							const in_data = {
								Table: "order_list",
								id: item.id, //删除ID
								Type: "delete",
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
										that.cz();
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
			cz() {
				this.page = 1;
				this.tableData = [];
				this.page_size = 10;
				this.get_order_list()
			},
			tabSelect(e) {
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.cz();
			},
			//获取订单
			get_order_list: function(e) {
				let that = this;
				if (that.TabCur == 0) {
					let in_data = {
						Type: "Warehouse_get",
						Table: "order_list",
						page: that.page,
						page_size: that.page_size,
						ORDER_nane: 'created_time',
						ORDER_da: 'asc'
					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							console.log(res);
							if (res.status.error_msg == "success") {
								that.tableData = that.tableData.concat(res.bizobj);
								that.total = Number(res.page_info.total_items);
							} else {
								uni.showToast({
									title: '无出库！',
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

				if (that.TabCur == 1) {
					let that = this;
					let in_data = {
						Type: "search",
						Table: "order_list",
						page: that.page,
						page_size: that.page_size,
						condition_name1: "refund",
						condition1: 1,
					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							console.log(res2);
							let res = res2.data;
							if (res.status.error_msg == "success") {
								that.tableData = that.tableData.concat(res.bizobj);
								that.total = Number(res.page_info.total_items);
							} else {
								uni.showToast({
									title: '无退货！',
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
			chakan(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.setStorage({
					key: 'items',
					data: item,
					success: function() {
						console.log(uni.getStorageSync('items'));
					}
				})
				uni.navigateTo({
					url: './xq?id=' + item.id + '&Yid=' + item.order_list_id
				})
			},
			returnApprovals(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				uni.setStorage({
					key: 'items',
					data: item,
					success: function() {
						console.log(uni.getStorageSync('items'));
					}
				})
				uni.navigateTo({
					url: './returnApproval?id=' + item.id + '&Yid=' + item.order_list_id
				})
			},



			//重制
			empty() {
				this.ID = '';
				this.customer_name = '';
				this.tableData = [];
				this.page = 1;
				this.page_size = 50;
				this.get_order_list();
			},
			//ID输入
			IDs(event) {
				let that = this
				that.ID = event.target.value
			},

			//ID搜索
			search() {
				let that = this
				that.tableData = [];
				let in_data = {
					Type: "search",
					Table: "order_list",
					condition_name1: 'ID',
					condition1: that.ID,
					page_size: 100,
					ORDER_nane: 'id',
					ORDER_da: 'desc',
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.bizobj.length >= 1) {
							that.tableData = res.bizobj;
							console.log('111');

						} else {
							uni.showToast({
								title: '无订单!',
								duration: 1000,
								icon: 'error'
							});
						}
					}
				);
			},
			//商家输入
			customer_name_in(event) {
				let that = this
				that.customer_name = event.target.value
			},
			//商家搜索
			customer_name_ou2() {
				let that = this
				if (that.customer_name) {
					that.tableData = [];
					let in_data = {
						Type: "search",
						Table: "order_list",
						condition_name1: 'customer_name',
						condition1: that.customer_name,
						page_size: 100,
						ORDER_nane: 'id',
						ORDER_da: 'desc',
					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							if (res.bizobj.length >= 1) {
								that.tableData = res.bizobj;
								console.log('111');

							} else {
								uni.showToast({
									title: '无订单!',
									duration: 1000,
									icon: 'error'
								});
							}
						}
					);
				}
			},

		}
	}
</script>

<style>

</style>