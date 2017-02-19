
define(['jquery','template','ckeditor','datepicker','language','region','validate','form','uploadify'],function($,template,CKEDITOR){

    var html,
        profile = $('#profile');

    $.ajax({
        url: '/api/teacher/profile',
        type: 'get',
        success: function(info) {
            if(info.code == 200){
                // 调用模板引擎，添加到dom中
                html = template('profileTpl', info.result);
                profile.html(html);
                
                // 省市县三级联动
                $('.hometown').region({
                    url: '/public/assets/jquery-region/region.json'
                });

                // 调用富文本
                CKEDITOR.replace('ckeditor', {
                    // 配置工具栏
                    toolbarGroups: [
                        {
                            name: 'editing', 
                            groups: ['find','selection','spellchecker']
                        },
                        { name: 'links' },
                        { name: 'insert' },
                        { name: 'insert' },
                        { name: 'forms' },
                        { name: 'tools' },
                        { name: 'others' }
                    ]
                });

                // 调用表单验证插件
                $('form').validate({
                    onBlur: true,
                    sendForm: false,
                    valid: function(){
                        // 所有表单项都合法时执行
                        for(instance in CKEDITOR.instances){
                            CKEDITOR.instances[instance].updateElement();
                        }
                        $(this).ajaxSubmit({
                            url: '/api/teacher/modify',
                            type: 'post',
                            success: function(info){
                                if(info.code == 200){
                                    alert('修改成功');
                                }
                            }
                        });
                    },
                    eachValidField: function(){
                        // 为合法的表单项提示信息
                    },
                    eachInvalidField: function(){
                        // 为不合法的表单项提示信息
                    },
                    description: {
                        // 进行文字提示
                    }
                });

                // 头像上传
                $('#upfile').uploadify({
                    // 去掉默认文字
                    buttonText: '',
                    // 修改上传按钮的大小
                    height: 120,
                    width: 120,
                    // 服务器接收参数
                    fileObjName: 'tc_avatar',
                    // 给一个空span，去掉上传进度文字
                    itemTemplate:'<span></span>',
                    /* 上传地址（接口）（最关键）*/
                    uploader: '/api/uploader/avatar',
                    swf: '/public/assets/uploadify/uploadify.swf',
                    onUploadSuccess: function(file,data){
                        // console.log(file);
                        // console.log(data);
                        data = JSON.parse(data);
                        if(data.code == 200){
                            // 预览图片
                            $('.preview img').attr('src',data.result.path);
                        }
                    }
                });
            }
        }
    });

})