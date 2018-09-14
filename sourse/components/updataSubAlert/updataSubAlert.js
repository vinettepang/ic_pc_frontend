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
    template: `
  <div class="ice_alert subscribeAlert" v-show="updataSubscribeState" style="display:none">
  <div class="content">
  <i class="nc-icon nc-simple-remove" @click="_closeSubscribe"></i>
  <div v-show="updataSubStepCurrent === 0 || updataSubStepCurrent === 1 ||updataSubStepCurrent === 2 ||updataSubStepCurrent === 3">
  <span class="title">修改我的专属订阅</span>
  <Steps :current="updataSubStepCurrent" class="subSteps">
  <Step title="" content=""></Step>
  <Step title="" content=""></Step>
  <Step title="" content=""></Step>
   <Step title="" content=""></Step>
  </Steps>
  </div>

  <div class="subscribeItem subscribeItem_updata" v-show="updataSubStepCurrent === 0">
  <div class="subItemTitle"> • 行业类别：</div>
  <ul class="wrapper">
  <li v-for="(item, index) in subscribeIdustryData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(0, item.id, subscribeIdustryData, index)">{{item.name}}</li>
  </ul>
  </div>

  <div class="subscribeItem subscribeItem_updata" v-show="updataSubStepCurrent === 1">
  <div class="subItemTitle"> • 工作城市：</div>
  <ul class="wrapper">
  <li v-for="(item, index) in cityData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(1, item.id, cityData, index)">{{item.name}}</li>
  </ul>
  </div>

    <div class="subscribeItem" v-show="updataSubStepCurrent === 2">
      <div class="subItemTitle"> • 职位类别：</div>
      <ul class="wrapper">
        <li v-for="(item, index) in positionsData" :class="{ 'active': item.selected, 'unlimited': index == 0 }" @click="_createSubItemId(2, item.id, positionsData, index)">{{item.name}}</li>
      </ul>
    </div>

  <div class="subscribeItem subscribeItem_updata radio" v-show="updataSubStepCurrent === 3">
  <div class="item">
  <div class="subItemTitle"> • 职位性质：</div>
  <ul class="wrapper">
  <li v-for="(item, index) in jobTypeData" :class="{ 'active': item.selected }" @click="_createSubItemId(3, item.id, jobTypeData, index)">{{item.name}}</li>
  </ul>
  </div>

  <div class="item">
  <div class="subItemTitle" style="display:none"> • 订阅推送的频率：</div>
  <ul class="wrapper" style="display:none">
  <li :class="{ active: job_remind_val === 1 }" @click="_createSubItemId(6, 1)">每天</li>
  </ul>
  </div>
  </div>

    <div class="subscribeItem" v-show="is_follow && updataSubStepCurrent === 4 && is_created_success">
      <div class="current3">
        <i class="okIcon nc-icon nc-check-circle-08"></i>
        <div class="message">订阅成功</div>
        <p class="about">我们会根据你的订阅内容，每天推送最新职位给你。如需关闭推送服务可在「通知设置」里进行修改。</p>
      </div>
    </div>

    <div class="subscribeItem" v-show="!is_follow && updataSubStepCurrent === 4">
      <div class="current3">
        <img class="qrCodeImg" data-rjs='2' src="/static/icebear2018/src/images/qr/baixiongxiaozhushou.png" alt="白熊小助手"/>
        <p class="about">关注公众号「白熊小助手」，我们将根据你的定制推送最新的职位给你。</p>
        <p class="tips" v-show="not_follow_tips">*订阅失败，请关注公众号</p>
      </div>
    </div>

    <div class="btnWrapper">
      <button class="btn-circle btn-primary" v-show="createSub_closeBtn_show"  @click="_subStepNext()">下一步</button>
    </div>
    <div class="btnGroup">
      <button class="btn-circle btn-primary prev" v-show="createSub_prevBtn_show" @click="_subStepPrev()">上一步</button>
      <button class="btn-circle btn-primary next" v-show="createSub_nextBtn_show" @click="_subStepNext()">下一步</button>
    </div>
  </div>
  </div>
  </div>`,
    props: {
        updataSubscribeState: {
            type: Boolean,
            default: false
        }
    },
    data() {
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
            is_created_success:false, //订阅是否成功
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
                job_type:0,
            },
        }
    },
    watch: {
        updataSubStepCurrent(newCurrent) {
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
                this.createSub_closeBtn_show = true
                this.createSub_prevBtn_show = false
                this.createSub_nextBtn_show = false
                this.createSub_finishBtn_show = false
            } else if (newCurrent === 1 || newCurrent === 2 || newCurrent === 3) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = true
                this.createSub_nextBtn_show = true
                this.createSub_finishBtn_show = false
            } else if (newCurrent === 4 && this.is_follow) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = false
                this.createSub_nextBtn_show = false
                this.createSub_finishBtn_show = true
            } else if (newCurrent === 4 && !this.is_follow) {
                this.createSub_closeBtn_show = false
                this.createSub_prevBtn_show = true
                this.createSub_nextBtn_show = true
                this.createSub_finishBtn_show = false
            }
        },
        updataSubscribeState(newState) {
            if (newState == true) {
                this.getUpdataSubData()
            }
        }
    },
    methods: {
        //获取订阅数据
        get_subData() {
            let _this = this
            post('/job/my_subscribe', {}, function(res) {
                if (res.code == 1) {
                    _this.only_school = res.data.job_subscribe.only_school
                    _this.only_referral = res.data.job_subscribe.only_referral
                    _this.job_remind_val = res.data.job_subscribe.job_remind_val
                }
            }, function(res) {
                console.log(res)
            })
        },
        _subStepNext() {
            // if (this.updataSubStepCurrent == 3 && this.is_follow) {
            //     console.log('执行完成订阅')
            //     this.not_follow_tips = false
            //     this._finishUpdataSub() //执行完成订阅
            // }
            if (this.updataSubStepCurrent == 3){
                //console.log('查询订阅状态 3')
                this.getUserFollow()
            }
            if (this.updataSubStepCurrent == 4){
                //console.log('查询订阅状态 4')
                this.getUserFollow()
            }
            if (this.updataSubStepCurrent == 4) {
                return
            } else {
                this.updataSubStepCurrent++
            }
        },
        _subStepPrev() {
            if (this.updataSubStepCurrent == 0) {
                return
            } else {
                this.updataSubStepCurrent--
            }
        },
        //关闭订阅弹窗
        _closeSubscribe() {
            let _this = this

            this.updataSubStepCurrent = 0
            this.updataSubscribeState = false

            Vue.nextTick(function() {
                _this._events.getsubstate[0](false)
            })
        },
        //获取修改订阅的行业、城市等数据
        getUpdataSubData(ids) {
            let _this = this

            if (_this.subscribeIdustryData.length === 1) {
                post('/job/my_subscribe', {}, function(res) {
                    if (res.code == 1) {
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
                        //_this.is_follow = res.data.is_follow_weixin
                        //_this.is_follow = true
                        _this.filterSelected(_this.subscribeIdustryData, 0)
                        _this.filterSelected(_this.cityData, 1)
                        _this.filterSelected(_this.positionsData, 2)
                        _this.filterSelected(_this.jobTypeData, 3)
                    }
                }, function(res) {
                    _this.$toast('服务器错误，请重试。', {
                        iconType: 'error'
                    })
                })
            }

        },
        //判断是否有选中的
        filterSelected(datas, index) {
            let _this = this
            switch (index) {
                case 0:
                    datas.forEach(function(item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.idu.push(item.id)
                            _this.updataSubItemsId.idu[item.id] = item.id
                        }
                    })
                    if (_this.updataSubItemsId.idu.length === 0) {
                        _this.subscribeIdustryData[0].selected = 1
                        _this.updataSubItemsId.idu = 0
                    }
                    break;
                case 1:
                    datas.forEach(function(item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.city.push(item.id)
                            _this.updataSubItemsId.city[item.id] = item.id
                        }
                    })
                    if (_this.updataSubItemsId.city.length === 0) {
                        _this.cityData[0].selected = 1
                        _this.updataSubItemsId.city = 0
                    }
                    //console.log(_this.updataSubItemsId.city)
                    break;
                case 2:
                    datas.forEach(function(item) {
                        if (item.selected == 1) {
                            //_this.updataSubItemsId.city.push(item.id)
                            _this.updataSubItemsId.position[item.id] = item.id
                        }
                    })
                    if (_this.updataSubItemsId.position.length === 0) {
                        _this.positionsData[0].selected = 1
                        _this.updataSubItemsId.position = 0
                    }
                    break;
                case 3:
                    datas.forEach(function(item) {
                        if (item.selected == 1) {
                            _this.updataSubItemsId.job_type = item.id
                        }
                    })
                    if (_this.updataSubItemsId.job_type === 0) {
                        _this.jobTypeData[0].selected = 1
                        _this.updataSubItemsId.job_type = 0
                    }
                    break;
            }
        },
        _createSubItemId(index, id, relData = [], i = 0) {
            let data = this.updataSubItemsId
            switch (index) {
                case 0:
                    if (id == 0) {
                        data.idu = 0 //修改post数组
                        //修改页面data
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    } else {
                        data.idu.length > 1 ? '' : data.idu = []
                        if (data.idu[id] != id) {
                            data.idu[id] = id
                            relData[0].selected = 0
                            relData[i].selected = 1
                            //console.log(data)
                        } else {
                            data.idu[id] = ''
                            relData[i].selected = 0
                            if (data.idu.length === 0) {
                                data.idu = 0
                                relData[0].selected = 1
                            }
                        }
                    }
                    this.subscribeIdustryData = relData
                    break;
                case 1:
                    if (id == 0) {
                        data.city = 0 //修改post数组
                        //修改页面data
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    } else {
                        data.city.length > 1 ? '' : data.city = []
                        if (data.city[id] != id) {
                            data.city[id] = id
                            relData[0].selected = 0
                            relData[i].selected = 1
                        } else {
                            data.city[id] = ''
                            relData[i].selected = 0
                            if (data.city.length === 0) {
                                data.city = 0
                                relData[0].selected = 1
                            }
                        }
                    }
                    this.cityData = relData
                    break;
                case 2:
                    if (id == 0) {
                        data.position = 0 //修改post数组
                        //修改页面data
                        relData.forEach(function(el, ind) {
                            ind ? relData[ind].selected = 0 : relData[ind].selected = 1
                        })
                    } else {
                        data.position.length > 1 ? '' : data.position = []
                        if (data.position[id] != id) {
                            data.position[id] = id
                            relData[0].selected = 0
                            relData[i].selected = 1
                        } else {
                            data.position[id] = ''
                            relData[i].selected = 0
                            if (data.position.length === 0) {
                                data.position = 0
                                relData[0].selected = 1
                            }
                        }
                    }
                    this.positionsData = relData
                    break;
                case 3:
                    data.job_type = id;
                    relData.forEach(function(el, ind) {
                        if (ind != i) {
                            el.selected = 0
                        }else{
                            el.selected = 1
                        }
                    })
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
            this.updataSubItemsId = data
            //console.log(this.updataSubItemsId)
        },
        //完成修改
        _finishUpdataSub() {
            let _this = this

            this.updataSubStepCurrent = 0

            Vue.nextTick(function() {
                _this._events.getsubstate[0](false)
            })

            this.updataSub_data()

            //console.log('修改订阅：')
            //console.log(this.updataSubItemsId)

        },
        //过滤空数值
        filterNull(arr) {
            // 注：IE9(不包含IE9)以下的版本没有trim()方法
            // var r = arr.filter(function (s) {
            //  return s && s.trim();
            // });
            return arr.filter(function(val) {
                return !(!val || val === "");
            });
        },
        //保存修改订阅的数据
        updataSub_data() {
            let updataSubItemsId = this.updataSubItemsId
            let data = {}
            let _this = this

            data.act = 'update'
            data.city_ids = updataSubItemsId.city.length > 1 ? _this.filterNull(updataSubItemsId.city) : updataSubItemsId.city
            data.industry_ids = updataSubItemsId.idu.length > 1 ? _this.filterNull(updataSubItemsId.idu) : updataSubItemsId.idu
            data.job_type = updataSubItemsId.job_type
            data.only_school = updataSubItemsId.school
            data.only_referral = updataSubItemsId.int_push
            data.job_remind_val = updataSubItemsId.push_fre
            data.position_ids = updataSubItemsId.position.length > 1 ? _this.filterNull(updataSubItemsId.position) : updataSubItemsId.position

            post('/job/my_subscribe', data, function(res) {
                _this._closeSubscribe()
                if (res.code === 1) {
                    if (res.data.subscribe_txt.split('|').length > 0) {
                        _this._events.getmysubcontent[0](res.data.subscribe_txt.split('|').join(' | '))
                    } else {
                        _this._events.getmysubcontent[0](res.data.subscribe_txt)
                    }
                    _this.$toast('修改成功', {
                        iconType: 'success'
                    })
                } else {
                    _this.$toast(res.msg, {
                        iconType: 'error'
                    })
                }
            }, function(res) {
                _this.$toast('服务器有错误，请重试。', {
                    iconType: 'error'
                })
            })
        },
        getUserFollow(){
          let _this = this
          post('/job/my_subscribe', {}, function(res) {
              if (res.code == 1) {
                //console.log(res)
                _this.is_follow = res.data.is_follow_weixin ? true : false
                _this.is_follow ? _this.not_follow_tips = false :_this.not_follow_tips = true
                if (_this.is_follow) {
                    _this.not_follow_tips = false
                    _this._finishUpdataSub() //执行完成订阅
                }

              }
          })
        },
    },
    created() {
        this.get_subData()
    },
    mounted() {}
}