<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">{{t.name}}-进行中</block>
		</cu-custom>
		<view class="cu-bar bg-white search ">
			<view class="search-form round">
				<text class="cuIcon-search"></text>
				<input type="text" @input="shangpin" :value="shangpin2" placeholder="搜索商品"
					confirm-type="search"></input>
			</view>
		</view>
		<view class="padding-sm" v-if="shangpins">
			<view v-for="(item,index) in shangpins" :key="index">
				<view @tap="up" :data-item="item" class="cu-bar bg-white by solid-bottom">
					<view class="action">
						{{item.product_name}}
					</view>
				</view>
			</view>
		</view>
		<view class="cu-bar bg-white solid-bottom" v-if="List">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text>盘点列表
			</view>
			<view class="action">
				<text class="cuIcon-title text-orange"></text>剩余盘点数({{total}})
			</view>
		</view>
		<view class="cu-list menu-avatar" v-if="List">
			<view class="cu-item" v-for="(item,index) in List" :key="index">
				<view class="cu-avatar round lg"
					style="background-image:url(https://ossweb-img.qq.com/images/lol/web201310/skin/big10006.jpg);">
				</view>
				<image @tap="ViewImage" :data-url="item.product_image" class="cu-avatar by lg" :src="item.product_image"
					mode=""></image>
				<view class="content flex-sub">
					<view class="">
						<view class="flex ">
							<view style="padding-right: 30rpx;">
								<view style="width: 350rpx;">{{item.product_name}}</view>
							</view>
							<view class="basis-xs"><button class="cu-btn sm bg-blue shadow" @tap="up"
									:data-item="item">修改</button></view>
							<!-- <view class="basis-xs "><button class="cu-btn sm bg-red shadow" @tap="deletes"
									:data-item="item">删除</button></view> -->
						</view>
					</view>
					<view class="text-gray text-sm flex justify-between">
						{{item.created_time}}
						<view class="text-gray text-sm">
							原库存:{{item.stock}}
							现库存:{{item.stock2}}
						</view>
					</view>

				</view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{item.product_name}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="cu-bar bg-white by solid-bottom">
					<view class="action">
						<text class="text-black text-bold">{{item.product_name}}</text>
					</view>

				</view>
				<view class="cu-bar bg-white by solid-bottom">
					<view class="action">
						<text class="text-black text-bold"> 规格：</text>{{item.product_specifications}}
					</view>
					<view class="action">
						<text class="text-black text-bold"> 单位：</text>{{item.product_unit}}
					</view>
				</view>
				<view class="cu-bar bg-white by solid-bottom">
					<view class="action">
						<text class="text-black text-bold">当前库存：{{item.stock}}</text>
					</view>
				</view>
				<view class="cu-form-group">
					<view class="title text-black text-bold">本次库存</view>
					<input placeholder="请输入本次库存" type="digit" name="input" @input="level2_ou" :value="level2"></input>
				</view>
				<view class="padding flex flex-direction" @click="up_add()">
					<button class="cu-btn bg-gradual-blue margin-tb-sm lg">保存盘点</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				shangpin2: '', //商品
				shangpins: [], //商品列表
				xz_shangpins: '', //选中商品
				level2: '', //本次库存
				t: '',
				List: [], //商品
				total: 0,
				page: 1,
				page_size: 10,
				modalName: '',
				item: ''
			}
		},
		onLoad(e) {
			if (e) {
				this.t = e
				this.List_get();
			}
		},
		onShow() {
			if (this.t.id == undefined) {
				uni.reLaunch({
					url: '/pages/AuditEvent/index'
				})
			}
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
			this.List_get();
			setTimeout(() => {
				// ...  这里写刷新时需要完成的数据加载
				uni.stopPullDownRefresh(); //停止刷新
			}, 1000)
		},
		methods: {

			cz() {
				let that = this
				that.shangpin2 = ''; //商品
				that.shangpins = ''; //商品列表
				that.xz_shangpins = ''; //选中商品
				that.level2 = ''; //本次库存
				that.List = []; //商品
				that.total = 0;
				that.page = 1;
				that.page_size = 10;
				that.modalName = null;
				that.List_get();
			},
			//搜索商品
			shangpin(event) {
				let that = this
				that.shangpin2 = event.target.value
				if (event.target.value.length == 0) {
					that.shangpins = '';
				} else {
					let in_data = {
						Type: "search2",
						Table: "Inventory_lsit",
						condition_name1: "product_name",
						condition1: event.target.value,

						condition_name2: "Inventory_id",
						condition2: that.t.id, //任务ID
						page: that.page,
						page_size: that.page_size,

					};
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							if (res.status.error_msg == "success") {
								that.shangpins = res.bizobj;
							} else {
								uni.showToast({
									title: '无相关商品！',
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
			//商品选中
			xz_sp(e) {
				let item = e.currentTarget.dataset.item
				this.xz_shangpins = item;
				this.shangpins = '';
				this.shangpin2 = '';

			},
			level2_ou(event) {

				this.level2 = event.target.value
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
								Table: "Inventory_lsit",
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
			showModal(e) {
				this.modalName = e.currentTarget.dataset.target
			},
			hideModal(e) {
				this.modalName = null
			},
			up(e) {
				let that = this
				let ite = e.currentTarget.dataset.item
				console.log(ite);
				that.item = ite;
				that.level2 = ite.stock2;
				that.modalName = 'Modal'

			},
			up_add() {
				let that = this
				if (that.level2) {
					let in_data = {
						Type: "Inventory_lsit_up",
						Table: "Inventory_lsit",
						id: that.item.id,
						stock2: that.level2,
						created_by: uni.getStorageSync('login').username,
						Cstock: that.item.stock - that.level2,
					}
					uni.$emit(
						'r',
						in_data,
						function(res2) {
							let res = res2.data;
							if (res.status.error_code == 0) {
								uni.showToast({
									title: '更新成功',
									duration: 5000,
									icon: 'error'
								});
								setTimeout(function() {
									that.cz();
								}, 1000);
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
				} else {
					uni.showToast({
						title: '请输入当前库存！',
						duration: 1000,
						icon: 'error'
					});
				}
			},
			//列表
			List_get() {
				let that = this
				let in_data = {
					Type: "search2",
					Table: "Inventory_lsit",
					condition_name1: "XY",
					condition1: 0,
					condition_name2: "Inventory_id",
					condition2: that.t.id, //任务ID
					page: that.page,
					page_size: that.page_size
				};

				uni.$emit(
					'r',
					in_data,
					function(res2) {
						console.log(res2);
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
			ViewImage(e) {
				uni.previewImage({
					urls: [e.currentTarget.dataset.url],
					current: e.currentTarget.dataset.url
				});
			},
		}
	}
</script>

<style>
</style>