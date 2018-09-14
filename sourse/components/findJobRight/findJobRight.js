let findJobRight = {
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
    template: `
  <div class="right">
    <slot></slot>

    <div class="side-box" v-show="createSub_banner">
      <h4 class="box-title">创建求职订阅</h4>
      <div class="v-flex-between box-header">
      <i class="icon-robot nc-icon nc-pencil"></i>
      <span class="right-text">我们会根据你设定，第一时间推送最新职位给你。</span>
      </div>
      <a class="btn-circle btn-secondary full-wd" @click="_createSub_data">点击创建</a>
    </div>

    <div class="ice_alert subscribeAlert createSubAlert" v-show="createSubscribeState" style="display: none" :width="400" height="500">
      <div class="content">
        <i class="nc-icon nc-simple-remove" @click="_closeSubscribe"></i>
        <div v-show="subStepCurrent === 0 || subStepCurrent === 1 ||subStepCurrent === 2 ||subStepCurrent === 3">
          <span class="title">轻松四步完成定制</span>
          <Steps :current="subStepCurrent" class="subSteps">
            <Step title="" content=""></Step>
            <Step title="" content=""></Step>
            <Step title="" content=""></Step>
            <Step title="" content=""></Step>
          </Steps>
        </div>
        <div class="subscribeItem" v-show="subStepCurrent === 0">
          <div class="subItemTitle"> • 行业类别：</div>
          <ul class="wrapper">
            <li v-for="(item, index) in subscribeIdustryData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(0, item.id, subscribeIdustryData, index)">{{item.name}}</li>
          </ul>
        </div>

        <div class="subscribeItem" v-show="subStepCurrent === 1">
          <div class="subItemTitle"> • 工作城市：</div>
          <ul class="wrapper">
            <li v-for="(item, index) in cityData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(1, item.id, cityData, index)">{{item.name}}</li>
          </ul>
        </div>

        <div class="subscribeItem" v-show="subStepCurrent === 2">
          <div class="subItemTitle"> • 职位类别：</div>
          <ul class="wrapper">
            <li v-for="(item, index) in positionsData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(2, item.id, positionsData, index)">{{item.name}}</li>
          </ul>
        </div>

        <div class="subscribeItem radio" v-show="subStepCurrent === 3">
          <div class="item">
            <div class="subItemTitle"> • 职位性质：</div>
            <ul class="wrapper">
              <li v-for="(item, index) in jobTypeData" :class="{ 'active': item.selected }" @click="_createSubItemId(3, item.id, jobTypeData, index)">{{item.name}}</li>
            </ul>
          </div>

          <div class="item" style="display:none">
            <div class="subItemTitle"> • 订阅推送的频率：</div>
            <ul class="wrapper">
              <li :class="{ active: job_remind_val === 1 }" @click="_createSubItemId(6, 1)">每天</li>
              <li :class="{ active: job_remind_val === 3 }" @click="_createSubItemId(6, 3)">每三天</li>
              <li :class="{ active: job_remind_val === 7 }"@click="_createSubItemId(6, 7)">每周</li>
            </ul>
          </div>
        </div>

        <div class="subscribeItem" v-show="is_created_follow && subStepCurrent === 4 && is_created_success">
          <div class="current3">
            <i class="okIcon nc-icon nc-check-circle-08"></i>
            <div class="message">订阅成功</div>
            <p class="about"></p>
          </div>
        </div>

        <div class="subscribeItem" v-show="!is_created_follow && subStepCurrent === 4">
          <div class="current3">
            <img class="qrCodeImg" data-rjs='2' src="/static/icebear2018/src/images/qr/baixiongxiaozhushou.png" alt="白熊小助手"/>
            <p class="about">关注公众号「白熊小助手」，我们将根据你的定制推送最新的职位给你。</p>
            <p class="tips" v-show="not_follow_tips">*订阅失败，请关注公众号</p>
          </div>
        </div>

        <div class="btnWrapper">
          <button class="btn-circle btn-primary" v-show="createSub_closeBtn_show"  @click="_subStepNext()">下一步</button>
          <button class="btn-circle btn-primary finishBtn" v-show="createSub_finishBtn_show" @click="_closeSubscribe">完成订阅</button>
        </div>
        <div class="btnGroup" v-show="!is_created_success">
          <button class="btn-circle btn-primary prev" v-show="createSub_prevBtn_show" @click="_subStepPrev()">上一步</button>
          <button class="btn-circle btn-primary next" v-show="createSub_nextBtn_show" @click="_subStepNext()">下一步</button>
        </div>
      </div>
    </div>

    <div class="subStateAlert" v-show="subStateAlertShow" style="display: none">
      <div class="ice_alert1">
        <div class="content">
          <i class="nc-icon nc-simple-remove" @click="_closeSubStateAlert"></i>
          <div class="ice_assistantAlert" v-if="subAlertState === 0">
            <img class="qRcode" src="/static/icebear2018/src/images/xiaozhushou.png"" alt="">
            <p class="about">关注公众号「白熊小助手」，我们将根据你的订阅推送最新的职位给你。</p>
            <span class="okBtn" @click="_closeSubStateAlert">好的</span>
          </div>

          <div class="sussageAlert" v-if="subAlertState === 1">
            <i class="okIcon nc-icon nc-check-circle-08"></i>
            <div class="message">订阅成功</div>
            <p class="about">我们会根据你的订阅内容，每天推送最新职位给你，如需关闭推送服务可在"通知设置"里进行修改。</p>
            <span class="okBtn" @click="_closeSubStateAlert">好的</span>
          </div>

        </div>
      </div>
    </div>
  </div>`,
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
    data() {
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
            is_created_success:false, //订阅是否成功
            clickNum:0,
            //创建订阅的相关id值
            createSubItemsId: {
                idu: 0,
                city: 0,
                position: 0,
                school: 0,
                int_push: 0,
                push_fre: 1,
                job_type:0,
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
        }
    },
    watch: {
        leftSubIdChange(newChange) {
            this.subData.forEach(function(item) {
                if (item.id == newChange.id) {
                    //console.log(newChange.follow)
                    newChange.follow ? item.sub_state = 1 : item.sub_state = 0
                }
            })
        },
        subStepCurrent(newCurrent) {
            if (newCurrent === 0) {
                this.createSub_closeBtn_show = true
                this.createSub_prevBtn_show = false
                this.createSub_nextBtn_show = false
                this.createSub_finishBtn_show = false
            } else if (newCurrent === 1 || newCurrent === 2 || newCurrent === 3) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = true
                this.createSub_nextBtn_show = true
                this.createSub_finishBtn_show = false
            } else if (newCurrent === 4 && this.is_created_follow) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = false
                this.createSub_nextBtn_show = false
                this.createSub_finishBtn_show = true
            } else if (newCurrent === 4 && !this.is_created_follow) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = true
                this.createSub_nextBtn_show = true
                this.createSub_finishBtn_show = false
            }
        }
    },
    created() {
        if (Vue.prototype.global.getCookie('session_login_token') == 1) {
            this.loginState = true
        } else {
            this.loginState = false
        }
    },
    mounted() {
        this._urlFilter()
        this.createSub_banner_init()
    },
    methods: {
        //获取创建订阅的行业、城市等数据
        getCreateSubData(ids) {
            let _this = this
            if (_this.subscribeIdustryData.length === 1) {
                post('/job/my_subscribe', {}, function(res) {
                    if (res.code == 1) {
                        //console.log(res)
                        res.data.job_subscribe.industrys.forEach(function(item) {
                            _this.subscribeIdustryData.push(item)
                        })

                        res.data.job_subscribe.citys.forEach(function(item) {
                            _this.cityData.push(item)
                        })

                        res.data.job_subscribe.job_type.forEach(function(item) {
                            _this.jobTypeData.push(item)
                        })

                        res.data.job_subscribe.positions.forEach(function(item) {
                            _this.positionsData.push(item)
                        })

                        //_this.is_created_follow = res.data.is_new && res.data.is_follow_weixin ? true : false
                        //_this.is_created_follow = true
                    }
                })
            } else {
                return
            }
        },
        getUserFollow(num){
          let _this = this
          post('/job/my_subscribe', {}, function(res) {
              if (res.code == 1) {
                  //console.log(res)

                  _this.is_created_follow = res.data.is_new && res.data.is_follow_weixin ? true : false
                  if(num == 1){
                    _this.is_created_follow ? _this.not_follow_tips = false :_this.not_follow_tips = true
                  }
                  //console.log(_this.is_created_follow)
                  if (_this.is_created_follow) {
                      _this.not_follow_tips = false
                      _this._finishCreateSub() //执行完成订阅
                  }

              }
          })
        },
        _urlFilter() {
            const _this = this
            Vue.nextTick(function() {
                if (location.pathname.indexOf('findJob_list') === 1) {
                    _this.$refs.mySubscribe.href = './my_findJob.html'
                    _this.$refs.myCollect.href = './my_findJob.html#page=collect'
                } else if (location.pathname.indexOf('my_findJob') === 1) {
                    _this.$refs.mySubscribe.href = 'javascript:void(0)'
                    _this.$refs.myCollect.href = 'javascript:void(0)'
                }
            })
        },
        //点击订阅按钮后弹出的弹窗 关闭
        _closeSubStateAlert() {
            this.subStateAlertShow = false
        },
        _createSub_data() {
            if (this.loginState) {
                this.getCreateSubData()
                this.createSubscribeState = true
            } else {
                header._loginAlertShow()
            }

        },
        _mySubscribe() {
            let hash = location.hash

            this.rigthTabsState = 0
            this._events.createrighttabs[0](this.rigthTabsState)

            if (hash.indexOf('#page') != -1) {
                newHash = hash.replace('page=collect', '')
                location.hash = newHash
            }
        },
        _myCollection() {
            let href = location.href
            this.rigthTabsState = 1
            this._events.createrighttabs[0](this.rigthTabsState)
            if (location.hash == '') {
                location.hash = 'page=collect'
            } else {
                // location.hash = 'page=collect' + location.hash
            }

        },
        _subStepNext() {
            // console.log(this.subStepCurrent)
            // console.log(this.createSub_banner)
            // if (this.createSub_banner && this.subStepCurrent == 3 && this.is_created_follow) {
            //     console.log('执行完成订阅')
            //     this.not_follow_tips = false
            //     this._finishCreateSub() //执行完成订阅
            // }
            if (this.createSub_banner && this.subStepCurrent == 3){
                this.getUserFollow(0)
            }
            if (this.createSub_banner && this.subStepCurrent == 4) {
              this.getUserFollow(1)
            }
            if (this.subStepCurrent == 4) {
                return
            } else {
                this.subStepCurrent++
            }
        },
        _subStepPrev(type) {
            if (this.subStepCurrent == 0) {
                return
            } else {
                this.subStepCurrent--
            }
        },
        //关闭订阅弹窗
        _closeSubscribe() {
            this.subStepCurrent = 0
            this.createSubscribeState = false
        },
        //完成订阅
        _finishCreateSub() {

            //this.subStepCurrent = 0
            //this.createSubscribeState = false

            // console.log('创建订阅：')
            // console.log(this.createSubItemsId)

            this.createSub_banner = false
            this.mySub_banner = true

            this.updataCreateSub_data()

        },
        //保存创建订阅的数据
        updataCreateSub_data() {
            let createSubItemsId = this.createSubItemsId
            let data = {}
            let _this = this

            data.act = 'update'
            data.city_ids = createSubItemsId.city
            data.industry_ids = createSubItemsId.idu
            data.job_type = createSubItemsId.job_type
            data.only_school = createSubItemsId.school
            data.only_referral = createSubItemsId.int_push
            data.job_remind_val = createSubItemsId.push_fre
            data.position_ids = createSubItemsId.position

            post('/job/my_subscribe', data, function(res) {
                if (res.code) {
                    _this.createSub_finishBtn_show = true
                    _this.is_created_success = true
                    _this._events.getsubscribestatus[0](false) //修改父组件订阅状态
                    if (res.data.subscribe_txt.split('|').length > 0) {
                        _this.mySubContent = res.data.subscribe_txt.split('|').join(' | ')
                    } else {
                        _this.mySubContent = res.data.subscribe_txt
                    }
                } else {

                    vm.$toast(res.msg, {
                        iconType: 'error'
                    })
                }
            }, function(res) {
                console.log(res)
            })
        },
        //创建订阅的弹窗初始化
        _createSub(state) {
            this.createSubscribeState = state
            this._resetSubAlert()
        },
        //重置订阅弹窗的按钮
        _resetSubAlert() {
            const items = document.querySelectorAll('.subscribeAlert li')

            items.forEach(function(el, index) {
                if (el.innerText == '不限' || el.innerText == '每天') {
                    addClass(el, 'active')
                } else {
                    removeClass(el, 'active')
                }
            })
        },
        //更新订阅状态
        updataSubState(data) {
            let follow = data.sub_state
            let _this = this

            if (this.loginState) {
                post('/job/tag_flow', {
                    tag_id: data.id,
                    follow: follow ? 0 : 1
                }, function(res) {
                    //console.log(res)
                    if (res.code == 1) {
                        let is_first_time = res.data.is_new
                        let is_follow_weixin = res.data.is_follow_weixin

                        if (is_follow_weixin != 1) {
                            state = 0 //未关注
                        } else if (is_follow_weixin == 1 && is_first_time == 1) {
                            state = 1 //关注公众号且为第一次订阅
                        } else {
                            state = 2 //关注公众号且不为第一次订阅
                        }

                        if (state == 0) {
                            _this.subStateAlertShow = true
                        } else if (state == 1) {
                            _this.subStateAlertShow = true
                        } else if (state == 2) {
                            if (follow) {
                                _this.$toast('取消订阅', {
                                    iconType: 'success'
                                })
                            } else {
                                _this.$toast('订阅成功', {
                                    iconType: 'success'
                                })
                            }
                        }
                    } else {
                        _this.$toast(res.msg, {
                            iconType: 'error'
                        })
                        //console.log(res.msg)
                    }
                }, function(res) {
                    console.log(res)
                })

                data.sub_state ? data.sub_state = 0 : data.sub_state = 1
            } else {
                header._loginAlertShow()
            }

        },
        _createSubItemId(index, id, relData = [], i = 0) {
            let data = this.createSubItemsId
            let selected = ''
            if (relData.length) {
                selected = !relData[i].selected //选中或反选

                relData[i].selected ? relData[i].selected = 0 : relData[i].selected = 1
            }
            switch (index) {
                case 0:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0
                            typeof(data.idu) == "number" ? data.idu = [0]: data.idu = data.idu
                            data.idu[0] ? data.idu.push(id) : data.idu[0] = id
                        } else {
                            data.idu.pop(id)
                            if (data.idu.length === 0) {
                                data.idu = 0
                                relData[0].selected = 1
                            }
                        }
                    } else {
                        data.idu = 0
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    };
                    this.subscribeIdustryData = relData
                    break;
                case 1:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0
                            typeof(data.city) == "number" ? data.city = [0]: data.city = data.city
                            data.city[0] ? data.city.push(id) : data.city[0] = id
                        } else {
                            data.city.pop(id)
                            if (data.city.length === 0) {
                                data.city = 0
                                relData[0].selected = 1
                            }
                        }
                    } else {
                        data.city = 0
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    };
                    this.cityData = relData
                    break;
                case 2:
                    if (id != 0) {
                        if (selected) {
                            relData[0].selected = 0
                            typeof(data.position) == "number" ? data.position = [0]: data.position = data.position
                            data.position[0] ? data.position.push(id) : data.position[0] = id
                        } else {
                            data.position.pop(id)
                            if (data.position.length === 0) {
                                data.position = 0
                                relData[0].selected = 1
                            }
                        }
                    } else {
                        data.position = 0
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    };
                    this.positionsData = relData
                    break;
                case 3:
                    data.job_type = id;
                    relData.forEach(function(el, ind) {
                        if (ind != i) {
                            el.selected = 0
                        }
                    })
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
            this.updataSubItemsId = data
        },
        //编辑我的订阅
        open_updataSub() {
            //console.log('编辑我的订阅！！')
            this._events.openupdatasub[0](true)
        },
        //初始化 是创建订阅还是我的专属订阅
        createSub_banner_init() {

            let _this = this
            if (this.loginState) {
                setTimeout(function() {
                    post('/job/get_my_subscribe', {}, function(res) {
                        //console.log(res)
                        if (res.code == 1) {
                            if (res.data.is_empty) {
                                _this._events.getsubscribestatus[0](true) //修改父组件订阅状态
                                _this.createSub_banner = true
                                _this.mySub_banner = false
                            } else {
                                _this._events.getsubscribestatus[0](false) //修改父组件订阅状态
                                _this.createSub_banner = false
                                _this.mySub_banner = true

                                if (res.data.subscribe_txt.split('|').length > 0) {
                                    _this.mySubContent1 = res.data.subscribe_txt.split('|').join(' | ')
                                } else {
                                    _this.mySubContent1 = res.data.subscribe_txt
                                }
                            }
                        }
                    }, function(res) {
                        console.log(res)
                    })
                }, 20)
            } else {
                _this.createSub_banner = true
                _this.mySub_banner = false
            }

        },
        //未登录弹出登录窗口
        notlogin() {
            if (this.loginState) {
                return
            } else {
                header._loginAlertShow()
            }
        }

    }
}