<template>
	<view class="content">
		<view class="mix-tree-list">
			<block v-for="(item, index) in treeList" :key="index">
				<view class="mix-tree-item" :style="[{
								paddingLeft: item.rank*15 + 'px',
								zIndex: item.rank*-1 +50
							}]" :class="{
								border: treeParams.border === true,
								show: item.show,
								last: item.lastRank,
								showchild: item.showChild
							}" @click.stop="treeItemTap(item, index)">

					<!-- 	<image class="left-mix-tree-icon"
						:src="item.lastRank ? treeParams.lastIcon : item.showChild ? treeParams.currentIcon : treeParams.defaultIcon">
					</image>
					{{item.name}}
					 -->
					<u-icon size="40" width="26upx" height="26upx" :label="item.name"
						:name="item.lastRank ? treeParams.lastIcon : item.showChild ? treeParams.currentIcon : treeParams.defaultIcon">
					</u-icon>
					<u-icon name="plus" class="right-mix-tree-icon"></u-icon>
				</view>
			</block>
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
				treeList: [],
				_treeList: [],
				treeParams: {
					defaultIcon: '/static/mix-tree/defaultIcon.png',
					currentIcon: '/static/mix-tree/currentIcon.png',
					lastIcon: '',
					border: false
				}
			}
		},
		watch: {
			// 
			list: {
				handler(newList, oldList) {
					this.treeParams = Object.assign(this.treeParams, this.params);
					this._treeList = [];
					this.renderTreeList(newList);
					this.treeList = this._treeList;
				},
				// immediate: true,
				deep: true
			}
		},
		methods: {
			//扁平化树结构
			renderTreeList(list = [], rank = 0, parentId = []) {
				list.forEach(item => {
					this._treeList.push({
						id: item.id,
						name: item.name,
						parentId, // 父级id数组
						rank, // 层级
						showChild: false, //子级是否显示
						show: rank === 0 // 自身是否显示
					})
					if (Array.isArray(item.children) && item.children.length > 0) {
						let parents = [...parentId];
						parents.push(item.id);
						this.renderTreeList(item.children, rank + 1, parents);
					} else {
						this._treeList[this._treeList.length - 1].lastRank = true;
					}
				})
			},
			// 点击
			treeItemTap(item) {
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
						if (!childItem.parentId.includes(id)) {
							return;
						}
						if (childItem.lastRank !== true) {
							childItem.showChild = false;
						}
						childItem.show = false;
					} else {
						if (childItem.parentId[childItem.parentId.length - 1] === id) {
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
