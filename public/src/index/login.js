
define(['jquery','cookie'], function($){
	//监听submit事件
    $('#loginForm').on('submit', function(){
        // 通过Ajax将表单数据发送到服务端
        // serialize方法要求表单必须要有name
        var formData = $(this).serialize();//this指向dom元素，用$转换成jQuery元素

        $.ajax({
            url: '/api/login',
            type: 'post',
            data: formData,
            success: function(info){
                if(info.code == 200){
                    alert(info.msg);
                    //将服务端返回的用户数据（用户名，头像）存到cookie里，这样其他页面就可以获取
                    //cookie只能为字符串
                    $.cookie('loginfo', JSON.stringify(info.result));
                    location.href = '/';//设置跳转，表示跳转到index.html
                }
            }
        });

        //阻止默认提交
        return false;
    });
});