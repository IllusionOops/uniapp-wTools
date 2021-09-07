<template>
	<view class="content">
		<u-swipe-action :key="item.id" :show="item.swipeShow" :btn-width="swipeOptions.btnWidth" :index="index"
			v-for="(item, index) in treeNodeList" @click="swipeClick" @open="swipeOpen" @close="swipeClose"
			:options="swipeOptions.options">
			<view class="mix-tree-item" :style="[{
								paddingLeft: (item.level-1)*15 + 'px',
								zIndex: (item.level-1)*-1 +50
							}]" :class="{
								border: treeOptions.border === true,
								show: item.show,
								last: item.lastRank,
								showchild: item.showChild
							}">
				<view @click.stop="treeNodeTap(item, index)">
					<u-icon size="40" width="26upx" height="26upx" :label="item.categoryName"
						:name="item.lastRank ? treeOptions.lastIcon : item.showChild ? treeOptions.currentIcon : treeOptions.defaultIcon">
					</u-icon>
				</view>
				<view @click.stop="beforeAddCategory(index)">
					<u-icon name="plus" class="right-mix-tree-icon"></u-icon>
				</view>
			</view>
		</u-swipe-action>


		<view v-if="modalOptions.showFlag">
			<u-modal v-model="modalOptions.showFlag" :show-cancel-button="true" @confirm="modalConfirm"
				:title="modalOptions.title" :title-style="{color:'#2979ff'}">
				<u-field v-model="modalOptions.name" label="分类名称" placeholder="请填写分类名称" required
					error-message="分类名称不能为空" :border-bottom="true">
				</u-field>
			</u-modal>
		</view>
		
		<view style="margin-top: 30rpx;">
			<u-button  type="primary" @click="beforeAddMainCategory()">添加分类</u-button>
		</view>
		<u-modal v-model="warningModalOptions.showFlag" :show-cancel-button="true" :title="warningModalOptions.title"
			:content="warningModalOptions.content" :title-style="{color:'#ff9900'}" @confirm="warningModalConfirm">
		</u-modal>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default () {
					return [];
				}
			},
			params: {
				type: Object,
				default () {
					return {}
				}
			}
		},
		data() {
			return {
				// 树形菜单数据
				treeNodeList: [],
				currentTreeNodeIndex: 0,
				// 当前树形菜单数据
				currentTreeNode: null,
				// 树形菜单参数
				treeOptions: {
					defaultIcon: '/static/mix-tree/defaultIcon.png',
					currentIcon: '/static/mix-tree/currentIcon.png',
					lastIcon: '',
					border: false
				},
				// 添加模态框参数
				modalOptions: {
					title: "添加",
					name: "",
					showFlag: false,
					// 确认按钮的函数名称
					func: null
				},
				warningModalOptions: {
					title: "警告",
					showFlag: false,
					content: "删除后将无法恢复，确认删除吗？"
				},

				// 滑块设置
				swipeOptions: {
					btnWidth: 150,
					options: [{
							text: '编辑',
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
				}
			}
		},
		// lsit参数的监听事件
		watch: {
			list: {
				handler(newList, oldList) {
					this.treeOptions = Object.assign(this.treeOptions, this.params);
					this.treeNodeList = [];
					this.rendertreeNodeList(newList);
				},
				// immediate: true,
				// deep: true
			}
		},
		methods: {
			// 滑块--点击事件
			swipeClick(index, index1) {
				this.currentTreeNodeIndex = index;
				this.currentTreeNode = this.treeNodeList[index];
				if (index1 == 1) {
					this.beforeDeleteCategory();
				} else {
					this.beforeUpdateCategory();
				}
			},
			// 如果打开一个的时候，不需要关闭其他，则无需实现本方法
			swipeOpen(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.treeNodeList[index].swipeShow = true;
				this.treeNodeList.map((val, idx) => {
					if (index != idx) this.treeNodeList[idx].swipeShow = false;
				})
			},
			swipeClose(index) {
				// 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
				// 原本为'false'，再次设置为'false'会无效
				this.treeNodeList[index].swipeShow = false;
			},
			beforeAddMainCategory() {
				this.modalOptions.title = "添加";
				this.modalOptions.func = this.doAddMainCategory;
				this.showModal();
			},
			beforeAddCategory(index) {
				this.modalOptions.title = "添加";
				this.currentTreeNodeIndex = index;
				this.currentTreeNode = this.treeNodeList[index];

				if (this.currentTreeNode != null && this.currentTreeNode.children == null) {
					this.currentTreeNode.children = [];
				}
				this.modalOptions.func = this.doAddCategory;
				this.showModal();
			},
			beforeDeleteCategory() {
				this.warningModalOptions.showFlag = true;
			},
			beforeUpdateCategory() {
				this.modalOptions.title = "编辑";
				this.modalOptions.func = this.doUpdateCategory;
				this.showModal();
			},
			doAddMainCategory() {
				let params = {
					"categoryName": this.modalOptions.name,
					"parentId": "218489046686535680",
					"typeCode": "note",
					"categoryCode": this.modalOptions.name
				};
				this.$emit('treeNodeAdd', params, result => {
					if (null != result && result.code == 200) {
						this.$u.toast(`添加成功`);
					}
				});
			},
			doAddCategory() {
				let params = {
					"categoryName": this.modalOptions.name,
					"parentId": this.currentTreeNode.id,
					"typeCode": "note",
					"categoryCode": this.modalOptions.name
				};
				this.$emit('treeNodeAdd', params, result => {
					if (null != result && result.code == 200) {
						this.$u.toast(`添加成功`);
					}
				});
			},
			doDeleteCategory() {
				if (this.currentTreeNode != null) {
					this.$emit('treeNodeDelete', {
						id: this.currentTreeNode.id
					}, result => {
						if (null != result && result.code == 200) {
							// this.swipeClose();
							// this.treeNodeList.splice(this.currentTreeNodeIndex, 1);
							this.$u.toast(`删除成功`);
						}
					});
				}
			},
			doUpdateCategory() {
				let params = {
					"categoryName": this.modalOptions.name,
					"id": this.currentTreeNode.id,
					"categoryCode": this.modalOptions.name
				};
				this.$emit('treeNodeUpdate', params, result => {
					if (null != result && result.code == 200) {
						this.currentTreeNode.swipeShow = false;
						this.$u.toast(`编辑成功`);
					}
				});

			},

			/**
			 * 打开modal
			 * index:treenodelist下标
			 * */
			showModal() {
				this.modalOptions.name = "";
				this.modalOptions.showFlag = !this.modalOptions.showFlag;
			},
			// modalConfirm
			modalConfirm() {
				this.modalOptions.func();

			},
			warningModalConfirm() {
				this.doDeleteCategory();
			},


			//扁平化树结构
			rendertreeNodeList(list = [], parentIdList = []) {
				list.forEach(item => {
					let showFlag = item.level === 1
					let showChildFlag = false;
					//子级是否显示
					let _item = {
						"id": item.id,
						"typeCode": item.typeCode,
						"categoryCode": item.categoryCode,
						"categoryName": item.categoryName,
						"parentId": item.parentId,
						"level": item.level,
						"showChild": showChildFlag, //子级是否显示
						"show": showFlag, // 自身是否显示
						"parentIdList": parentIdList,
						"swipeShow": false
					}
					if (this.currentTreeNode != null && this.currentTreeNode.id != undefined) {
						// item是this.currentTreeNode、item是this.currentTreeNode的父级、
						// item是this.currentTreeNode的子集、item是this.currentTreeNode的兄弟
						if (_item.id == this.currentTreeNode.id ||
							this.currentTreeNode.parentIdList.includes(_item.id) ||
							(_item.parentIdList != undefined && _item.parentIdList.includes(this.currentTreeNode
								.id)) ||
							(_item.parentIdList != undefined && this.currentTreeNode.parentIdList.includes(_item
								.parentId))) {
							showFlag = true;
							showChildFlag = true;
						}
					}
					_item.show = showFlag;
					_item.showChild = showChildFlag;
					this.treeNodeList.push(_item);
					if (Array.isArray(item.children) && item.children.length > 0) {
						let parents = [...parentIdList];
						parents.push(item.id);
						this.rendertreeNodeList(item.children, parents);
					} else {
						this.treeNodeList[this.treeNodeList.length - 1].lastRank = true;
					}
				});
			},
			// 点击
			treeNodeTap(item, index) {
				this.currentTreeNode = item;
				this.currentTreeNodeIndex = index;
				let list = this.treeNodeList;
				let id = item.id;
				if (item.lastRank === true) {
					//点击最后一级时触发事件
					this.$emit('treeNodeClick', item);
					return;
				}
				item.showChild = !item.showChild;
				list.forEach(childItem => {
					if (item.showChild === false) {
						//隐藏所有子级
						if (!childItem.parentIdList.includes(id)) {
							return;
						}
						if (childItem.lastRank !== true) {
							childItem.showChild = false;
						}
						childItem.show = false;
					} else {
						if (childItem.parentIdList[childItem.parentIdList.length - 1] === id) {
							childItem.show = true;
						}
					}
				});
			}
		}
	}
</script>

<style>
	.content {
		padding-left: 30upx;
	}

	.mix-tree-item {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		font-size: 30upx;
		color: #333;
		height: 0;
		opacity: 0;
		transition: .2s;
		position: relative;
	}

	.mix-tree-item.border {
		border-bottom: 1px solid #eee;
	}

	.mix-tree-item.show {
		height: 80upx;
		opacity: 1;
	}

	.left-mix-tree-icon {
		width: 26upx;
		height: 26upx;
		margin-right: 8upx;
		opacity: .9;
	}

	.right-mix-tree-icon {
		width: 26upx;
		height: 26upx;
		margin-right: 40upx;
		opacity: .9;
	}

	.mix-tree-item.showchild:before {
		transform: rotate(90deg);
	}

	.mix-tree-item.last:before {
		opacity: 0;
	}
</style>
