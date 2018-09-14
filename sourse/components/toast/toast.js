var Toast = {};
var showToast = false, // 存储toast显示状态
    showLoad = false, // 存储loading显示状态
    toastVM = null, // 存储toast vm
    loadNode = null; // 存储loading节点元素

Toast.install = function (Vue, options) {

    var opt = {
        defaultType: 'center',
        duration: '1000',
        wordWrap: false,
        iconType:'success'
    };
    for (var property in options) {
        opt[property] = options[property];
    }

    Vue.prototype.$toast = function (tips, type) {
        var curType = type && type.defaultType ? type : opt.defaultType;
        var wordWrap = opt.wordWrap ? 'ic-word-wrap' : '';
        var style = opt.width ? 'style="width: ' + opt.width + '"' : '';
        var iconType = type && type.iconType ? type.iconType : opt.iconType;
        //var iconTmp = iconType == 'success'? '<i class="nc-icon nc-check-circle-08 success"></i>':'<i class="nc-icon nc-circle-bold-remove error"></i>';
        var iconTmp = '<i class="nc-icon " :class="iconSuccess"></i>';
        var tmp = '<div v-show="show" :class="type" class="ic-toast ' + wordWrap + '" ' + style + '>'+iconTmp+'{{tip}}</div>';

        if (showToast) {
            // 如果toast还在，则不再执行
            return;
        }
        if (!toastVM) {
            var toastTpl = Vue.extend({
                data: function () {
                    return {
                        show: showToast,
                        tip: tips,
                        iconType:iconType,
                        iconSuccess:'nc-icon nc-check-circle-08 success',
                        type: 'ic-toast-' + curType
                    }
                },
                template: tmp
            });
            toastVM = new toastTpl()
            var tpl = toastVM.$mount().$el;
            document.body.appendChild(tpl);
        }

        toastVM.type = 'ic-toast-' + curType;
        toastVM.tip = tips;
        toastVM.show = showToast = true;
        toastVM.iconType = iconType;
        toastVM.iconSuccess =  toastVM.iconType == 'success' ? 'nc-check-circle-08 success' :'nc-circle-bold-remove error';

        setTimeout(function () {
            toastVM.show = showToast = false;
        }, opt.duration)
    };
    ['bottom', 'center', 'top'].forEach(function (type) {
        Vue.prototype.$toast[type] = function (tips) {
            return Vue.prototype.$toast(tips, type)
        }
    });

    Vue.prototype.$loading = function (tips, type) {
        if (type == 'close') {
            loadNode.show = showLoad = false;
            document.querySelector('.ic-load-mark').remove();
        } else {
            if (showLoad) {
                // 如果loading还在，则不再执行
                return;
            }
            var loadTpl = Vue.extend({
                data: function () {
                    return {
                        show: showLoad
                    }
                },
                template: '<div v-show="show" class="ic-load-mark"><div class="ic-load-box"><div class="ic-loading"><div class="loading_leaf loading_leaf_0"></div><div class="loading_leaf loading_leaf_1"></div><div class="loading_leaf loading_leaf_2"></div><div class="loading_leaf loading_leaf_3"></div><div class="loading_leaf loading_leaf_4"></div><div class="loading_leaf loading_leaf_5"></div><div class="loading_leaf loading_leaf_6"></div><div class="loading_leaf loading_leaf_7"></div><div class="loading_leaf loading_leaf_8"></div><div class="loading_leaf loading_leaf_9"></div><div class="loading_leaf loading_leaf_10"></div><div class="loading_leaf loading_leaf_11"></div></div><div class="ic-load-content">' + tips + '</div></div></div>'
            });
            loadNode = new loadTpl();
            var tpl = loadNode.$mount().$el;

            document.body.appendChild(tpl);
            loadNode.show = showLoad = true;
        }
    };

    ['open', 'close'].forEach(function (type) {
        Vue.prototype.$loading[type] = function (tips) {
            return Vue.prototype.$loading(tips, type)
        }
    });
}
//module.exports = Toast;