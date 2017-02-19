
define(['jquery','../utils','template','validate','form'], function($,utils,template){
    // 设置导航
    utils.setMenu('/course/create');

    // 定义变量
    var cs_id = utils.qs('cs_id'),
        chapter = $('#chapter'),
        chapterModal = $('#chapterModal'),
        html;

    // 发送请求获取初始数据
    $.ajax({
        url: '/api/course/lesson',
        type: 'get',
        data: {cs_id: cs_id},
        success: function(info){
            if(info.code == 200){
                // 渲染页面
                html = template('chapterTpl', info.result);
                chapter.html(html);
            }
        }
    });

    // 添加课时（委托）
    chapter.on('click', '.add', function(){
        // 调用模板引擎
        html = template('lessonTpl', {
            title: '添加课时',
            btnText: '添 加',
            action: '/api/course/chapter/add'
        });
        // 添加dom
        chapterModal.find('.modal-content').html(html);
        // 弹出模态框
        chapterModal.modal();
        // 表单验证提交
        validForm();
    });

    // 编辑课时（委托）
    chapter.on('click', '.edit', function(){
        var _this = $(this),
            ct_id = _this.parent().attr('data-id');
        // 发送请求获取该课时的数据
        $.ajax({
            url: '/api/course/chapter/edit',
            type: 'get',
            data: {ct_id: ct_id},
            success: function(info) {
                // 给响应数据添加几个属性渲染进模态框中
                info.result.title = '编辑课时';
                info.result.btnText = '保 存';
                info.result.action = '/api/course/chapter/modify';
                // 调用模板引擎
                html = template('lessonTpl', info.result);
                // 添加dom
                chapterModal.find('.modal-content').html(html);
                // 弹出模态框
                chapterModal.modal();
                // 表单验证提交
                validForm();
            }
        });
    });

    // 表单验证提交方法
    function validForm(){
        $('#lessonForm').validate({
            // 阻止默认提交
            sendForm: false,
            // 所有表单项都验证通过方可执行
            valid: function(){
                // 判断是否免费
                // var ct_is_free = $('.free')[0].checked ? 1 : 0 ;
                var ct_is_free = $('.free').prop("checked") ? 1 : 0 ;
                
                // 提交表单（this指向form）
                $(this).ajaxSubmit({
                    // 若不写url则默认找当前表单的action属性值
                    type: 'post',
                    data: {
                        ct_cs_id: cs_id,
                        ct_is_free: ct_is_free
                    },
                    success: function(info){
                        if(info.code == 200){
                            // 隐藏模态框（手动写法）
                            chapterModal.modal('hide');
                        }
                    }
                });
            }
        });
    }
});