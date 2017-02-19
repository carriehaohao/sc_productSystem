
define(['jquery','../utils','template'], function($,utils,template) {
    // 设置导航
    utils.setMenu('/course/list');
    
    // 发送请求获取数据
    $.ajax({
        url: '/api/course',
        type: 'get',
        success: function(info) {
            if(info.code == 200){
                var html = template('courseTpl', {list:info.result});
                $('.courses').append(html);
            }
        }
    });
});