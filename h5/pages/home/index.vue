<template name="basics">
	<view>
		<cu-custom bgColor="bg-gradual-blue">
			<block slot="content">欢迎您--{{username}} </block>
		</cu-custom>
		<scroll-view scroll-y class="page">
			<view style="padding: 20rpx;background-color: #ffffff;"></view>
			<!-- 			<image src="/static/logo.jpg" mode="widthFix" class="response"></image> -->
			<view class="nav-list">
				<navigator v-if="item.XY" hover-class="none" :url="item.url" class="nav-li" navigateTo
					:class="'bg-'+item.color" :style="[{animation: 'show ' + ((index+1)*0.2+1) + 's 1'}]"
					v-for="(item,index) in elements" :key="index">
					<view class="nav-title">{{item.title}}</view>
					<view class="nav-name">{{item.name}}</view>
					<text :class="'cuIcon-' + item.cuIcon"></text>
				</navigator>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
		<navigator url="/pages/logon/index?ex=0" style="position: fixed; bottom: 0rpx;left: 230rpx;">
			<view class="text-center padding">深圳餐具 v1.0.0 <text class="padding text-blue">退出账号</text> </view>
		</navigator>
	</view>
</template>

<script>
	import {
		callWithErrorHandling
	} from "vue";
	export default {
		name: "basics",
		data() {
			return {
				elements: [],
				username: ''
			}
		},
		onShow() {
			let that = this
			uni.request({
				url: 'https://xcx.szhxch.com/api/Mobile/login.php', //仅为示例，并非真实接口地址。
				header: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				method: "POST",
				data: {
					username: uni.getStorageSync('login').username,
					password: uni.getStorageSync('login').password,
					code_key: uni.getStorageSync('login').sys_token,
				},

				success: (res) => {
					if (res.data.status.error_code == 0) {
						let o = res.data.bizobj.elements;
						that.elements = res.data.bizobj.elements
						that.username = uni.getStorageSync('login').username
						const hasTrueXY = o.some(obj => obj.XY === true);
						if (hasTrueXY) {
							uni.setStorage({
								key: 'login',
								data: res.data.bizobj,
								success: function() {}
							})
						} else {
							uni.showToast({
								title: '暂无任何权限,请联系您的上级！',
								duration: 1000000,
								icon: 'error'
							});
						}

					}
				}
			});
		},
		methods: {

		}
	}
</script>

<style>
	.page {
		height: 100%;
		background-color: #ffffff;
	}

	page {
		background-color: #ffffff;
	}
</style>