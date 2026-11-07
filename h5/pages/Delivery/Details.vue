<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
			<block slot="backText">返回</block>
			<block slot="content"><text class="text-bold text-black text-xl">
					{{Original.XY==0?'电脑订单':Original.XY==1?'小程序订单':'手机端订单'}}</text></block>
		</cu-custom>
		<view class="" v-if="xcx_User" @tap="ViewImageSH" :data-url="xcx_User.Doorsign">
			<image :src="xcx_User.Doorsign" mode="widthFix" style="width: 100%;"></image>
		</view>
		<view class="fgx"></view>
		<view v-if="Original">
			<view class="cu-bar bg-white sby solid-bottom">
				<view class="action">
					{{Original.customer_name}}
				</view>
				<view class="action">
					等级：{{Original.customer_level}}
				</view>
			</view>
			<view class="cu-bar bg-white  solid-bottom" v-if="Original.customer_phone">
				<view class="action">
					电话：{{Original.customer_phone}}
				</view>
				<view class="action">
					<button class="cu-btn sm shadow" @tap="MakeCall" :data-ph="Original.customer_phone">拨打</button>
				</view>
			</view>
			<view class="cu-bar bg-white  solid-bottom" v-if="Original.customer_address">
				<view class="action">
					地址：{{Original.customer_address}}
				</view>
			</view>
			<view class="cu-bar   bg-white solid-bottom " v-if="Original.created_time">
				<view class="action">
					下单时间
				</view>
				<view class="action">
					{{Original.created_time}}
				</view>
			</view>
			<view class="cu-bar   bg-white solid-bottom " v-if="Original.rob_time">
				<view class="action">
					抢单时间
				</view>
				<view class="action">
					{{Original.rob_time}}
				</view>
			</view>
			<view class="cu-bar xby  bg-white solid-bottom " v-if="Original.reach_time">
				<view class="action">
					完成时间
				</view>
				<view class="action">
					{{Original.reach_time}}
				</view>
			</view>
		</view>
		<view class="fgx"></view>
		<view class="cu-bar by bg-white solid-bottom ">
			<view class="action">
				<text class="cuIcon-titles text-blue "></text>商品列表
			</view>
			<view class="action">
				总价:<view class=" sm by text-price text-red">{{Original.order_total_price}}</view>
			</view>
		</view>
		<view>
			<view :class="item.state==0?'text-black':'text-gray'" v-for="(item,index) in tableData" :key="index">
				<view class="cu-list menu-avatar by">
					<view class="cu-item">
						<image @tap="ViewImageSH" :data-url="item.main_image_sh" class="cu-avatar by lg"
							:src="item.main_image_sh?item.main_image_sh:'../../static/logo.jpg'" mode="">
						</image>
						<view class="content flex-sub">
							<view class="text-grey">
								<text class="text-cut" style="width:220px"> {{item.product_name}}</text>
								<view v-if="Original.delivery_person!='待分配'&&Original.XY!=1">
									<button class="cu-btn sm " :class="item.state==0?'':'bg-white'" @tap="refund"
										:data-item="item">{{item.state==0?'退货':'已退'}}</button>
								</view>
							</view>
							<view class="text-gray text-sm flex justify-between">
								数量 X {{item.product_quantity}}
								<view class="text-gray text-sm">
									<text class="text-price text-red">{{item.total_price}}</text>
								</view>
							</view>
						</view>

					</view>
				</view>
			</view>
		</view>
		<view v-if="Original.remarks">
			<view style="padding-top: 10px;"></view>
			<view class="cu-bar by bg-white sby solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>备注
				</view>
			</view>
			<view class="cu-form-group xby">
				<textarea maxlength="-1" :placeholder="Original.remarks"></textarea>
			</view>

			<view style="padding-top: 10px;"></view>
		</view>
		<view v-if="Coupons_list">
			<view class="cu-bar sby bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-orange "></text>优惠
				</view>
			</view>
			<view v-for="(item,index) in Coupons_list" :key="index">
				<view class="cu-bar by  bg-white solid-bottom ">
					<view class="action">
						{{item}}
					</view>
				</view>
			</view>
			<view style="padding-top: 20px;"></view>
		</view>
		<view v-if="Original.Warehouse_sh>1">
			<view class="cu-bar by bg-white solid-bottom " v-if="Original.Warehouse_sh==3">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>签收图片
				</view>
			</view>
			<view class="padding-sm" v-if="Original.Warehouse_sh==3">
				<!-- 	<view v-for="(item,index) in receipt_photo_list" :key="index">
					<image class="images by" :src="item" mode=""></image>
				</view> -->
				<view class="grid flex-sub padding-lr col-3 grid-square">
					<view class="bg-img only-img" :style="{ backgroundImage: `url(${item})` }"
						v-for="(item,index) in receipt_photo_list" :key="index" @tap="ViewImage" :data-url="item"
						:data-item="receipt_photo_list">
					</view>
				</view>
			</view>
			<view class="cu-bar by bg-white solid-bottom ">
				<view class="action">
					<text class="cuIcon-titles text-blue "></text>上传送达图片
				</view>
			</view>
			<view class="cu-form-group">
				<view class="grid col-4 grid-square flex-sub">
					<view class="bg-img" v-for="(item,index) in imgList" :key="index" @tap="ViewImage"
						:data-url="imgList[index]">
						<image :src="imgList[index]" mode="aspectFill"></image>
						<view class="cu-tag bg-red" @tap.stop="DelImg" :data-index="index">
							<text class='cuIcon-close'></text>
						</view>
					</view>
					<view class="solids" @tap="ChooseImage" v-if="imgList.length<4">
						<text class='cuIcon-cameraadd'></text>
					</view>
				</view>
			</view>
			<view class=" flex flex-direction padding-sm bg-white" v-if="Original.state==3">
				<button class="cu-btn bg-gradual-blue margin-tb-sm  round" @click="img_up">更新图片</button>
			</view>
			<view style="padding: 200rpx;"></view>
		</view>
		<view v-if="Original.Warehouse_sh==2">
			<view class="padding-sm new" @click="PhotoTaking" v-if="Original.delivery_person!='待分配'">
				<view class=" flex flex-direction">
					<button class="cu-btn bg-gradual-blue round margin-tb-sm lg">确认送达</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgList: [],
				New: false,
				Yid: '',
				tableData: '',
				Original: '',
				receipt_photo_list: [],
				Coupons_list: [],
				xcx_User: ''

			}
		},
		onLoad(e) {
			let that = this
			let in_data = {
				Type: "id_get",
				Table: "order_list",
				id: e.i,
			};
			uni.$emit(
				'r',
				in_data,
				function(res) {
					let Ol = res.data.bizobj;
					that.Original = Ol
					that.Yid = Ol.order_list_id;
					that.Coupons_list = JSON.parse(Ol.Coupons_list);
					that.get_preorder()
					if (Ol.Warehouse_sh == 3) {
						that.receipt_photo_list = JSON.parse(Ol.receipt_photo_list)
					}
					if (Ol.openid) {
						that.get_Delivery_openid(Ol.openid)
					}
				})


		},
		methods: {
			get_Delivery_openid(e) {
				let that = this
				let in_data = {
					Type: "get_Delivery_openid",
					Table: "xcx_User",
					openid: e, //订单ID
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_code == 0) {
							that.xcx_User = res.bizobj;
						}
					}
				);
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
					page_size: 10000,
				};
				uni.$emit(
					'r',
					in_data,
					function(res2) {
						let res = res2.data;
						if (res.status.error_msg == "success") {
							that.tableData = res.bizobj;
						};
					},
					function(error) {
						console.error(error);
					}
				);
			},
			//拨打电话
			MakeCall(e) {
				let that = this
				uni.makePhoneCall({
					phoneNumber: e.currentTarget.dataset.ph //仅为示例
				});
			},
			DelImg(e) {
				uni.showModal({
					title: '大兄弟',
					content: '确定要删除这个图片吗？',
					cancelText: '再看看',
					confirmText: '确定',
					success: res => {
						if (res.confirm) {
							this.imgList.splice(e.currentTarget.dataset.index, 1)
						}
					}
				})
			},
			ChooseImage() {
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['camera '], //使用相机
					success: (res) => {
						if (this.imgList.length != 0) {
							this.imgList = this.imgList.concat(res.tempFilePaths)
						} else {
							this.imgList = res.tempFilePaths
						}
					}
				});
			},
			//拍照签收
			PhotoTaking() {
				let that = this
				let imgList = that.imgList
				if (imgList.length > 0) {
					async function processImages() {
						const promises = imgList.map((item) => {
							return new Promise((resolve, reject) => {
								console.log(item); // 输出数组中的每个元素  
								uni.showLoading({
									title: '上传图片中'
								});
								uni.uploadFile({
									url: 'https://xcx.szhxch.com/Si.php', // 仅为示例，并非真实的接口地址  
									filePath: item,
									name: 'file',
									success: function(uploadFileRes) {
										uni.hideLoading();
										if (uploadFileRes.statusCode == 200) {
											that.receipt_photo_list.push(uploadFileRes
												.data);
											resolve(); // 上传成功，解决这个 Promise  
										} else {
											uni.showToast({
												title: '图片上传失败!',
												duration: 1000,
												icon: 'error'
											});
											reject(new Error(
												'图片上传失败')); // 上传失败，拒绝这个 Promise  
										}
									},
									fail: function(error) {
										uni.hideLoading();
										reject(error); // 上传失败，拒绝这个 Promise  
									}
								});
							});
						});

						// 等待所有的上传操作完成  
						await Promise.all(promises);
						console.log('循环完成后执行更新'); // 在所有异步操作完成后输出这条消息    
						let in_data = {
							Type: "order_list_receipt_photo_up",
							Table: "order_list",
							id: that.Original.id,
							receipt_photo: that.receipt_photo_list[0],
							receipt_photo_list: JSON.stringify(that.receipt_photo_list)
						};
						uni.$emit(
							'r',
							in_data,
							function(res2) {
								let res = res2.data;
								if (res.status.error_code == 0) {
									uni.showToast({
										title: '更新送达成功',
										duration: 1000,
										icon: 'success'
									});
									setTimeout(function() {
										uni.reLaunch({
											url: './List?TabCur=2'
										})
									}, 1000);
								} else {
									uni.showToast({
										title: '更新送达失败！',
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

					processImages();
				} else {
					uni.showToast({
						title: '请上传图片!',
						duration: 1000,
						icon: 'error'
					});
				}
			},
			//退货
			refund(e) {
				let that = this;
				let item = e.currentTarget.dataset.item;
				console.log(item);
				if (that.Original.is_paid == 1) {
					uni.showToast({
						title: '财务已收款,不可退货!',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				if (item.state == 1) {
					uni.showToast({
						title: '已退货!',
						duration: 1000,
						icon: 'error'
					});
					return
				}
				uni.showModal({
					title: '提示',
					content: item.product_name + '确定要操作' + '退货吗？',
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
							let in_data = {
								Type: "order_state_up",
								Table: "orders",
								order_list_id: that.Original.id, //订单ID
								Yid: that.Yid, //关联订单ID
								id: item.id //商品ID
							};
							uni.$emit(
								'r',
								in_data,
								function(res2) {
									let res = res2.data;
									if (res.status.error_code == 0) {
										uni.showToast({
											title: '退货成功',
											duration: 1000,
											icon: 'success'
										});
										that.get_preorder()
									} else {
										uni.showToast({
											title: '退货失败！',
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
			//img_up 图片更新
			img_up() {
				console.log('img_up 图片更新')
				let that = this
				let imgList = that.imgList
				if (imgList.length > 0) {
					async function processImages() {
						const promises = imgList.map((item) => {
							return new Promise((resolve, reject) => {
								console.log(item); // 输出数组中的每个元素  
								uni.showLoading({
									title: '上传图片中'
								});
								uni.uploadFile({
									url: 'https://xcx.szhxch.com/Si.php', // 仅为示例，并非真实的接口地址  
									filePath: item,
									name: 'file',
									success: function(uploadFileRes) {
										uni.hideLoading();
										if (uploadFileRes.statusCode == 200) {
											that.receipt_photo_list.push(uploadFileRes
												.data);
											resolve(); // 上传成功，解决这个 Promise  
										} else {
											uni.showToast({
												title: '图片上传失败!',
												duration: 1000,
												icon: 'error'
											});
											reject(new Error(
												'图片上传失败')); // 上传失败，拒绝这个 Promise  
										}
									},
									fail: function(error) {
										uni.hideLoading();
										reject(error); // 上传失败，拒绝这个 Promise  
									}
								});
							});
						});

						// 等待所有的上传操作完成  
						await Promise.all(promises);
						console.log('循环完成后执行更新'); // 在所有异步操作完成后输出这条消息   
						// return
						let in_data = {
							Type: "order_list_receipt_photo_up_img_up",
							Table: "order_list",
							id: that.Original.id,
							receipt_photo_list: JSON.stringify(that.receipt_photo_list)
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
									that.imgList = [];

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
					}
					processImages();

				} else {
					uni.showToast({
						title: '请上传图片!',
						duration: 1000,
						icon: 'error'
					});
				}
			}
		},
	}
</script>

<style>
	.images {
		width: 100%;
	}
</style>