// /common/http.api.js

// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)
var loginUrl = '/sys-user/login';

var noteUrlDict = {
	// 根据typeCode查询分类列表
	'getCategoryListByTypeCodeUrl': '/sys-category/getListByTypeCode',
	// 添加分类
	'categoryAddUrl':"/sys-category/add",
	// 删除分类
	'categoryDeleteUrl':"/sys-category/deleteById",
	// 修改分类
	'categoryUpdateUrl':"/sys-category/update",
	//笔记列表查询url
	'getNotePageUrl': '/tools-note/page',
	// 笔记添加
	'noteAddUrl':'/tools-note/add',
	// 笔记添加
	'noteDeleteUrl':'/tools-note/deleteById',
	'noteUpdateUrl':'/tools-note/update',
	// 查询网站来源
	'getWebSiteSourcesUrl':'/sys-source/list',
}

// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	//登录
	var login = (params = {}) => vm.$u.post(loginUrl, params);

	
	// var noteRequestDict = {
	// 	getCategoryListByTypeCode: (params = {}) => vm.$u.get(noteUrlDict.getListByTypeCodeUrl, params),
	// 	//笔记列表查询
	// 	getNotePage: (params = {
	// 		"categoryId": "218468297832599552",
	// 		"pageNum": 1,
	// 		"pageSize": 20
	// 	}) => vm.$u.post(noteUrlDict.getNotePageUrl, params)
	// }
	//查询分类字典
	let getCategoryListByTypeCode = (params = {}) => vm.$u.get(noteUrlDict.getCategoryListByTypeCodeUrl, params);
	let categoryAdd =(params = {}) => vm.$u.post(noteUrlDict.categoryAddUrl, params);
	let categoryDelete =(params = {}) => vm.$u.post(noteUrlDict.categoryDeleteUrl, params);
	let categoryUpdate =(params = {}) => vm.$u.post(noteUrlDict.categoryUpdateUrl, params);
	//笔记列表查询
	let getNotePage = (params = {
		"categoryId": "218468297832599552",
		"pageNum": 1,
		"pageSize": 20
	}) => vm.$u.post(noteUrlDict.getNotePageUrl, params);
	// 笔记添加方法
	let noteAdd = (params = {}) => vm.$u.post(noteUrlDict.noteAddUrl, params);
	// 笔记删除方法
	let noteDelete = (params = {}) => vm.$u.post(noteUrlDict.noteDeleteUrl, params);
	// 笔记修改方法
	let noteUpdate = (params = {}) => vm.$u.post(noteUrlDict.noteUpdateUrl, params);
	
	// 查询网站来源
	let getWebSiteSources = (params = {}) => vm.$u.get(noteUrlDict.getWebSiteSourcesUrl, params);
	

	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {
		login,
		getCategoryListByTypeCode,
		categoryAdd,
		categoryDelete,
		categoryUpdate,
		getNotePage,
		noteAdd,
		noteDelete,
		noteUpdate,
		getWebSiteSources
	};
}

export default {
	install
}
