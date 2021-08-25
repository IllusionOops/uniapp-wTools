<template>
	<view class="wrap">
		<view class="content">
			<view class="title">欢迎登录美团</view>

			<view v-show="loginWay == '短信验证登录'">
				<input class="u-border-bottom" type="number" v-model="tel" placeholder="请输入手机号" />
				<view class="tips">未注册的手机号验证后自动创建美团账号</view>
				<button @tap="submit" :style="[inputStyle]" class="getCaptcha">获取短信验证码</button>
			</view>

			<view v-show="loginWay == '账号密码登录'">
				<u-form :model="loginForm" ref="loginFormRef">
					<u-form-item label="账号" prop="account">
						<u-input placeholder="请输入登录账号" v-model="loginForm.account" />
					</u-form-item>
					<u-form-item label="密码" prop="password">
						<u-input placeholder="请输入登录密码" v-model="loginForm.password" />
					</u-form-item>
				</u-form>
				<u-button type="primary" @tap="loginFormSubmit">提交</u-button>
			</view>

			<view class="alternative">
				<view class="password" @click="changeLoginWay">{{loginWayTitle}}</view>
				<view class="issue">遇到问题</view>
			</view>
		</view>


		<view class="buttom">
			<view class="loginType">
				<view class="wechat item">
					<view class="icon">
						<u-icon size="70" name="weixin-fill" color="rgb(83,194,64)"></u-icon>
					</view>
					微信
				</view>
				<view class="QQ item">
					<view class="icon">
						<u-icon size="70" name="qq-fill" color="rgb(17,183,233)"></u-icon>
					</view>
					QQ
				</view>
			</view>
			<view class="hint">
				登录代表同意
				<text class="link">美团点评用户协议、隐私政策，</text>
				并授权使用您的美团点评账号信息（如昵称、头像、收获地址）以便您统一管理
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tel: '',
				loginWay: '短信验证登录',
				loginWayTitle: "账号密码登录",

				loginForm: {
					account: '',
					password: '',
				},

				rules: {
					name: [{
						required: true,
						message: '请输入账号',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					intro: [{
							required: true,
							message: '请输入密码',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						},
						{
							min: 6,
							message: '密码不能少于6位',
							trigger: 'change'
						}
					]
				}
			}
		},
		computed: {
			inputStyle() {
				let style = {};
				if (this.tel) {
					style.color = "#fff";
					style.backgroundColor = this.$u.color['warning'];
				}
				return style;
			}
		},
		methods: {
			//点击切换登录方式
			changeLoginWay() {
				if (this.loginWay == '短信验证登录') {
					this.loginWay = '账号密码登录'
					this.loginWayTitle = '短信验证登录'
				} else if (this.loginWay == '账号密码登录') {
					this.loginWay = '短信验证登录'
					this.loginWayTitle = '账号密码登录'
				}

			},

			submit() {
				if (this.$u.test.mobile(this.tel)) {
					this.$u.route({
						url: 'pages/login/code'
					})
				}
			},
			loginFormSubmit() {
				console.log(this.loginForm.account + "  " + this.loginForm.password)
				this.$u.api.login(this.loginForm).then(res=>{
					this.$u.toast(res.msg);
					if (res.code ==200) {
						uni.setStorage({
						    key: 'token',
						    data: res.value,
						    success: function () {
						        console.log('set token success');
						    }
						});
						setTimeout(() => {
							this.$u.route({
								url: 'pages/index/index',
								params: {
								}
							})
						}, 200)
					}
				})
			}
		},

		// 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
		onReady() {
			this.$refs.loginFormRef.setRules(this.rules);
		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		font-size: 28rpx;

		.content {
			width: 600rpx;
			margin: 80rpx auto 0;

			.title {
				text-align: left;
				font-size: 60rpx;
				font-weight: 500;
				margin-bottom: 100rpx;
			}

			input {
				text-align: left;
				margin-bottom: 10rpx;
				padding-bottom: 6rpx;
			}

			.tips {
				color: $u-type-info;
				margin-bottom: 60rpx;
				margin-top: 8rpx;
			}

			.getCaptcha {
				background-color: rgb(253, 243, 208);
				color: $u-tips-color;
				border: none;
				font-size: 30rpx;
				padding: 12rpx 0;

				&::after {
					border: none;
				}
			}

			.alternative {
				color: $u-tips-color;
				display: flex;
				justify-content: space-between;
				margin-top: 30rpx;
			}
		}

		.buttom {
			.loginType {
				display: flex;
				padding: 350rpx 150rpx 150rpx 150rpx;
				justify-content: space-between;

				.item {
					display: flex;
					flex-direction: column;
					align-items: center;
					color: $u-content-color;
					font-size: 28rpx;
				}
			}

			.hint {
				padding: 20rpx 40rpx;
				font-size: 20rpx;
				color: $u-tips-color;

				.link {
					color: $u-type-warning;
				}
			}
		}
	}
</style>
