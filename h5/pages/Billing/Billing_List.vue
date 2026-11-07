<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">开单列表</block>
		</cu-custom>
		<view class="padding-sm">
			<view class="cu-bar sby bg-white search ">
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
			<scroll-view scroll-x class="by bg-white nav">
				<view class="flex text-center">
					<view class="cu-item flex-sub" :class="index==TabCur?' text-bold text-blue cur':''"
						v-for="(item,index) in TabCur_list" :key="index" @tap="tabSelect" :data-id="index"
						:data-o="item.o">
						{{item.i}}
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="padding-sm">
			<view class="" v-for="(item,index)  in tableData" :key="index">
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						订单ID：{{item.id}}
					</view>
					<view class="action" @click="copyText" :data-id="item.id">
						<button class="cu-btn sm  shadow bg-white">复制</button>
					</view>
				</view>
				<view class="cu-bar sby bg-white solid-bottom ">
					<view class="action">
						<text class="text-blue text-bold  text-xl">{{item.customer_name}}</text>
					</view>
					<view class="action">
						总价 {{item.order_total_price}}
					</view>
				</view>
				<view class="cu-bar bg-white xby solid-bottom">
					<view class="action">
						财务是否收款
					</view>
					<view class="action">
						<button :class="item.is_paid==1?'bg-green':'bg-white'" class="cu-btn sm " @tap="chakan" :data-item="item">{{item.is_paid==1?'已收款':'未收款'}}</button>
						
					</view>
				</view>
				<view class="cu-bar xby  bg-white solid-bottom ">
					<view class="action">
						{{item.created_time}}
					</view>
					<view class="action">
						<button class="cu-btn sm bg-white shadow" @tap="daying" :data-id="item.id">分享</button>
					</view>
					<view class="action">
						<button class="cu-btn sm bg-gradual-blue shadow" @tap="chakan" :data-item="item">查看</button>
					</view>
					<view class="action" v-if="item.order_total_price==0">
						<button class="cu-btn sm bg-red shadow" @tap="deletes" :data-item="item">删除</button>
					</view>
				</view>
				<view class="fgx"></view>
			</view>
			<view v-if="tableData.length==0">
				<image style="width: 100%;" src="/static/data.png" mode="widthFix" />
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
				
				
				TabCur_list: [{
						i: '所有订单',
						o: 0
					},
					{
						i: '配送中',
						o: 2
					},
					{
						i: '待收款',
						o: 'Warehouse_sh3'
					},
					{
						i: '已完成',
						o: 3
					}
				],
				TabCur: 0,
				scrollLeft: 0,
				state: 0,

				page: 1,
				tableData: [],
				page_size: 20,
				total: ''
			}
		},
		onLoad() {
			this.get_order_list()
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
			cz() {
				this.page = 1;
				this.tableData = [];
				this.page_size = 10;
				this.get_order_list()
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
				this.state = e.currentTarget.dataset.o;
				this.scrollLeft = (e.currentTarget.dataset.id - 1) * 60;

				this.page = 1;
				this.tableData = [];
				this.page_size = 20;
				this.get_order_list()
			},
			get_order_list: function(e) {
				let that = this;
				let in_data = {
					Type: "k_get",
					Table: "order_list",
					created_by_id: uni.getStorageSync('login').admin_id,
					page: that.page,
					page_size: that.page_size,
					state: that.state,
					ORDER_nane: 'created_time',
					ORDER_da: 'desc',
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = that.tableData.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);
						}
					},
					function(error) {
						console.error(error);
					}
				);
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
					url: '/pages/Billing/Billing_xq?id=' + item.id + '&Yid=' + item.order_list_id
				})
			},
			daying(e) {
				window.location.href =
					"https://xcx.szhxch.com/api/Mobile/order.php?id=" + e.currentTarget.dataset.id

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