<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">财务审核</block>
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
		<view>
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
			<view class="" v-for="(item,index)  in List" :key="index">
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>商家：{{item.customer_name}}
					</view>
					<view class="action">
						订单ID: {{item.id}} </view>
				</view>
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>开单人：{{item.created_by}}
					</view>
				</view>
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="cuIcon-title text-orange "></text>配送员：{{item.delivery_person}}
					</view>
					<view class="action">
						<view class=" sm by text-price text-red">{{item.order_total_price}}</view>
					</view>
				</view>

				<view class="cu-bar xby  bg-white solid-bottom ">
					<view class="action">
						完成时间：{{item.reach_time}}
					</view>
					<view class="action">
						<button :class="item.is_paid==1?'bg-blue':'bg-white'" class="cu-btn sm  shadow"
							@tap="Collection" :data-item="item">{{item.is_paid==1?'已收款':'待收款'}}</button>
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
				List: [],
				page: 1,
				page_size: 10,
				total: '',

				TabCur_list: [
					'未收款', '已收款',
				],
				TabCur: 0,
				scrollLeft: 0,
			}
		},

		onLoad() {
			this.get()
		},
		// 下拉刷新
		onReachBottom() {
			if (this.List.length == this.total) {
				uni.showToast({
					icon: 'none',
					title: '全部在这了',
					duration: 2000
				})
				return
			}
			this.page = this.page + 1
			this.get()
			setTimeout(() => {
				// ...  这里写刷新时需要完成的数据加载
				uni.stopPullDownRefresh(); //停止刷新
			}, 1000)
		},
		methods: {

			tabSelect(e) {
				this.List = [];
				this.page = 1;
				this.page_size = 10;
				this.total = '';
				this.TabCur = e.currentTarget.dataset.id;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
				this.get()
			},

			get() {
				let that = this
				let in_data = {
					Type: "search",
					Table: "order_list",
					condition_name1: 'is_paid',
					condition1: that.TabCur,
					page: that.page,
					page_size: that.page_size,
					ORDER_nane: 'id',
					ORDER_da: 'desc',
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.List = that.List.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);
						}
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//重制
			empty() {
				this.ID = '';
				this.customer_name = '';
				this.List = [];
				this.page = 1;
				this.page_size = 10;
				this.get();
			},
			//ID输入
			IDs(event) {
				let that = this
				that.ID = event.target.value
			},

			//ID搜索
			search() {
				let that = this
				that.List = [];
				let in_data = {
					Type: "search2",
					Table: "order_list",
					condition_name1: 'ID',
					condition1: that.ID,
					condition_name2: 'is_paid',
					condition2: that.TabCur,
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
							that.List = res.bizobj;
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
				that.List = [];
				let in_data = {
					Type: "search2",
					Table: "order_list",
					condition_name1: 'customer_name',
					condition1: that.customer_name,
					condition_name2: 'is_paid',
					condition2: that.TabCur,
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
							that.List = res.bizobj;
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


			Collection(e) {
				let that = this
				let item = e.currentTarget.dataset.item
				if (item.is_paid == 1) {
					uni.showToast({
						title: '已收款！',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				uni.showModal({
					title: '提示',
					content: '收到订单ID为:【' + item.id + '】的【' + item.order_total_price + '元】' + '的货款？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							let in_data = {
								Type: "order_list_is_paid_up",
								Table: "order_list",
								id: item.id,
								is_paid_name: uni.getStorageSync('login').username
							};
							uni.$emit(
								'r',
								in_data,
								function(res2) {
									let res = res2.data;
									if (res.status.error_code == 0) {
										uni.showToast({
											title: '更新成功',
											duration: 1000,
											icon: 'success'
										});
										that.empty()

									} else {
										uni.showToast({
											title: '更新失败！',
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
			}

		}
	}
</script>

<style>

</style>