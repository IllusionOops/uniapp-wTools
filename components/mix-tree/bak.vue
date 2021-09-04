<template>
	<view class="content">
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeNodeList" :key="index">
				<view class="mix-tree-item" :style="[{
								paddingLeft: (item.level-1)*15 + 'px',
								zIndex: (item.level-1)*-1 +50
							}]" :class="{
								border: treeParams.border === true,
								show: item.show,
								last: item.lastRank,
								showchild: item.showChild
							}">
					<view @click.stop="treeItemTap(item, index)">
						<u-icon size="40" width="26upx" height="26upx" :label="item.categoryName"
							:name="item.lastRank ? treeParams.lastIcon : item.showChild ? treeParams.currentIcon : treeParams.defaultIcon">
						</u-icon>
					</view>
					<view @click.stop="showAddModal(item, index)">
						<u-icon name="plus" class="right-mix-tree-icon"></u-icon>
					</view>
					
				</view>
			</block>
		</view>

		<view v-if="addModal.modalShowFlag" style="text-align: center;display: flex;">
			<u-modal v-model="addModal.modalShowFlag" :show-cancel-button="true" @confirm="addConfirm" title="添加"
				:title-style="{color:'#2979ff'}">
				<u-field v-model="addModal.name" label="分类名称" placeholder="请填写分类名称">
				</u-field>
			</u-modal>

		</view>
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
				// 源树形菜单数据
				sourceTreeNodeList: [],
				// 当前添加对象
				addResult: {},
				// 当前树形菜单数据
				currentTreeNode: {},
				// 树形菜单参数
				treeParams: {
					defaultIcon: '/static/mix-tree/defaultIcon.png',
					currentIcon: '/static/mix-tree/currentIcon.png',
					lastIcon: '',
					border: false
				},
				// 添加模态框参数
				addModal: {
					modalShowFlag: false,
					name: ""
				},

			}
		},
		watch: {
			// lsit参数的监听事件
			list: {
				handler(newList, oldList) {
					this.treeParams = Object.assign(this.treeParams, this.params);
					this.treeNodeList = [];
					this.sourceTreeNodeList = newList;
					this.rendertreeNodeList(newList);
				},
				// immediate: true,
				// deep: true
			}
		},
		methods: {
			// 打开添加modal
			showAddModal(item, index) {
				if (item.children == null) {
					item.children = [];
				}
				this.currentTreeNode = item;
				this.addModal.modalShowFlag = !this.addModal.modalShowFlag;
			},
			// 添加分类
			addConfirm() {
				let params = {
					"categoryName": this.addModal.name,
					"parentId": this.currentTreeNode.id,
					"typeCode": this.currentTreeNode.typeCode,
					"categoryCode": this.addModal.name
				};
				this.$u.api.categoryAdd(params).then(res => {
					this.addResult = {
						"id": res.value.id,
						"typeCode": res.value.typeCode,
						"categoryCode": res.value.categoryName,
						"categoryName": res.value.categoryName,
						"parentId": res.value.parentId,
						"level": res.value.level,
						"showChild": false,
						"show": res.value > 1,
						"children": [],

					};
					this.treeNodeList = [];
					this.add2SourceTreeNodeList(this.sourceTreeNodeList);
					this.rendertreeNodeList(this.sourceTreeNodeList);
				})
			},
			// 将数据添加到sourceTreeNodeList
			add2SourceTreeNodeList(list = []) {
				list.forEach(sourceItem => {
					if (sourceItem.id == this.addResult.parentId) {
						sourceItem.children.push(this.addResult);
						return;
					} else {
						if (sourceItem.children != null) {
							this.add2SourceTreeNodeList(sourceItem.children);
						}
					}
				});
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
						"parentIdList": parentIdList
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
			treeItemTap(item) {
				this.currentTreeNode = item;
				let list = this.treeNodeList;
				let id = item.id;
				if (item.lastRank === true) {
					//点击最后一级时触发事件
					this.$emit('treeItemClick', item);
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
	.mix-tree-list {
		display: flex;
		flex-direction: column;
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
