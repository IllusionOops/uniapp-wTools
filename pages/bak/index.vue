<template>
	<view>
		<button @tap="startRecord">开始录音</button>
		<button @tap="endRecord">停止录音</button>
		<button @tap="playVoice">播放录音</button>
		<button @tap="startRecognize">开始识别</button>
	</view>
</template>
<script>
	const recorderManager = uni.getRecorderManager();
	const innerAudioContext = uni.createInnerAudioContext();
	innerAudioContext.autoplay = true;
	var _this;
	
	export default {
		data(){
			return {
				voicePath : ''
			}
		},
		onLoad() {
			_this = this;
			recorderManager.onStop(function(res) {
				console.log(res)
				_this.voicePath = res.tempFilePath
				// 使用uni.uploadFile上传到服务器上，此时是mp3格式
			});
		},
		methods: {
			startRecord() {
				console.log('开始录音');
				recorderManager.start({
					sampleRate: 16000 // 必须设置是后台设置的参数，不然百度语音识别不了
				});
			},
			endRecord() {
				console.log('录音结束');
				_this = this;
				recorderManager.stop();
			},
			playVoice() {
				console.log('播放录音');
				if (this.voicePath) {
					innerAudioContext.src = this.voicePath;
					innerAudioContext.play();
				}
			},
			startRecognize() {
				var options = {};
				options.engine = 'baidu';
				console.log("开始语音识别：");
				plus.speech.startRecognize(options, function(s){
					console.log("识别结果:"+s)
					plus.speech.stopRecognize();
				}, function(e){
					console.log("语音识别失败："+e.message);
				});
			}
		}
	}
</script>