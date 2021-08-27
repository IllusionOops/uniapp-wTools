<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view>
		<!-- 隐藏抽屉 -->
		<uni-drawer ref="showRight" mode="left" :mask-click="false">
			<!-- 左侧分类 -->
			<view class="u-menu-wrap">
				<scroll-view scroll-y scroll-with-animation class="u-tab-view menu-scroll-view" :scroll-top="scrollTop">
					<button @click="closeDrawer" type="primary">关闭Drawer</button>
					<view v-for="(item,index) in mainDataArr" :key="index" class="u-tab-item"
						:class="[current==index ? 'u-tab-item-active' : '']" :data-current="index"
						@tap.stop="swichMenu(index)">
						<text class="u-line-1">{{item.categoryName}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
		<!-- 主要列表展示 -->
		<view class="u-menu-wrap">
			<block v-for="(item,index) in mainDataArr" :key="index">
				<scroll-view scroll-y class="right-box" v-if="current==index">
					<view class="page-view">
						<view class="class-item">
							<uni-section :title="item.categoryName" type="line">{{item.categoryName}}</uni-section>

							<!-- <view class="item-title">
								<text>{{item.categoryName}}</text>
							</view> -->
							<view class="item-container">
								<!-- 基于 uni-list 的页面布局 -->
								<uni-list style="width: 100%;">
									<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
									<uni-list-item direction="column" v-for="(item1,index1) in item.records"
										:key="item1.title+index1"
										:to="'/pages/detail/detail?id='+item1.id+'&title='+item1.title">
										<!-- 通过header插槽定义列表的标题 -->
										<template v-slot:header>
											<view class="uni-title">
												<uni-link :href="item1.link" :text="item1.title" color="#0000FF"
													copyTips="这是复制时显示的提示语" :showUnderLine="true"></uni-link>
											</view>
										</template>
										<!-- 通过body插槽定义列表内容显示 -->
										<template v-slot:body>
											<view class="uni-list-box">
												<view class="uni-content">
													<view class="uni-title-sub uni-ellipsis-2">
														<uni-link :href="item1.link" :text="item1.link" color="#0000FF"
															copyTips="这是复制时显示的提示语" :showUnderLine="true"></uni-link>
													</view>
													<view class="uni-note">{{item1.updateTime}}</view>
												</view>
											</view>
										</template>
										<!-- 同步footer插槽定义列表底部的显示效果 -->
										<template v-slot:footer>
											<view class="uni-footer">
												<text class="uni-footer-text">评论</text>
												<text class="uni-footer-text">点赞</text>
												<text class="uni-footer-text">分享</text>
											</view>
										</template>
									</uni-list-item>
								</uni-list>
							</view>
						</view>
					</view>
				</scroll-view>
			</block>
		</view>

		<!-- 悬浮框 -->
		<view>
			<uni-fab :pattern="uniFabOption.pattern" :content="uniFabOption.content"
				:horizontal="uniFabOption.horizontal" :vertical="uniFabOption.vertical"
				:direction="uniFabOption.direction" @trigger="fabTrigger" @fabClick="fabClick"></uni-fab>
		</view>
		<!-- 悬浮框--添加弹出框 -->
		<view>
			<u-popup v-model="uniFabOption.popupShow" mode="bottom" border-radius="14" :closeable="true"
				close-icon-pos="top-right" height="600rpx">
				<view class="popup-content">
					<scroll-view scroll-y="true" style="height: 500rpx;">
						<u-form :model="uniFabOption.popupForm" ref="uForm">
							<u-form-item label="标题">
								<u-input v-model="uniFabOption.popupForm.name" :border="true" />
							</u-form-item>
							<u-form-item label="链接">
								<u-input v-model="uniFabOption.popupForm.intro" :border="true" />
							</u-form-item>
							<u-form-item label="来源">
								<uni-combox label="" :candidates="uniFabOption.popupForm.linkSourceArr"
									placeholder="请选择链接来源" v-model="uniFabOption.popupForm.city"></uni-combox>
							</u-form-item>

							<u-button style="margin-top: 120rpx;" class='submit-class'>提交</u-button>
						</u-form>
					</scroll-view>
				</view>
			</u-popup>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 界面接收到的参数
				pageParam: {},
				// 是否是第一次加载
				doFirstLoad: true,

				scrollTop: 0, //tab标题的滚动条位置
				current: 0, // 预设当前项的值
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度

				//主要数据集
				mainDataArr: [],
				_mainDataArr: [],
				categoryId: "",
				//悬浮按钮属性
				uniFabOption: {
					// 悬浮按钮弹框的激活标志
					doactive: {
						"active": "",
						"": "active"
					},
					//popup
					popupShow: false,
					popupForm: {
						name: '',
						intro: '',
						city: "",
						linkSourceArr: ['知乎',
							'CSDN',
							'博客园',
							'微博'
						],
					},
					pattern: {},
					content: [{
							"iconPath": "",
							"selectedIconPath": "/static/image/logo.png",
							"text": "打开",
							"active": "active",
						},
						{
							"iconPath": "",
							"selectedIconPath": "/static/image/logo.png",
							"text": "添加",
							"active": "",
						}
					],
					horizontal: "right",
					vertical: "bottom",
					direction: "horizontal",
				},




			}
		},
		computed: {

		},
		// onInit 监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
		// onLoad 监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
		// onShow 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		// onReady 监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
		onLoad(option) {
			this.pageParam = option;
			this.getCategoryList(this.pageParam.categoryType);
		},
		methods: {
			// 点击左边的栏目切换
			async swichMenu(index) {
				this.current = index;
				if (index == this.current) return;
				this.getNotePage();
				// 如果为0，意味着尚未初始化
				if (this.menuHeight == 0 || this.menuItemHeight == 0) {
					await this.getElRect('menu-scroll-view', 'menuHeight');
					await this.getElRect('u-tab-item', 'menuItemHeight');
				}
				// 将菜单菜单活动item垂直居中
				this.scrollTop = index * this.menuItemHeight + this.menuItemHeight / 2 - this.menuHeight / 2;
			},
			// 获取一个目标元素的高度
			getElRect(elClass, dataVal) {
				new Promise((resolve, reject) => {
					const query = uni.createSelectorQuery().in(this);
					query.select('.' + elClass).fields({
						size: true
					}, res => {
						// 如果节点尚未生成，res值为null，循环调用执行
						if (!res) {
							setTimeout(() => {
								this.getElRect(elClass);
							}, 10);
							return;
						}
						this[dataVal] = res.height;
					}).exec();
				})
			},


			showDrawer() {
				this.$refs.showRight.open();
			},
			closeDrawer() {
				this.$refs.showRight.close();
			},
			//查询左侧分类字典列表
			getCategoryList(typeCode) {
				let params = {
					"typeCode": typeCode
				}
				this.$u.api.getCategoryListByTypeCode(params).then(res => {
					if (null != res.value && res.value.length > 0) {
						this._mainDataArr = res.value;
						this.categoryId = this._mainDataArr[0].id;
						this.getNotePage();
					}
				})
			},
			// 查询右侧list数据
			getNotePage() {
				if (this._mainDataArr[this.current] != undefined &&
					this._mainDataArr[this.current] != null &&
					this._mainDataArr[this.current]['records'] == null) {
					let params = {
						"categoryId": this.categoryId,
						"pageNum": 1,
						"pageSize": 20
					}
					this.$u.api.getNotePage(params).then(res => {
						this._mainDataArr[this.current]['records'] = res.value.records;
						this.mainDataArr = this._mainDataArr;
					})
				}
			},
			// 悬浮按钮---触发方法
			fabClick() {
				console.log("fabClick---:")
			},
			//悬浮按钮---弹框内按钮---触发方法
			fabTrigger(option) {
				this.uniFabOption.content[option.index].active = this.uniFabOption.doactive[this.uniFabOption.content[
						option.index]
					.active];
				console.log("悬浮按钮---------------", option)
				if (0 == option.index) {
					this.showDrawer();
				}
				if (1 == option.index) {
					this.uniFabOption.popupShow = !this.uniFabOption.popupShow;
				}
			},

		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/uni-ui.scss';

	// ********************************列表开始********************************
	.u-wrap {
		height: calc(100vh);
		/* #ifdef H5 */
		height: calc(100vh - var(--window-top));
		/* #endif */
		display: flex;
		flex-direction: column;
	}

	.u-search-box {
		padding: 18rpx 30rpx;
	}

	.u-menu-wrap {
		flex: 1;
		display: flex;
		overflow: hidden;
	}

	.u-search-inner {
		background-color: rgb(234, 234, 234);
		border-radius: 100rpx;
		display: flex;
		align-items: center;
		padding: 10rpx 16rpx;
	}

	.u-search-text {
		font-size: 26rpx;
		color: $u-tips-color;
		margin-left: 10rpx;
	}

	// .u-tab-view {
	// 	width: 200rpx;
	// 	height: 100%;
	// }

	.u-tab-item {
		height: 110rpx;
		background: #f6f6f6;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 26rpx;
		color: #444;
		font-weight: 400;
		line-height: 1;
	}

	.u-tab-item-active {
		position: relative;
		color: #000;
		font-size: 30rpx;
		font-weight: 600;
		background: #fff;
	}

	.u-tab-item-active::before {
		content: "";
		position: absolute;
		border-left: 4px solid $u-type-primary;
		height: 32rpx;
		left: 0;
		top: 39rpx;
	}

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 16rpx;
	}

	.class-item {
		margin-bottom: 30rpx;
		background-color: #fff;
		padding: 16rpx;
		border-radius: 8rpx;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-container {
		display: flex;
		flex-wrap: wrap;
	}

	// ********************************列表结束********************************


	//********************************弹出层开始********************************
	.popup-content {
		padding: 110rpx 40rpx 24rpx 40rpx;
		text-align: center;
	}

	.submit-class {
		width: 400rpx;
	}



	.uni-ellipsis-2 {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	//********************************弹出层结束********************************
</style>
