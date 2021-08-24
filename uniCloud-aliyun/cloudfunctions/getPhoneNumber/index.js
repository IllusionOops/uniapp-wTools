'use strict';

const db = uniCloud.database()

exports.main = async (event, context) => {
	const res = await uniCloud.getPhoneNumber({
		appid: '__UNI__F1F6100', // 替换成自己开通一键登录的应用的DCloud appid，使用callFunction方式调用时可以不传（会自动取当前客户端的appid），如果使用云函数URL化的方式访问必须传此参数
		provider: 'univerify',
		apiKey: 'bdd8d15dfd49fecbaac7e946bbf6b1d1', // 在开发者中心开通服务并获取apiKey
		apiSecret: '94b60cf1b2d6247e400dabe2dcc984c6', // 在开发者中心开通服务并获取apiSecret
		access_token: event.access_token,
		openid: event.openid
	});

	console.log(res); // res里的数据格式	{ code: 0, success: true, phoneNumber: '186*****078' }

	// 执行入库等操作，正常情况下不要把完整手机号返回给前端	
	return await db.collection('regUser').add({		
		openid: event.openid, //前端提交过来的数据
		PhoneNumber:res.phoneNumber,
		createTime: Date.now()		
	})
};