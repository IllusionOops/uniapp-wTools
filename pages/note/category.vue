<template>
	<view class="content">
		<mix-tree :list="treeNodeList" @treeItemClick="treeItemClick"></mix-tree>

		<u-button @click="click"></u-button>
	</view>


</template>

<script>
	import mixTree from '@/components/mix-tree/mix-tree';
	let treeNodeList = [];
	export default {
		components: {
			mixTree
		},
		data() {
			return {
				list: [],
				num: 0
			}
		},
		onLoad() {
			
			setTimeout(() => {
				this.getCategoryList();
			}, 300)
		},
		methods: {
			//点击最后一级时触发该事件
			
			treeItemClick(item) {
				let {
					id,
					name,
					parentId
				} = item;
				uni.showModal({
					content: `点击了${parentId.length+1}级菜单, ${name}, id为${id}, 父id为${parentId.toString()}`
				})
				console.log(item)
			},
			
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

			click() {
				this.num = this.num + 1;
				console.log("num=" + this.num)

				let _obj = {
					id: 10 + this.num,
					name: '北京市',
				};
				this.list.push(_obj);
			}
		}
	}
</script>

<style>

</style>
