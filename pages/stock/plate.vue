<template>
	<view>
		<view class="charts-box">
			<qiun-data-charts type="column" :chartData="chartData" background="none" :opts="{'rotate':true}"/>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				plateName: "",
				chartData: {
					"categories": [
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021"
					],
					"series": [{
							"name": "目标值",
							"data": [
								35,
								36,
								31,
								33,
								13,
								34
							]
						},
						{
							"name": "完成量",
							"data": [
								18,
								27,
								21,
								24,
								6,
								28
							]
						}
					]
				}
			}
		},
		onLoad: function(options) {
			this.plateName = options.name
			//设置标题
			uni.setNavigationBarTitle({
				title: this.plateName
			})
		},
		methods: {

		}
	}
</script>

<style>
/* 请根据需求修改图表容器尺寸，如果父容器没有高度图表则会显示异常 */
.charts-box{
  width: 100%;
  height: 1000rpx;
}
</style>
