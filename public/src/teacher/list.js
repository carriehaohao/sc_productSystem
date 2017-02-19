
define(['jquery','template','../utils'], function($,template,utils){

	// 设置选中导航
	utils.setMenu('/teacher/list');

	// 全局获取dom元素
	var teacherList = $('#teacherList'),
		teacherModal = $('#teacherModal'),
		html;

	// 进入讲师管理界面就自动发送请求获取讲师列表
	$.ajax({
		url: 'http://route.showapi.com/52-26',
		type: 'get',
		data: {
			showapi_appid:'32319',
			showapi_sign:'87f3babfc25242b7835621741b9212f1',
			q:'银行',
			region:'北京'
		},
		success: function(info){
			html = template('teacherTpl', {list: info.showapi_res_body.results});
			teacherList.html(html);
		}
	});

	// 点击查看按钮查看相应的讲师信息
	teacherList.on('click', '.preview', function(){

		var	_this = $(this),
			td = _this.parent(),
			tc_id = td.attr('data-id');

		$.ajax({
			url: '/api/teacher/view',
			type: 'get',
			data: {tc_id: tc_id},
			success: function(info){
				console.log(info);
				if(info.code == 200){
					//处理家乡显示格式
					var hometown = info.result.tc_hometown.split('|').join(' ');
					info.result.tc_hometown = hometown;

					html = template('modalTpl', info.result);
					teacherModal.find('.panel-body').html(html);
					teacherModal.modal();
				}
			}
		});
	});

	// 注销和启用
	teacherList.on('click', '.handle', function(){

		var _this = $(this),
			td = _this.parent(),
			tc_id = td.attr('data-id'),
			// tc_status 讲师当前的状态
			// 0(启用状态)	显示‘注销’
			// 1(注销状态)	显示‘启用’
			tc_status = td.attr('data-status');

		$.ajax({
			url: '/api/teacher/handle',
			type: 'post',
			data: {
				tc_id: tc_id,
				tc_status: tc_status
			},
			success: function(info){
				console.log(info);
				if(info.code == 200){
					// 修改按钮上的文字（表象）
					if(tc_status == 0){
						_this.text('启 用');
					} else {
						_this.text('注 销');
					}
					// 更新讲师的状态（实际）
					td.attr('data-status', info.result.tc_status);
				}
			}
		});
	});

})