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
						:class="[categoryListIndex==index ? 'u-tab-item-active' : '']" :data-current="index"
						@tap.stop="swichMenu(index)">
						<text class="u-line-1">{{item.categoryName}}</text>
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
		<!-- 主要列表展示 -->
		<view class="u-menu-wrap">
			<block v-for="(item,index) in mainDataArr" :key="index">
				<scroll-view scroll-y class="right-box" v-if="categoryListIndex==index">
					<view class="page-view">
						<view class="class-item">
							<view class="item-container">
								<!-- 滑动操作 -->
								<u-swipe-action :disabled="false" :btn-width="200"
									@content-click="clickSwipeActionContent" bg-color="rgb(250, 250, 250)"
									v-for="(item1, index1) in item.records" :key="item1.id" :show="item1.show"
									:index="index1" @click="clickSwipeAction" @close="closeSwipeAction"
									@open="openSwipeAction" :options="swipeActionOption.options">
									<!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
									<view class="title-wrap title-swipe-action ">
										<text class="u-line-2">{{ item1.title }}</text>
									</view>

									<view class="title-wrap title3-swipe-action ">
										<text class="u-line-2">{{ item1.remark }}</text>
									</view>

									<view class="title-wrap title1-swipe-action" style="margin-left: -20rpx;">
										<uni-link :href="item1.link" :text="item1.link" copyTips="这是复制时显示的提示语">
										</uni-link>
									</view>
									<view class="title-wrap title2-swipe-action">
										<u-row gutter="16">
											<u-col span="4">
												<view class="demo-layout">
													{{item1.source}}
												</view>
											</u-col>
											<u-col span="7">
												<view class="demo-layout">
													{{item1.updateTime}}
												</view>
											</u-col>
										</u-row>

									</view>
									<u-line border-style="dashed"></u-line>
								</u-swipe-action>
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
		<!-- 悬浮框--笔记添加弹出框 -->
		<view>
			<u-popup v-model="uniFabOption.notePopupShow" mode="bottom" border-radius="14" :closeable="true"
				close-icon-pos="top-right" height="600rpx">
				<view class="popup-content">
					<u-form :model="uniFabOption.notePopupForm" ref="noteForm">
						<u-form-item label="来源">
							<uni-combox style="width: 100%;height: 70rpx;border: 2rpx solid #dcdfe6;border-radius:8rpx;"
								label="" labelWidth="400rpx" :candidates="noteSourceOption.arr" placeholder="请选择链接来源"
								v-model="uniFabOption.notePopupForm.source"></uni-combox>
						</u-form-item>
						<u-form-item label="链接">
							<u-input v-model="uniFabOption.notePopupForm.link" :border="true" />
						</u-form-item>
						<u-form-item label="备注">
							<u-input v-model="uniFabOption.notePopupForm.remark" :border="true" />
						</u-form-item>
						<u-button v-if="uniFabOption.notePopupForm.doAdd" style="margin-top: 30rpx;"
							class='submit-btn-popup-form' @click="noteAdd">添加
						</u-button>
						<u-button v-if="uniFabOption.notePopupForm.doAdd==false" style="margin-top: 30rpx;"
							class='submit-btn-popup-form' @click="noteUpdate">修改
						</u-button>
					</u-form>
				</view>
			</u-popup>
		</view>

		<!-- 悬浮框--分类添加弹出框 -->
		<view>
			<u-popup v-model="uniFabOption.categoryPopupShow" mode="bottom" border-radius="14" :closeable="true"
				close-icon-pos="top-right" height="400rpx">
				<view class="popup-content">
					<u-form :model="uniFabOption.categoryPopupForm" ref="categoryForm">
						<u-form-item label="类型">
							<u-input v-model="uniFabOption.categoryPopupForm.name" :border="true" />
						</u-form-item>
						<u-button style="margin-top: 30rpx;" class='submit-btn-popup-form' @click="categoryAdd">提交
						</u-button>
					</u-form>
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

				scrollTop: 0, //tab标题的滚动条位置
				categoryListIndex: 0, // 预设当前项的值
				categoryId: "",
				menuHeight: 0, // 左边菜单的高度
				menuItemHeight: 0, // 左边菜单item的高度

				//主要数据集
				mainDataArr: [],
				_mainDataArr: [],
				noteListIndex: 0,

				noteSourceOption: {
					arr: [],
					infoArr: []
				},

				//悬浮按钮属性
				uniFabOption: {
					// 悬浮按钮弹框的激活标志
					doactive: {
						"active": "",
						"": "active"
					},
					//popup
					notePopupShow: false,
					notePopupForm: {
						id: "",
						remark: '',
						link: '',
						source: "",

						// 是否是添加模式
						doAdd: true
					},
					categoryPopupShow: false,
					categoryPopupForm: {
						name: '',
					},
					pattern: {},
					content: [{
							"iconPath": "/static/image/note/navigation.png",
							"selectedIconPath": "/static/image/note/navigation_blue.png",
							"text": "导航",
							"active": "active",
						},
						{
							"iconPath": "/static/image/note/add.png",
							"selectedIconPath": "/static/image/note/add_blue.png",
							"text": "添加",
							"active": "",
						},
						{
							"iconPath": "/static/image/note/add.png",
							"selectedIconPath": "/static/image/note/add_blue.png",
							"text": "添加分类",
							"active": "",
						}
					],
					horizontal: "right",
					vertical: "bottom",
					direction: "horizontal",
				},
				// 滑块
				swipeActionOption: {
					options: [{
							text: '修改',
							style: {
								backgroundColor: '#007aff'
							}
						},
						{
							text: '删除',
							style: {
								backgroundColor: '#dd524d'
							}
						}
					]
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
			this.getWebSiteSources();
			this.pageParam = option;
			this.getCategoryList(this.pageParam.categoryType);
		},
		methods: {
			// 点击左边的栏目切换
			async swichMenu(index) {
				this.categoryListIndex = index;
				if (index == this.categoryListIndex) return;
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
			// 打开抽屉方法
			showDrawer() {
				this.$refs.showRight.open();
			},
			// 关闭抽屉方法
			closeDrawer() {
				this.$refs.showRight.close();
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
				if (0 == option.index) {
					this.showDrawer();
				} else if (1 == option.index) {
					// 添加
					this.uniFabOption.notePopupForm.doAdd = true;

					this.uniFabOption.notePopupForm.id = "";
					this.uniFabOption.notePopupForm.remark = "";
					this.uniFabOption.notePopupForm.link = "";
					this.uniFabOption.notePopupForm.source = "";
					this.uniFabOption.notePopupForm.remark = "";

					this.uniFabOption.notePopupShow = !this.uniFabOption.notePopupShow;
				} else if (2 == option.index) {
					this.uniFabOption.categoryPopupShow = !this.uniFabOption.categoryPopupShow;
				}
			},

			clickSwipeAction(index, index1) {
				this.noteListIndex = index;
				if (index1 == 1) {
					this.noteDelete(this.mainDataArr[this.categoryListIndex].records[index].id)
				} else {
					this.mainDataArr[this.categoryListIndex].records[index].show = false;
					this.uniFabOption.notePopupForm.doAdd = false;

					this.uniFabOption.notePopupForm.id = this.mainDataArr[this.categoryListIndex].records[index].id;
					this.uniFabOption.notePopupForm.remark = this.mainDataArr[this.categoryListIndex].records[index]
						.remark;
					this.uniFabOption.notePopupForm.link = this.mainDataArr[this.categoryListIndex].records[index].link;
					console.log("this.mainDataArr[this.categoryListIndex].records[index].source=" + this.mainDataArr[this
							.categoryListIndex].records[index]
						.source)
					if (null != this.mainDataArr[this.categoryListIndex].records[index]
						.source && "" != this.mainDataArr[this.categoryListIndex].records[index]
						.source) {
						this.uniFabOption.notePopupForm.source = this.mainDataArr[this.categoryListIndex].records[index]
							.source;
						
						this.uniFabOption.notePopupForm.source = this.getWebSiteSourceName('sourceCode');
					}

					this.uniFabOption.notePopupShow = true;
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openSwipeAction(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.mainDataArr[this.categoryListIndex].records[index].show = true;
				this.mainDataArr[this.categoryListIndex].records.map((val, idx) => {
					if (index != idx) this.mainDataArr[this.categoryListIndex].records[idx].show = false;
				})
			},
			closeSwipeAction(index) {
				this.mainDataArr[this.categoryListIndex].records[index].show = false;
			},
			clickSwipeActionContent(index) {
				// console.log(index);
			},

			// ************************业务接口请求---开始***********
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
			// 分类添加接口
			categoryAdd() {
				let params = {
					"categoryName": this.uniFabOption.categoryPopupForm.name,
					"parentId": "218489046686535680",
					"typeCode":"note",
					"categoryCode": this.uniFabOption.categoryPopupForm.name
				};
				this.$u.api.categoryAdd(params).then(res => {
					this.getCategoryList(this.pageParam.categoryType);
				})
			},


			//查询笔记来源网址
			getWebSiteSources(typeCode) {
				let params = {};
				this.$u.api.getWebSiteSources(params).then(res => {
					console.log(JSON.stringify(res))
					if (null != res && res.value.length > 0) {
						this.noteSourceOption.infoArr = res.value;
						for (var i = 0; i < res.value.length; i++) {
							this.noteSourceOption.arr[i] = res.value[i].sourceName;
						}
					}
				})
			},
			// 查询笔记list数据
			getNotePage() {
				if (this._mainDataArr[this.categoryListIndex] != undefined &&
					this._mainDataArr[this.categoryListIndex] != null &&
					this._mainDataArr[this.categoryListIndex]['records'] == null) {
					let params = {
						"categoryId": this.categoryId,
						"pageNum": 1,
						"pageSize": 30
					}
					this.$u.api.getNotePage(params).then(res => {
						res.value.records.forEach(obj => {
							obj['show'] = false;
						})
						this._mainDataArr[this.categoryListIndex]['records'] = res.value.records;
						this.mainDataArr = this._mainDataArr;
					})
				}
			},
			// 笔记添加接口
			noteAdd() {
				let _source = this.getWebSiteSourceName('sourceName');
				
				let params = {
					"categoryId": this.mainDataArr[this.categoryListIndex].id,
					"link": this.uniFabOption.notePopupForm.link,
					"remark": this.uniFabOption.notePopupForm.remark,
					"source": _source
				};
				this.$u.api.noteAdd(params).then(res => {
					console.log("-----noteAdd")
					console.log(JSON.stringify(res))
				})
			},
			noteDelete(id) {
				let params = {
					"id": id
				};
				this.$u.api.noteDelete(params).then(res => {
					this.mainDataArr[this.categoryListIndex].records.splice(this.noteListIndex, 1);
					this.$u.toast(`删除了第${this.noteListIndex}条笔记`);
				});
			},
			noteUpdate(id) {
				let _source = this.getWebSiteSourceName('sourceName');
				let params = {
					"id": this.uniFabOption.notePopupForm.id,
					"categoryId": this.mainDataArr[this.categoryListIndex].id,
					"link": this.uniFabOption.notePopupForm.link,
					"remark": this.uniFabOption.notePopupForm.remark,
					"source": _source
				};
				this.$u.api.noteUpdate(params).then(res => {
					this.$u.toast(`修改了第${this.noteListIndex}条笔记`);
				});
			},
			// 获取网站来源name
			getWebSiteSourceName(field) {
				var str="";
				this.noteSourceOption.infoArr.forEach(obj => {
					if (obj[field] == this.uniFabOption.notePopupForm.source) {
						str= obj[field];
					}
				});
				return str;
			}

			// ************************业务接口请求---开始***********


		}
	}
</script>

<style lang="scss" scoped>
	@import '@/common/uni-ui.scss';

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

	.right-box {
		background-color: rgb(250, 250, 250);
	}

	.page-view {
		padding: 0rpx 20rpx;
	}

	.class-item {
		// margin-bottom: 30rpx;
		// background-color: #fff;
		// padding: 20rpx 20rpx;
		// border-radius: 8rpx;

		border-width: 1px;
		border-color: #ddd;
		border-style: dashed;
		background-color: #fafafa;
		padding: 0px 10px;
		border-radius: 3px;
	}

	.item-title {
		font-size: 26rpx;
		color: $u-main-color;
		font-weight: bold;
	}

	.item-container {
		text-align: center;
	}

	// ********************************左侧开始********************************
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

	//********************************左侧结束********************************

	// ********************************滑块开始********************************
	.title-swipe-action {
		margin-top: 25rpx;
		text-align: left;
		font-size: 28rpx;
		color: #303133;
	}

	.title1-swipe-action {
		margin-top: 15rpx;
		text-align: left;
		font-size: 26rpx;
	}

	.title2-swipe-action {
		margin-top: 15rpx;
		margin-bottom: 25rpx;
		font-size: 26rpx;
		color: #909399;
	}

	.title3-swipe-action {
		margin-top: 25rpx;
		text-align: left;
		font-size: 24rpx;
		color: #606266;
	}

	// ********************************滑块结束********************************



	//********************************弹出层开始********************************
	.popup-content {
		padding: 70rpx 65rpx 24rpx 60rpx;
		text-align: center;
	}

	.submit-btn-popup-form {
		// width: 700rpx;
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
