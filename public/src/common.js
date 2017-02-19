
define(['jquery','template','nprogress','cookie'], function($,template,NProgress){

	/*左侧导航交互*/
	$('.navs ul').prev('a').on('click', function () {
		$(this).next().slideToggle();
	});


	/*检测登录*/

	// 判断是否登录，就是要检测有没有一个叫 PHPSESSID 的 cookie
	// console.log($.cookie('PHPSESSID'));
	// 并且，在登录页不需要检测登录，否则就会陷入死循环
	// console.log(location.pathname);
	if(location.pathname != '/login' && !$.cookie('PHPSESSID')){
		location.href = '/login';
	}

	/*退出登录*/
	$('#logout').on('click', function(){
		$.ajax({
			url: '/api/logout',
			type: 'post',
			success: function(info){
				if(info.code == 200){
					alert(info.msg);
					location.reload();
				}
			}
		});
	});


	/*登录后在主页上渲染头像和用户名*/

	// 获取cookie，将cookie信息读取出来设置为头像
	var loginfo = $.cookie('loginfo');

	// loginfo只有登录成功后才会有，否则为空，并且是以字符串形式存在的
	// 转成对象
	var loginfo = loginfo && JSON.parse(loginfo);

	// console.log(loginfo);

	var tpl = '<!-- 头像 -->\
				<div class="avatar img-circle">\
					<img src="{{tc_avatar}}">\
				</div>\
				<h4>{{tc_name}}</h4>';//用反斜杠可以表示字符串换行

	var render = template.compile(tpl);

	var html = render(loginfo || {});//如果没有传内容，就传一个空对象，以防报错

	$('.aside .profile').html(html);


	/*加载进度条*/
	NProgress.start();
	NProgress.done();


	/*监听所有页面的所有ajax请求*/
	$(document).ajaxStart(function(){
		$('.overlay').show();
	}).ajaxStop(function(){
		setTimeout(function(){
			$('.overlay').hide();
		},300);
	});

});
	

            
            
                
            
            
