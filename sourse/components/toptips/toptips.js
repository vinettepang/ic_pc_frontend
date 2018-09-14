var Toptips = {};
var showToptips = false, // 存储Toptips显示状态
    showLoad = false, // 存储loading显示状态
    ToptipsVM = null, // 存储Toptips vm
    loadNode = null; // 存储loading节点元素

Toptips.install = function (Vue, options) {
    var opt = {
        defaultType: 'center',
        height: '0',
        duration: '3000',
        wordWrap: false,
        tipType:'info'
    };
    for (var property in options) {
        opt[property] = options[property];
    }

    Vue.prototype.$toptips = function (tips, type) {

        var curType = type && type.defaultType ? type : opt.defaultType;
        var wordWrap = opt.wordWrap ? 'ic-word-wrap' : '';
        var style = opt.width ? 'style="width: ' + opt.width + '"' : '';
        var tipType = type && type.tipType ? type.tipType : opt.tipType;
        var height = type && type.height ? type.height : 0;

        var iconTmp = '<i class="nc-icon " :class="iconSuccess"></i>';
        var tmp = '<div  :class="type" class="ic-toptips ' + wordWrap + '" ' + style + '><div class="ic-toptips-notice" :style="{ height: height}"><div class="ic-toptips-notice-content">'+iconTmp+'{{tip}}</div></div></div>';
        var duration = type && type.duration ? type.duration : opt.duration;

        if (showToptips) {
            // 如果Toptips还在，则不再执行
            return;
        }
        if (!ToptipsVM) {
            var ToptipsTpl = Vue.extend({
                data: function () {
                    return {
                        show: showToptips,
                        tip: tips,
                        height:height,
                        tipType:tipType,
                        iconSuccess:'nc-icon nc-check-circle-08 success',
                        type: 'ic-toptips-' + curType
                    }
                },
                template: tmp
            });
            ToptipsVM = new ToptipsTpl()
            var tpl = ToptipsVM.$mount().$el;
            document.body.appendChild(tpl);
        }
        setTimeout(function () {
            ToptipsVM.height = '60px'
        }, 300)
        ToptipsVM.type = 'ic-Toptips-' + curType;
        ToptipsVM.tip = tips;
        ToptipsVM.show = showToptips = true;
        ToptipsVM.tipType = tipType;
        ToptipsVM.iconSuccess =  ToptipsVM.tipType == 'info' ? '' : ToptipsVM.tipType == 'success' ? 'nc-check-circle-08 success' :'nc-circle-bold-remove error';

        setTimeout(function () {
            ToptipsVM.height = 0
            ToptipsVM.show = showToptips = false;
        }, duration)
    };
    ['bottom', 'center', 'top'].forEach(function (type) {
        Vue.prototype.$toptips[type] = function (tips) {
            return Vue.prototype.$toptips(tips, type)
        }
    });
}
//module.exports = Toptips;