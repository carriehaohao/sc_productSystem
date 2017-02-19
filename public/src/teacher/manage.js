
define(['jquery','../utils','template','form','datepicker','language','validate'], function($,utils,template){
    // 设置导航
    utils.setMenu('/teacher/list');

    // 获得讲师id，从而获取讲师信息
    var tc_id = utils.qs('tc_id'),
        // dom缓存（避免重复获取）
        teacher = $('#teacher'),
        html;

    // 将参数发送给服务端，服务端返回给前端数据
    // 只有编辑操作才有必要发送请求要数据
    // 添加操作不需要
    if(tc_id){ // 编辑
        $.ajax({
            url: '/api/teacher/edit',
            type: 'get',
            data: {tc_id: tc_id},
            success: function(info){
                if(info.code == 200){
                    // 将获取到的数据展示到页面中
                    // 给info.result添加属性
                    info.result.active = '讲师编辑';// 页面状态
                    info.result.btnText = '修 改';// 按钮文字
                    info.result.action = '/api/teacher/update';// 接口地址
                    html = template('teacherTpl', info.result);
                    teacher.html(html);
                    // 验证表单
                    validateForm();
                }
            }
        });
    } else { // 添加
        // 拼凑数据并调用模板引擎
        html = template('teacherTpl',{
            active: '讲师添加',
            btnText: '添 加',
            action: '/api/teacher/add',
            tc_gender: 0
        });
        teacher.html(html);
        // 验证表单
        validateForm();
    }

    // 提交表单
    // teacher.on('submit','form',function(){
        
    //     // 阻止默认提交
    //     return false;
    // });

    // 验证函数
    function validateForm(){
        $('form').validate({
            sendForm: false,
            onKeyup: true,
            valid: function(){
                // 所有表单项都合法会调用
                // 这时可以提交表单
                $(this).ajaxSubmit({ //this指向form标签
                    // url: '/api/teacher/update',
                    type: 'post',
                    success: function(info){
                        if(info.code == 200){
                            if(tc_id){
                                alert('修改成功!');
                            } else {
                                alert('添加成功!');
                            }
                        }
                    }
                });
            },
            eachValidField: function(){
                // 为合法表单项提示信息
                // 以下类名是bootstrap全局样式
                $(this).parents('.form-group').removeClass('has-error').addClass('has-success');//this指向input表单项
            },
            eachInvalidField: function(){
                // 为不合法表单项提示信息
                $(this).parents('.form-group').removeClass('has-success').addClass('has-error');//this指向input表单项
            },
            description: {
                user: {
                    required: '姓名不能为空'
                }
            }
        });
    }
    
});