// 'use strict';
/*;(function($, window, document,undefined) {
})(jQuery, window, document);*/
let miniProgramCode = 'https://icebear.me/Public/Home/images/index/code_baixiong.png';
var getMediaConfig = '/academy_get_video_player_config',
updateWatch = '/academy_update_watch_video_process';
function Tools() {
  this.userAgent = function () {
      let Sys = {};
      let ua = navigator.userAgent.toLowerCase();
      let s;
      (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
      (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
      (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
      (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
      (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

      //以下进行测试
      if (Sys.ie) console.log('IE: ' + Sys.ie);
      if (Sys.firefox) console.log('Firefox: ' + Sys.firefox);
      if (Sys.chrome) console.log('Chrome: ' + Sys.chrome);
      if (Sys.opera) console.log('Opera: ' + Sys.opera);
      if (Sys.safari) console.log('Safari: ' + Sys.safari);
  }
  this.navScoll = function (target) {
    //点击滚动
    $('body').on('click', target+' li', function(e) {
      let that = $(this);
      var scrollHeight = $(that.data('ref')).offset().top - 88;
      $("html, body").animate({scrollTop: scrollHeight + "px"}, function() {
        that.parent().siblings().removeClass('active');
        that.parent().addClass('active');
      });
    });
    //滚动定位
    $(window).scroll(function(e){
      e.stopPropagation();
      $(target).find('li').each(function(i){
        var a = $($(this).data('ref')).offset().top,
        b = $($(this).data('ref')).outerHeight(),
        c =$(window).scrollTop() + 88;
        if (c >= a && c <= a+b) {
          var obj = 'li[data-ref="'+$(this).data('ref')+'"]';
          $(target).find('li').siblings().removeClass('active');
          $(target).find(obj).addClass('active');
          //console.log("在这 "+$(this).data('ref'));
        }
     })
     //  $(target).find('li a').each(function(i){
     //    var a = $($(this).attr('href')).offset().top,
     //    b = $($(this).attr('href')).outerHeight(),
     //    c =$(window).scrollTop() + 88;
     //    if (c >= a && c <= a+b) {
     //      var obj = 'a[href="'+$(this).attr('href')+'"]';
     //      $('.nav-scroll li').siblings().removeClass('active');
     //      $('.nav-scroll li').find(obj).parent().addClass('active');
     //      //console.log("在这 "+$(this).attr('href'));
     //    }
     // })
    });
  }

  this.showHideTab = function () {
    let btnClass = '.v-show-tab-btn a'; //btn
    let boxClass = '.v-show-tab-box'; //box
    let targetClass = '.v-show-tab-panel .v-show-target';  //触发target
    $('body').on('click', btnClass, function(event) {
      event.preventDefault();
      let that = $(this);
      let index = that.index(); //索引
      let box = that.parents(boxClass); //当前box
      let box_s = box.hasClass('v_show'); //当前box添加标记
      let target_s = box.find(targetClass).eq(index).is(':hidden'); //当前触发target状态
      let text = null;
      that.data('text') != null ? ( text = that.data('text')) :'';
      if (box_s) {
          if (target_s) {
            $.each(box.find(btnClass), function(index, val) {
                let text = $(val).data('text');
                $(val).html('查看'+text);
            });
            box.find(btnClass).eq(index).html('收起'+text);
            box.find(targetClass).siblings().fadeOut().eq(index).fadeIn();
          }else{
            that.html('查看'+text);
            box.find(targetClass).eq(index).slideUp();
            box.removeClass('v_show');
          }
      }else{
          that.html('收起'+text);
          box.find(targetClass).eq(index).slideDown();
          box.addClass('v_show');
      }
    });
  }

  this.showHide = function (c,t) {
    let btn = '.v-show-btn';
    let target = '.v-show-target';
    let box = '.v-show-box';
    let multiBtn = '.v-multishow-btn';
   $('body').on('click', btn, function(e) {
    //console.log(e);
      let _this = $(this);
      e.stopPropagation();
      let multi_target = _this.data('target');
      let multi_target_status = $(multi_target).is(':hidden');
      let p_obj = _this.parents(box);
      let status = p_obj.hasClass('v_show');
      let text = null;
      _this.data('text') != null ? ( text = _this.data('text')) :'';
      if (status) {
          if (multi_target_status) {
            p_obj.find(target).fadeOut();
            $(multi_target).slideDown();
          }else{
            p_obj.removeClass('v_show');
            $(multi_target).slideUp();
          }
          _this.data('text', _this.html()).html(text);
      }else{
          _this.data('text', _this.html()).html(text);
          $(multi_target).slideDown();
          p_obj.addClass('v_show');
      }
    });
  }

  this.readMore = function (opt) {
    //console.log('readMore');
    //内置
    let boxClass = '.v-readmore-box';
    if ($(boxClass).length > 0) {

      this.default = {
        'overHeight' : '230' //超过的高度
      };
      this.options = $.extend({}, this.default, opt);
      let defHeight = this.options.overHeight;  //默认高度

      $.each($(boxClass), function(index, val) {
          let infoHeight = $(val).height();  //内容块高度
          if (infoHeight > defHeight) {
              $(val).css('height', defHeight + 'px'); // 设置默认高度,隐藏超出部分
              $(val).after('<div class="v-readmore"><a href="javascript:;" class="v-readmore-btn" real-height="'+infoHeight+'" def-height="'+defHeight+'"><span class="text">查看更多 <i class="nc-icon nc-minimal-down-2"></i></span></a></div>');
          }
      });

      // 点击按钮
      $('body').on('click', '.v-readmore-btn', function(e) {
          e.stopPropagation();
              let myBox = $(this).parent().prev(boxClass);
              let curHeight = myBox.height();  //实时
              let realHeight = $(this).attr('real-height');
              let realdefHeight = $(this).attr('def-height');
          if (curHeight == defHeight) {
              myBox.animate({height:realHeight});
              $(this).find('.text').html('收起更多 <i class="nc-icon nc-minimal-up-2"></i>');
          } else{
              myBox.animate({height:realdefHeight});
              $(this).find('.text').html('查看更多 <i class="nc-icon nc-minimal-down-2"></i>');
          };
      });
    }
  }

  this.btnPopup = function () {
    // body...
  }

  this.popup = function (opt) {

    this.default = {
      'height' : '280', //高度
      'width' : '320', //宽度
      'overlay':true,//背景遮罩
    };
    this.options = $.extend({}, this.default, opt);

    let $img =null;
    let $box = $("<div>").addClass("v-popup-box"); //弹窗插件容器
    let $layer = $("<div>").addClass("v_layer");//遮罩层
    let $popBox = $('<div>').addClass('v-popup').css({'height':  this.options.height,'width': this.options.width});//弹窗盒子
    let $titleBox = $('<div>').addClass('pop-head');//弹窗顶部区域
    let $mainBox = $('<div>').addClass('pop-main');//弹窗内容主体区
    let $clsBtn = $('<a>').addClass("cls").html('<i>x</i>');//弹窗关闭按钮
    let options = this.options;
    let $content = $('<p>').html(this.options.content);//弹窗内容
    let popId = creatPopId();//弹窗索引

    typeof (this.options.imgSrc) === 'string' ? ($img = $('<img>').attr('src', this.options.imgSrc),$img = $('<p class="img">').append($img), $mainBox.append($img)):'';

    if (this.options.position == 'absolute') {
      let client_top = this.options.popupTarget[0].clientHeight;
      let client_left = this.options.popupTarget[0].clientWidth;
      //console.log(this.options.height/2);
      let pop_h = this.options.height/2 + 15;
      let pop_l = client_left/2 ;
      $popBox.css({
        'position': 'absolute',
        'top':pop_h ,
        //'top': client_top + this.options.height/2 ,
        'left': pop_l
      });
    }

    function init() {
      creatDom(options);
      bind()
    }

    init();

    function creatDom(opt) {
      $popBox.append(
         // $titleBox.append($clsBtn)
      ).append($mainBox.append($content));

      if (opt.overlay) { $box.attr('id', popId).append($layer).append($popBox); }
      else{ $box.attr('id', popId).append($popBox); }

      if (typeof(opt.popupTarget) == 'object') {
        //opt.popupTarget.wrap('<div style="position:relative"></div>').after($box).fadeIn();
        opt.popupTarget.after($box).fadeIn();
      }else{
        $('body').append($box).fadeIn();
      }
     // $('body').append($box).fadeIn();
    }

    //点击关闭按钮
    function bind(){
      $clsBtn.click(doClose);
      $popBox.click(function(e) {
        e.stopPropagation();
      });
    }

    //关闭按钮事件
    function doClose(){
      $("#" + popId).fadeOut('400', function() {$(this).remove(); });
      $(window).unbind("keydown");
    }

    //重生popId,防止id重复
    function creatPopId(){
      var i = "pop_" + (new Date()).getTime()+parseInt(Math.random()*100000);//弹窗索引
      if($("#" + i).length > 0){ return creatPopId(); }else{ return i; }
    }
    $(document).bind('click',function(e){
      e.stopPropagation();
      doClose();
    });
  }

  this.clickPopup = function () {
    let that = this;
    let btn = '.group_popup';
    $('body').on('click', btn, function(e) {
      e.stopPropagation();
      let target=$(this);
      that.popup({
        'imgSrc': miniProgramCode,
        'content':'微信扫码，使用小程序<br/>「白熊求职」进行查看','overlay':false,'position':'absolute','popupTarget':target});
    });

    let group_buy = '.group_buy';
    $('body').on('click', group_buy, function(e) {
      e.stopPropagation();
      let target=$(this);
      that.popup({
        'imgSrc': miniProgramCode,
        'content':'微信扫码，使用小程序<br/>「白熊求职」进行团购','overlay':false,'position':'absolute','popupTarget':target});
    });
  }

  this.stopPropagation = function (e) {
    if (e.stopPropagation)
    e.stopPropagation();
    else
    e.cancelBubble = true;
  }

  this.editor = function (val) {
    //console.log('tool editor')
    var editor_height = '';
      val&&val!=null&&val!='' ? editor_height = val: editor_height = 110;
      tinymce.init({
          selector: '.edit-container textarea',
          // branding: false,
          // elementpath: false,
          height: editor_height,
          language: 'zh_CN',
          menubar:false,
          //menubar: 'edit insert view format table tools',
          theme: 'modern',
           plugins: ["lists"],
          // plugins: [
          //     'advlist autolink lists link image charmap print preview hr anchor pagebreak imagetools',
          //     'searchreplace visualblocks visualchars code fullscreen fullpage',
          //     'insertdatetime media nonbreaking save table contextmenu directionality',
          //     'emoticons paste textcolor colorpicker textpattern imagetools codesample'
          // ],
          toolbar1:'formatselect | undo redo | bold italic strikethrough forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist  | removeformat',
          //toolbar1: ' newnote print fullscreen preview | undo redo | insert | styleselect | forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image emoticons media codesample',
          autosave_interval: '20s',
          image_advtab: true,
          table_default_styles: {
              width: '100%',
              borderCollapse: 'collapse'
          },
          editor_css:['src/css/app.css']
      });
      // Get the HTML contents of the currently active editor(得到当前处于活动状态的编辑器的html内容)
      // console.debug(tinymce.activeEditor.getContent());

      // // Get the raw contents of the currently active editor(得到当前处于活动状态的编辑器的原生内容)
      // tinymce.activeEditor.getContent({format : 'raw'});

      // // Get content of a specific editor:(得到指定的编辑器的内容)
      // tinymce.get('content id').getContent()
  }

  this.clipboard = function (that) {
    Vue.use(Toast, {});
    let clipboard = new Clipboard('.ic-clipboard');
     clipboard.on('success',function (e) {
      //console.log(that)
        that.$toast('复制成功',{
            iconType:'success'
        });
    })
    clipboard.on('error',function (e) {
      //console.log(that)
        that.$toast('复制失败',{
            iconType:'error'
        });
    })
  }

  this.horizonTimeline = function () {
    let box = '.horizon-timeline-box';
    let obj = '.horizon-timeline';
    let objInner = '.horizon-timeline-inner';
    let objActive= '.horizon-timeline .active';
    let objSub = '.ivu-timeline-item';
    $.each($(obj), function(index, val) {
      //let flag = $(this)[0].scrollWidth >600 ? true :false;
      let subLength = $(this).find(objSub).length;
      let subWidth = $(this).find(objSub).width();
      let realWidth = subLength*subWidth;
      let flag = realWidth > 600 ? true :false;
      if (flag) {
        //$(this).css({'position':'absolute','top':0})
        let boxOffsetLeft = $(this).offset().left;
        let offsetLeft =  $(this).find('.active').length >0 ? $(this).find('.active').offset().left : 0;
        let val = offsetLeft - boxOffsetLeft - 300;
        if (val < 0 ) { val = 0 }
        //$(this).css({left: - val});
        val = - parseInt(val)
        $(this).css({'transform':'translate('+val+'px, 0px)'})

        $(this).parents(objInner).before('<a class="hTimeSLeft timeline-lbtn" href="javascript:;" data-width="'+realWidth+'" data-left="'+val+'"><i class="nc-icon nc-minimal-left"></i></a>');
        $(this).parents(objInner).after('<a class="hTimeSRight timeline-rbtn" href="javascript:;" data-width="'+realWidth+'" data-left="'+val+'"><i class="nc-icon nc-minimal-right"></i></a>');
      }
    });

    $('body').on('click', '.hTimeSLeft', function(event) {
      let realWidth = $(this).attr('data-width'),oldLeft= $(this).attr('data-left');
      let offsetLeft = parseInt(oldLeft) - 300;
      offsetLeft = offsetLeft >= 0 ? offsetLeft : 0;
      if(offsetLeft === 0){$(this).addClass('dark');}
      $('.hTimeSRight').removeClass('dark')
      let traget = $(this).next().find(obj);
      //$(traget).animate({left: -offsetLeft}, 600);
      $(traget).css({'transform':'translate(-'+offsetLeft+'px, 0px)'})
      $(box).find('a').attr('data-left',offsetLeft)
    });
    $('body').on('click', '.hTimeSRight', function(event) {
      let realWidth = $(this).attr('data-width'),oldLeft= $(this).attr('data-left');
      let offsetLeft = parseInt(oldLeft) + 300;
      offsetLeft = offsetLeft >= realWidth - 500 ? realWidth - 500 : offsetLeft;
      if(offsetLeft >= realWidth - 500 ){$(this).addClass('dark');}
      $('.hTimeSLeft').removeClass('dark')
      let traget = $(this).prev().find(obj);
      //$(traget).animate({left: - offsetLeft}, 600);
      $(traget).css({'transform':'translate(-'+offsetLeft+'px, 0px)'})
      $(box).find('a').attr('data-left',offsetLeft)
    });

  }

  this.scrollToToday = function () {
    $('body').on('click', '#scroll_to_today', function(event) {
      event.preventDefault();
      let objClass = '.timetable-item.active';
      if ($(objClass).length > 0) {
        let targetToTop = $(objClass)[0].offsetTop;
        let windowH  =$(window).height();
        $('body').animate({scrollTop: targetToTop-windowH/3}, 1000);
      }
    });
  }

  this.scrollTop = function () {
      window.onload = function(){
          var btn = document.getElementById("global_scroll");
          if (btn == null) {
            return false;
          }
          var scrollTopBtn = '#scroll_top_btn';
          var clientHeight = document.documentElement.clientHeight;  //获取可视区域的高度
          window.onscroll = function(){
              var scrollTop = document.documentElement.scrollTop || document.body.scrollTop; //获取滚动条的滚动高度
              btn.style.display = scrollTop >= 50 ?  "block" : "none";//如果滚动高度大于设定高度，则显示回到顶部按钮否则隐藏
          }
          //回到顶部按钮点击事件
          $('body').on('click', scrollTopBtn, function(event) {
            event.preventDefault();
            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            $('body').animate({scrollTop: 0}, 500);
            //用于设置速度差，产生缓动的效果
            //var speed = Math.floor(-scrollTop / 6);
            //document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed;
          });
      }
  }

  this.intlTelInput = function (){
    //国家区号选择
      if ($("#country-code")) {
        $("#countryCode").intlTelInput({
          separateDialCode: true,
          preferredCountries: ['cn','en'],
        });
      }
  },

  this.mediaPlay = function (media,next) {
    // body...
    var player = false;
    var updateWatchInterval = null;
    load_video(media);
    if(typeof(next) != 'undefined'){
      var videoNext = {
        hasNextPlay:next.hasNextPlay,
        nextVideoLink:next.nextVideoLink,
        nextChapterlink:next.nextChapterlink,
        nextChapterState:next.nextChapterState,
      }
    }

    //加载视频
    function load_video(media){
      post(getMediaConfig,{vid: media.vid},function (res) {
        //console.log(res)
        if(res.code){
            //加载播放器
          play(res.data);
        }
        else{
          console.log("ajax err" + res.msg );
        }
      })
    }

    //播放视频
    function play(player_config){
      let u = navigator.userAgent;
      let isMobile = false
      if(!!u.match(/AppleWebKit.*Mobile.*/)||u.indexOf('iPad') > -1){
        isMobile = true
      }
      post('/login_info', {}, function(res){
        if (res.code && res.data) {
            global_uid = res.data.uid
        }
        if(!player && !isMobile){
          player = polyvObject('#infovid').videoPlayer({
            'width': '100%', 'height': '360',
            'vid': player_config.vid,
            'playsafe': player_config.playsafe,
            'session_id': player_config.session_id,
            'hideRepeat':true,
            'forceH5': true,
            'autoplay':true,
            'uid' :global_uid
                //'autoplay':true,
          });
          player.on('changeH5Success', function(newPlayer) {
            // newPlayer 是初始化 HTML5 播放器后返回对象
            player = newPlayer;
          });
        }else if(!player && isMobile){
          player = polyvObject('#infovid').videoPlayer({
            'width': '100%', 'height': '360',
            'vid': player_config.vid,
            'playsafe': player_config.playsafe,
            'session_id': player_config.session_id,
            'hideRepeat':true,
            'forceH5': true,
            'autoplay':true,
            'ts':player_config.ts,
            'sign':player_config.sign,
            'uid' :global_uid
                //'autoplay':true,
          });
          player.on('changeH5Success', function(newPlayer) {
            // newPlayer 是初始化 HTML5 播放器后返回对象
            player = newPlayer;
          });
        }else{
          //切换视频 option 同初始化的参数
          //player.changeVid(option);
          var option={
              'width': '100%', 'height': '360',
              'vid': player_config.vid,
              'playsafe': player_config.playsafe,
              'session_id': player_config.session_id,
              'uid' :global_uid,
              'autoplay':true,
              'hideRepeat':true,
              'autoplay':true,
              'forceH5': true,
          };
          player.changeVid(option);
        }
      })
    }

    function autoPlay() {
      if (videoNext.nextChapterState) {
        window.location.href = window.location.origin + videoNext.nextChapterlink
      }else{
        window.location.href = window.location.origin + videoNext.nextVideoLink
      }
    }

    //视频结束时
    window.s2j_onPlayOver = function(){
        //vm.isPlayEnd = true
        if(typeof(next) != 'undefined'){
          if(videoNext.hasNextPlay && !videoNext.nextChapterState){
            vm.isPlayEnd = true
            //videoNext.nextChapterState?vm.isPlayEndContent = '播放结束，准备下一章':vm.isPlayEndContent = '播放结束，准备下一集'
            vm.isPlayEndContent = '播放结束，准备下一集'
            var playEndCount = setInterval(function () {
              vm.isPlayEndCount == 0 ? clearInterval(playEndCount) : vm.isPlayEndCount--
            },1000);
            setTimeout(function(){
              autoPlay()
            },3000)
          }else{
            //vm.isPlayEndContent = '所有课程播放结束'
          }
        }
    }

    //初始化完毕，每次切换视频都会触发
    window.s2j_onPlayerInitOver = function()
    {
      //console.log('初始化完毕');
    }

    //视频播放时
    window.s2j_onVideoPlay = function(){
      updateWatchInterval=setInterval(function () {
        updateWatchProcess(media)
      },1000);
    }

    //视频暂停时
    window.s2j_onVideoPause = function() {
      clearInterval(updateWatchInterval)
    }
    //更新播放进度
    function updateWatchProcess(media) {
      var sec1=player.j2s_stayInVideoTime();
      var sec2=player.j2s_getCurrentTime();
      //console.log(player.HTML5.video.playbackRate)
      var sec4=player.j2s_realPlayVideoTime();
      //console.log(sec4)
      let real_rate = 1
      if (typeof(player.HTML5.video.playbackRate) != undefined) {
        real_rate = player.HTML5.video.playbackRate
      }

      post(updateWatch,{lesson_id:media.lesson_id,vid:media.vid,total_watch_time:real_rate,last_current_time:sec2},function (res) {
        if(!res.code){
          clearInterval(updateWatchInterval)
        }
      })
    }
  }

  this.IEVersion = function () {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
      var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
      var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
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
      }else{
          return -1;//不是ie浏览器
      }
  }

  this._init = function () {
    this.intlTelInput(); //国家区号
    this.scrollTop(); //回到顶部
    this.scrollToToday(); //回到今天
    this.horizonTimeline(); //时间轴
    this.readMore();
    this.showHide();
    //this.userAgent(); //检测用户浏览器信息
    this.showHideTab(); //切换显示隐藏
    this.clickPopup();//购买popup
  }
}
$(document).ready(function(){
    let _tools = new Tools();
    _tools._init();
})

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

function removeClass(el, className) {
  if (hasClass(el, className)) {
    let newClass = el.className.split(' ')
    let index = newClass.indexOf(className)

    newClass.splice(index, 1)
    el.className = newClass.join(' ')
  } else {
    return
  }
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

if ( !Array.prototype.forEach ) {
  console.log('forEach test')
    Array.prototype.forEach = function forEach( callback, thisArg ) {
        var T, k;
        if ( this == null ) {
            throw new TypeError( "this is null or not defined" );
        }
        var O = Object(this);
        var len = O.length >>> 0;
        if ( typeof callback !== "function" ) {
            throw new TypeError( callback + " is not a function" );
        }
        if ( arguments.length > 1 ) {
            T = thisArg;
        }
        k = 0;
        while( k < len ) {

            var kValue;
            if ( k in O ) {
                kValue = O[ k ];
                callback.call( T, kValue, k, O );
            }
            k++;
        }
    };
}