<template>
	<view class="u-wrap">
		<view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view>

		<!-- 主要列表展示 -->
		<view>
			<view style="text-align: center;">
				<u-loading :show="loadingFlag" mode="flower" size="100"></u-loading>
			</view>
			<view class="page-view">
				<view class="class-item">
					<view class="item-container">
						<!-- 滑动操作 -->
						<u-swipe-action :disabled="false" :btn-width="200" @content-click="clickSwipeActionContent"
							bg-color="rgb(250, 250, 250)" v-for="(item1, index1) in noteList" :key="item1.id"
							:show="item1.show" :index="index1" @click="clickSwipeAction" @close="closeSwipeAction"
							@open="openSwipeAction" :options="swipeActionOptions.options">
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
		</view>

		<!-- 悬浮框 -->
		<view>
			<uni-fab :pattern="uniFabOptions.pattern" :content="uniFabOptions.content"
				:horizontal="uniFabOptions.horizontal" :vertical="uniFabOptions.vertical"
				:direction="uniFabOptions.direction" @trigger="fabTrigger" @fabClick="fabClick"></uni-fab>
		</view>

		<!-- 悬浮框--笔记添加弹出框 -->
		<view>
			<u-popup v-model="uniFabOptions.notePopupShowFlag" mode="bottom" border-radius="14" :closeable="true"
				close-icon-pos="top-right" height="600rpx">
				<view class="popup-content">
					<u-form :model="uniFabOptions.notePopupForm" ref="noteForm">
						<u-form-item label="来源">
							<uni-combox style="width: 100%;height: 70rpx;border: 2rpx solid #dcdfe6;border-radius:8rpx;"
								label="" labelWidth="400rpx" :candidates="noteSourceOptions.arr" placeholder="请选择链接来源"
								v-model="uniFabOptions.notePopupForm.source"></uni-combox>
						</u-form-item>
						<u-form-item label="链接">
							<u-input v-model="uniFabOptions.notePopupForm.link" :border="true" />
						</u-form-item>
						<u-form-item label="备注">
							<u-input v-model="uniFabOptions.notePopupForm.remark" :border="true" />
						</u-form-item>
						<u-button v-if="uniFabOptions.notePopupForm.doAddFlag" style="margin-top: 30rpx;"
							class='submit-btn-popup-form' @click="noteAdd">添加
						</u-button>
						<u-button v-if="uniFabOptions.notePopupForm.doAddFlag==false" style="margin-top: 30rpx;"
							class='submit-btn-popup-form' @click="noteUpdate">修改
						</u-button>
					</u-form>
				</view>
			</u-popup>
		</view>
		<u-modal v-model="warningModalOptions.showFlag" :show-cancel-button="true" :title="warningModalOptions.title"
			:content="warningModalOptions.content" :title-style="{color:'#ff9900'}" @confirm="warningModalConfirm">
		</u-modal>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				// 界面接收到的参数
				params: null,
				// 是否显示正在加载
				loadingFlag: true,
				//主要数据集
				noteList: [],

				currentItemIndex: null,
				currentItem: {},

				// 笔记来源参数
				noteSourceOptions: {
					arr: [],
					infoArr: []
				},

				//悬浮按钮属性
				uniFabOptions: {
					// 悬浮按钮弹框的激活标志
					doactive: {
						"active": "",
						"": "active"
					},
					//popup
					notePopupShowFlag: false,
					notePopupForm: {
						id: "",
						remark: '',
						link: '',
						source: "",

						// 是否是添加模式
						doAddFlag: true
					},
					pattern: {},
					content: [{
						"iconPath": "/static/image/note/add.png",
						"selectedIconPath": "/static/image/note/add_blue.png",
						"text": "添加",
						"active": "",
					}],
					horizontal: "right",
					vertical: "bottom",
					direction: "horizontal",
				},
				// 滑块
				swipeActionOptions: {
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
				warningModalOptions: {
					title: "警告",
					showFlag: false,
					content: "删除后将无法恢复，确认删除吗？"
				},
			}
		},
		computed: {

		},
		// onInit 监听页面初始化，其参数同 onLoad 参数，为上个页面传递的数据，参数类型为 Object（用于页面传参），触发时机早于 onLoad
		// onLoad 监听页面加载，其参数为上个页面传递的数据，参数类型为 Object（用于页面传参）
		// onShow 监听页面显示。页面每次出现在屏幕上都触发，包括从下级页面点返回露出当前页面
		// onReady 监听页面初次渲染完成。注意如果渲染速度快，会在页面进入动画完成前触发
		onLoad(options) {
			this.getWebSiteSources();
			this.params = options;
			this.getNotePage();
		},
		methods: {
			// 悬浮按钮---触发方法
			fabClick() {},
			//悬浮按钮---弹框内按钮---触发方法
			fabTrigger(option) {
				this.uniFabOptions.content[option.index].active = this.uniFabOptions.doactive[this.uniFabOptions.content[
						option.index]
					.active];
				if (0 == option.index) {
					// 添加
					this.uniFabOptions.notePopupForm.doAddFlag = true;

					this.uniFabOptions.notePopupForm.id = "";
					this.uniFabOptions.notePopupForm.remark = "";
					this.uniFabOptions.notePopupForm.link = "";
					this.uniFabOptions.notePopupForm.source = "";
					this.uniFabOptions.notePopupForm.remark = "";

					this.uniFabOptions.notePopupShowFlag = !this.uniFabOptions.notePopupShowFlag;
				}
			},
			// 列表滑动窗口的点击时间
			clickSwipeAction(index, index1) {
				this.currentItemIndex = index;
				this.currentItem = this.noteList[index];
				if (index1 == 1) {
					this.warningModalOptions.showFlag = true;
				} else {
					this.noteList[index].show = false;
					this.uniFabOptions.notePopupForm.doAddFlag = false;

					this.uniFabOptions.notePopupForm.id = this.currentItem.id;
					this.uniFabOptions.notePopupForm.remark = this.currentItem
						.remark;
					this.uniFabOptions.notePopupForm.link = this.currentItem.link;
					this.uniFabOptions.notePopupForm.source = "";
			
					if (null != this.currentItem
						.source && "" != this.currentItem
						.source) {
						this.uniFabOptions.notePopupForm.source = this.currentItem
							.source;
						// this.uniFabOptions.notePopupForm.source = this.getWebSiteSourceName('sourceCode');
					}
					this.uniFabOptions.notePopupShowFlag = true;
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			openSwipeAction(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.noteList[index].show = true;
				this.noteList.map((val, idx) => {
					if (index != idx) this.noteList[idx].show = false;
				})
			},
			closeSwipeAction(index) {
				this.noteList[index].show = false;
			},
			clickSwipeActionContent(index) {
				// console.log(index);
			},
			warningModalConfirm() {
				this.noteDelete();
			},

			// ************************业务接口请求---开始***********


			//查询笔记来源网址
			getWebSiteSources(typeCode) {
				let params = {};
				this.$u.api.getWebSiteSources(params).then(res => {
					if (null != res && res.value.length > 0) {
						this.noteSourceOptions.infoArr = res.value;
						for (var i = 0; i < res.value.length; i++) {
							this.noteSourceOptions.arr[i] = res.value[i].sourceName;
						}
					}
				})
			},
			// 获取网站来源name
			getWebSiteSourceName(field) {
				var str = "";
				this.noteSourceOptions.infoArr.forEach(obj => {
					if (obj[field] == this.uniFabOptions.notePopupForm.source) {
						str = obj[field];
					}
				});
				return str;
			},
			// 查询笔记list数据
			getNotePage() {
				this.loadingFlag = true;
				this.doGetNotePage();
			},
			doGetNotePage() {
				let params = {
					"categoryId": this.params.categoryId,
					"pageNum": 1,
					"pageSize": 30
				}
				this.$u.api.getNotePage(params).then(res => {
					this.loadingFlag = false;
					if (res.value.records != null && res.value.records.length > 0) {
						res.value.records.forEach(obj => {
							obj['show'] = false;
						});
						this.noteList = res.value.records;
					}
				})
			},
			// 笔记添加接口
			noteAdd() {
				let _source = this.getWebSiteSourceName('sourceName');

				let params = {
					"categoryId": this.params.categoryId,
					"link": this.uniFabOptions.notePopupForm.link,
					"remark": this.uniFabOptions.notePopupForm.remark,
					"source": _source
				};
				this.$u.api.noteAdd(params).then(res => {
					this.uniFabOptions.notePopupShowFlag = false;
					this.getNotePage();
				})
			},
			// 删除
			noteDelete() {
				this.doNoteDelete();
			},
			doNoteDelete() {
				let params = {
					"id": this.currentItem.id
				};
				this.$u.api.noteDelete(params).then(res => {
					this.noteList.splice(this.currentItemIndex, 1);
					this.$u.toast(`删除了第${this.currentItemIndex}条笔记`);
				});
			},
			// 修改
			noteUpdate() {
				this.doNoteUpdate();
			},
			doNoteUpdate() {
				let _source = this.getWebSiteSourceName('sourceName');
				let params = {
					"id": this.uniFabOptions.notePopupForm.id,
					"categoryId": this.currentItem.categoryId,
					"link": this.uniFabOptions.notePopupForm.link,
					"remark": this.uniFabOptions.notePopupForm.remark,
					"source": _source
				};
				this.$u.api.noteUpdate(params).then(res => {
					this.$u.toast(`修改了第${this.currentItemIndex}条笔记`);
					this.uniFabOptions.notePopupShowFlag = false;
					this.getNotePage();
				});
			},

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

	.page-view {
		padding: 0rpx 20rpx;
	}

	.class-item {
		border-width: 1px;
		border-color: #ddd;
		border-style: dashed;
		background-color: #fafafa;
		padding: 0px 10px;
		border-radius: 3px;
	}


	.item-container {
		text-align: center;
	}


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
