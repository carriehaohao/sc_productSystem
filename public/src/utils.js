
define(['jquery'], function($){
	return {
		// 设置左侧导航栏选中样式
		setMenu: function(href){
			$('.aside a[href="'+href+'"]')
			.addClass('active')
			.parents('ul').show();
		},
		// 获取地址中每个等号后面的值
		qs: function(key){
			// location对象可以帮助获取地址信息
			// location.search可以获取地址参数
			// 地址参数以?开始
			var search = location.search.slice(1);
			search = search.split('&');
			var obj = {};
			for(var i=0; i<search.length; i++){
				var temp = search[i].split('=');
				obj[temp[0]] = temp[1];
			}
			return obj[key];
		}
	};
})