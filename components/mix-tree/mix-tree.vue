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
						<u-icon size="40" width="26upx" height="26upx" :label="item.name"
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
				_treeNodeList: [],
				// 树形菜单参数
				treeParams: {
					defaultIcon: '/static/mix-tree/defaultIcon.png',
					currentIcon: '/static/mix-tree/currentIcon.png',
					lastIcon: '',
					border: false
				},
				// 当前树形菜单数据
				currentTreeNode: {},

				// 添加模态框参数
				addModal: {
					modalShowFlag: false,
					name: ""
				},

			}
		},
		watch: {
			// 
			list: {
				handler(newList, oldList) {
					this.treeParams = Object.assign(this.treeParams, this.params);
					this._treeNodeList = [];
					this.rendertreeNodeList(newList);
					this.treeNodeList = this._treeNodeList;
				},
				// immediate: true,
				deep: true
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
					"parentId": this.currentTreeNode.parentId,
					"typeCode": "note",
					"categoryCode": this.addModal.name
				};
				this.$u.api.categoryAdd(params).then(res => {
					let item = res.value;
					item.showChild = false;
					item.show = item.level > 1
					this.currentTreeNode.children.push(item);
					console.log("this.treeNodeList=" + JSON.stringify(this.treeNodeList))
				})
			},
			//扁平化树结构
			rendertreeNodeList(list = []) {
				console.log("list=" + JSON.stringify(list))
				list.forEach(item => {
					//子级是否显示
					item.showChild = false; //子级是否显示
					item.show = item.level > 1; // 自身是否显示
					this._treeNodeList.push(item);
					if (Array.isArray(item.children) && item.children.length > 0) {
						this.rendertreeNodeList(item.children);
					} else {
						this._treeNodeList[this._treeNodeList.length - 1].lastRank = true;
					}
				})
			},
			// 点击
			treeItemTap(item) {
				this.currentTreeNode = item;
				let list = this.treeList;
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
						if (!childItem.parentId === id) {
							return;
						}
						if (childItem.lastRank !== true) {
							childItem.showChild = false;
						}
						childItem.show = false;
					} else {
						if (childItem.parentId === id) {
							childItem.show = true;
						}
					}
				})
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
