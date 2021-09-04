<template>
	<view class="u-demo">
		<view class="u-demo-wrap">
			<view class="u-demo-area">
				<u-toast ref="uToast"></u-toast>
				<swiper class="swiper" @change="swiperChange">
					<swiper-item>
						<u-grid :border="border" :col="col" @click="gridClick" hover-class="hover-class">
							<u-grid-item v-for="(item, index) in gridList" :index="index" :key="index">
								<u-badge count="9" :offset="[col == 3 ? 20 : 14, col == 3 ? 30 : 20]"></u-badge>
								<u-icon :name="item.icon" :size="46"></u-icon>
								<text class="grid-text">{{ item.text + (index + 1) }}</text>
							</u-grid-item>
						</u-grid>
					</swiper-item>
					<swiper-item>
						<u-grid :border="border" :col="col" @click="gridClick">
							<u-grid-item v-for="(item, index) in gridList" :index="index + 9" :key="index">
								<image src="https://cdn.uviewui.com/uview/grid/hot6.png"
									style="width: 44rpx;height: 44rpx;top:0;right:0;" class="badge-icon"></image>
								<u-icon :name="item.icon" :size="46"></u-icon>
								<text class="grid-text">{{ item.text + (index + 1) }}</text>
							</u-grid-item>
						</u-grid>
					</swiper-item>
					<swiper-item>
						<u-grid :border="border" :col="col" @click="gridClick">
							<u-grid-item v-for="(item, index) in gridList" :index="index + 18" :key="index">
								<u-icon :name="item.icon" :size="46"></u-icon>
								<text class="grid-text">{{ item.text + (index + 1) }}</text>
							</u-grid-item>
						</u-grid>
					</swiper-item>
				</swiper>
				<view class="indicator-dots">
					<view class="indicator-dots-item" :class="[current == 0 ? 'indicator-dots-active' : '']">
					</view>
					<view class="indicator-dots-item" :class="[current == 1 ? 'indicator-dots-active' : '']">
					</view>
					<view class="indicator-dots-item" :class="[current == 2 ? 'indicator-dots-active' : '']">
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				gridList: [{
						"text": "笔记本",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "笔记本2",
						"icon": "integral",
						"url": "pages/note/category"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					},
					{
						"text": "abc",
						"icon": "integral",
						"url": "pages/note/index"
					}
				],
				current: 0,
				border: true,
				col: 3
			};
		},
		methods: {
			gridClick(index) {
				this.$u.route({
					url: this.gridList[index].url,
					params: {
						categoryType:'note'
					}
				})
				// uni.navigateTo({
				// 	url:"/"+this.gridList[index].url
				// })
			},
			swiperChange(e) {
				this.current = e.detail.current;
			},
			// 针对单个grid-item的事件
			itemClick(index) {
				// console.log(index);
			}
		}
	};
</script>

<style scoped lang="scss">
	.grid-text {
		font-size: 28rpx;
		margin-top: 4rpx;
		color: $u-type-info;
	}

	.badge-icon {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
	}

	.swiper {
		height: 480rpx;
	}

	.indicator-dots {
		margin-top: 40rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.indicator-dots-item {
		background-color: $u-tips-color;
		height: 6px;
		width: 6px;
		border-radius: 10px;
		margin: 0 3px;
	}

	.indicator-dots-active {
		background-color: $u-type-primary;
	}
</style>
