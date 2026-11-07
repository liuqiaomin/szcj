<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content">盘点列表</block>
		</cu-custom>
		<view class="padding-sm">
			<view v-for="(item,index) in List" :key="index">
				<view　@tap="addg" :data-item="item" class="cu-list menu card-menu margin-sm  ">
					<view class="cu-item arrow" :class="item.XY==1?'text-black':'text-grey'">
						<view class="content">
							<text class="cuIcon-edit "></text>
							<text>{{item.Inventory_name}}-{{item.XY==1?'进行中':'已停止'}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		callWithErrorHandling
	} from "vue";
	export default {
		data() {
			return {
				List: [], //商品
				total: 0,
				page: 1,
				page_size: 1000
			}
		},
		// 下拉刷新
		onReachBottom() {
			console.log('下拉刷新', this.List.length, this.total)
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
		onLoad() {
			this.List_get();
		},
		methods: {
			//列表
			List_get() {
				let that = this
				let in_data = {
					Type: "get",
					Table: "Inventory",
					page: that.page,
					page_size: that.page_size,
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.List = that.List.concat(res.bizobj);
							that.total = Number(res.page_info.total_items);

						} else {
							uni.showToast({
								title: '无任务！',
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
			//商品选中
			addg(e) {
				let item = e.currentTarget.dataset.item;
				console.log(item);
				if(item.XY==0){
					uni.showToast({
						title: '已停止盘点！',
						duration: 1000,
						icon: 'error'
					});
				}else{
				uni.navigateTo({
					url: '/pages/AuditEvent/add?id=' + item.id + '&name=' + item.Inventory_name
				})	
				}
				
			}
		},

	}
</script>

<style>
	.padding-sm {
		padding: 1px;
	}
</style>