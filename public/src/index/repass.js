
define(['jquery','validate','form'], function($){
    // 验证表单
    $('#repassForm').validate({
        sendForm: false,
        // 所有表单项都合法会调用
        valid: function(){
            // 发送请求
            $(this).ajaxSubmit({
                url: '/api/teacher/repass',
                type: 'post',
                success: function(info) {
                    if(info.code == 200){
                        alert('修改成功！');
                    }
                }
            });
        },
        // 每个表单项合法时都会调用
        eachValidField: function() {
            $(this).parents('.form-group').removeClass('has-error').addClass('has-success');
        },
        eachInvalidField: function() {
            $(this).parents('.form-group').removeClass('has-success').addClass('has-error');
        }
    });
});