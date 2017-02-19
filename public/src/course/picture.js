
define(['jquery','../utils','template','uploadify','Jcrop','form'], function($,utils,template) {
    // 设置导航
    utils.setMenu('/course/create');

    // 根据课程id查询课程信息
    var cs_id = utils.qs('cs_id'),
        picture = $('#picture'),
        preview,
        html;

    // 请求封面图
    $.ajax({
        url: '/api/course/picture',
        type: 'get',
        data: {cs_id: cs_id},
        success: function(info) {
            if(info.code == 200){
                // 渲染页面
                html = template('pictureTpl', info.result);
                picture.html(html);

                // 获取预览图片
                preview = $('.preview img');

                var jcrop;//用来保存jcrop实例

                // 图片裁切
                function imgCrop(){
                    // 清除上一次，保证只有一个实例
                    if(jcrop) {
                        jcrop.destroy();
                    }
                    // 调用插件
                    preview.Jcrop({
                        // 外盒子宽度
                        boxWidth: 400,
                        // 宽高比
                        aspectRatio: 2,

                    }, function(){
                        // this指向Jcrop实例对象，此对象上有一些方法可供使用

                        // 根据原始图片宽高可以计算初始选区的参数
                        var w = this.ui.stage.width,
                            h = w / 2,
                            x = 0,
                            y = (this.ui.stage.height - h) / 2;

                        // 新选区
                        this.newSelection();
                        // 设置新选区的起始坐标和宽高
                        this.setSelect([x, y, w, h]);

                        jcrop = this;//保存jcrop实例

                        // 缩略图（会有问题。。。。）
                        this.initComponent('Thumbnailer', {
                            width: 240,
                            height: 120,
                            thumb: '.thumb'
                        });

                    });
                }

                // 获取裁切参数
                preview.parent().on('cropmove cropend', function(e,s,c){
                    // 通过c参数可以获取裁切后的尺寸
                    // 将裁切参数放到表单里
                    $('#x').val(c.x);
                    $('#y').val(c.y);
                    $('#w').val(c.w);
                    $('#h').val(c.h);
                });

                // 处理图片（裁切/保存）
                $('#cutBtn .btn').on('click', function(){
                    var _this = $(this),
                        status = _this.attr('data-status');
                    if(status == 'save'){
                        // 发送请求
                        $('#coords').ajaxSubmit({
                            url: '/api/course/update/picture',
                            type: 'post',
                            success: function(info) {
                                if(info.code == 200){
                                    location.href = '/course/chapter?cs_id=' + info.result.cs_id;
                                }
                            }
                        });
                    } else {
                        _this.attr('data-status','save').text('保存图片');
                        // 调用裁切(它会报跨域的错，因此放在最后)
                        imgCrop();
                    }
                });

                // 上传图片
                $('#upfile').uploadify({
                    buttonText: '选择图片',
                    buttonClass: 'btn btn-success btn-sm',
                    width: 80,
                    height: 'auto',
                    // 服务端接收图片的参数
                    fileObjName: 'cs_cover_original',
                    // 相当于jquery中的data，随上传的图片附加的参数
                    formData: {cs_id: cs_id},
                    // 允许的文件类型
                    fileTypeExts: '*.gif; *.jpg; *.png',
                    // 允许的文件大小不超过
                    fileSizeLimit: '2MB',
                    // 禁用上传进度
                    itemTemplate: '<span></span>',
                    // 上传地址
                    uploader: '/api/uploader/cover',
                    // 配置flash
                    swf: '/public/assets/uploadify/uploadify.swf',
                    // 上传成功后操作
                    onUploadSuccess: function(file,info){
                        // 转成js对象
                        info = JSON.parse(info);
                        if(info.code == 200){
                            // 预览
                            preview.attr('src',info.result.path);

                            // 调用图片裁切
                            imgCrop();

                            // 更改按钮状态
                            $('#cutBtn .btn')
                            // prop：添加或删除一个属性，true是添加，false是删除
                            .prop('disabled', false)
                            .attr('data-status', 'save')
                            .val('保存图片');
                        }
                    }
                });
            }
        }
    });
});