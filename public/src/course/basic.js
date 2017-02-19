
define(['jquery','../utils','template','ckeditor','validate','form'], function($,utils,template,CKEDITOR){
    // 设置导航
    utils.setMenu('/course/create');

    // 获取课程id，然后根据课程id查询课程信息
    var cs_id = utils.qs('cs_id'),
        basic = $('#basic'),
        html;

    // 发送课程id，向服务器索要课程信息
    $.ajax({
        url: '/api/course/basic',
        type: 'get',
        data: {cs_id: cs_id},
        success: function(info) {
            // 调用模板引擎
            html = template('basicTpl',info.result);
            basic.html(html);

            // 调用富文本编辑器
            CKEDITOR.replace('ckeditor',{});

            // 验证并提交表单
            $('#basicForm').validate({
                sendForm: false,
                // 所有表单项都验证成功时才调用
                valid: function(){
                    // 更新富文本内容
                    for(instance in CKEDITOR.instances){
                        CKEDITOR.instances[instance].updateElement();
                    }
                    // 提交
                    $(this).ajaxSubmit({
                        url: '/api/course/update/basic',
                        type: 'post',
                        success: function(info) {
                            if(info.code == 200){
                                location.href = '/course/picture?cs_id='+ info.result.cs_id;
                            }
                        }
                    });
                }
            });
        }
    });

    // 事件委托
    basic.on('change','select.top',function(){
        var _this = $(this),
            cg_id = _this.val();//分类ID

        $.ajax({
            url: '/api/category/child',
            type: 'get',
            data: {cg_id: cg_id},
            success: function(info) {
                if(info.code == 200){
                    // 字符串模板
                    var tpl = '{{each opts}}\
                    <option value="{{$value.cg_id}}">{{$value.cg_name}}</option>\
                    {{/each}}';
                    // 处理字符串模板
                    var render = template.compile(tpl);
                    // 渲染模板
                    html = render({opts: info.result});
                    // 添加dom
                    _this.next().html(html);
                }
            }
        });

    });
});