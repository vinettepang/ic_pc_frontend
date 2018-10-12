'use strict';

var getCompanyListUrl = '/job',
    //获取公司列表
centerNoticeUrl = '/my_preference',
    //个人中心的通知设置
getSubListUrl = '',
    //获取订阅列表
getCreateSubUrl = '',
    //获取创建订阅后的列表
getAllSubCompanyListUrl = '',
    //获取所有订阅的公司列表
getSubCompanyListUrl = '',
    //获取相关订阅的公司列表
getChangeSubUrl = '',
    //获取修改订阅后的数据
getCollectListUrl = ''; //获取我的收藏的公司列表
"use strict";

var iceCarousel = {
  template: "\n    <div id=\"ice_carousel\" @mouseover=\"carousel_over\" @mouseout=\"carousel_out\">\n      <div class=\"carousel_list\">\n        <div class=\"carousel_item\" :class=\"{ active: index === current }\" v-for=\"(item, index) in carouselData\" :style=\"{ background: item.back_color,'z-index': index === current ? 5 : 2  }\">\n          <a :href=\"item.href\" target=\"_blank\">\n          <img :src=\"item.url\" data-rjs=\"2\" :class=\"{ img_active: index === current }\" class=\"item_img\"/>\n          </a>\n        </div>\n        <ol class=\"dot_wrapper\">\n          <li class=\"dot_box\" :class=\"{ box_active: index === current }\" v-for=\"(item, index) in carouselData\" @click=\"dot_updata_current(index)\">\n            <span class=\"dot\" :class=\"{ active: index === current }\" :style=\"{ backgroundColor: light ? '#482929' : '#fff' }\"></span>\n          </li>\n        </ol>\n        <transition name=\"prevOrNext_state\">\n          <div v-show=\"prevOrNext_state\">\n            <i class=\"nc-icon nc-circle-left-38 prev\" @click=\"prev\" :style=\"{ color: light ? '#482929' : '#fff' }\"></i>\n            <i class=\"nc-icon nc-circle-right-37 next\" @click=\"next\" :style=\"{ color: light ? '#482929' : '#fff' }\"></i>\n          </div>\n        </transition>\n      </div>\n    </div>",
  props: {
    //轮播图的数据
    carouselData: {
      type: Array,
      default: []
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  data: function data() {
    return {
      current: 0,
      prevOrNext_state: false,
      light: 1
    };
  },

  watch: {
    current: function current(newCurrent) {
      this.light = this.carouselData[newCurrent].light;
    }
  },
  methods: {
    carouse_init: function carouse_init() {
      this.timer_init();
    },
    dot_updata_current: function dot_updata_current(index) {
      this.current = index;
    },
    timer_init: function timer_init() {
      var _this = this;
      var imgLength = this.carouselData.length;

      this.timer = setInterval(function () {
        if (_this.current >= imgLength - 1) {
          _this.current = 0;
        } else {
          _this.current++;
        }
      }, _this.duration);
    },
    prev: function prev() {
      if (this.current <= 0) {
        this.current = this.carouselData.length - 1;
      } else {
        this.current--;
      }
    },
    next: function next() {
      if (this.current >= this.carouselData.length - 1) {
        this.current = 0;
      } else {
        this.current++;
      }
    },
    carousel_over: function carousel_over() {
      clearInterval(this.timer);
      this.prevOrNext_state = true;
    },
    carousel_out: function carousel_out() {
      this.timer_init();
      this.prevOrNext_state = false;
    }
  },
  mounted: function mounted() {
    this.light = this.carouselData[0].light;
    //console.log(this.light)
    this.carouse_init();
  }
};
'use strict';

var iceAlert = {
  template: '\n  <div class="ice_alert" :style="shadeStyle">\n    <div class="content" ref="content">\n      <slot></slot>\n    </div>\n  </div>',
  props: {
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: String,
      default: 450
    },
    shade: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      shadeStyle: ''
    };
  },
  created: function created() {
    this.shade ? this.shadeStyle = '' : this.shadeStyle = 'background-color: rgba(0, 0, 0, 0);';
  },
  mounted: function mounted() {
    this.ice_alert_init();
  },

  methods: {
    ice_alert_init: function ice_alert_init() {
      var _this = this;

      Vue.nextTick(function () {
        _this.$refs.content.style.width = _this.width + 'px';
        _this.$refs.content.style.height = _this.height + 'px';
      }, 20);
    }
  }
};
'use strict';

var findJobRight = {
    // <div class="item">
    //           <div class="subItemTitle"> • 是否只看校招</div>
    //           <ul class="wrapper">
    //             <li @click="_createSubItemId(3, 0)" :class="{ active: only_school == 0 }">不限</li>
    //             <li @click="_createSubItemId(3, 1)" :class="{ active: only_school == 1 }">只看校招</li>
    //           </ul>
    //         </div>
    //         <div class="item">
    //           <div class="subItemTitle"> • 是否只看内推</div>
    //           <ul class="wrapper">
    //             <li @click="_createSubItemId(4, 0)" :class="{ active: only_referral == 0 }">不限</li>
    //             <li @click="_createSubItemId(4, 1)" :class="{ active: only_referral == 1 }">只看内推</li>
    //           </ul>
    //         </div>
    //       <div class="subscribeItem" v-show="subStepCurrent === 3">
    //         <div class="current3">
    //           <img class="qrCodeImg" src="/static/icebear2018/src/images/xiaozhushou.png" alt="">
    //           <p class="about">关注公众号「白熊小助手」，我们将根据你的定制推送最新的职位给你</p>
    //         </div>
    //       </div>
    //右侧订阅列表
    //  <div class="subscribeList">
    //   <div class="subHeader">
    //     <span class="title">订阅列表</span>
    //     <a :href="loginState ? '/my_preference.html' : 'javascript:void(0)'" @click='notlogin'><button class="btn-border btn-border-sm">推送设置</button></a>
    //   </div>
    //   <ul class="subWrapper">
    //     <li class="item" v-if="createSub_banner">
    //       <div class="row">
    //         <span class="createTitle">创建自己的专属订阅</span>
    //         <a class="btn-circle btn-nano btn-secondary" @click="_createSub_data">开始创建</a>
    //       </div>
    //       <div class="">
    //         <img class="subImg" src="/static/icebear2018/src/images/findJob/zhuanshu.png" alt="">
    //         <span class="about">点击开始创建，定制属于自己的求职订阅，第一时间获取求职信息。</span>
    //       </div>
    //       <div class="row">
    //         <span class="peopleNum"></span>
    //       </div>
    //     </li>
    //     <li class="item" v-if="mySub_banner">
    //       <div class="row">
    //         <span class="createTitle">我的专属订阅</span>
    //         <button class="btn-circle btn-nano btn-secondary" @click="open_updataSub">编辑</button>
    //       </div>
    //       <div class="">
    //         <img class="subImg" src="/static/icebear2018/src/images/findJob/zhuanshu.png" alt="">
    //         <span class="about">{{ mySubContent ? mySubContent : mySubContent1 }}</span>
    //       </div>
    //       <div class="row">
    //         <span class="peopleNum"></span>
    //       </div>
    //     </li>
    //     <li class="item" v-for="i in subData">
    //       <div class="row">
    //         <span class="createTitle">{{ i.title }}</span>
    //         <button class="btn-circle btn-nano createBtn" :class="i.sub_state ? 'active' : ''" @click="updataSubState(i)">{{ i.sub_state ? "已订阅" : "订阅" }}</button>
    //       </div>
    //       <div class="">
    //         <img class="subImg" :src="i.sub_img" alt="">
    //         <span class="about">{{ i.content }}</span>
    //       </div>
    //       <div class="row">
    //         <span class="peopleNum">{{ i.number }} 人订阅</span>
    //       </div>
    //     </li>
    //   </ul>
    // </div>
    //<p class="about">我们会根据你的订阅内容，每天推送最新职位给你。如需关闭推送服务可在「通知设置」里进行修改。</p>
    template: '\n  <div class="right">\n    <slot></slot>\n\n    <div class="side-box" v-show="createSub_banner">\n      <h4 class="box-title">\u521B\u5EFA\u6C42\u804C\u8BA2\u9605</h4>\n      <div class="v-flex-between box-header">\n      <i class="icon-robot nc-icon nc-pencil"></i>\n      <span class="right-text">\u6211\u4EEC\u4F1A\u6839\u636E\u4F60\u8BBE\u5B9A\uFF0C\u7B2C\u4E00\u65F6\u95F4\u63A8\u9001\u6700\u65B0\u804C\u4F4D\u7ED9\u4F60\u3002</span>\n      </div>\n      <a class="btn-circle btn-secondary full-wd" @click="_createSub_data">\u70B9\u51FB\u521B\u5EFA</a>\n    </div>\n\n    <div class="ice_alert subscribeAlert createSubAlert" v-show="createSubscribeState" style="display: none" :width="400" height="500">\n      <div class="content">\n        <i class="nc-icon nc-simple-remove" @click="_closeSubscribe"></i>\n        <div v-show="subStepCurrent === 0 || subStepCurrent === 1 ||subStepCurrent === 2 ||subStepCurrent === 3">\n          <span class="title">\u8F7B\u677E\u56DB\u6B65\u5B8C\u6210\u5B9A\u5236</span>\n          <Steps :current="subStepCurrent" class="subSteps">\n            <Step title="" content=""></Step>\n            <Step title="" content=""></Step>\n            <Step title="" content=""></Step>\n            <Step title="" content=""></Step>\n          </Steps>\n        </div>\n        <div class="subscribeItem" v-show="subStepCurrent === 0">\n          <div class="subItemTitle"> \u2022 \u884C\u4E1A\u7C7B\u522B\uFF1A</div>\n          <ul class="wrapper">\n            <li v-for="(item, index) in subscribeIdustryData" :class="{ \'active\': item.selected, \'unlimited\': index == 0 }" @click="_createSubItemId(0, item.id, subscribeIdustryData, index)">{{item.name}}</li>\n          </ul>\n        </div>\n\n        <div class="subscribeItem" v-show="subStepCurrent === 1">\n          <div class="subItemTitle"> \u2022 \u5DE5\u4F5C\u57CE\u5E02\uFF1A</div>\n          <ul class="wrapper">\n            <li v-for="(item, index) in cityData" :class="{ \'active\': item.selected, \'unlimited\': index == 0 }" @click="_createSubItemId(1, item.id, cityData, index)">{{item.name}}</li>\n          </ul>\n        </div>\n\n        <div class="subscribeItem" v-show="subStepCurrent === 2">\n          <div class="subItemTitle"> \u2022 \u804C\u4F4D\u7C7B\u522B\uFF1A</div>\n          <ul class="wrapper">\n            <li v-for="(item, index) in positionsData" :class="{ \'active\': item.selected, \'unlimited\': index == 0 }" @click="_createSubItemId(2, item.id, positionsData, index)">{{item.name}}</li>\n          </ul>\n        </div>\n\n        <div class="subscribeItem radio" v-show="subStepCurrent === 3">\n          <div class="item">\n            <div class="subItemTitle"> \u2022 \u804C\u4F4D\u6027\u8D28\uFF1A</div>\n            <ul class="wrapper">\n              <li v-for="(item, index) in jobTypeData" :class="{ \'active\': item.selected }" @click="_createSubItemId(3, item.id, jobTypeData, index)">{{item.name}}</li>\n            </ul>\n          </div>\n\n          <div class="item" style="display:none">\n            <div class="subItemTitle"> \u2022 \u8BA2\u9605\u63A8\u9001\u7684\u9891\u7387\uFF1A</div>\n            <ul class="wrapper">\n              <li :class="{ active: job_remind_val === 1 }" @click="_createSubItemId(6, 1)">\u6BCF\u5929</li>\n              <li :class="{ active: job_remind_val === 3 }" @click="_createSubItemId(6, 3)">\u6BCF\u4E09\u5929</li>\n              <li :class="{ active: job_remind_val === 7 }"@click="_createSubItemId(6, 7)">\u6BCF\u5468</li>\n            </ul>\n          </div>\n        </div>\n\n        <div class="subscribeItem" v-show="is_created_follow && subStepCurrent === 4 && is_created_success">\n          <div class="current3">\n            <i class="okIcon nc-icon nc-check-circle-08"></i>\n            <div class="message">\u8BA2\u9605\u6210\u529F</div>\n            <p class="about"></p>\n          </div>\n        </div>\n\n        <div class="subscribeItem" v-show="!is_created_follow && subStepCurrent === 4">\n          <div class="current3">\n            <img class="qrCodeImg" data-rjs=\'2\' src="/static/icebear2018/src/images/qr/baixiongxiaozhushou.png" alt="\u767D\u718A\u5C0F\u52A9\u624B"/>\n            <p class="about">\u5173\u6CE8\u516C\u4F17\u53F7\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D\uFF0C\u6211\u4EEC\u5C06\u6839\u636E\u4F60\u7684\u5B9A\u5236\u63A8\u9001\u6700\u65B0\u7684\u804C\u4F4D\u7ED9\u4F60\u3002</p>\n            <p class="tips" v-show="not_follow_tips">*\u8BA2\u9605\u5931\u8D25\uFF0C\u8BF7\u5173\u6CE8\u516C\u4F17\u53F7</p>\n          </div>\n        </div>\n\n        <div class="btnWrapper">\n          <button class="btn-circle btn-primary" v-show="createSub_closeBtn_show"  @click="_subStepNext()">\u4E0B\u4E00\u6B65</button>\n          <button class="btn-circle btn-primary finishBtn" v-show="createSub_finishBtn_show" @click="_closeSubscribe">\u5B8C\u6210\u8BA2\u9605</button>\n        </div>\n        <div class="btnGroup" v-show="!is_created_success">\n          <button class="btn-circle btn-primary prev" v-show="createSub_prevBtn_show" @click="_subStepPrev()">\u4E0A\u4E00\u6B65</button>\n          <button class="btn-circle btn-primary next" v-show="createSub_nextBtn_show" @click="_subStepNext()">\u4E0B\u4E00\u6B65</button>\n        </div>\n      </div>\n    </div>\n\n    <div class="subStateAlert" v-show="subStateAlertShow" style="display: none">\n      <div class="ice_alert1">\n        <div class="content">\n          <i class="nc-icon nc-simple-remove" @click="_closeSubStateAlert"></i>\n          <div class="ice_assistantAlert" v-if="subAlertState === 0">\n            <img class="qRcode" src="/static/icebear2018/src/images/xiaozhushou.png"" alt="">\n            <p class="about">\u5173\u6CE8\u516C\u4F17\u53F7\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D\uFF0C\u6211\u4EEC\u5C06\u6839\u636E\u4F60\u7684\u8BA2\u9605\u63A8\u9001\u6700\u65B0\u7684\u804C\u4F4D\u7ED9\u4F60\u3002</p>\n            <span class="okBtn" @click="_closeSubStateAlert">\u597D\u7684</span>\n          </div>\n\n          <div class="sussageAlert" v-if="subAlertState === 1">\n            <i class="okIcon nc-icon nc-check-circle-08"></i>\n            <div class="message">\u8BA2\u9605\u6210\u529F</div>\n            <p class="about">\u6211\u4EEC\u4F1A\u6839\u636E\u4F60\u7684\u8BA2\u9605\u5185\u5BB9\uFF0C\u6BCF\u5929\u63A8\u9001\u6700\u65B0\u804C\u4F4D\u7ED9\u4F60\uFF0C\u5982\u9700\u5173\u95ED\u63A8\u9001\u670D\u52A1\u53EF\u5728"\u901A\u77E5\u8BBE\u7F6E"\u91CC\u8FDB\u884C\u4FEE\u6539\u3002</p>\n            <span class="okBtn" @click="_closeSubStateAlert">\u597D\u7684</span>\n          </div>\n\n        </div>\n      </div>\n    </div>\n  </div>',
    props: {
        subData: {
            type: Object,
            default: {}
        },
        leftSubIdChange: {
            type: Object,
            default: {}
        },
        mySubContent: {
            type: String,
            default: ''
        }
    },
    data: function data() {
        return {
            createSubscribeState: false, //创建订阅的弹窗的显示状态
            rigthTabsState: 0,
            subStepCurrent: 0, //创建订阅的第几个步骤
            createSub_closeBtn_show: true,
            createSub_prevBtn_show: false,
            createSub_nextBtn_show: false,
            createSub_finishBtn_show: false,
            createSub_banner: false,
            mySub_banner: true,
            mySubContent1: '',
            only_school: 0,
            only_referral: 0,
            job_remind_val: 1,
            subStateAlertShow: false, //订阅弹窗的显示状态
            subAlertState: 1,
            is_created_follow: false, //是否已关注且初次订阅
            not_follow_tips: false, //未关注提示
            is_created_success: false, //订阅是否成功
            clickNum: 0,
            //创建订阅的相关id值
            createSubItemsId: {
                idu: 0,
                city: 0,
                position: 0,
                school: 0,
                int_push: 0,
                push_fre: 1,
                job_type: 0
            },
            //订阅的行业、城市数据
            subscribeIdustryData: [{
                id: 0,
                name: "不限",
                selected: 1
            }],
            cityData: [{
                id: 0,
                name: "不限",
                selected: 1
            }],
            jobTypeData: [{
                id: 0,
                name: "不限",
                selected: 1
            }],
            positionsData: [{
                id: 0,
                name: "不限",
                selected: 1
            }],
            loginState: false
        };
    },

    watch: {
        leftSubIdChange: function leftSubIdChange(newChange) {
            this.subData.forEach(function (item) {
                if (item.id == newChange.id) {
                    //console.log(newChange.follow)
                    newChange.follow ? item.sub_state = 1 : item.sub_state = 0;
                }
            });
        },
        subStepCurrent: function subStepCurrent(newCurrent) {
            if (newCurrent === 0) {
                this.createSub_closeBtn_show = true;
                this.createSub_prevBtn_show = false;
                this.createSub_nextBtn_show = false;
                this.createSub_finishBtn_show = false;
            } else if (newCurrent === 1 || newCurrent === 2 || newCurrent === 3) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = true;
                this.createSub_nextBtn_show = true;
                this.createSub_finishBtn_show = false;
            } else if (newCurrent === 4 && this.is_created_follow) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = false;
                this.createSub_nextBtn_show = false;
                this.createSub_finishBtn_show = true;
            } else if (newCurrent === 4 && !this.is_created_follow) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = true;
                this.createSub_nextBtn_show = true;
                this.createSub_finishBtn_show = false;
            }
        }
    },
    created: function created() {
        if (Vue.prototype.global.getCookie('session_login_token') == 1) {
            this.loginState = true;
        } else {
            this.loginState = false;
        }
    },
    mounted: function mounted() {
        this._urlFilter();
        this.createSub_banner_init();
    },

    methods: {
        //获取创建订阅的行业、城市等数据
        getCreateSubData: function getCreateSubData(ids) {
            var _this = this;
            if (_this.subscribeIdustryData.length === 1) {
                post('/job/my_subscribe', {}, function (res) {
                    if (res.code == 1) {
                        //console.log(res)
                        res.data.job_subscribe.industrys.forEach(function (item) {
                            _this.subscribeIdustryData.push(item);
                        });

                        res.data.job_subscribe.citys.forEach(function (item) {
                            _this.cityData.push(item);
                        });

                        res.data.job_subscribe.job_type.forEach(function (item) {
                            _this.jobTypeData.push(item);
                        });

                        res.data.job_subscribe.positions.forEach(function (item) {
                            _this.positionsData.push(item);
                        });

                        //_this.is_created_follow = res.data.is_new && res.data.is_follow_weixin ? true : false
                        //_this.is_created_follow = true
                    }
                });
            } else {
                return;
            }
        },
        getUserFollow: function getUserFollow(num) {
            var _this = this;
            post('/job/my_subscribe', {}, function (res) {
                if (res.code == 1) {
                    //console.log(res)

                    _this.is_created_follow = res.data.is_new && res.data.is_follow_weixin ? true : false;
                    if (num == 1) {
                        _this.is_created_follow ? _this.not_follow_tips = false : _this.not_follow_tips = true;
                    }
                    //console.log(_this.is_created_follow)
                    if (_this.is_created_follow) {
                        _this.not_follow_tips = false;
                        _this._finishCreateSub(); //执行完成订阅
                    }
                }
            });
        },
        _urlFilter: function _urlFilter() {
            var _this = this;
            Vue.nextTick(function () {
                if (location.pathname.indexOf('findJob_list') === 1) {
                    _this.$refs.mySubscribe.href = './my_findJob.html';
                    _this.$refs.myCollect.href = './my_findJob.html#page=collect';
                } else if (location.pathname.indexOf('my_findJob') === 1) {
                    _this.$refs.mySubscribe.href = 'javascript:void(0)';
                    _this.$refs.myCollect.href = 'javascript:void(0)';
                }
            });
        },

        //点击订阅按钮后弹出的弹窗 关闭
        _closeSubStateAlert: function _closeSubStateAlert() {
            this.subStateAlertShow = false;
        },
        _createSub_data: function _createSub_data() {
            if (this.loginState) {
                this.getCreateSubData();
                this.createSubscribeState = true;
            } else {
                header._loginAlertShow();
            }
        },
        _mySubscribe: function _mySubscribe() {
            var hash = location.hash;

            this.rigthTabsState = 0;
            this._events.createrighttabs[0](this.rigthTabsState);

            if (hash.indexOf('#page') != -1) {
                newHash = hash.replace('page=collect', '');
                location.hash = newHash;
            }
        },
        _myCollection: function _myCollection() {
            var href = location.href;
            this.rigthTabsState = 1;
            this._events.createrighttabs[0](this.rigthTabsState);
            if (location.hash == '') {
                location.hash = 'page=collect';
            } else {
                // location.hash = 'page=collect' + location.hash
            }
        },
        _subStepNext: function _subStepNext() {
            // console.log(this.subStepCurrent)
            // console.log(this.createSub_banner)
            // if (this.createSub_banner && this.subStepCurrent == 3 && this.is_created_follow) {
            //     console.log('执行完成订阅')
            //     this.not_follow_tips = false
            //     this._finishCreateSub() //执行完成订阅
            // }
            if (this.createSub_banner && this.subStepCurrent == 3) {
                this.getUserFollow(0);
            }
            if (this.createSub_banner && this.subStepCurrent == 4) {
                this.getUserFollow(1);
            }
            if (this.subStepCurrent == 4) {
                return;
            } else {
                this.subStepCurrent++;
            }
        },
        _subStepPrev: function _subStepPrev(type) {
            if (this.subStepCurrent == 0) {
                return;
            } else {
                this.subStepCurrent--;
            }
        },

        //关闭订阅弹窗
        _closeSubscribe: function _closeSubscribe() {
            this.subStepCurrent = 0;
            this.createSubscribeState = false;
        },

        //完成订阅
        _finishCreateSub: function _finishCreateSub() {

            //this.subStepCurrent = 0
            //this.createSubscribeState = false

            // console.log('创建订阅：')
            // console.log(this.createSubItemsId)

            this.createSub_banner = false;
            this.mySub_banner = true;

            this.updataCreateSub_data();
        },

        //保存创建订阅的数据
        updataCreateSub_data: function updataCreateSub_data() {
            var createSubItemsId = this.createSubItemsId;
            var data = {};
            var _this = this;

            data.act = 'update';
            data.city_ids = createSubItemsId.city;
            data.industry_ids = createSubItemsId.idu;
            data.job_type = createSubItemsId.job_type;
            data.only_school = createSubItemsId.school;
            data.only_referral = createSubItemsId.int_push;
            data.job_remind_val = createSubItemsId.push_fre;
            data.position_ids = createSubItemsId.position;

            post('/job/my_subscribe', data, function (res) {
                if (res.code) {
                    _this.createSub_finishBtn_show = true;
                    _this.is_created_success = true;
                    _this._events.getsubscribestatus[0](false); //修改父组件订阅状态
                    if (res.data.subscribe_txt.split('|').length > 0) {
                        _this.mySubContent = res.data.subscribe_txt.split('|').join(' | ');
                    } else {
                        _this.mySubContent = res.data.subscribe_txt;
                    }
                } else {

                    vm.$toast(res.msg, {
                        iconType: 'error'
                    });
                }
            }, function (res) {
                console.log(res);
            });
        },

        //创建订阅的弹窗初始化
        _createSub: function _createSub(state) {
            this.createSubscribeState = state;
            this._resetSubAlert();
        },

        //重置订阅弹窗的按钮
        _resetSubAlert: function _resetSubAlert() {
            var items = document.querySelectorAll('.subscribeAlert li');

            items.forEach(function (el, index) {
                if (el.innerText == '不限' || el.innerText == '每天') {
                    addClass(el, 'active');
                } else {
                    removeClass(el, 'active');
                }
            });
        },

        //更新订阅状态
        updataSubState: function updataSubState(data) {
            var follow = data.sub_state;
            var _this = this;

            if (this.loginState) {
                post('/job/tag_flow', {
                    tag_id: data.id,
                    follow: follow ? 0 : 1
                }, function (res) {
                    //console.log(res)
                    if (res.code == 1) {
                        var is_first_time = res.data.is_new;
                        var is_follow_weixin = res.data.is_follow_weixin;

                        if (is_follow_weixin != 1) {
                            state = 0; //未关注
                        } else if (is_follow_weixin == 1 && is_first_time == 1) {
                            state = 1; //关注公众号且为第一次订阅
                        } else {
                            state = 2; //关注公众号且不为第一次订阅
                        }

                        if (state == 0) {
                            _this.subStateAlertShow = true;
                        } else if (state == 1) {
                            _this.subStateAlertShow = true;
                        } else if (state == 2) {
                            if (follow) {
                                _this.$toast('取消订阅', {
                                    iconType: 'success'
                                });
                            } else {
                                _this.$toast('订阅成功', {
                                    iconType: 'success'
                                });
                            }
                        }
                    } else {
                        _this.$toast(res.msg, {
                            iconType: 'error'
                        });
                        //console.log(res.msg)
                    }
                }, function (res) {
                    console.log(res);
                });

                data.sub_state ? data.sub_state = 0 : data.sub_state = 1;
            } else {
                header._loginAlertShow();
            }
        },
        _createSubItemId: function _createSubItemId(index, id) {
            var relData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var data = this.createSubItemsId;
            var selected = '';
            if (relData.length) {
                selected = !relData[i].selected; //选中或反选

                relData[i].selected ? relData[i].selected = 0 : relData[i].selected = 1;
            }
            switch (index) {
                case 0:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0;
                            typeof data.idu == "number" ? data.idu = [0] : data.idu = data.idu;
                            data.idu[0] ? data.idu.push(id) : data.idu[0] = id;
                        } else {
                            data.idu.pop(id);
                            if (data.idu.length === 0) {
                                data.idu = 0;
                                relData[0].selected = 1;
                            }
                        }
                    } else {
                        data.idu = 0;
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    };
                    this.subscribeIdustryData = relData;
                    break;
                case 1:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0;
                            typeof data.city == "number" ? data.city = [0] : data.city = data.city;
                            data.city[0] ? data.city.push(id) : data.city[0] = id;
                        } else {
                            data.city.pop(id);
                            if (data.city.length === 0) {
                                data.city = 0;
                                relData[0].selected = 1;
                            }
                        }
                    } else {
                        data.city = 0;
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    };
                    this.cityData = relData;
                    break;
                case 2:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0;
                            typeof data.position == "number" ? data.position = [0] : data.position = data.position;
                            data.position[0] ? data.position.push(id) : data.position[0] = id;
                        } else {
                            data.position.pop(id);
                            if (data.position.length === 0) {
                                data.position = 0;
                                relData[0].selected = 1;
                            }
                        }
                    } else {
                        data.position = 0;
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    };
                    this.positionsData = relData;
                    break;
                case 3:
                    data.job_type = id;
                    relData.forEach(function (el, ind) {
                        if (ind != i) {
                            el.selected = 0;
                        }
                    });
                    this.jobTypeData = relData;
                    break;
                case 4:
                    this.only_school = id;
                    data.school = id;
                    break;
                case 5:
                    this.only_referral = id;
                    data.int_push = id;
                    break;
                case 6:
                    this.job_remind_val = id;
                    data.push_fre = id;
                    break;
            }
            this.updataSubItemsId = data;
        },

        //编辑我的订阅
        open_updataSub: function open_updataSub() {
            //console.log('编辑我的订阅！！')
            this._events.openupdatasub[0](true);
        },

        //初始化 是创建订阅还是我的专属订阅
        createSub_banner_init: function createSub_banner_init() {

            var _this = this;
            if (this.loginState) {
                setTimeout(function () {
                    post('/job/get_my_subscribe', {}, function (res) {
                        //console.log(res)
                        if (res.code == 1) {
                            if (res.data.is_empty) {
                                _this._events.getsubscribestatus[0](true); //修改父组件订阅状态
                                _this.createSub_banner = true;
                                _this.mySub_banner = false;
                            } else {
                                _this._events.getsubscribestatus[0](false); //修改父组件订阅状态
                                _this.createSub_banner = false;
                                _this.mySub_banner = true;

                                if (res.data.subscribe_txt.split('|').length > 0) {
                                    _this.mySubContent1 = res.data.subscribe_txt.split('|').join(' | ');
                                } else {
                                    _this.mySubContent1 = res.data.subscribe_txt;
                                }
                            }
                        }
                    }, function (res) {
                        console.log(res);
                    });
                }, 20);
            } else {
                _this.createSub_banner = true;
                _this.mySub_banner = false;
            }
        },

        //未登录弹出登录窗口
        notlogin: function notlogin() {
            if (this.loginState) {
                return;
            } else {
                header._loginAlertShow();
            }
        }
    }
};
'use strict';

var ipadBlock = {
    template: '\n    <div class="unclose-dialog" v-show="isIpadBlock && agreeOpenWatchInPad">\n        <div class="unclose-dialog-content">\n            <div class="unclose-dialog-box">\n                <div class="unclose-dialog-text"><p>\u7531\u4E8E\u79FB\u52A8\u7AEF\u7F51\u9875\u6682\u65F6\u65E0\u6CD5\u51C6\u786E\u8BB0\u5F55\u770B\u8BFE\u60C5\u51B5\uFF0C\n\u5F71\u54CD\u62BC\u91D1\u8BFE\u9000\u6B3E\u3002</p><p>\u5EFA\u8BAE\u5728\u5FAE\u4FE1\u4F7F\u7528\u300C<span id="miniprogram">\u767D\u718A\u5B66\u9662</span>\u300D\u5C0F\u7A0B\u5E8F\u8FDB\u884C\u5B66\u4E60\u3002</p></div>\n                <img class="unclose-img" data-rjs="2" :src="miniImage">\n                <button class="unclose-btn ic-clipboard" data-clipboard-target="#miniprogram">\u590D\u5236\u5C0F\u7A0B\u5E8F\u540D\u79F0</button>\n                <button class="unclose-btn" @click="setIpadWatchCookie" >\u4F9D\u7136\u4F7F\u7528\u7F51\u9875\u770B\u8BFE</button>\n            </div>\n        </div>\n        <div class="unclose-dialog-cover"></div>\n    </div>',
    props: {
        isIpadBlock: {
            type: Boolean,
            default: false
        },
        miniImage: {
            type: String,
            default: ''
        }
    },
    data: function data() {
        return {
            agreeOpenWatchInPad: true //pad是否
        };
    },

    watch: {
        isIpadBlock: function isIpadBlock(status) {
            if (status == true) {
                this.isIpadBlock = true;
            }
        }
    },
    created: function created() {},
    mounted: function mounted() {
        // Vue.prototype.global.getCookie('agree_watch_in_pad') == 'true'
        // ? this.agreeOpenWatchInPad = false : this.agreeOpenWatchInPad = true
    },

    methods: {
        setIpadWatchCookie: function setIpadWatchCookie() {
            // Vue.prototype.global.setCookie('agree_watch_in_pad','true',365)
            this.agreeOpenWatchInPad = false;
            this._events.agree_open_watch_in_pad[0](false);
        }
    }
};
'use strict';

var liveTimer = {
  template: '{{timerCount}}',
  props: {
    time: {
      type: Number, //直播间开始时间
      default: ''
    }
  },
  data: function data() {
    return {
      timerCount: '15:00', //倒计时
      liveStartTime: '' //直播间开始时间
    };
  },

  computed: {
    playIcon: function playIcon() {
      return this.audioState ? 'pause' : 'play';
    }
  },
  created: function created() {
    //console.log(this.time)
  },

  watch: {},
  methods: {
    status: function status() {
      this.status ? this.countdowm(this.time) : '';
    },

    //倒计时
    countdowm: function countdowm(timestamp) {
      var self = this;
      var countdownTimer = setInterval(function () {
        var nowTime = new Date();
        var endTime = new Date(timestamp * 1000);
        var t = endTime.getTime() - nowTime.getTime();
        if (t > 0) {
          var day = Math.floor(t / 86400000);
          var hour = Math.floor(t / 3600000 % 24);
          var min = Math.floor(t / 60000 % 60);
          var sec = Math.floor(t / 1000 % 60);
          hour = hour < 10 ? "0" + hour : hour;
          min = min < 10 ? "0" + min : min;
          sec = sec < 10 ? "0" + sec : sec;
          if (min < 15) {
            var format = '';
            if (day > 0) {
              format = day + '\u5929' + hour + ':' + min + ':' + sec + ':';
            }
            if (day <= 0 && hour > 0) {
              format = hour + ':' + min + ':' + sec;
            }
            if (day <= 0 && hour <= 0) {
              format = min + ':' + sec;
            }
            self.timerCount = format;
          }
        } else {
          clearInterval(countdownTimer);
          //this.startLive();
          // self.timerCount = self.endText;
          // self._callback();
        }
      }, 1000);
    }
  }

};
"use strict";

var modal = {
  template: "<Modal\n        title=\"{{ modal.title }}\"\n        v-model=\"true\"\n        class-name=\"vertical-center-modal\">\n        <slot></slot>\n    </Modal>",
  props: {
    modal: {
      type: Object,
      default: {},
      status: false
    }
  },
  create: function create() {
    console.log(this.modal);
  }
};
'use strict';

var login = {
  template: '\n  <div class="loginAlert">\n    <slot></slot>\n    <img class="weixinImg" :src="wexinImg" alt="">\n    <div class="about">\n      <p>\u5FAE\u4FE1\u626B\u7801\u5173\u6CE8\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D</p>\n      <p>\u8FDB\u884C\u767B\u5F55/\u6CE8\u518C</p>\n    </div>\n  </div>',
  props: {
    wexinImg: {
      type: String,
      default: ''
    }
  }
};
'use strict';

var player = {
  template: '\n  <div :class="{ player, \'player_active\': audioState }" :style="{ width: playerWidth }">\n    <audio :src="url" ref="audio" controls="" preload="auto" @timeupdate="updateTime" style="display:none"></audio>\n    <a href="javascript:void(0)" @click="playing()">\n      <Icon :type="playIcon"></Icon>\n    </a>\n    <div class="progress-bar" ref="progressBar">\n      <div class="bar-inner" @click="progressClick">\n        <div class="progress" ref="progress"></div>\n        <div class="timeBuffered" ref="timeBuffered"></div>\n        <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove"\n          @touchend="progressTouchEnd">\n          <div class="progress-btn"></div>\n        </div>\n      </div>\n    </div>\n    <span class="time">{{format(time - currentTime)}}</span>\n    <div class="playState">\n      <i class="nc-icon nc-wifi" v-show="playState === 1"></i>\n      <i class="nc-icon nc-check-circle-07-2 icon-checked"  v-show="playState === 2"></i>\n    </div>\n  </div>',
  props: {
    time: {
      type: Number,
      default: 60
    },
    url: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    },
    index: {
      type: Number,
      default: 0
    },
    imgIndex: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      //进度条按钮宽度
      progressBtnWidth: 2,
      currentTime: 0, //当前播放的时长
      percent: 0, //currentTime / time
      audioState: false, //播放的状态
      bufferPercent: 0, //缓存的进度
      nowAudio: null, //最近播放的音频
      playState: 0, //播放的状态
      playerWidth: '90%' //播放器的宽度
    };
  },

  computed: {
    playIcon: function playIcon() {
      return this.audioState ? 'pause' : 'play';
    }
  },
  created: function created() {
    this.touch = {};
  },
  mounted: function mounted() {
    var _this = this;
    Vue.nextTick(function () {
      var audio = _this.$refs.audio;
      audio.addEventListener("playing", function () {
        _this.audioState = true;
      });
      audio.addEventListener("pause", function () {
        _this.audioState = false;
      });
      audio.addEventListener('timeupdate', _this._currentTime), audio.addEventListener('canplay', _this._durationTime);
    });

    this.playerWidth_init();
  },
  beforeDestroyed: function beforeDestroyed() {
    this.removeEventListeners();
  },

  watch: {
    audioState: function audioState(state) {
      if (state) {
        this.playState = 1;
      } else {
        if (this.playState != 2) {
          this.playState = 0;
        }
      }
    },
    percent: function percent(newPercent) {
      var audio = this.$refs.audio;
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth;
        //偏移的宽度
        var offsetWidth = newPercent * barWidth;

        this._playOffset(offsetWidth);
      }

      if (newPercent >= 1) {
        this.playState = 2;
        audio.pause();
      }
    },
    bufferPercent: function bufferPercent(newBufferPercent) {
      if (newBufferPercent >= 0) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1;
        //缓存的宽度
        var offsetWidth = Math.min(newBufferPercent * barWidth, barWidth);

        this._newBufferOffset(offsetWidth);
      }
    },
    count: function count(newCount) {
      if (newCount > 1) {
        this.$refs.audio.pause();
        this.audioState = false;
      }
    }
  },
  methods: {
    removeEventListeners: function removeEventListeners() {
      var self = this;
      var audio = self.$refs.audio;
      audio.removeEventListener('timeupdate', self._currentTime);
      audio.removeEventListener('canplay', self._durationTime);
    },
    _currentTime: function _currentTime() {
      var audio = this.$refs.audio;
      audio.timeNow = parseInt(audio.currentTime);
      //console.log(audio.timeNow)
    },
    _durationTime: function _durationTime() {
      var audio = this.$refs.audio;
      audio.timeDuration = parseInt(audio.duration);
      if (this.time == 0) {
        var audio_time = audio.timeDuration;
        this.time = audio.timeDuration;
      }
      //console.log(audio.timeDuration)
    },
    //格式化时间
    format: function format(interval) {
      interval = interval | 0;
      var minute = interval / 60 > 10 ? interval / 60 : '0' + interval / 60 | 0;
      var second = interval % 60 > 10 ? interval % 60 : '0' + interval % 60;

      return minute + ':' + second;
    },

    //修改播放的状态
    playing: function playing() {
      var audio = this.$refs.audio;
      var _this = this;

      this.audioState = !this.audioState;

      if (this.audioState) {
        audio.play();
        this._events.callback[0](this.imgIndex);
      } else {
        audio.pause();
      }

      if (this.audioState && this.currentTime == this.time) {
        audio.currentTime = 0;
      }

      this.audioState ? this.count++ : this.count--;
      this._events.countchange[0](this.count);

      setTimeout(function () {
        if (_this.count > 1) {
          audio.play();
          _this.audioState = true;
          _this.count--;
          _this._events.countchange[0](_this.count);
        }
      }, 20);

      this._events.nearplayaudio[0](audio, this.index, this.audioState);
    },
    updateTime: function updateTime(e) {
      var audio = this.$refs.audio;
      var timeRanges = audio.buffered;
      var timeBuffered = timeRanges.end(timeRanges.length - 1);

      this.currentTime = e.target.currentTime | 0;
      if (this.time == 0) {
        this._durationTime();
      }
      this.percent = this.currentTime / this.time;
      // 获取缓存进度，值为0到1
      this.bufferPercent = timeBuffered / audio.duration;

      if (this.currentTime === this.time) {
        this.audioState = false;
        audio.pause();
      }
    },
    playerWidth_init: function playerWidth_init() {
      if (this.time == 0) {
        this._durationTime();
      }
      if (this.time <= 60 && this.time >= 36) {
        this.playerWidth = this.time / 60 * 90 + '%';
      } else if (this.time > 60) {
        this.playerWidth = '90%';
      } else {
        this.playerWidth = '54%';
      }
    },
    _offset: function _offset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = '';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _playOffset: function _playOffset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = 'all .1s';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _newBufferOffset: function _newBufferOffset(offsetWidth) {
      this.$refs.timeBuffered.style.width = offsetWidth - 2 + 'px';
    },

    //h5端的touch事件
    progressTouchStart: function progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove: function progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      var deltaX = e.touches[0].pageX - this.touch.startX;
      var offsetWidth = Math.min(this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth, Math.max(0, this.touch.left + deltaX));

      this._offset(offsetWidth);
    },
    progressTouchEnd: function progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick: function progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    },
    _triggerPercent: function _triggerPercent() {
      var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth;
      var percent = this.$refs.progress.clientWidth / barWidth;

      this.currentTime = percent * this.time;
      this.$refs.audio.currentTime = this.currentTime;

      if (this.audioState) {
        this.$refs.audio.play();
      }
    }
  }
};
'use strict';

var player = {
  template: '\n  <div class="player">\n    <audio :src="url" ref="audio" @timeupdate="updateTime" style="display:none"></audio>\n    <a href="javascript:void(0)" @click="playing()">\n      <Icon :type="playIcon"></Icon>\n    </a>\n    <div class="progress-bar" ref="progressBar" @click="progressClick">\n      <div class="bar-inner">\n        <div class="progress" ref="progress"></div>\n        <div class="timeBuffered" ref="timeBuffered"></div>\n        <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove"\n          @touchend="progressTouchEnd">\n          <div class="progress-btn"></div>\n        </div>\n      </div>\n    </div>\n    <span class="time">{{format(time - currentTime)}}</span>\n    <div class="playState" style="display: none">\n      <i class="nc-icon nc-wifi"></i>\n      <i class="nc-icon nc-check-circle-07-2 icon-checked"></i>\n    </div>\n  </div>',
  props: {
    time: {
      type: Number,
      default: 60
    },
    url: {
      type: String,
      default: ''
    },
    count: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      //进度条按钮宽度
      progressBtnWidth: 2,
      currentTime: 0, //当前播放的时长
      percent: 0, //currentTime / time
      audioState: false, //播放的状态
      bufferPercent: 0 //缓存的进度
    };
  },

  computed: {
    playIcon: function playIcon() {
      return this.audioState ? 'pause' : 'play';
    }
  },
  created: function created() {
    this.touch = {};
    var audio = this.$refs.audio;
    console.log(audio.duration);
  },

  watch: {
    percent: function percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth - 30;
        //偏移的宽度
        var offsetWidth = newPercent * barWidth;

        this._playOffset(offsetWidth);
      }
    },
    bufferPercent: function bufferPercent(newBufferPercent) {
      if (newBufferPercent >= 0) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1 - 28;
        //缓存的宽度
        var offsetWidth = newBufferPercent * barWidth;

        this._newBufferOffset(offsetWidth);
      }
    },
    count: function count(newCount) {
      if (newCount > 1) {
        this.$refs.audio.pause();
        this.audioState = false;
      }
    }
  },
  methods: {
    //格式化时间
    format: function format(interval) {
      interval = interval | 0;
      var minute = interval / 60 | 0;
      var second = interval % 60;

      return minute + ':' + second;
    },

    //修改播放的状态
    playing: function playing() {
      var audio = this.$refs.audio;
      var _this = this;

      this.audioState = !this.audioState;
      this.audioState ? audio.play() : audio.pause();

      if (this.audioState && this.currentTime == this.time) {
        audio.currentTime = 0;
      }

      this.audioState ? this.count++ : this.count--;
      this._events.countchange[0](this.count);

      setTimeout(function () {
        if (_this.count > 1) {
          audio.play();
          _this.audioState = true;
          _this.count--;
          _this._events.countchange[0](_this.count);
        }
      }, 20);
    },
    updateTime: function updateTime(e) {
      var audio = this.$refs.audio;
      var timeRanges = audio.buffered;
      var timeBuffered = void 0;
      if (timeRanges.length) {
        timeBuffered = timeRanges.end(timeRanges.length - 1);
      }

      this.currentTime = e.target.currentTime | 0;
      this.percent = this.currentTime / this.time;
      // 获取缓存进度，值为0到1
      this.bufferPercent = timeBuffered / audio.duration;

      if (this.currentTime === this.time) {
        this.audioState = false;
        audio.pause();
      }
    },
    _offset: function _offset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = '';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _playOffset: function _playOffset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = 'all .1s';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _newBufferOffset: function _newBufferOffset(offsetWidth) {
      this.$refs.timeBuffered.style.width = offsetWidth + 'px';
    },

    //h5端的touch事件
    progressTouchStart: function progressTouchStart(e) {
      this.touch.initiated = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    progressTouchMove: function progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      var deltaX = e.touches[0].pageX - this.touch.startX;
      var offsetWidth = Math.min(this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth, Math.max(0, this.touch.left + deltaX));

      this._offset(offsetWidth);
    },
    progressTouchEnd: function progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick: function progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    },
    _triggerPercent: function _triggerPercent() {
      var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth;
      var percent = this.$refs.progress.clientWidth / barWidth;

      this.currentTime = percent * this.time;
      this.$refs.audio.currentTime = this.currentTime;

      if (this.audioState) {
        this.$refs.audio.play();
      }
    }
  }

};
'use strict';

var record = {
  // <h4 style="margin-top: 20px;">调试信息：</h4>
  // <div id="recordingslist" class="recordingslist"></div>
  // <Icon :type="playIcon"></Icon>
  template: '\n  <div class="ice_record">\n    <div class="section" style="margin-top: 20px;">\n      <i class="start-btn nc-icon nc-audio-91" :class="{active: !startDisabled}" v-show="startBtnState" @click="funStart"></i>\n      <i class="stop-btn nc-icon nc-button-circle-stop" v-show="stopBtnState" @click="funStop"></i>\n      <i class="close-btn" v-show="closeBtnState" @click="funClose">\u7ED3\u675F</i>\n      <i class="reset-btn" v-show="resetBtnState" @click="funReset">\u91CD\u5F55</i>\n      <span class="recTime" v-show="recTimeState">{{ recTime }}"/180</span>\n\n      <div class="audioFinish" ref="audioFinish" v-show="playerUrl">\n        <div class="player">\n          <audio :src="playerUrl" ref="audio" @timeupdate="updateTime" style="display:none"></audio>\n          <a href="javascript:void(0)" @click="playing()">\n            <i class="playIcon" :class="playIcon"></i>\n          </a>\n          <div class="progress-bar">\n            <div class="bar-inner" ref="progressBar" @click="progressClick">\n              <div class="progress" ref="progress"></div>\n              <div class="timeBuffered" ref="timeBuffered"></div>\n              <div class="progress-btn-wrapper" ref="progressBtn">\n                <div class="progress-btn"></div>\n              </div>\n            </div>\n          </div>\n          <span class="time">{{format(playerTime - currentTime)}}</span>\n        </div>\n\n      </div>\n      <span v-show="deleteBtnState" @click="funDelete" style="font-size: 14px; margin-left: 10px; cursor: pointer">\u5220\u9664</span>\n    </div>\n  </div>',
  data: function data() {
    return {
      //开始按钮的disbaled
      startDisabled: true,
      //开始、暂停、结束、重录、删除按钮的现实状态
      startBtnState: true,
      stopBtnState: false,
      closeBtnState: false,
      resetBtnState: false,
      deleteBtnState: false,
      recTimeState: true,
      //recoredr对象
      recorder: '',
      //MP3文件流对象
      mp3Blob: '',
      // 播放器的数据
      playerUrl: '',
      playerTime: 0,
      count: 0,
      //录制的时间
      recTime: 0,
      //进度条按钮宽度
      progressBtnWidth: 2,
      currentTime: 0, //当前播放的时长
      percent: 0, //currentTime / playerTime
      audioState: false, //播放的状态
      bufferPercent: 0 //缓存的进度
    };
  },
  created: function created() {
    this.touch = {};
    this.recorder_init();
  },

  computed: {
    playIcon: function playIcon() {
      return this.audioState ? 'nc-icon nc-button-pause' : 'nc-icon nc-button-play';
    }
  },
  watch: {
    //百分比的变化
    percent: function percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth;
        //偏移的宽度
        var offsetWidth = newPercent * barWidth;

        this._playOffset(offsetWidth);
      }
    },
    bufferPercent: function bufferPercent(newBufferPercent) {
      if (newBufferPercent >= 0) {
        //进度条的宽度
        var barWidth = this.$refs.progressBar.clientWidth * 1;
        //缓存的宽度
        var offsetWidth = newBufferPercent * barWidth;

        this._newBufferOffset(offsetWidth);
      }
    },
    count: function count(newCount) {
      if (newCount > 1) {
        this.$refs.audio.pause();
        this.audioState = false;
      }
    }
  },
  methods: {
    //录音初始化
    recorder_init: function recorder_init() {
      var _this = this;

      this.recorder = new MP3Recorder({
        debug: true,
        funOk: function funOk() {
          _this.startDisabled = false;
          // _this.log('初始化成功');
        },
        funCancel: function funCancel(msg) {
          // _this.log(msg);
          //console.log(msg)
          _this.recorder = null;
        }
      });
    },

    //录音开始
    funStart: function funStart() {
      if (this.startDisabled === false) {
        this.startBtnState = false;
        this.stopBtnState = true;
        // this.log('录音开始...');
        this.recorder.start();

        this.recordTimer(1);
      }
    },

    //录音停止
    funStop: function funStop() {
      this.recorder.stop();
      this.stopBtnState = false;
      this.closeBtnState = true;
      this.resetBtnState = true;

      this.recordTimer(0);
    },

    // 录音结束
    funClose: function funClose() {
      var _this = this;
      var recordingslist = document.querySelector('#recordingslist');

      // this.log('录音结束，MP3导出中...');
      this.recorder.getMp3Blob(function (blob) {
        // _this.log('MP3导出成功');

        _this.mp3Blob = blob;
        _this.closeBtnState = false;
        _this.resetBtnState = false;
        _this.startBtnState = true;
        _this.startDisabled = true;
        _this.deleteBtnState = true;
        _this.recTimeState = false;

        var mp3url = URL.createObjectURL(_this.mp3Blob);
        var au = document.createElement('audio');

        au.controls = true;
        au.src = mp3url;

        setTimeout(function () {
          var time = Math.ceil(au.duration);
          var data = {};
          _this.playerUrl = mp3url;
          _this.playerTime = time;
          data.blob = _this.mp3Blob;
          data.time = time;

          _this._events.requestdata[0](data);
        }, 100);
      });
    },

    //重录
    funReset: function funReset() {
      this.closeBtnState = false;
      this.resetBtnState = false;
      this.stopBtnState = true;
      // this.log('录音重新开始...');
      this.recorder.getMp3Blob();

      this.recorder.start();
      this.recTime = 0;
      this.recordTimer(1);
    },
    funDelete: function funDelete() {
      this.deleteBtnState = false;
      this.recTimeState = true;
      this.playerUrl = '';
      this.playerTime = 0;
      this.startDisabled = false;
      this.recTime = 0;
    },

    //输出日志信息
    // log(str) {
    //   let recordingslist = document.querySelector('#recordingslist');
    //   recordingslist.innerHTML += str + '<br/>';
    // },
    //录音上传
    funUpload: function funUpload() {
      // var fd = new FormData();
      // var mp3Name = encodeURIComponent('audio_recording_' + new Date().getTime() + '.mp3');
      // fd.append('mp3Name', mp3Name);
      // fd.append('file', mp3Blob);

      // var xhr = new XMLHttpRequest();
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState == 4 && xhr.status == 200) {
      //     recordingslist.innerHTML += '上传成功：<a href="' + xhr.responseText + '" target="_blank">' + mp3Name + '</a>';
      //   } else {
      //     console.log(xhr.readyState + '-' + xhr.status)
      //   }
      // };

      // xhr.open('POST', 'upload.ashx');
      // xhr.send(fd);
    },

    //格式化时间
    format: function format(interval) {
      interval = interval | 0;
      var minute = interval / 60 | 0;
      var second = interval % 60;

      return minute + ':' + second;
    },

    //修改播放的状态
    playing: function playing() {
      var audio = this.$refs.audio;
      var _this = this;

      this.audioState = !this.audioState;
      this.audioState ? audio.play() : audio.pause();

      if (this.audioState && this.currentTime == this.playerTime) {
        audio.currentTime = 0;
      }

      this.audioState ? this.count++ : this.count--;

      setTimeout(function () {
        if (_this.count > 1) {
          audio.play();
          _this.audioState = true;
          _this.count--;
        }
      }, 20);
    },
    //audio的时间更新
    updateTime: function updateTime(e) {
      var audio = this.$refs.audio;
      var timeRanges = audio.buffered;
      var timeBuffered = void 0;
      if (timeRanges.length) {
        timeBuffered = timeRanges.end(timeRanges.length - 1);
      }

      this.currentTime = Math.ceil(e.target.currentTime);

      this.percent = this.currentTime / this.playerTime;
      // 获取缓存进度，值为0到1
      this.bufferPercent = timeBuffered / audio.duration;

      if (this.currentTime === this.playerTime) {
        this.audioState = false;
        audio.pause();
      }
    },
    _offset: function _offset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = '';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _playOffset: function _playOffset(offsetWidth) {
      this.$refs.progress.style.width = offsetWidth + 'px';
      this.$refs.progressBtn.style.transition = 'all .1s';
      this.$refs.progressBtn.style.transform = 'translate3d(' + offsetWidth + 'px, 0, 0)';
    },
    _newBufferOffset: function _newBufferOffset(offsetWidth) {
      this.$refs.timeBuffered.style.width = offsetWidth + 'px';
    },
    progressClick: function progressClick(e) {
      this._offset(e.offsetX);
      this._triggerPercent();
    },
    _triggerPercent: function _triggerPercent() {
      var barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth;
      var percent = this.$refs.progress.clientWidth / barWidth;

      this.currentTime = percent * this.playerTime;
      this.$refs.audio.currentTime = this.currentTime;

      if (this.audioState) {
        this.$refs.audio.play();
      }
    },
    recordTimer: function recordTimer(state) {
      var _this = this;
      var recTimer;

      if (state) {
        clearInterval(window.recTimer);
        _this.recTime++;

        window.recTimer = setInterval(function () {
          _this.recTime++;
        }, 1000);
      } else {
        clearInterval(window.recTimer);
      }
    }
  }
};
'use strict';

var scroll = {
  template: '\n  <div class="scroll">\n    <slot></slot>\n    <span class="scroll_moreText" v-show="moreTextState"><i class="icon nc-icon nc-dots-05-2"></i>\u67E5\u770B\u66F4\u591A</span>\n  </div>',
  props: {
    //是否还能加载
    scrollState: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      moreTextState: false,
      isScroll: false
    };
  },

  watch: {
    scrollState: function scrollState(newState) {
      this.moreTextState = newState;
    }
  },
  methods: {
    scroll_init: function scroll_init() {
      var _this = this;

      window.onscroll = function (e) {
        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口的高度
        var bodyHeight = document.body.scrollHeight || document.body.clientHeight || document.documentElement.clientHeight; //body的高度
        var pageYOffset = window.pageYOffset; //滚动条到顶端的距离
        var pageBottom = bodyHeight - windowHeight - pageYOffset; //滚动条到底部的距离
        if (pageBottom <= 0 && _this.scrollState == true) {
          console.log('加载更多：' + pageBottom);
          _this.isScroll = true;
          _this.moreTextState = true;
          //console.log(_this.moreTextState)
          _this._events.scrolladddata[0]();
        }
      };
    }
  },
  created: function created() {
    this.scroll_init();
  }
};
'use strict';

var scrollTop = {
  template: '\n  <div class="scrollTop_bottom">\n    <div class="ivu-back-top" :class="status? \'ivu-back-top-show\':\'\'">\n      <div class="ivu-back-top-inner" @click="clickScrollTop"><img data-rjs="2" :src="scrollTopImg"/></div>\n    </div>\n    <div class="global_scroll_service">\n      <Poptip trigger="hover" class="scroll_service" content="content" placement="left-end">\n        <img data-rjs="2" :src="serviceButtonImg"/>\n        <div slot="content">\n            <img data-rjs="2" :src="serviceContentImg"/>\n        </div>\n      </Poptip>\n    </div>\n  </div>',
  props: {
    //是否还能加载
    status: {
      type: Boolean,
      default: false
    },
    serviceButtonImg: {
      type: String,
      default: ''
    },
    serviceContentImg: {
      type: String,
      default: ''
    },
    scrollTopImg: {
      type: String,
      default: ''
    }
  },
  data: function data() {
    return {};
  },

  watch: {
    status: function status(newState) {
      this.status = newState;
    }
  },
  methods: {
    clickScrollTop: function clickScrollTop() {
      $('html,body').animate({ scrollTop: 0 }, 800);
    }
  },
  created: function created() {}
};
'use strict';

var subTag = {
  template: '\n  <div ref="subTags" class="subTag">\n    <div class="item" v-if="subTags.length" v-for="(item, index) in subTags">\n      <span class="subTagsItem" @click.stop="_subTagsDetail(event, item, index)">{{ item.tag_name }}</span>\n      <div class="subDetail" @click.stop style="display: none;">\n        <div class="itemRow itemRow1">\n          <span class="name">{{ item.tag_name }}</span>\n          <span class="subBtn" :class="item.follow ? \'active\' : \'\'" @click="_subSubmit(item)">{{ item.follow ? "\u5DF2\u8BA2\u9605" : "\u8BA2\u9605" }}</span>\n        </div>\n        <div class="itemRow2">\n          <img class="subImg" :src="item.logo" alt="">\n          <span class="about">{{item.content}}</span>\n        </div>\n        <div class="itemRow itemRow3">\n          <span class="peopleNum">{{item.flow_num}} \u4EBA\u8BA2\u9605</span>\n        </div>\n      </div>\n      <div class="subStateAlert" v-show="subStateAlertShow" style="display: none">\n        <div class="ice_alert1">\n          <div class="content">\n            <i class="nc-icon nc-simple-remove" @click="_closeSubStateAlert"></i>\n            <div class="ice_assistantAlert" v-if="subAlertState === 0">\n              <img class="qRcode" src="/static/icebear2018/src/images/xiaozhushou.png"" alt="">\n              <p class="about">\u5173\u6CE8\u516C\u4F17\u53F7\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D\uFF0C\u6211\u4EEC\u5C06\u6839\u636E\u4F60\u7684\u8BA2\u9605\u63A8\u9001\u6700\u65B0\u7684\u804C\u4F4D\u7ED9\u4F60\u3002</p>\n              <span class="okBtn" @click="_closeSubStateAlert">\u597D\u7684</span>\n            </div>\n\n            <div class="sussageAlert" v-if="subAlertState === 1">\n              <i class="okIcon nc-icon nc-check-circle-08"></i>\n              <div class="message">\u8BA2\u9605\u6210\u529F</div>\n              <p class="about">\u6211\u4EEC\u4F1A\u6839\u636E\u4F60\u7684\u8BA2\u9605\u5185\u5BB9\uFF0C\u6BCF\u5929\u63A8\u9001\u6700\u65B0\u804C\u4F4D\u7ED9\u4F60\uFF0C\u5982\u9700\u5173\u95ED\u63A8\u9001\u670D\u52A1\u53EF\u5728"\u901A\u77E5\u8BBE\u7F6E"\u91CC\u8FDB\u884C\u4FEE\u6539\u3002</p>\n              <span class="okBtn" @click="_closeSubStateAlert">\u597D\u7684</span>\n            </div>\n\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>',
  props: {
    subTags: {
      type: Object,
      default: []
    },
    subTagAlertEls: {
      type: Object,
      default: []
    },
    loginState: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      //点击订阅按钮的弹窗的显示状态
      subStateAlertShow: false,
      //点击订阅按钮的弹窗的内容显示状态
      subAlertState: 0,
      subTagAlertElement: Object

    };
  },
  created: function created() {},
  mounted: function mounted() {
    this._subTagsInit();
    this._bodyCloseAlert();
  },

  methods: {
    //点击订阅标签的逻辑
    _subTagsDetail: function _subTagsDetail(e, data, index) {

      var _this = this;
      var element = e.target.nextSibling.nextSibling;
      var state = 1;

      post('/job/tag_detail', { tag_id: data.id }, function (res) {
        if (res.code == 1) {

          _this.subTags[index] = res.data;

          if (_this.subTagAlertElement.style && _this.subTagAlertElement != element) {
            _this.subTagAlertElement.flag = false;
            _this.subTagAlertElement.style.display = 'none';
          }

          element.flag = !element.flag;
          element.flag ? element.style.display = '' : element.style.display = 'none';

          _this.subTagAlertElement = element;
          _this._events.nearsubalertel[0](_this.subTagAlertElement);
        }
      }, function (res) {
        console.log(res);
      });
    },

    //点击订阅按钮后弹出的弹窗 关闭
    _closeSubStateAlert: function _closeSubStateAlert() {
      this.subStateAlertShow = false;
    },

    //订阅提交
    _subSubmit: function _subSubmit(data) {
      var follow = data.follow;
      var _this = this;
      var state = 2;

      if (this.loginState) {
        post('/job/tag_flow', {
          tag_id: data.id,
          follow: follow ? 0 : 1
        }, function (res) {
          if (res.code == 1) {
            var is_first_time = res.data.is_first_time;
            var is_follow_weixin = res.data.is_follow_weixin;

            _this._events.updatasubdata[0](data.id, !follow);
            if (_this.subTagAlertElement.style) {
              _this.subTagAlertElement.flag = false;
              _this.subTagAlertElement.style.display = 'none';
            }

            if (is_follow_weixin != 1) {
              state = 0;
            } else if (is_follow_weixin == 1 && is_first_time == 1) {
              state = 1;
            } else {
              state = 2;
            }

            if (state == 0) {
              _this.subStateAlertShow = true;
              _this.subAlertState = 0;
            } else if (state == 1) {
              _this.subStateAlertShow = true;
              _this.subAlertState = 1;
            } else if (state == 2) {
              if (follow) {
                _this.$toast('取消订阅', {
                  iconType: 'success'
                });
              } else {
                _this.$toast('订阅成功', {
                  iconType: 'success'
                });
              }
            }
          } else {
            if (_this.subTagAlertElement.style) {
              _this.subTagAlertElement.flag = false;
              _this.subTagAlertElement.style.display = 'none';
            }
            // 输出错误信息
            console.log(res.msg);
          }
        }, function (res) {
          console.log(res);
        });
      } else {
        _this.subStateAlertShow = false;
        header._loginAlertShow();
      }
    },

    //初始化订阅标签
    _subTagsInit: function _subTagsInit() {
      var _this = this;
      Vue.nextTick(function () {
        _this.$refs.subTags.querySelectorAll('.subTagsItem').forEach(function (elItem) {
          elItem.nextSibling.nextSibling.flag = false;
        });
      });
    },

    //点击外部关闭弹窗
    _bodyCloseAlert: function _bodyCloseAlert() {
      var _this = this;
    }
  }
};
'use strict';

var Toast = {};
var showToast = false,
    // 存储toast显示状态
showLoad = false,
    // 存储loading显示状态
toastVM = null,
    // 存储toast vm
loadNode = null; // 存储loading节点元素

Toast.install = function (Vue, options) {

    var opt = {
        defaultType: 'center',
        duration: '1000',
        wordWrap: false,
        iconType: 'success'
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
        var tmp = '<div v-show="show" :class="type" class="ic-toast ' + wordWrap + '" ' + style + '>' + iconTmp + '{{tip}}</div>';

        if (showToast) {
            // 如果toast还在，则不再执行
            return;
        }
        if (!toastVM) {
            var toastTpl = Vue.extend({
                data: function data() {
                    return {
                        show: showToast,
                        tip: tips,
                        iconType: iconType,
                        iconSuccess: 'nc-icon nc-check-circle-08 success',
                        type: 'ic-toast-' + curType
                    };
                },
                template: tmp
            });
            toastVM = new toastTpl();
            var tpl = toastVM.$mount().$el;
            document.body.appendChild(tpl);
        }

        toastVM.type = 'ic-toast-' + curType;
        toastVM.tip = tips;
        toastVM.show = showToast = true;
        toastVM.iconType = iconType;
        toastVM.iconSuccess = toastVM.iconType == 'success' ? 'nc-check-circle-08 success' : 'nc-circle-bold-remove error';

        setTimeout(function () {
            toastVM.show = showToast = false;
        }, opt.duration);
    };
    ['bottom', 'center', 'top'].forEach(function (type) {
        Vue.prototype.$toast[type] = function (tips) {
            return Vue.prototype.$toast(tips, type);
        };
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
                data: function data() {
                    return {
                        show: showLoad
                    };
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
            return Vue.prototype.$loading(tips, type);
        };
    });
};
//module.exports = Toast;
'use strict';

var Toptips = {};
var showToptips = false,
    // 存储Toptips显示状态
showLoad = false,
    // 存储loading显示状态
ToptipsVM = null,
    // 存储Toptips vm
loadNode = null; // 存储loading节点元素

Toptips.install = function (Vue, options) {
    var opt = {
        defaultType: 'center',
        height: '0',
        duration: '3000',
        wordWrap: false,
        tipType: 'info'
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
        var tmp = '<div  :class="type" class="ic-toptips ' + wordWrap + '" ' + style + '><div class="ic-toptips-notice" :style="{ height: height}"><div class="ic-toptips-notice-content">' + iconTmp + '{{tip}}</div></div></div>';
        var duration = type && type.duration ? type.duration : opt.duration;

        if (showToptips) {
            // 如果Toptips还在，则不再执行
            return;
        }
        if (!ToptipsVM) {
            var ToptipsTpl = Vue.extend({
                data: function data() {
                    return {
                        show: showToptips,
                        tip: tips,
                        height: height,
                        tipType: tipType,
                        iconSuccess: 'nc-icon nc-check-circle-08 success',
                        type: 'ic-toptips-' + curType
                    };
                },
                template: tmp
            });
            ToptipsVM = new ToptipsTpl();
            var tpl = ToptipsVM.$mount().$el;
            document.body.appendChild(tpl);
        }
        setTimeout(function () {
            ToptipsVM.height = '60px';
        }, 300);
        ToptipsVM.type = 'ic-Toptips-' + curType;
        ToptipsVM.tip = tips;
        ToptipsVM.show = showToptips = true;
        ToptipsVM.tipType = tipType;
        ToptipsVM.iconSuccess = ToptipsVM.tipType == 'info' ? '' : ToptipsVM.tipType == 'success' ? 'nc-check-circle-08 success' : 'nc-circle-bold-remove error';

        setTimeout(function () {
            ToptipsVM.height = 0;
            ToptipsVM.show = showToptips = false;
        }, duration);
    };
    ['bottom', 'center', 'top'].forEach(function (type) {
        Vue.prototype.$toptips[type] = function (tips) {
            return Vue.prototype.$toptips(tips, type);
        };
    });
};
//module.exports = Toptips;
"use strict";

var updataSubAlert = {
    // <div class="item">
    //         <div class="subItemTitle"> • 是否只看校招</div>
    //         <ul class="wrapper">
    //           <li @click="_createSubItemId(3, 0)" :class="{ active: only_school == 0 }">不限</li>
    //           <li @click="_createSubItemId(3, 1)" :class="{ active: only_school == 1 }">只看校招</li>
    //         </ul>
    //       </div>
    //       <div class="item">
    //         <div class="subItemTitle"> • 是否只看内推</div>
    //         <ul class="wrapper">
    //           <li @click="_createSubItemId(4, 0)" :class="{ active: only_referral == 0 }">不限</li>
    //           <li @click="_createSubItemId(4, 1)" :class="{ active: only_referral == 1 }">只看内推</li>
    //         </ul>
    //       </div>
    //   <div class="item">
    // <div class="subItemTitle" style="display:none"> • 订阅推送的频率：</div>
    // <ul class="wrapper" style="display:none">
    // <li :class="{ active: job_remind_val === 1 }" @click="_createSubItemId(5, 1)">每天</li>
    // <!--<li :class="{ active: job_remind_val === 3 }" @click="_createSubItemId(5, 3)">每三天</li>
    // <li :class="{ active: job_remind_val === 7 }"@click="_createSubItemId(5, 7)">每周</li>
    // -->
    // </ul>
    // </div>
    // </div>
    template: "\n  <div class=\"ice_alert subscribeAlert\" v-show=\"updataSubscribeState\" style=\"display:none\">\n  <div class=\"content\">\n  <i class=\"nc-icon nc-simple-remove\" @click=\"_closeSubscribe\"></i>\n  <div v-show=\"updataSubStepCurrent === 0 || updataSubStepCurrent === 1 ||updataSubStepCurrent === 2 ||updataSubStepCurrent === 3\">\n  <span class=\"title\">\u4FEE\u6539\u6211\u7684\u4E13\u5C5E\u8BA2\u9605</span>\n  <Steps :current=\"updataSubStepCurrent\" class=\"subSteps\">\n  <Step title=\"\" content=\"\"></Step>\n  <Step title=\"\" content=\"\"></Step>\n  <Step title=\"\" content=\"\"></Step>\n   <Step title=\"\" content=\"\"></Step>\n  </Steps>\n  </div>\n\n  <div class=\"subscribeItem subscribeItem_updata\" v-show=\"updataSubStepCurrent === 0\">\n  <div class=\"subItemTitle\"> \u2022 \u884C\u4E1A\u7C7B\u522B\uFF1A</div>\n  <ul class=\"wrapper\">\n  <li v-for=\"(item, index) in subscribeIdustryData\" :class=\"{ 'active': item.selected, 'unlimited': index == 0 }\" @click=\"_createSubItemId(0, item.id, subscribeIdustryData, index)\">{{item.name}}</li>\n  </ul>\n  </div>\n\n  <div class=\"subscribeItem subscribeItem_updata\" v-show=\"updataSubStepCurrent === 1\">\n  <div class=\"subItemTitle\"> \u2022 \u5DE5\u4F5C\u57CE\u5E02\uFF1A</div>\n  <ul class=\"wrapper\">\n  <li v-for=\"(item, index) in cityData\" :class=\"{ 'active': item.selected, 'unlimited': index == 0 }\" @click=\"_createSubItemId(1, item.id, cityData, index)\">{{item.name}}</li>\n  </ul>\n  </div>\n\n    <div class=\"subscribeItem\" v-show=\"updataSubStepCurrent === 2\">\n      <div class=\"subItemTitle\"> \u2022 \u804C\u4F4D\u7C7B\u522B\uFF1A</div>\n      <ul class=\"wrapper\">\n        <li v-for=\"(item, index) in positionsData\" :class=\"{ 'active': item.selected, 'unlimited': index == 0 }\" @click=\"_createSubItemId(2, item.id, positionsData, index)\">{{item.name}}</li>\n      </ul>\n    </div>\n\n  <div class=\"subscribeItem subscribeItem_updata radio\" v-show=\"updataSubStepCurrent === 3\">\n  <div class=\"item\">\n  <div class=\"subItemTitle\"> \u2022 \u804C\u4F4D\u6027\u8D28\uFF1A</div>\n  <ul class=\"wrapper\">\n  <li v-for=\"(item, index) in jobTypeData\" :class=\"{ 'active': item.selected }\" @click=\"_createSubItemId(3, item.id, jobTypeData, index)\">{{item.name}}</li>\n  </ul>\n  </div>\n\n  <div class=\"item\">\n  <div class=\"subItemTitle\" style=\"display:none\"> \u2022 \u8BA2\u9605\u63A8\u9001\u7684\u9891\u7387\uFF1A</div>\n  <ul class=\"wrapper\" style=\"display:none\">\n  <li :class=\"{ active: job_remind_val === 1 }\" @click=\"_createSubItemId(6, 1)\">\u6BCF\u5929</li>\n  </ul>\n  </div>\n  </div>\n\n    <div class=\"subscribeItem\" v-show=\"is_follow && updataSubStepCurrent === 4 && is_created_success\">\n      <div class=\"current3\">\n        <i class=\"okIcon nc-icon nc-check-circle-08\"></i>\n        <div class=\"message\">\u8BA2\u9605\u6210\u529F</div>\n        <p class=\"about\">\u6211\u4EEC\u4F1A\u6839\u636E\u4F60\u7684\u8BA2\u9605\u5185\u5BB9\uFF0C\u6BCF\u5929\u63A8\u9001\u6700\u65B0\u804C\u4F4D\u7ED9\u4F60\u3002\u5982\u9700\u5173\u95ED\u63A8\u9001\u670D\u52A1\u53EF\u5728\u300C\u901A\u77E5\u8BBE\u7F6E\u300D\u91CC\u8FDB\u884C\u4FEE\u6539\u3002</p>\n      </div>\n    </div>\n\n    <div class=\"subscribeItem\" v-show=\"!is_follow && updataSubStepCurrent === 4\">\n      <div class=\"current3\">\n        <img class=\"qrCodeImg\" data-rjs='2' src=\"/static/icebear2018/src/images/qr/baixiongxiaozhushou.png\" alt=\"\u767D\u718A\u5C0F\u52A9\u624B\"/>\n        <p class=\"about\">\u5173\u6CE8\u516C\u4F17\u53F7\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D\uFF0C\u6211\u4EEC\u5C06\u6839\u636E\u4F60\u7684\u5B9A\u5236\u63A8\u9001\u6700\u65B0\u7684\u804C\u4F4D\u7ED9\u4F60\u3002</p>\n        <p class=\"tips\" v-show=\"not_follow_tips\">*\u8BA2\u9605\u5931\u8D25\uFF0C\u8BF7\u5173\u6CE8\u516C\u4F17\u53F7</p>\n      </div>\n    </div>\n\n    <div class=\"btnWrapper\">\n      <button class=\"btn-circle btn-primary\" v-show=\"createSub_closeBtn_show\"  @click=\"_subStepNext()\">\u4E0B\u4E00\u6B65</button>\n    </div>\n    <div class=\"btnGroup\">\n      <button class=\"btn-circle btn-primary prev\" v-show=\"createSub_prevBtn_show\" @click=\"_subStepPrev()\">\u4E0A\u4E00\u6B65</button>\n      <button class=\"btn-circle btn-primary next\" v-show=\"createSub_nextBtn_show\" @click=\"_subStepNext()\">\u4E0B\u4E00\u6B65</button>\n    </div>\n  </div>\n  </div>\n  </div>",
    props: {
        updataSubscribeState: {
            type: Boolean,
            default: false
        }
    },
    data: function data() {
        return {
            updataSubStepCurrent: 0,
            createSub_closeBtn_show: true,
            createSub_prevBtn_show: false,
            createSub_nextBtn_show: false,
            createSub_finishBtn_show: false,
            only_school: 0,
            only_referral: 0,
            job_remind_val: 1,
            subStateAlertShow: false, //订阅弹窗的显示状态
            subAlertState: 1,
            is_follow: false, //是否已关注
            not_follow_tips: false, //未关注提示
            is_created_success: false, //订阅是否成功
            //订阅的行业、城市数据
            subscribeIdustryData: [{
                id: 0,
                name: "不限",
                selected: 0
            }],
            cityData: [{
                id: 0,
                name: "不限",
                selected: 0
            }],
            jobTypeData: [{
                id: 0,
                name: "不限",
                selected: 0
            }],
            positionsData: [{
                id: 0,
                name: "不限",
                selected: 0
            }],
            //修改订阅的相关id值
            updataSubItemsId: {
                idu: [],
                city: [],
                position: [],
                school: 0,
                int_push: 0,
                push_fre: 1,
                job_type: 0
            }
        };
    },

    watch: {
        updataSubStepCurrent: function updataSubStepCurrent(newCurrent) {
            // if (newCurrent === 0) {
            //     this.createSub_closeBtn_show = true
            //     this.createSub_prevBtn_show = false
            //     this.createSub_nextBtn_show = false
            //     this.createSub_finishBtn_show = false
            // } else if (newCurrent === 1) {
            //     this.createSub_closeBtn_show = false
            //     this.createSub_prevBtn_show = true
            //     this.createSub_nextBtn_show = true
            //     this.createSub_finishBtn_show = false
            // } else if (newCurrent === 2) {
            //     this.createSub_closeBtn_show = false
            //     this.createSub_prevBtn_show = true
            //     this.createSub_nextBtn_show = false
            //     this.createSub_finishBtn_show = true
            // }
            if (newCurrent === 0) {
                this.createSub_closeBtn_show = true;
                this.createSub_prevBtn_show = false;
                this.createSub_nextBtn_show = false;
                this.createSub_finishBtn_show = false;
            } else if (newCurrent === 1 || newCurrent === 2 || newCurrent === 3) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = true;
                this.createSub_nextBtn_show = true;
                this.createSub_finishBtn_show = false;
            } else if (newCurrent === 4 && this.is_follow) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = false;
                this.createSub_nextBtn_show = false;
                this.createSub_finishBtn_show = true;
            } else if (newCurrent === 4 && !this.is_follow) {
                this.createSub_closeBtn_show = false;
                this.createSub_prevBtn_show = true;
                this.createSub_nextBtn_show = true;
                this.createSub_finishBtn_show = false;
            }
        },
        updataSubscribeState: function updataSubscribeState(newState) {
            if (newState == true) {
                this.getUpdataSubData();
            }
        }
    },
    methods: {
        //获取订阅数据
        get_subData: function get_subData() {
            var _this = this;
            post('/job/my_subscribe', {}, function (res) {
                if (res.code == 1) {
                    _this.only_school = res.data.job_subscribe.only_school;
                    _this.only_referral = res.data.job_subscribe.only_referral;
                    _this.job_remind_val = res.data.job_subscribe.job_remind_val;
                }
            }, function (res) {
                console.log(res);
            });
        },
        _subStepNext: function _subStepNext() {
            // if (this.updataSubStepCurrent == 3 && this.is_follow) {
            //     console.log('执行完成订阅')
            //     this.not_follow_tips = false
            //     this._finishUpdataSub() //执行完成订阅
            // }
            if (this.updataSubStepCurrent == 3) {
                //console.log('查询订阅状态 3')
                this.getUserFollow();
            }
            if (this.updataSubStepCurrent == 4) {
                //console.log('查询订阅状态 4')
                this.getUserFollow();
            }
            if (this.updataSubStepCurrent == 4) {
                return;
            } else {
                this.updataSubStepCurrent++;
            }
        },
        _subStepPrev: function _subStepPrev() {
            if (this.updataSubStepCurrent == 0) {
                return;
            } else {
                this.updataSubStepCurrent--;
            }
        },

        //关闭订阅弹窗
        _closeSubscribe: function _closeSubscribe() {
            var _this = this;

            this.updataSubStepCurrent = 0;
            this.updataSubscribeState = false;

            Vue.nextTick(function () {
                _this._events.getsubstate[0](false);
            });
        },

        //获取修改订阅的行业、城市等数据
        getUpdataSubData: function getUpdataSubData(ids) {
            var _this = this;

            if (_this.subscribeIdustryData.length === 1) {
                post('/job/my_subscribe', {}, function (res) {
                    if (res.code == 1) {
                        res.data.job_subscribe.industrys.forEach(function (item) {
                            _this.subscribeIdustryData.push(item);
                        });

                        res.data.job_subscribe.citys.forEach(function (item) {
                            _this.cityData.push(item);
                        });

                        res.data.job_subscribe.job_type.forEach(function (item) {
                            _this.jobTypeData.push(item);
                        });

                        res.data.job_subscribe.positions.forEach(function (item) {
                            _this.positionsData.push(item);
                        });
                        //_this.is_follow = res.data.is_follow_weixin
                        //_this.is_follow = true
                        _this.filterSelected(_this.subscribeIdustryData, 0);
                        _this.filterSelected(_this.cityData, 1);
                        _this.filterSelected(_this.positionsData, 2);
                        _this.filterSelected(_this.jobTypeData, 3);
                    }
                }, function (res) {
                    _this.$toast('服务器错误，请重试。', {
                        iconType: 'error'
                    });
                });
            }
        },

        //判断是否有选中的
        filterSelected: function filterSelected(datas, index) {
            var _this = this;
            switch (index) {
                case 0:
                    datas.forEach(function (item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.idu.push(item.id)
                            _this.updataSubItemsId.idu[item.id] = item.id;
                        }
                    });
                    if (_this.updataSubItemsId.idu.length === 0) {
                        _this.subscribeIdustryData[0].selected = 1;
                        _this.updataSubItemsId.idu = 0;
                    }
                    break;
                case 1:
                    datas.forEach(function (item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.city.push(item.id)
                            _this.updataSubItemsId.city[item.id] = item.id;
                        }
                    });
                    if (_this.updataSubItemsId.city.length === 0) {
                        _this.cityData[0].selected = 1;
                        _this.updataSubItemsId.city = 0;
                    }
                    //console.log(_this.updataSubItemsId.city)
                    break;
                case 2:
                    datas.forEach(function (item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.city.push(item.id)
                            _this.updataSubItemsId.position[item.id] = item.id;
                        }
                    });
                    if (_this.updataSubItemsId.position.length === 0) {
                        _this.positionsData[0].selected = 1;
                        _this.updataSubItemsId.position = 0;
                    }
                    break;
                case 3:
                    datas.forEach(function (item) {
                        if (item.selected == 1) {
                            _this.updataSubItemsId.job_type = item.id;
                        }
                    });
                    if (_this.updataSubItemsId.job_type === 0) {
                        _this.jobTypeData[0].selected = 1;
                        _this.updataSubItemsId.job_type = 0;
                    }
                    break;
            }
        },
        _createSubItemId: function _createSubItemId(index, id) {
            var relData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
            var i = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

            var data = this.updataSubItemsId;
            switch (index) {
                case 0:
                    if (id == 0) {
                        data.idu = 0; //修改post数组
                        //修改页面data
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    } else {
                        data.idu.length > 1 ? '' : data.idu = [];
                        if (data.idu[id] != id) {
                            data.idu[id] = id;
                            relData[0].selected = 0;
                            relData[i].selected = 1;
                            //console.log(data)
                        } else {
                            data.idu[id] = '';
                            relData[i].selected = 0;
                            if (data.idu.length === 0) {
                                data.idu = 0;
                                relData[0].selected = 1;
                            }
                        }
                    }
                    this.subscribeIdustryData = relData;
                    break;
                case 1:
                    if (id == 0) {
                        data.city = 0; //修改post数组
                        //修改页面data
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    } else {
                        data.city.length > 1 ? '' : data.city = [];
                        if (data.city[id] != id) {
                            data.city[id] = id;
                            relData[0].selected = 0;
                            relData[i].selected = 1;
                        } else {
                            data.city[id] = '';
                            relData[i].selected = 0;
                            if (data.city.length === 0) {
                                data.city = 0;
                                relData[0].selected = 1;
                            }
                        }
                    }
                    this.cityData = relData;
                    break;
                case 2:
                    if (id == 0) {
                        data.position = 0; //修改post数组
                        //修改页面data
                        relData.forEach(function (el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1;
                        });
                    } else {
                        data.position.length > 1 ? '' : data.position = [];
                        if (data.position[id] != id) {
                            data.position[id] = id;
                            relData[0].selected = 0;
                            relData[i].selected = 1;
                        } else {
                            data.position[id] = '';
                            relData[i].selected = 0;
                            if (data.position.length === 0) {
                                data.position = 0;
                                relData[0].selected = 1;
                            }
                        }
                    }
                    this.positionsData = relData;
                    break;
                case 3:
                    data.job_type = id;
                    relData.forEach(function (el, ind) {
                        if (ind != i) {
                            el.selected = 0;
                        } else {
                            el.selected = 1;
                        }
                    });
                    this.jobTypeData = relData;
                    break;
                // case 2:
                //     data.position = id;
                //     relData.forEach(function(el, ind) {
                //         if (ind != i) {
                //             el.selected = 0
                //         } else {
                //             el.selected = 1
                //         }
                //     })
                //     this.positionData = relData;
                //     break;
                case 4:
                    this.only_school = id;
                    data.school = id;
                    break;
                case 5:
                    this.only_referral = id;
                    data.int_push = id;
                    break;
                case 6:
                    this.job_remind_val = id;
                    data.push_fre = id;
                    break;
            }
            this.updataSubItemsId = data;
            //console.log(this.updataSubItemsId)
        },

        //完成修改
        _finishUpdataSub: function _finishUpdataSub() {
            var _this = this;

            this.updataSubStepCurrent = 0;

            Vue.nextTick(function () {
                _this._events.getsubstate[0](false);
            });

            this.updataSub_data();

            //console.log('修改订阅：')
            //console.log(this.updataSubItemsId)
        },

        //过滤空数值
        filterNull: function filterNull(arr) {
            // 注：IE9(不包含IE9)以下的版本没有trim()方法
            // var r = arr.filter(function (s) {
            //  return s && s.trim();
            // });
            return arr.filter(function (val) {
                return !(!val || val === "");
            });
        },

        //保存修改订阅的数据
        updataSub_data: function updataSub_data() {
            var updataSubItemsId = this.updataSubItemsId;
            var data = {};
            var _this = this;

            data.act = 'update';
            data.city_ids = updataSubItemsId.city.length > 1 ? _this.filterNull(updataSubItemsId.city) : updataSubItemsId.city;
            data.industry_ids = updataSubItemsId.idu.length > 1 ? _this.filterNull(updataSubItemsId.idu) : updataSubItemsId.idu;
            data.job_type = updataSubItemsId.job_type;
            data.only_school = updataSubItemsId.school;
            data.only_referral = updataSubItemsId.int_push;
            data.job_remind_val = updataSubItemsId.push_fre;
            data.position_ids = updataSubItemsId.position.length > 1 ? _this.filterNull(updataSubItemsId.position) : updataSubItemsId.position;

            post('/job/my_subscribe', data, function (res) {
                _this._closeSubscribe();
                if (res.code === 1) {
                    if (res.data.subscribe_txt.split('|').length > 0) {
                        _this._events.getmysubcontent[0](res.data.subscribe_txt.split('|').join(' | '));
                    } else {
                        _this._events.getmysubcontent[0](res.data.subscribe_txt);
                    }
                    _this.$toast('修改成功', {
                        iconType: 'success'
                    });
                } else {
                    _this.$toast(res.msg, {
                        iconType: 'error'
                    });
                }
            }, function (res) {
                _this.$toast('服务器有错误，请重试。', {
                    iconType: 'error'
                });
            });
        },
        getUserFollow: function getUserFollow() {
            var _this = this;
            post('/job/my_subscribe', {}, function (res) {
                if (res.code == 1) {
                    //console.log(res)
                    _this.is_follow = res.data.is_follow_weixin ? true : false;
                    _this.is_follow ? _this.not_follow_tips = false : _this.not_follow_tips = true;
                    if (_this.is_follow) {
                        _this.not_follow_tips = false;
                        _this._finishUpdataSub(); //执行完成订阅
                    }
                }
            });
        }
    },
    created: function created() {
        this.get_subData();
    },
    mounted: function mounted() {}
};
'use strict';

var userWindow = {
  template: '\n  <div class="userWindow" v-if="loginStatus">\n    <img class="useAvater" :src="userMessage.avaterurl" alt="">\n    <div class="userName">{{ userMessage.name }}</div>\n    <div class="vip" v-show="userMessage.vip">{{ userMessage.vip }}</div>\n    <div class="about">\n      <a :href="item.url ? item.url : \'javascript:void(0)\'" class="item" v-for="item in userMessage.about">\n        <div class="number">{{ item.number }}</div>\n        <span class="text">{{ item.title }}</span>\n      </a>\n    </div>\n  </div>\n  <div class="userWindow-loginAlert loginAlert" v-else>\n    <slot></slot>\n    <img class="weixinImg" :src="global.loginCodeImg" alt="">\n    <div class="about">\n      <p>\u5FAE\u4FE1\u626B\u7801\u5173\u6CE8\u300C\u767D\u718A\u5C0F\u52A9\u624B\u300D</p>\n      <p>\u8FDB\u884C\u767B\u5F55/\u6CE8\u518C</p>\n    </div>\n  </div>',
  props: {
    loginStatus: '',
    userMessage: {
      type: Object,
      default: {}
    }
  },
  created: function created() {}
};