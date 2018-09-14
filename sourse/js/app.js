/*
  Icebear
*/
/*全局*/
var ajaxStatus = true;
var globalUid = 0;
Vue.prototype.global = {
    urlOrigin:window.location.origin,
    loginStatus: false,  //登录状态
    loginAlertShow: false,//登录框状态
    registerAlertShow: false,//注册框状态
    phoneBindAlertShow:false, //手机已被绑定过模态框状态
    userMessage: {}, //用户信息
    loginCodeImg: '/static/icebear2018/src/images/qr/reg_empty_code.png', //登录二维码
    loginToken: null, //登录token
    loginExpireTime: null, //登录token过期时间
    icModalEditInfo:false, //是否编辑过个人信息提示
    isIe:false, //是否为ie浏览器
    globalUid:0,
    reg: {
        token: '',
        phone: '',
        country_code: '',
        sms_code: '',
        error: '',
        sendCode: {
            time: 60,
            status: true,
            text: '获取验证码'
        }
    },
    checkUser:function () {
        let session_login_token = this.getCookie('session_login_token');
        if (session_login_token && session_login_token == 1) {
            this.loginStatus = true;
            //console.log('---已登录---');
        } else {
            //console.log('---未登录---');
            //this.userLogin()
        }

    },
    //拉取二维码供登录或注册
    userLogin:function() {
        var that = this;
        post("/get_login_qr", {},
            function (data, status) {
                that.loginCodeImg = data.data.qr_img_src;
                that.loginToken = data.data.token;
                that.loginExpireTime = data.data.expire_time;
                window.checkScanInterval = window.setInterval(that.checkScan.bind(that), 1000);
            }, false, false);
    },
    //检测用户是否扫码
    checkScan:function() {
        var that = this
        post("/check_login_qr", {
            token: that.loginToken
        }, function (data, status) {
            if (data.code) {
                if (data.data == 200) {
                } else {
                    window.clearInterval(window.checkScanInterval);
                    if (data.data == "login_success") {
                        //登录成功
                        console.log("登录成功");
                        that.loginStatus = true;
                        window.location.reload();
                    } else {
                        //需要注册
                        console.log('需要注册');
                        let userData = data.data;
                        that.registerAlertShow = true;
                        that.loginAlertShow = false;
                        that.userMessage.nickname = userData.nickname;
                        that.userMessage.headimgurl = userData.headimgurl;
                        that.reg.token = that.loginToken;
                        that.reg.phone = userData.check_mobile.phone && userData.check_mobile.phone != '' ? userData.check_mobile.phone : '';
                        that.reg.country_code = userData.check_mobile.country_code && userData.check_mobile.country_code != '' ? userData.check_mobile.country_code : '86';
                    }
                }
            } else {
                //异常信息
                console.log(data, status + ' 异常信息');
            }
        }, false, false);
    },
    //检测手机号合法性
    checkPhone:function(){
        let that = this;
        let phoneCheck = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if(that.reg.phone == ''){
            that.reg.error = '*请输入手机号'
            return false
        }
        if(that.reg.phone.length > 11){
            that.reg.error = '*手机号长度超过11位'
            return false
        }

        let checkCode = $("#countryCode").intlTelInput("getSelectedCountryData");
        that.reg.country_code = '+' + checkCode.dialCode;
        if(that.reg.country_code == '86' || that.reg.country_code == '+86'){
            if (!phoneCheck.test(that.reg.phone)) {
                that.reg.error = '*您输入的手机号格式不正确'
                return false
            }
        }
        if (typeof(that.reg.country_code) == 'undefined') {
            that.reg.country_code = '+86'
        }
        if(that.reg.country_code.indexOf('+') == -1){
            that.reg.country_code = '+' + that.reg.country_code
        }
        return true
    },
    //检测手机号是否绑定过
    checkPhoneBind:function(cb){
        let that = this;
        post("/api/is_phone_bind", {phone:that.reg.phone,country_code:that.reg.country_code},
            function (res, status) {
                //console.log(res, status)
                if (res.code) {
                    if (res.data.is_bind) {
                        that.phoneBindAlertShow = true
                        return
                    }else{
                        if (cb && typeof (cb) === 'function') {
                            cb()
                        }
                    }
                }
        }, false, false);
    },
    //注册提交
    regsubmit:function() {
        var that = this;
        if(!that.checkPhone()){
            return
        }
        if(that.reg.sms_code == ''){
            that.reg.error = '*请输入短信验证码'
            return
        }
        that.checkPhoneBind(function() {
            var countryData = $("#countryCode").intlTelInput("getSelectedCountryData");
            that.reg.country_code = '+' + countryData.dialCode;
            var formData = that.reg;
            //注册
            post("/finish_reg", formData,
            function (data, status) {
                if (data.code) {
                    window.location.reload();
                } else {
                    //console.log(data, status)
                    data.msg.indexOf('*') == -1 ?data.msg = '*'+data.msg:'';
                    that.reg.error = data.msg;
                }
            }, false, false);
        })
    },
    //获取验证码
    regGetCode:function() {
        let that = this;
        if(!that.checkPhone()){
            return
        }
        that.checkPhoneBind(function() {
            that.regCountDown()
            let checkCode  = $("#countryCode").intlTelInput("getSelectedCountryData");
            that.reg.country_code = '+' + checkCode.dialCode;
            post("/sms_code_send", { phone: that.reg.phone, country_code: that.reg.country_code },
            function (data, status) {
                //console.log(data, status)
                if (data.code) {
                } else {
                    that.reg.sendCode.time = 60;
                    that.reg.sendCode.status = true;
                    //window.clearTimeout(regCountDown);
                    //alert(data.msg);
                }
            }, false, false);
        })
    },
    //获取验证码倒数
    regCountDown:function() {
        let that = this;
        that.reg.sendCode.status = false;
        if (that.reg.sendCode.time > 0) {
            that.reg.sendCode.time--;
            that.reg.sendCode.text = that.reg.sendCode.time + 's';
            setTimeout(function () {
                that.regCountDown()
            }, 1000);
        } else {
            that.reg.sendCode.time = 60;
            that.reg.sendCode.status = true;
            that.reg.sendCode.text = '重新获取';
        }
    },
    handleHide:function(){
        //隐藏区号选择下拉框
        //document.addEventListener('click', (e) => {
          // console.log(this.$el);
          // console.log(e);
          // console.log(this);
          // if (!this.$el.contains(e.currentTarget)){
          //   let countryList = document.querySelector('.flag-container .country-list')
          //     countryList.classList.contains('hide')?'':countryList.classList.add('hide')
          // }
        //})
    },
    //检测用户是否填写过个人信息
    checkUserInfo:function(e){
        let that = this
        let url = e.currentTarget.dataset.url
        post("/index/user/upload_profile", { get_info: 1 }, function(res) {
            if (res && res.data != null && res.data.uid ) {
                window.location.href = url
            }else{
                that.icModalEditInfo = true
            }
        })
    },
    //设置cookie
    setCookie: function (name, value, days) {
        var d = new Date;
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
    },
    //获取cookie
    getCookie: function (name) {
        var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    //删除cookie
    delete: function (name) {
        this.set(name, '', -1);
    },
    ieVersion() {
        var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
        var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
        var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
        var isQQ = userAgent.indexOf('QQ') > -1
        if(isIE) {
            var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
            reIE.test(userAgent);
            var fIEVersion = parseFloat(RegExp["$1"]);
            if(fIEVersion == 7) {
                return 7;
            } else if(fIEVersion == 8) {
                return 8;
            } else if(fIEVersion == 9) {
                return 9;
            } else if(fIEVersion == 10) {
                return 10;
            } else {
                return 6;//IE版本<=7
            }
        } else if(isEdge) {
            return 'edge';//edge
        } else if(isIE11) {
            return 11; //IE11
        }else if(isQQ) {
            return 'qq';//edge
        }else{
            return -1;//不是ie浏览器
        }
    }
}

/*头部*/
Vue.use(Toast, {})
var header = new Vue({
    el: '#header',
    data:function() {
        return {
            global: this.global,
            //登录状态
            userLogin: false,
            loginAlertShow: false,
            registerAlertShow: false,
            headerMsgeBox: false,
            disabled: false,
            headerCenterBox: false,
            message: [],
            //消息Icon上的小红点显示状态
            unreadMessState: false,
            unreadMess_num: 0,
            // sessionMess_state: 0,
            //加载更多
            globalUid:null, //用户信息
            moreTextState: false,
            mess_page: 1,
            mess_prevPage: 1
        }
    },
    watch: {
    },
    created:function() {
        this.global.checkUser(); //检测登录状态
        this._headerHandleHide();
        this.global.handleHide(); //点击区域外隐藏内容
        if(Vue.prototype.global.loginStatus){
            this.red_dot_init(); //获取未读信息红点
            this.get_check_unread_message(); //获取未读信息
        }
        this.getIeVersion() //检测ie版本
    },
    mounted:function() {
        console.log('欢迎来到白熊求职~~')
        this.$Message.config({
            top: 0,
            duration: 3
        });
        this.getUserInfo()
    },
    computed:{
        getCountryCode:function(){   //person.id为当前用户id
            return "+"+ this.global.reg.country_code;
        }
    },
    methods: {
        getUserInfo:function(){
            post('/login_info', {}, function(res){
                if (res.code && res.data) {
                    this.globalUid = res.data.uid
                    globalUid = res.data.uid
                }
            }, function(res){
                console.log(res)
            })
        },
        //获取已读信息
        get_my_message:function(){
            let _this = this
            post('/my_message', { reset_red_point: 1, page: 1  }, function(res){
                if(res.code == 1){
                    _this.message = res.data.list
                    if(res.data.total_page > res.data.page){
                        _this.mess_page = 2
                        _this.mess_prevPage = 1
                        _this.moreTextState = true
                    }else{
                        _this.mess_page = 1
                        _this.mess_prevPage = 1
                        _this.moreTextState = false
                    }
                }

            }, function(res){
                //console.log(res)
            })
        },
        red_dot_init:function(){
            let _this = this
            post('/my_message', { reset_red_point: 1, page: 1  }, function(res){
                if(res.code == 1){
                    if(res.data.list[0] && res.data.list[0].is_read && res.data.list[0].is_read != 1){
                        if(!sessionStorage.getItem("unreadMessState")){
                            sessionStorage.setItem("unreadMessState", 1)
                        }

                        if(parseInt(sessionStorage.getItem("unreadMessState"))){
                            _this.unreadMessState = true
                        }
                    }
                }
            }, function(res){
                //console.log(res)
            })
        },
        scorllAdd_get_message:function(){
            let _this = this

            post('/my_message', { reset_red_point: 1, page: _this.mess_page  }, function(res){

                if(res.code === 1 && _this.mess_page > _this.mess_prevPage){
                    _this.message = _this.message.concat(res.data.list)
                    _this.mess_prevPage = _this.mess_page
                    if(res.data.total_page > res.data.page){
                        _this.mess_page++
                    }
                    res.data.total_page === res.data.page ? _this.moreTextState = false : _this.moreTextState = true
                }
            }, function(res){
                //console.log(res)
            })
        },
        //获取未读信息数
        get_check_unread_message:function(){
            let _this = this
            post('/check_unread_message', {}, function(res){
                if(res.code === 1){
                    if(res.data){
                        _this.unreadMess_num = res.data
                    }
                }
            }, function(res){
                //console.log(res)
            })
        },
        messageScroll:function(e){
            const el = e.currentTarget
            let scrollTop = el.scrollTop
            let scrollHeight = el.scrollHeight
            let el_height = el.clientHeight
            let scrollBottom = scrollHeight - el_height - scrollTop

            if(scrollBottom < 30){
                this.scorllAdd_get_message()
            }
        },
        inputChange:function(){
            that.global.reg.error = ''
        },
        readMessage:function(mid, e){

            if(hasClass(e.currentTarget, 'active')){
                removeClass(e.currentTarget, 'active')
            }
            post('/remark_message', { mid: mid }, function(res){}, function(res){
                //console.log(res)
            })
        },
        send: function () {
            this.disabled = true;
            setTimeout(this.sended, 2000);
        },
        sended: function() {
            this.$refs.btn.run();
            this.disabled = false;
        },
        _messageBoxShow: function () {
            this.unreadMessState = false
            sessionStorage.setItem("unreadMessState", 0)

            this.headerMsgeBox = !this.headerMsgeBox,
            this.headerCenterBox = false

            this.get_my_message()
        },
        _centerBoxShow: function () {
            this.headerCenterBox = !this.headerCenterBox,
            this.headerMsgeBox = false
        },
        _loginAlertShow:function() {
            this.global.userLogin()
            this.global.loginAlertShow = true
        },
        _loginAlertHide:function() {
            this.global.loginAlertShow = false
            this.global.phoneBindAlertShow = false
            window.clearInterval(window.checkScanInterval)
        },
        _registerAlertShow:function() {
            this.global.registerAlertShow = true
        },
        _registerAlertHide:function() {
            this.global.registerAlertShow = false
            this.global.phoneBindAlertShow = false
        },
        _headerHandleHide:function() {
            let _this = this;
            document.onclick = function (e) {
                _this.headerMsgeBox = false
                _this.headerCenterBox = false
                _this.loginAlertShow = false
                _this.registerAlertShow = false
            }
        },
        getIeVersion(){
            let version = this.global.ieVersion()
            if (version > 0 || version == 'qq') {
                this.global.isIe = true
            }
        }
    }
})

let footer  = new Vue({
    el: '#footer',
    data:function() {
      return {
        globalScrollTop:false,
        serviceButtonImg: '/static/icebear2018/src/images/feedback.png',
        serviceContentImg: '/static/icebear2018/src/images/qr/service_code.png',
        scrollTopImg:'/static/icebear2018/src/images/to-top.png'
      }
    },
    mounted:function() {
        this.throttleLoad = this.throttle(() => {
            this.scrollTop()
        }, 20)
        window.addEventListener('scroll', this.throttleLoad, true)
    },
    destroyed() {
        window.removeEventListener('scroll', this.throttleLoad)
    },
    components: {
        'scrollTop': scrollTop,
    },
    methods: {
        scrollTop:function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            scrollTop > 200 ? this.globalScrollTop = true : this.globalScrollTop = false
        },
        // clickScrollTop:function(){
        //     $('html,body').animate({scrollTop:0},1000);
        // },
        throttle(fn, delay, immediate, debounce) {
            var curr = +new Date(), //当前事件
                last_call = 0,
                last_exec = 0,
                timer = null,
                diff, //时间差
                context, //上下文
                args,
                exec = function() {
                    last_exec = curr;
                    fn.apply(context, args);
                };
            return function() {
                curr = +new Date();
                context = this,
                    args = arguments,
                    diff = curr - (debounce ? last_call : last_exec) - delay;
                clearTimeout(timer);
                if (debounce) {
                    if (immediate) {
                        timer = setTimeout(exec, delay);
                    } else if (diff >= 0) {
                        exec();
                    }
                } else {
                    if (diff >= 0) {
                        exec();
                    } else if (immediate) {
                        timer = setTimeout(exec, -diff);
                    }
                }
                last_call = curr;
            }
        },
    }
})
var global_uid = ''
post('/login_info', {}, function(res){
    if (res.code && res.data) {
        global_uid = res.data.uid
    }
})

/*ajax*/
// ajax封装
function ajax(url, data, success, cache, alone, async, type, dataType, error) {
    var type = type || 'post';//请求类型
    var dataType = dataType || 'json';//接收数据类型
    var async = async || true;//异步请求
    var alone = alone || false;//独立提交（一次有效的提交）
    var cache = cache || false;//浏览器历史缓存
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
        'url': url,
        'data': data,
        'type': type,
        'dataType': dataType,
        'async': async,
        'success': success,
        'error': error,
        'jsonpCallback': 'jsonp' + (new Date()).valueOf().toString().substr(-4),
        'beforeSend': function () {
            // iview.Message.loading({
            //     //content: data.msg,
            //     content: '加载中',
            //     duration: 0
            // });
        },
        'complete': function () {
            //iview.Message.destroy()
        }
    });
}

function upload(url, data, success,error) {
    var error = error || function (data) {
        //console.error('请求成功失败');
        /*data.status;//错误状态吗*/
        console.log(data)
        setTimeout(function () {
            if (data.status == 404) {
                iview.Message.error('请求失败,请求未找到');
            } else if (data.status == 503 || data.status == 500) {
                iview.Message.error('请求失败,服务器内部错误');
            } else {
                iview.Message.error('请求失败,网络连接超时');
            }
            ajaxStatus = true;
        }, 500);
    };
    $.ajax({
        type: 'POST',
        url: url,
        data: data,
        contentType: false,
        processData: false,
        mimeType: "multipart/form-data",
        'success': success,
        'error': error,
        beforeSend: function() {
            // iview.Message.loading({
            //     content: data.msg,
            //     content: '加载中',
            //     duration: 0
            // });
        },
        complete: function() { //在success之后就进行
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
function post(url, data, success, cache, alone) {
    ajax(url, data, success, cache, alone, false, 'post', 'json');
}

// jsonp跨域请求(get方式提交)
function jpost(url, data, success, cache, alone) {
    ajax(url, data, success, cache, alone, false, 'post', 'jsonp');
}
// ajax提交(get方式提交)
function get(url, success, cache, alone) {
    ajax(url, {}, success, alone, false, 'get', 'json');
}

// jsonp跨域请求(get方式提交)
function jsonp(url, success, cache, alone) {
    ajax(url, {}, success, cache, alone, false, 'get', 'jsonp');
}

function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

// 获取时间格式的时间戳
function getTimeStamp(time) {
    return Date.parse(new Date(time)) / 1000;
}