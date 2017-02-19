
define(['jquery','../utils','validate','form'],function($,utils){
    // 设置导航
    utils.setMenu('/course/create');

    // 验证并提交数据
    $('#createForm').validate({
        sendForm: false,
        valid: function(){
            // form插件的ajaxSubmit方法可以自动表单数据，前提是表单项必须有name
            $(this).ajaxSubmit({
                url: '/api/course/create',
                type: 'post',
                success: function(info){
                    if(info.code == 200){
                        location.href = '/course/basic?cs_id=' +  info.result.cs_id;
                    }
                }
            });
        }
    });
});