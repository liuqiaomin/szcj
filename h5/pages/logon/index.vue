<template>
	<view class="top">
		<view class="text-center">
			<image class="top_img " src="../../static/logo.jpg" mode="aspectFill"></image>
		</view>
		<view class="fgx"></view>
		<view class="flex-sub text-center">
			<view class="text-xs ">
				<text class="text-gray">深圳餐具手机端</text>
			</view>
			<view class="padding text-gray">v1.0</view>
		</view>
		<view style="padding-top: 150rpx;"></view>
		<view class="cu-form-group">
			<view class="title">账号：</view>
			<input placeholder="请输入您的账号" @input="on_zhangh" name="input" :value="zhangh"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">密码：</view>
			<input placeholder="请输入您的密码" @input="on_mima" name="input" :value="mima"></input>
		</view>
		<view class="cu-form-group">
			<view class="title">验证码</view>
			<input placeholder="请输入验证码" maxlength="4" name="input" @input="on_code"></input>
			<view class='cu-btn bg-gray by'>{{getCaptchaCode.code}}</view>
		</view>
		<view style="padding: 30rpx;"></view>
		<view class="padding flex flex-direction" @click="logon">
			<button class="cu-btn bg-blue margin-tb-sm lg">登录</button>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				zhangh: '',
				mima: '',
				code: '',
				getCaptchaCode: {
					code: ''
				}
			}
		},
		onLoad(e) {
			console.log(e);
			if(e.ex==0){
				uni.setStorage({
					key: 'login',
					data: '',
					success: function(e) {
						console.log(e);
					}
				})
			}
		},
		onShow() {
			if (uni.getStorageSync('login')) {
				this.zhangh = uni.getStorageSync('login').username;
				this.mima = uni.getStorageSync('login').password;
			} else {
				this.get_CaptchaCode()

			}
		},
		methods: {
			get_CaptchaCode() {
				let that = this
				uni.request({
					url: 'https://xcx.szhxch.com/api/Mobile/getCaptchaCode.php', //仅为示例，并非真实接口地址。
					header: {
						"Content-Type": "application/x-www-form-urlencoded",
					},
					success: (res) => {
						that.getCaptchaCode = res.data.bizobj
					}
				});
			},
			on_zhangh: function(event) {
				this.zhangh = event.target.value
			},
			on_mima: function(event) {
				this.mima = event.target.value
			},
			on_code: function(event) {
				this.code = event.target.value
			},
			logon() {
				let that = this
				let zhangh = that.zhangh;
				let mima = that.mima;
				let code = that.code;
				console.log(that.getCaptchaCode.code);
				if (zhangh && mima) {
					if (code != that.getCaptchaCode.code) {
						uni.showToast({
							title: '验证码不正确！',
							duration: 2000,
							icon: 'error'
						});
						that.get_CaptchaCode()
						return
					}
					uni.request({
						url: 'https://xcx.szhxch.com/api/Mobile/login.php', //仅为示例，并非真实接口地址。
						header: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						method: "POST",
						data: {
							username: zhangh,
							password: mima,
							code_key: that.getCaptchaCode.code_key,
						},

						success: (res) => {
							if (res.data.status.error_code == 0) {
								uni.showToast({
									title: '登录成功',
									duration: 2000,
									icon: 'success'
								});
								uni.setStorage({
									key: 'login',
									data: res.data.bizobj,
									success: function() {
										uni.navigateTo({
											url: '/pages/home/index'
										})
									}
								})
							} else {
								uni.showToast({
									title: '登录失败',
									duration: 2000,
									icon: 'error'
								});
							}
						}
					});
				} else {
					uni.showToast({
						title: '请填写账号密码',
						duration: 2000,
						icon: 'error'
					});
					return
				}
			}
		}
	}
</script>

<style>
	page {
		background-color: #ffffff;
	}

	.top {
		padding: 20rpx;
	}

	.top_img {
		width: 120px;
		height: 120px;
		border-radius: 50%;
	}
</style>