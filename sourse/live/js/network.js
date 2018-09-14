/*ajax*/
// ajax封装
var domin_url = window.location.origin;

function ajax(url, data, message, success, cache, alone, async, type, dataType, error) {
    var type = type || 'post';//请求类型
    var dataType = dataType || 'json';//接收数据类型
    var async = async || true;//异步请求
    var alone = alone || false;//独立提交（一次有效的提交）
    var cache = cache || false;//浏览器历史缓存
    var ajaxStatus = false;
    var success = success || function (data) {

        /*console.log('请求成功');*/
        // const msg = iview.Message.loading({
        //     //content: data.msg,
        //     content: '请求成功',
        //     duration: 0
        // });
        // setTimeout(msg, 500);

        if (data.status) {//服务器处理成功
            setTimeout(function () {
                if (data.url) {
                    location.replace(data.url);
                } else {
                    location.reload(true);
                }
            }, 1500);
        } else {//服务器处理失败
            if (alone) {//改变ajax提交状态
                ajaxStatus = true;
            }
        }
    };
    var error = error || function (data) {
        //console.error('请求成功失败');
        /*data.status;//错误状态吗*/
        setTimeout(function () {
            if (data.status == 404) {
                iview.Message.error('请求失败,请求未找到');
            } else if (data.status == 503) {
                iview.Message.error('请求失败,服务器内部错误');
            } else {
                iview.Message.error('请求失败,网络连接超时');
            }
            ajaxStatus = true;
        }, 500);
    };
    /*判断是否可以发送请求*/
    // if (!ajaxStatus) {
    //     return false;
    // }
    //ajaxStatus = false;//禁用ajax请求
    /*正常情况下1秒后可以再次多个异步请求，为true时只可以有一次有效请求（例如添加数据）*/
    if (!alone) {
        setTimeout(function () {
            ajaxStatus = true;
        }, 1000);
    }
    $.ajax({
        'url': domin_url+url,
        'data': data,
        'type': type,
        'dataType': dataType,
        'async': async,
        'success': success,
        'error': error,
        'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
        'beforeSend': function () {
            if (message !='') {
                iview.Message.loading({
                    //content: data.msg,
                    content: message,
                    duration: 1500
                });
            }
        },
        'complete': function () {
            iview.Message.destroy()
        }
    });
}

// submitAjax(post方式提交)
function submitAjax(form, success, cache, alone) {
    cache = cache || true;
    var form = $(form);
    var url = form.attr('action');
    var data = form.serialize();
    ajax(url, data, success, cache, alone, false, 'post', 'json');
}

// ajax提交(post方式提交)
function post(url, data, message, success, cache, alone) {
    ajax(url, data, message, success, cache, alone, false, 'post', 'json');
}

// jsonp跨域请求(get方式提交)
function jpost(url, data, message, success, cache, alone) {
    ajax(url, data, message, success, cache, alone, false, 'post', 'jsonp');
}
// ajax提交(get方式提交)
function get(url, message, success, cache, alone) {
    ajax(url, {}, message, success, alone, false, 'get', 'json');
}

// jsonp跨域请求(get方式提交)
function jsonp(url, message, success, cache, alone) {
    ajax(url, {}, message, success, cache, alone, false, 'get', 'jsonp');
}

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}
