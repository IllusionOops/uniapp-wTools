<template>
	<view>
		<!-- 搜索框 -->
		<view class="u-search-box">
			<view class="u-search-inner">
				<u-icon name="search" color="#909399" :size="28"></u-icon>
				<text class="u-search-text">搜索uView</text>
			</view>
		</view>
		<!-- picker -->
		<view>
			<u-row class="picker-row">
				<u-col span="3">
					<u-button @click="show = true">{{singleColText}}</u-button>
					<u-select :default-value="[0]" v-model="show" mode="single-column" :list="stockTypeOptions"
						@confirm="confirm"></u-select>
				</u-col>
				<u-col span="8">
					<uni-datetime-picker v-model="single" type="date" rangeSeparator="至" @change="change"
						:clearIcon="false" />
				</u-col>
			</u-row>
		</view>
		<!-- 个股表格 -->
		<view class="stock-table" v-if="singleColText == '个股'">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="60">序号</uni-th>
					<uni-th align="center" width="120">股票代码</uni-th>
					<uni-th align="center" width="120">股票名称</uni-th>
					<uni-th align="center" width="80" :sortable="true" @sort-change="sortLastPrice">最新价</uni-th>
					<uni-th align="center" width="80" :sortable="true" @sort-change="sortQuoteChange">跌涨幅</uni-th>
					<uni-th align="center" width="120" :sortable="true" @sort-change="sortInFlowNet">净流入</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in singleStockList" :key="index">
					<uni-td align="center">{{index+1}}</uni-td>
					<uni-td align="center">
						<navigator 
							:url="'/pages/stock/stockLine?stockNum='+item.stockNum+'&name='+item.name"
							class="navigator-stock">
							{{item.stockNum}}
						</navigator>
					</uni-td>
					<uni-td align="center">{{item.name}}</uni-td>
					<uni-td align="center">{{item.lastestPrice}}</uni-td>
					<uni-td align="center">{{item.quoteChange}}%</uni-td>
					<uni-td align="center">{{item.inFlowNet}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<!-- 板块表格 -->
		<view class="stock-table" v-if="singleColText == '板块'">
			<uni-table border stripe emptyText="暂无更多数据">
				<!-- 表头行 -->
				<uni-tr>
					<uni-th align="center" width="60">序号</uni-th>
					<uni-th align="center" width="120">板块名称</uni-th>
					<uni-th align="center" width="120">净流入最大股</uni-th>
					<uni-th align="center" width="80" :sortable="true" @sort-change="sortPlateQuoteChange">跌涨幅</uni-th>
					<uni-th align="center" width="120" :sortable="true" @sort-change="sortPlateInFlowNet">净流入</uni-th>
				</uni-tr>
				<!-- 表格数据行 -->
				<uni-tr v-for="(item,index) in plateList" :key="index">
					<uni-td align="center">{{index+1}}</uni-td>
					<uni-td align="center">
						<navigator 
							:url="'/pages/stock/plate?name='+item.name"
							class="navigator-stock">
							{{item.name}}
						</navigator>
					</uni-td>
					<uni-td align="center">
						<navigator 
							:url="'/pages/stock/stockLine?stockNum='+item.maxStockNum+'&name='+item.maxStockName"
							class="navigator-stock">
							{{item.maxStockName}}
						</navigator>
					</uni-td>
					<uni-td align="center">{{item.quoteChange}}%</uni-td>
					<uni-td align="center">{{item.inFlowNet}}</uni-td>
				</uni-tr>
			</uni-table>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/***************************个股表格*************************/
				singleStockList: [{
						stockNum: '600905',
						name: '三峡能源',
						lastestPrice: 7.0,
						quoteChange: 5.00,
						inFlowNet: 200
					},
					{
						stockNum: '000725',
						name: '京东方Ａ',
						lastestPrice: 68.0,
						quoteChange: 6.00,
						inFlowNet: 300
					}
				],
				/****************************板块表格************************/
				plateList: [{
						name: "化工行业",
						maxStockNum: "603077",
						maxStockName: "和邦生物",
						quoteChange: 3.05,
						inFlowNet: 49.8
					},
					{
						name: "电子信息",
						maxStockNum: "300059",
						maxStockName: "东方财富",
						quoteChange: 5.00,
						inFlowNet: 23.16
					}
				],
				/***************************picker **************************/
				//类型
				singleColText: '个股',
				show: false,
				stockTypeOptions: [{
					label: '个股',
					value: 1,
				}, {
					label: '板块',
					value: 2,
				}],
				//日期
				single: "",
			}
		},
		watch: {
			// range(newval) {
			// 	console.log('范围选:', this.range);
			// }
		},
		onload() {
			// plus.screen.lockOrientation('default');
		},
		onUnload() {
			// plus.screen.lockOrientation('portrait-primary'); 
		},
		created() {
			this.single = this.getNowFormatDate()
			console.log(this.single)
		},
		mounted() {

		},
		methods: {
			/*********************************picker**************************************/
			confirm(params) {
				console.log("picker单列。", params)
				this.singleColText = params[0].label
			},
			//日期
			change(e) {
				console.log('-change事件:', e);
			},

			/*********************************个股表格******************************************/
			//净流入排序
			sortInFlowNet(sorter) {
				if (sorter.order == 'ascending') {
					this.singleStockList.sort((x, y) => {
						return x.inFlowNet - y.inFlowNet
					})
				} else if (sorter.order == 'descending') {
					this.singleStockList.sort((x, y) => {
						return y.inFlowNet - x.inFlowNet
					})
				}
			},
			//最新价排序
			sortLastPrice(sorter) {
				if (sorter.order == 'ascending') {
					this.singleStockList.sort((x, y) => {
						return x.lastestPrice - y.lastestPrice
					})
				} else if (sorter.order == 'descending') {
					this.singleStockList.sort((x, y) => {
						return y.lastestPrice - x.lastestPrice
					})
				}
			},
			//涨幅排序
			sortQuoteChange(sorter) {
				if (sorter.order == 'ascending') {
					this.singleStockList.sort((x, y) => {
						return x.quoteChange - y.quoteChange
					})
				} else if (sorter.order == 'descending') {
					this.singleStockList.sort((x, y) => {
						return y.quoteChange - x.quoteChange
					})
				}
			},
			/*********************************个股表格******************************************/
			//涨幅排序
			sortPlateQuoteChange(sorter) {
				if (sorter.order == 'ascending') {
					this.plateList.sort((x, y) => {
						return x.quoteChange - y.quoteChange
					})
				} else if (sorter.order == 'descending') {
					this.plateList.sort((x, y) => {
						return y.quoteChange - x.quoteChange
					})
				}
			},
			//净流入排序
			sortPlateInFlowNet(sorter) {
				if (sorter.order == 'ascending') {
					this.plateList.sort((x, y) => {
						return x.inFlowNet - y.inFlowNet
					})
				} else if (sorter.order == 'descending') {
					this.plateList.sort((x, y) => {
						return y.inFlowNet - x.inFlowNet
					})
				}
			},
			/******************************工具方法*****************************************/
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			}
		}
	}
</script>

<style>
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
	
	/* 表格开始 */
	.stock-table {
		padding: 18rpx 30rpx;
	}
	.navigator-stock{
		color: cornflowerblue;
	}
	/* 表格结束 */

	/* picker */
	.picker-row {
		padding: 18rpx 10rpx;
	}

	/* 日期 */
	@import '@/common/uni-nvue.scss';
</style>
