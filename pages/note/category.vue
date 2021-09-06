<template>
	<view class="content">
		<view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view>
		<category-tree :list="treeNodeList" @treeNodeClick="treeNodeClick" @treeNodeAdd="treeNodeAdd"
			@treeNodeUpdate="treeNodeUpdate" @treeNodeDelete="treeNodeDelete">
		</category-tree>
	</view>
</template>

<script>
	import categoryTree from '@/components/mix-tree/category-tree.vue';
	export default {
		components: {
			categoryTree
		},
		data() {
			return {
				treeNodeList: [],
				num: 0
			}
		},
		onLoad() {

			setTimeout(() => {
				this.getCategoryList();
			}, 300)
		},
		methods: {
			//查询树结构数据
			getCategoryList() {
				let params = {
					"typeCode": "note"
				}
				this.$u.api.getCategoryListByTypeCode(params).then(res => {
					if (null != res.value && res.value.length > 0) {
						this.treeNodeList = res.value;
					}
				})
			},

			//树节点点击事件---点击最后一级时触发该事件
			treeNodeClick(node) {
				// 带参数
				this.$u.route({
					url: "/pages/note/note",
					params: {
						categoryId: node.id
					}
				})
			},
			//树节点删除事件---
			treeNodeAdd(params,callback) {
				// let params = {
				// 	"categoryName": this.addModal.name,
				// 	"parentId": this.currentTreeNode.id,
				// 	"typeCode": this.currentTreeNode.typeCode,
				// 	"categoryCode": this.addModal.name
				// };
				this.$u.api.categoryAdd(params).then(res => {
					console.log("treeNodeAdd----")
					this.getCategoryList();
					callback(res);
				});
			},
			//树节点删除事件---
			treeNodeDelete(params, callback) {
				this.$u.api.categoryDelete(params).then(res => {
					console.log("treeNodeDelete")
					this.getCategoryList();
					callback(res);
				});
			},
			//树节点修改事件---
			treeNodeUpdate(params, callback) {
				this.$u.api.categoryUpdate(params).then(res => {
					console.log("treeNodeUpdate")
					this.getCategoryList();
					callback(res);
				});
			},
		
		}
	}
</script>

<style lang="scss" scoped>
	.u-search-box {
		padding: 18rpx 30rpx;
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
</style>
