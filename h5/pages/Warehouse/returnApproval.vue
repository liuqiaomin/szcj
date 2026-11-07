<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">退回详情</block>
		</cu-custom>
		<view class="padding-sm" v-if="Original">
			<view class="cu-bar sby bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-title text-orange "></text>配送员：{{Original.delivery_person}}
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
		</view>
		<view class="cu-bar by bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-orange "></text>退货列表
			</view>
		</view>
		<view class="padding-sm">
			<view v-for="(item,index) in tableData" :key="index">
				<view class="cu-list menu-avatar by">
					<view class="cu-item">
						<image @tap="ViewImage" :data-url="item.main_image_sh" class="cu-avatar by lg"
							:src="item.main_image_sh?item.main_image_sh:'../../static/logo.jpg'" mode="">
						</image>
						<view class="content flex-sub">
							<view class="text-grey">
								<text class="text-cut" style="width:220px"> {{item.product_name}}</text>
								<view class="text-gray text-sm flex justify-between">
									{{item.product_quantity}} {{item.product_unit}}

								</view>
							</view>

						</view>

					</view>
				</view>
			</view>
		</view>
		<view style="padding: 100rpx;"></view>
		<view class="padding-sm new" @click="up">
			<view class=" flex flex-direction">
				<button class="cu-btn bg-orange margin-tb-sm lg">确认收到以上退货</button>
			</view>
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

			}
		},
		onLoad(e) {
			this.Original = uni.getStorageSync('items');
			this.Yid = e.Yid;
			console.log(this.Original);
			this.get_preorder()
		},
		methods: {
			ViewImage(e) {
				uni.previewImage({
					urls: e.currentTarget.dataset.item,
					current: e.currentTarget.dataset.url
				});
			},
			//获取用户商品
			get_preorder() {
				let that = this
				that.tableData = '';
				let in_data = {
					Type: "search2",
					Table: "orders",
					condition_name1: "Yid",
					condition1: that.Yid,
					condition_name2: "state",
					condition2: 1,
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
			up() {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确认收到以上退货吗?',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							let in_data = {
								Type: "order_list_state_TH_up",
								Table: "order_list",
								id: that.Original.id, //订单ID
								Yid: that.Original.order_list_id, //商品列表ID
								state: 6,
							};
							uni.$emit(
								'r',
								in_data,
								function(res2) {
									let res = res2.data;
									if (res.status.error_msg == "success") {
										uni.showToast({
											title: '更新成功',
											duration: 1000,
											icon: 'success'
										});
										uni.navigateBack(1)
									} else {
										uni.showToast({
											title: '更新失败',
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
		},
	}
</script>

<style>

</style>