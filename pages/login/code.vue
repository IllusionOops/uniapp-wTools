<template>
    <view class="content">
        <hj-dragabledrawer :options="options" ref="dragBox" @open="afterOpen" @close="afterClose">
            <button @tap="hello">hi</button>
            <text>不建议使用v-for进行列表渲染</text>
            <text style="background-color: red;">单击蒙层也会关闭</text>
            <text>如需自定义抽屉内容布局，可把这些内容放在一个宽高100%的view里面哦</text>
            <button @tap="close">close</button>
            <view v-for="i in 10" :key="i">{{ i }}</view>
        </hj-dragabledrawer>
       <!-- <button @tap="open">打开</button>
        <button @tap="toggle">L/R模式切换</button>
        <button @tap="toggle1">mask模式切换</button>
        <text>
            当前模式：
            <text v-if="!options.rightMode">左侧弹出</text>
            <text v-else="">右侧弹出</text>
        </text>
        <text>遮罩：{{ options.mask ? '有' : '无' }}</text> -->
    </view>
</template>
<script>
import hjDragabledrawer from '@/components/hj-dragabledrawer/hj-dragabledrawer.vue'; //这里修改下插件的相对路径
let dragBox;
export default {
    data() {
        return {
            options: {
                visible: false,
                rightMode: false,
                autoClose: true,
                pulldown: true
            }
        };
    },
    onReady() {
        dragBox = this.$refs.dragBox;
    },
    components: {
        hjDragabledrawer
    },
    methods: {
        open() {
            dragBox.open();
        },
        hello() {
            uni.showToast({
                title: 'hello',
                icon: 'none'
            });
        },
        close() {
            dragBox.close();
        },
        toggle() {
            this.options.rightMode = !this.options.rightMode;
        },
        toggle1() {
            this.$set(this.options, 'mask', !this.options.mask);
        },
        afterOpen() {
            uni.showToast({
                title: 'open',
                icon: 'none'
            });
        },
        afterClose() {
            uni.showToast({
                title: 'close',
                icon: 'none'
            });
        }
    }
};
</script>
<style scoped="">
.content {
    display: flex;
    flex-direction: column;
    align-items: center;
}

button {
    margin: 20upx;
    padding: 20upx;
    font-size: 32upx;
    width: 60%;
}

text {
    margin: 20upx;
    font-size: 24upx;
}
</style>