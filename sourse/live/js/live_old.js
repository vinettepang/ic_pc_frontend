/*
    直播live
*/
var domin_url = window.location.origin;
//var domin_url = 'http://new2018.icebear.me';
//var currenturl = window.location.href;


// 设置Apush的js包的日志级别,调试用
Apush._loglevel = 'info';
// 填阿里云应用的appKey
//var appId = '24733430';
var apushClient;
var vm = new Vue({
    el: '#app',
    data: {
        isWxEnv:false,
        liveLoading:true,
        config: {
            banned: false, //直播禁言
            endLive: false, //关闭直播
            danmu: false, //弹幕状态 - 教师端
            live_room_id: null, //当前直播房间id
        },
        status: {
            live_status: null, //当前直播状态 waiting living
            user_live_status: 0, //用户进入当前直播状态 0未开播 1正常直播 2倒计时 3已结束
            live_start_time: '', //直播间开始时间
            live_start_time_show: '', //直播间开始时间
            get_wx_config: false, //是否获取微信配置
        },
        focusCommentStatus:false,
        timerCount: '15:00', //倒计时
        timer: null,
        swiperImg: null, //预设图片
        presetWallList: [], //预设上墙列表
        wallList: [], //上墙列表
        wallNowList: [], //实时拉取消息列表
        commentList: [], //弹幕评论列表
        questionList: [], //问题区列表
        discussList: [], //讨论区列表
        //teacher_reply_index: null, //当前回复的评论索引
        teacher_reply_id: null, //当前回复的评论id
        replyStatus: false, //全局回复状态
        editText: null, //当前编辑的回复
        addQuestion: false, //回复是否为提问
        startTime: null, //录音开始时间
        endTime: null, //录音结束时间
        recordTime: 0, //录音时长
        recording: false, //是否正在录音
        recorded: false, //录音状态
        recordId: null, //wx返回的recordId
        switch1: null,
        userInfo: [], //用户信息
        editCommentStatus: false,
        footerTabIndex: null,
        commentTabIndex: 0, //讨论区的索引
        commentTab: [{ 'title': '讨论区' }, { 'title': '提问区' }], //讨论区tab
        userActionDiscussIndex: null, //用户点击讨论区进行操作的索引
        userActionQuestionIndex: null, //用户点击提问区进行操作的索引
        userDelDiscussIndex: null, //用户点击讨论区删除
        userDelQuestionIndex: null, //用户点击提问区删除
        commentStatus: false,
        danmuStatus: true,
        listData: null, //当前聊天列表
        visible: false,
        uploadStatus: true,
        isTabsActive: '3',
        swiperStatus: false, //swiper
        swiperIndex: 0, //swiper
        mySwiper: {},
        observer: true, //swiper
        observeParents: true, //swiper
        reviewedStatus: false, //往期精选
        count: 0, //当前处于播放状态的播放器数量
        oContent: {},
        mySwiper: {},
        count: 0, //当前处于播放状态的播放器数量
        playerList: [], //播放器列表
        playerListDom: [], //播放器列表
        nearAudio: null, //最近播放的音频
        audioPlayState: false, //当前播放音频的状态
        audioIndex: -1, //当前播放音频在播放列表里的下标
        audioId: -1, //当前播放音频的下标
        pushConfig: [], //阿里配置
        imgFile: {}, //上传图片
        modal_error: {
            status: false, //错误弹窗
            title: '', //错误弹窗标题
            content: '', //错误弹窗内文
        },
        remindState: false, //新消息状态
        remindHeight: null, //新消息所处高度
        uploadLocalRecordURL: domin_url + '/live/upload_voice',
        localAudioSrc: null
    },
    created() {
        this.getWx()
        this.getWxModel()
    },
    mounted() {
        this.config.live_room_id = parseInt(document.getElementById('live_room_id').value)
        if (!this.config.live_room_id) {
            this.$Message.info('直播间无法获取有效id');
            return
        } else {
            this.getListData()
        }
        this.throttleLoad = this.throttle(() => {
            this.scrollHandler()
        }, 20)
        window.addEventListener('scroll', this.throttleLoad, true)
        if (this.versions().webKit && document.querySelector('.ic-main')) {
            document.querySelector('.ic-main').style.paddingBottom = '60px'
            document.querySelector('.danmu').style.position = 'absolute'
            let clientHeight = document.documentElement.clientHeight
            let realHeight = clientHeight - 56 - 60
            if (document.documentElement && clientHeight &&  realHeight > 858 ){
                document.querySelector('.live_pc_wrap').style.height = realHeight+'px'
            }
        }
        //document.addEventListener('click', this.handleDocumentClick);
    },
    destroyed() {
        window.removeEventListener('scroll', this.throttleLoad)
    },
    computed: {},
    filters: {
        msgTime(timestamp) {
            return vm.timestampToTime(timestamp)
        }
    },
    components: {
        player: player,
        'live-timer': liveTimer
    },
    directives: {
        focus: {
            update: function(el, { value }) {
                if (value) {
                    el.focus()
                }
            }
        }
    },
    watch: {
        presetWallList() {
            this.$nextTick(() => {
                let list = document.querySelector('.talk-container')
                list.scrollTop = list.scrollHeight
            })
        },
    },
    methods: {
        getWxModel(){
            let _ = this
            wx.miniProgram.getEnv(function(res) {
                //alert(res.miniprogram) // true
                if(res.miniprogram){
                    _.isWxEnv = true
                }else{
                    let ua = window.navigator.userAgent.toLowerCase();
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        _.isWxEnv = true
                    }
                }
            })
        },
        //获取wx-sdk配置
        getWx() {
            let that = this

            post('/live/get_jsapi', { url: window.location.href }, '', function(res) {
                //console.log(res)
                if (res.code && res.data) {
                    let data = JSON.parse(res.data)
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                        appId: data.appId, // 必填，公众号的唯一标识
                        timestamp: data.timestamp, // 必填，生成签名的时间戳
                        nonceStr: data.nonceStr, // 必填，生成签名的随机串
                        signature: data.signature, // 必填，签名，见附录1
                        // 所有要调用的 API 都要加到这个列表中
                        jsApiList: [
                            'chooseImage',
                            'uploadImage',
                            'startRecord',
                            'stopRecord',
                            'onVoiceRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice'
                        ]
                    });
                    wx.ready(function() {
                        that.status.get_wx_config = true
                        //console.log('wx ready')
                    });
                    wx.error(function(res) {
                        //console.log('err', res)
                    });
                } else {
                    that.$Message.info(res.msg);
                }
            }, false, false)

        },
        //定位是否提醒用户有新消息
        scrollHandler() {
            //var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
            let ot = document.querySelector('.talk-container')
            if (ot.scrollHeight - ot.scrollTop + 50 >= ot.clientHeight && this.remindState) {
                this.remindState = false
            }
        },
        //直播间状态设置
        roomStatus(res,time) {
            let that = this
            //let getInRoomTime = new Date().getTime();
            let getInRoomTime = res.time
            let liveTime = Date.parse(new Date((that.status.live_start_time).replace(/-/g, '/')))

            switch (that.status.live_status) {
                case 'waiting':
                    that.countdowm(res,time)
                    that.status.live_start_time_show = (new Date(liveTime)).Format("MM月dd日 hh:mm")
                    console.log('直播时间未到...')
                    that.startOverLive(res)
                    break;
                case 'living':
                    that.status.user_live_status = 1
                    that.startOverLive(res)
                    that.$nextTick(function() {
                        that.swiper();
                        // setTimeout(()=>{
                        //     that.swiper();
                        // },100)
                    })
                    console.log('直播正在进行中...')
                    break;
                default:
                    that.startOverLive(res)
                    that.$nextTick(function() {
                        that.swiper();
                    })
                    that.status.user_live_status = 3
                    console.log('直播已结束')
                    break;
            }
        },
        //用户先于开播时间进入 直播间开始直播 拉取预设数据
        startLive(data) {
            //console.log('startLive')
            let that = this;
            that.presetWallList = data.pre_msg //预设上墙数据
            let length = that.presetWallList.length;
            let index = 0;
            that.oContent = document.querySelector('.talk-container');
            //拉取预设数据循环输出
            let wallMsgTimer = setInterval(() => {
                if (length > 0) {
                    Vue.set(that.wallList, index, that.presetWallList[index]);
                    index++;
                    length--;
                    setTimeout(() => {
                        that.oContent.scrollTop = that.oContent.scrollHeight;
                    }, 500);
                } else {
                    clearInterval(wallMsgTimer);
                    that.wallList = that.wallList.concat(data.message_list)
                    that.scrollBottom(that)
                    //直播结束不开启连接
                    if (that.config.endLive) {
                        // console.log('直播已结束，不开启直播连接')
                        // that.$Message.info('直播已结束');
                        // return
                        let postData = {
                            media_type: 'system',
                            msg_content: '直播结束'
                        }
                        that.wallList.push(postData);
                    }
                    that.createClient(); //预设发完后 开启实时连接
                }
            }, 500);
        },

        //超过开播时间才进入房间
        startOverLive(data) {
            //console.log('startOverLive')
            // this.presetWallList = data.pre_msg //预设上墙数据
            // this.wallList = this.presetWallList
            this.wallList = this.wallList.concat(data.message_list)
            for (var i = 0; i < this.wallList.length; i++) {
                if (this.wallList[i].media_type == 'audio') {
                    //console.log(this.wallList[i])
                    this.playerList.push(this.wallList[i])
                }
            }

            //this.commentList = this.commentList.concat(data.discuss_and_question.reverse())
            //console.log(this.playerList)
            //this.scrollBottom(this)
            //直播结束不开启连接
            if (this.config.endLive) {
                let postData = {
                    media_type: 'system',
                    msg_content: '直播结束'
                }
                this.wallList.push(postData);
                // console.log('直播已结束，不开启直播连接')
                // this.$Message.info('直播已结束');
                // return
            }
            if(this.userInfo.user_type != 'student'){
                this.scrollBottom(this)
            }
            this.getPlayerList();
            this.createClient()
        },
        //滚到主消息框最底部
        scrollBottom(that) {
            that.oContent = document.querySelector('.talk-container');
            setTimeout(() => {
                that.oContent.scrollTop = that.oContent.scrollHeight;
            }, 500);
        },
        //拉取所有的数据
        getListData(type) {
            let that = this
            //console.log(that.config.live_room_id)
            let url = '/live/' + that.config.live_room_id
            //console.log(that.getUrlParam('roomid'))
            post(url, { id: that.config.live_room_id }, '加载中', function(res) {
                console.log('直播数据拉取成功...')
                if (res.code) {
                    let liveData = res.data
                    //console.log(res)
                    that.swiperImg = liveData.ppt_list //预设图片
                    that.status.live_start_time = liveData.begin_time //直播状态
                    that.status.live_status = liveData.live_status //直播状态
                    that.config.live_room_id = liveData.id //直播间id
                    that.config.banned = liveData.is_keep_silent ? true : false //直播是否为禁言状态
                    that.config.endLive = liveData.live_status != "living" && liveData.live_status != "waiting" ? true : false //直播是否为已关闭状态
                    that.pushConfig = liveData.push_config //拉取阿里配置
                    that.questionList = liveData.question_area //问题区列表
                    that.discussList = liveData.discuss_area //讨论区列表
                    that.commentList = liveData.discuss_and_question.reverse() //弹幕
                    that.liveLoading = false
                    //当前用户信息
                    that.userInfo = {
                        user_type: typeof(liveData.current_user.user_type) != 'undefined' ? liveData.current_user.user_type : '',
                        //user_type: 'teacher',
                        userHead: typeof(liveData.current_user.headimgurl) != 'undefined' ? liveData.current_user.headimgurl : '',
                        name: typeof(liveData.current_user.nickname) != 'undefined' ? liveData.current_user.nickname : '',
                        uid: typeof(liveData.current_user.id) != 'undefined' ? liveData.current_user.id : ''
                    }
                    //that.swiper(); //加载ppt
                    that.roomStatus(liveData,res.time);
                    //that.liveStatus = liveData.live_status == 'finished' ? false : true;
                    that.userActionMark('enter_room'); //记录用户进入事件
                } else {
                    that.$Message.info('错误: ' + res.msg);
                    return;
                }
            }, false, false)
            //预设上墙数据
            // that.presetWallList = that.listData.filter(function(i){ return i.user_type === 1 ||( i.wall && i.user_type === 'student') });
        },
        //顶部swiper
        swiper() {
            //console.log('swiper')
            this.mySwiper = new Swiper('.swiper-container', {
                pagination: {
                    el: '.swiper-pagination',
                    type: 'fraction',
                },
                navigation: {
                    nextEl: '.my-swiper-button-next',
                    prevEl: '.my-swiper-button-prev',
                },
                //pagination: '.swiper-pagination',
                paginationClickable: true,
                observer: true,
                observeParents: true,
            });
        },
        changeSwiperById(id) {
            let index = this.swiperImg.findIndex(function(item) {
                return item.ppt_id == id;
            });
            this.changeSwiper(index);
        },
        //切换swiper
        changeSwiper(index) {
            this.swiperIndex = index;
            this.mySwiper.slideTo(index);
        },
        //图片放大
        toggleBigPic(e) {
            $('.image').viewer({
                toolbar: false,
                tooltip: false,
                scalable: false,
                navbar: false,
                title: false,
                transition: false
            });
        },
        //倒计时
        countdowm(res,time) {
            let that = this;
            //let nowTime = new Date();
            //let endTime = new Date(timestamp * 1000);
            //let t = endTime.getTime() - nowTime.getTime();
            let liveTime = Date.parse(new Date((that.status.live_start_time).replace(/-/g, '/')))
            //console.log(liveTime)
            let nowTime = new Date(time * 1000).getTime()
            let t = liveTime - nowTime
            //console.log(t)
            let countdownTimer = setInterval(function() {
                t = t-1000;
                 //console.log(t)
                if (t > 0) {
                    let day = Math.floor(t / 86400000);
                    let hour = Math.floor((t / 3600000) % 24);
                    let min = Math.floor((t / 60000) % 60);
                    let sec = Math.floor((t / 1000) % 60);
                    hour = hour < 10 ? "0" + hour : hour;
                    min = min < 10 ? "0" + min : min;
                    sec = sec < 10 ? "0" + sec : sec;
                    if (min < 15) {
                        let format = '';
                        if (day > 0) { format = `${day}天${hour}:${min}:${sec}:`; }
                        if (day <= 0 && hour > 0) { format = `${hour}:${min}:${sec}`; }
                        if (day <= 0 && hour <= 0) { format = `${min}:${sec}`; }
                        that.status.user_live_status = 2
                        that.timerCount = format;
                    } else {
                        that.status.user_live_status = 0
                    }
                } else {
                    clearInterval(countdownTimer)
                    that.$nextTick(function() {
                        setTimeout(() => {
                            that.swiper();
                        }, 100)
                    })
                    //that.startLive(res) //倒计时结束 进入直播状态拉取消息
                    that.status.user_live_status = 1 //倒计时结束 修改用户转态
                    // that._callback();
                }
            }, 1000);
        },
        //发送消息
        sendMsg() {
            this.openEdit(); //关闭编辑
            if (this.editText === '' || this.editText === null) {
                console.log('不能为空');
                return false;
            }
            let url = '/live/send_msg'
            let pushData = {
                uid: this.userInfo.uid,
                msg_content: this.editText,
                live_room_id: this.config.live_room_id,
                is_question: 0,
                media_type: 'rich_text',
                nickname: this.userInfo.name,
                avatar: this.userInfo.userHead,
                user_type: this.userInfo.user_type,
            };

            if (this.addQuestion) {
                pushData.is_question = 1;
            }
            //判断是否为教师端回复提问
            if ((this.teacher_reply_id != null) && (this.userInfo.user_type === 'teacher' || this.userInfo.user_type === 'team')) {
                pushData = []
                pushData = {
                    uid: this.userInfo.uid,
                    msg_content: this.editText,
                    live_room_id: this.config.live_room_id,
                    media_type: 'rich_text',
                    user_type: this.userInfo.user_type,
                    reply_question_id: this.teacher_reply_id
                };
                //console.log(pushData)
                url = '/live/answer'
            }

            if (this.userInfo.user_type === 'teacher' || this.userInfo.user_type === 'team') {
                pushData.ppt_id = this.swiperImg[this.mySwiper.activeIndex].ppt_id
            }
            let that = this
            post(url, pushData, '', function(res) {
                if (res.code) {
                    that.scrollBottom(that)
                } else {
                    that.$Message.info(res.msg);
                }
            }, false, false)
            that.editText = null;
        },
        //教师端 - 关闭底部选项框
        closeFooter() {
            this.footerTabIndex = null
        },
        //教师端 - 底部切换事件
        changeFooterTabs(index) {
            if (this.footerTabIndex === index) {
                this.footerTabIndex = null
            } else if (this.footerTabIndex !== index) {
                this.footerTabIndex = index
            }
        },
        //用户操作记录
        userActionMark(userEvent) {
            let that = this
            let postData = {
                uid: that.userInfo.uid,
                event: userEvent,
                live_room_id: that.config.live_room_id,
                act_uid: that.userInfo.uid,
                user_type: that.userInfo.user_type,
            }
            post('/live/event', postData, '', function(res) {
                if (!res.code) {
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
        },
        //点赞
        likeAction(e, type) {
            let that = this
            let postData = {
                uid: that.userInfo.uid,
                id: e.currentTarget.dataset.mid,
                live_room_id: that.config.live_room_id,
            }
            let index = e.currentTarget.dataset.index
            let like_url = ''
            if (type == 'question') {
                like_url = '/live/question_like'

            } else if (type == 'discuss') {
                like_url = '/live/discuss_like'
            }

            post(like_url, postData, '', function(res) {
                if (res.code) {
                    if (res.data.action == 'like') {
                        if (type == 'question') {
                            that.questionList[index].current_user_is_like = 1
                            //that.questionList[index].like_nums = parseInt(that.questionList[index].like_nums) + 1
                        } else if (type == 'discuss') {
                            that.discussList[index].current_user_is_like = 1
                            //that.discussList[index].like_nums = parseInt(that.discussList[index].like_nums) + 1
                        }
                    } else {
                        if (type == 'question') {
                            that.questionList[index].current_user_is_like = 0
                            //that.questionList[index].like_nums = parseInt(that.questionList[index].like_nums) - 1
                        } else if (type == 'discuss') {
                            that.discussList[index].current_user_is_like = 0
                            //that.discussList[index].like_nums = parseInt(that.discussList[index].like_nums) - 1
                        }
                    }
                } else {
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
        },
        //切换评论/提问框
        changeCommentTab(index) {
            if (this.commentTabIndex !== index) {
                this.commentTabIndex = index
            }
            // if (this.commentTabIndex === index) {
            //     this.commentTabIndex = ''
            // } else if (this.commentTabIndex !== index) {
            //     this.commentTabIndex = index
            // }
        },
        //删除评论
        deleteComment(e) {
            let that = this
            let del_id = e.currentTarget.dataset.id
            let del_type = e.currentTarget.dataset.del
            let postData = {
                id: del_id,
                type: del_type,
                live_room_id: that.config.live_room_id,
            }
            that.$Modal.confirm({
                render: (h) => {
                    return h('p', '确认删除？')
                },
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    post('/live/del_speak', postData, '', function(res) {
                        if (res.code) {
                            if (del_type == 'discuss') {
                                // let index = that.discussList.findIndex(function(item) {
                                //     return item.discuss_id == del_id;
                                // });
                                // that.discussList.splice(index, 1)
                                that.userDelDiscussIndex = ''
                            } else if (del_type == 'question') {
                                // let index = that.questionList.findIndex(function(item) {
                                //     return item.question_id == del_id;
                                // });
                                // that.questionList.splice(index, 1)
                                that.userDelQuestionIndex = ''
                            }
                        } else {
                            that.userDelDiscussIndex = ''
                            that.userDelQuestionIndex = ''
                            that.modal_error.status = true
                            that.modal_error.title = res.msg
                            that.modal_error.content = ''
                            //that.$Message.info(res.msg);
                        }
                    }, false, false)
                },
                onCancel: () => {
                    return
                }
            });
        },

        //用户操作 讨论区问题区右上角操作
        userAction(index, type) {
            switch (type) {
                case 'delete_question':
                    if (this.userDelQuestionIndex === index) {
                        this.userDelQuestionIndex = ''
                    } else if (this.userDelQuestionIndex !== index) {
                        this.userDelQuestionIndex = index
                    }
                    break;
                case 'delete_discuss':
                    if (this.userDelDiscussIndex === index) {
                        this.userDelDiscussIndex = ''
                    } else if (this.userDelDiscussIndex !== index) {
                        this.userDelDiscussIndex = index
                    }
                    break;
                default:
                    this.$Message.info('操作没有获取到id错误');
            }
        },
        //打开编辑
        openEdit() {
            let _ = this
            _.editCommentStatus ? _.editCommentStatus = false : _.editCommentStatus = true;
            setTimeout(function () {
                _.focusCommentStatus =true
            },1500)
        },
        //打开/关闭  评论/问题 浮框
        toggleComment() {
            this.commentStatus ? this.commentStatus = false : this.commentStatus = true;
        },
        //打开/关闭  弹幕 浮框
        danmu() {
            this.danmuStatus ? this.danmuStatus = false : this.danmuStatus = true;
            this.danmuClass ? this.danmuClass = false : this.danmuClass = true;
        },
        //打开/关闭  幻灯片 浮框
        swiperAction() {
            this.swiperStatus ? this.swiperStatus = false : this.swiperStatus = true;
        },
        //教师端 - 撤回
        recall(e) {
            let that = this
            let mid = e.currentTarget.dataset.mid
            let postData = {
                uid: that.userInfo.uid,
                live_room_id: that.config.live_room_id,
                mid: mid,
            };
            that.$Modal.confirm({
                render: (h) => {
                    return h('p', '确认撤回？')
                },
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    post('/live/speak_back', postData, '', function(res) {
                        if (!res.code) {
                            that.modal_error.status = true
                            that.modal_error.title = res.msg
                            that.modal_error.content = ''
                        }
                    }, false, false)
                },
                onCancel: () => {
                    return
                }
            });
        },
        //教师端 - 结束回复提问
        endReply() {
            if (this.replyStatus) {
                let that = this
                let postData = {
                    uid: that.userInfo.uid,
                    msg_content: that.editText,
                    msg_content: '回答完毕',
                    live_room_id: that.config.live_room_id,
                    media_type: 'rich_text',
                    user_type: that.userInfo.user_type,
                    question_id: parseInt(that.teacher_reply_id),
                    is_question_over: 1,
                    reply_question_id: parseInt(that.teacher_reply_id),
                };

                post('/live/answer', postData, '', function(res) {
                    if (res.code) {
                        that.scrollBottom(that)
                        //that.teacher_reply_index = null
                        that.teacher_reply_id = null
                        that.replyStatus = false
                    } else {
                        that.$Message.info('错误: ' + res.msg);
                    }
                }, false, false)
            }
        },
        //教师端 - 回复提问
        replyQuestion(e) {
            let id = e.currentTarget.dataset.id
            let index = e.currentTarget.dataset.index
            //let uid = e.currentTarget.dataset.uid
            let replyed_data = this.questionList[index] //当前回复的问题信息

            this.replyStatus = true;
            if (this.replyStatus && this.teacher_reply_id !== '' && this.teacher_reply_id !== null) {
                console.log('需结束回复...');
                return false;
            } else {
                //this.openEdit(); //打开编辑
                this.toggleComment(); //关闭评论
                //this.teacher_reply_index = index; //记录教师当前回答的问题index
                this.teacher_reply_id = parseInt(id); //记录教师当前回答的问题id
                replyed_data.id = id
                replyed_data.media_type = 'rich_text'
                this.clickReply(replyed_data) //调用post
                //this.questionList[this.teacher_reply_index].is_recommend = 1;
                //this.wallList.push(replyed_data); //将当前问题上墙
            }
        },
        //教师点击回复学生问题
        clickReply(replyed_data) {
            //console.log(replyed_data)
            let that = this
            let postData = {
                uid: parseInt(replyed_data.uid),
                msg_content: replyed_data.msg_content,
                live_room_id: parseInt(that.config.live_room_id),
                media_type: 'rich_text',
                user_type: that.userInfo.user_type,
                question_id: parseInt(replyed_data.id),
                is_recommend: 1,
            };
            post('/live/send_msg', postData, '', function(res) {
                if (res.code) {
                    that.replyStatus = true;
                    //console.log('教师点击回复...')
                } else {
                    that.$Message.info('错误: ' + res.msg);
                    return;
                }
            }, false, false)
        },
        //教师端 - 取消录音
        cancelRecord() {
            let that = this
            that.$Modal.confirm({
                render: (h) => {
                    return h('p', '确认重录？')
                },
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                    that.recorded = false;
                    that.recording = false;
                    that.endTime = 0;
                    that.startTime = 0;
                    that.recordTime = 0;
                },
                onCancel: () => {
                    return
                }
            });
        },
        //教师端 - 开始录音
        startRecord() {
            //console.log('开始录音')
            this.recording = true;
            this.startTime = new Date().getTime();
            let that = this;
            that.recordTimeInterval = setInterval(() => {
                that.recordTime++;
                //console.log(that.recordTime);
            }, 1000);
            wx.startRecord({
                success: function() {
                    wx.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete: function(res) {
                            that.stopRecord('over',res.localId)
                            //alert('最多只能录制一分钟');
                            //console.log(res);
                            //var localId = res.localId;
                            //that.uploadRecord(localId);
                        }
                    });
                },
                cancel: function() {
                    console.log('用户拒绝授权录音');
                    return false;
                }
            });
            wx.onVoiceRecordEnd({
                success: function() {
                    wx.onVoiceRecordEnd({
                        // 录音时间超过一分钟没有停止的时候会执行 complete 回调
                        complete: function(res) {
                            that.stopRecord('over',res.localId)
                            //alert('最多只能录制一分钟');
                            //console.log(res);
                            //var localId = res.localId;
                            //that.uploadRecord(localId);
                        }
                    });
                },
                cancel: function() {
                    return false;
                }
            });

        },
        //教师端 - 停止录音
        stopRecord(type,id) {
            let that = this
            that.endTime = new Date().getTime();
            let recordTime = that.endTime - that.startTime; //录音时间
            clearInterval(that.recordTimeInterval)
            if(type && type =='over'){
                //console.log(type)
                that.recordId = id
                that.recordTime = 60
                that.recorded = true;
                that.recording = false;
                return
            }
            if (recordTime < 2000) {
                that.cancelRecord();
                //wx.stopRecord({});
                alert('录音时间不能少于2秒');
                return false;
                //小于300ms，不录音
            } else {
                that.recorded = true;
                that.recording = false;
                //console.log('成功录音');
                //console.log('recordTime ' + recordTime);
                //console.log('that.recordTime ' + that.recordTime);
                wx.stopRecord({
                    success: function(res) {
                        //alert(res.localId)
                        //localId = res.localId;
                        that.recordId = res.localId
                        //that.recordTime = Math.round(recordTime/1000)
                        that.recordTime = parseInt(recordTime/1000)
                        //that.uploadRecord(localId,recordTime);
                    }
                });
            }
        },
        //教师端 - 上传录音
        uploadRecord(localId, recordTime) {
            //console.log('等待微信配置，目前为上传默认录音');
            let that = this
            wx.uploadVoice({
                localId: that.recordId, // 需要上传的音频的本地ID，由stopRecord接口获得
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function(res) {
                    //alert(res.serverId)
                    var serverId = res.serverId; // 返回音频的服务器端ID
                    post('/live/upload_audio', { media_id: serverId }, '', function(res) {
                        if (res.code) {
                            //alert(JSON.stringify(res.data))
                            that.sendRecord(res.data)
                        } else {
                            that.$Message.info('错误: ' + res.msg);
                        }
                    }, false, false)
                }
            })
        },
        sendRecord(data) {
            let that = this
            let url = '/live/send_msg'
            let postData = {
                uid: that.userInfo.uid,
                live_room_id: that.config.live_room_id,
                audio_src: data.file_url,
                duration: data.duration?data.duration:0,
                media_type: 'audio',
                user_type: that.userInfo.user_type,
                audio_time: data.duration?data.duration:0, //that.recordTime
                ppt_id: that.swiperImg[that.mySwiper.activeIndex].ppt_id
            }
            //判断是否为教师端回复提问
            if ((that.teacher_reply_id != null) && (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team')) {
                postData['reply_question_id'] = that.teacher_reply_id
                //console.log(postData)
                url = '/live/answer'
            }

            if (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team') {
                postData['ppt_id'] = that.swiperImg[that.mySwiper.activeIndex].ppt_id
            }
            //alert(JSON.stringify(postData))
            post(url, postData, '', function(res) {
                //alert(JSON.stringify(res))
                if (res.code) {
                    that.recorded = false;
                    that.recording = false;
                    that.endTime = 0;
                    that.startTime = 0;
                    that.recordTime = 0;
                    that.closeFooter()
                } else {
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
        },
        uploadPicForWx(){
            let that = this
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                success: function(res) {
                    //alert(JSON.stringify(res))
                    var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                    wx.uploadImage({
                        localId: localIds[0], // 需要上传的图片的本地ID，由chooseImage接口获得
                        isShowProgressTips: 1, // 默认为1，显示进度提示
                        success: function(res) {
                            //alert(JSON.stringify(res))
                            // var medias = { 'lid': localIds[0].toString(), 'sid': res.serverId };
                            // $('#img_media').attr('src', medias.lid);
                            post('/index/live/upload_weixin_image', { media_id: res.serverId }, '', function(res) {
                                if (res.code) {
                                    //alert(JSON.stringify(res))
                                    that.sendPicMsg(res.data)
                                } else {
                                    that.modal_error.status = true
                                    that.modal_error.title = '操作失败'
                                    that.modal_error.content = res.msg
                                    //that.$Message.info('错误: ' + res.msg);
                                }
                            }, false, false)
                        },
                        fail: function(res) {
                            that.modal_error.status = true
                            that.modal_error.title = '上传失败'
                            that.modal_error.content = res.msg
                            //alert("上传失败");
                            //alert(JSON.stringify(res));
                        }
                    });
                }
            });
        },
        //教师端 - 上传图片
        uploadPic(e) {
            let that = this
            const files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            const file = files[0]
            const imgMasSize = 1024 * 1024 * 2; // 2MB

            // 检查文件类型
            if (['jpeg', 'png', 'gif', 'jpg'].indexOf(file.type.split("/")[1]) < 0) {
                // 自定义报错方式
                that.modal_error.status = true
                that.modal_error.title = '操作失败'
                that.modal_error.content = '（图片仅支持大小在 2M 内的 jpg、png、gif、jpeg、bmp 格式）'
                //that.$Message.info('文件类型仅支持 jpg/jpeg/png/gif');
                return;
            }

            // 文件大小限制
            if (file.size > imgMasSize) {
                // 文件大小自定义限制
                // that.modal_error.status = true
                // that.modal_error.title = '操作错误'
                // that.modal_error.content = '文件大小不能超过2MB'
                that.modal_error.status = true
                that.modal_error.title = '操作失败'
                that.modal_error.content = '（图片仅支持大小在 2M 内的 jpg、png、gif、jpeg、bmp 格式）'
                //that.$Message.info('文件大小不能超过2MB');
                return;
            }

            // 判断是否是ios
            if (!!window.navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
                // iOS
                that.transformFileToFormData(file);
                return;
            }

            // 图片压缩之旅
            this.transformFileToDataUrl(file);

            // const formData = new FormData();
            // that.$Message.info(formData);
            // if (file) {
            //     formData.append("file", file);
            // }else{
            //     that.$Message.info('未选择图片');
            // }
            // that.uploadImg(formData)

        },
        // 将file转成dataUrl
        transformFileToDataUrl(file) {
            const imgCompassMaxSize = 200 * 1024; // 超过 200k 就压缩

            // 存储文件相关信息
            this.imgFile.type = file.type || 'image/jpeg'; // 部分安卓出现获取不到type的情况
            this.imgFile.size = file.size;
            this.imgFile.name = file.name;
            this.imgFile.lastModifiedDate = file.lastModifiedDate;
            //console.log(this.imgFile)
            // 封装好的函数
            const reader = new FileReader();
            let that = this
            // file转dataUrl是个异步函数，要将代码写在回调里
            reader.onload = function(e) {
                const result = e.target.result;

                if (result.length < imgCompassMaxSize) {
                    that.compress(result, that.processData, false); // 图片不压缩
                } else {
                    that.compress(result, that.processData); // 图片压缩
                }
            };

            reader.readAsDataURL(file);
        },
        // 使用canvas绘制图片并压缩
        compress(dataUrl, callback, shouldCompress = true) {
            const img = new window.Image();

            img.src = dataUrl;
            const imgFile = this.imgFile
            //console.log(imgFile)
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                let compressedDataUrl;

                if (shouldCompress) {
                    compressedDataUrl = canvas.toDataURL(imgFile.type, 0.2);
                } else {
                    compressedDataUrl = canvas.toDataURL(imgFile.type, 1);
                }
                callback(compressedDataUrl);
            }
        },

        processData(dataUrl) {
            // 这里使用二进制方式处理dataUrl
            const binaryString = window.atob(dataUrl.split(',')[1]);
            const arrayBuffer = new ArrayBuffer(binaryString.length);
            const intArray = new Uint8Array(arrayBuffer);
            const imgFile = this.imgFile;

            for (let i = 0, j = binaryString.length; i < j; i++) {
                intArray[i] = binaryString.charCodeAt(i);
            }

            const data = [intArray];

            let blob;
            let that = this
            try {
                blob = new Blob(data, { type: imgFile.type });
            } catch (error) {
                window.BlobBuilder = window.BlobBuilder ||
                    window.WebKitBlobBuilder ||
                    window.MozBlobBuilder ||
                    window.MSBlobBuilder;
                if (error.name === 'TypeError' && window.BlobBuilder) {
                    const builder = new BlobBuilder();
                    builder.append(arrayBuffer);
                    blob = builder.getBlob(imgFile.type);
                } else {
                    throw new Error('版本过低，不支持上传图片');
                    that.$Message.info('版本过低，不支持上传图片');
                }
            }

            // blob 转file
            const fileOfBlob = new File([blob], imgFile.name);
            const formData = new FormData();

            // type
            formData.append('type', imgFile.type);
            // size
            formData.append('size', fileOfBlob.size);
            // name
            formData.append('name', imgFile.name);
            // lastModifiedDate
            formData.append('lastModifiedDate', imgFile.lastModifiedDate);
            // append 文件
            formData.append('file', fileOfBlob);

            this.uploadImg(formData);
        },
        uploadImg(formData) {
            let that = this
            //that.$Message.info(formData);
            $.ajax({
                type: 'POST',
                url: domin_url + '/live/upload_file',
                data: formData,
                contentType: false,
                processData: false,
                mimeType: "multipart/form-data",
                beforeSend: function() {
                    const msg = that.$Message.loading({
                        content: '正在上传图片中...',
                        duration: 0
                    });
                },
                complete: function() { //在success之后就进行
                    that.$Message.destroy()
                },
                success: function(res) {
                    //alert(res.data)
                    res = JSON.parse(res)
                    if (res.code) {
                        that.sendPicMsg(res.data)
                        //that.$Message.info('图片上传成功');
                        //console.log('图片上传成功');
                    } else {
                        that.modal_error.status = true
                        that.modal_error.title = '操作失败'
                        that.modal_error.content = res.msg
                        //that.$Message.info(res.msg);
                    }
                },
                error: function() {
                    //服务器连接失败
                    that.modal_error.status = true
                    that.modal_error.title = '服务器连接失败'
                    that.modal_error.content = ''
                }
            });
        },
        handleSuccess(res, file) {},
        uploadLocalRecord(e) {
            let that = this
            const files = e.target.files || e.dataTransfer.files;
            if (!files.length) return;
            const file = files[0]
            //console.log(file)
            const fileMasSize = 1024 * 1024 * 5; // 5MB

            // 检查文件类型
            // if(['mp3', 'wav'].indexOf(file.type.split("/")[1]) < 0){
            //     // 自定义报错方式
            //     that.modal_error.status =true
            //     that.modal_error.title ='操作失败'
            //     that.modal_error.content ='（音频仅支持 mp3、wav 格式）'
            //     //that.$Message.info('文件类型仅支持 jpg/jpeg/png/gif');
            //     return;
            // }

            // 文件大小限制
            // if(file.size > fileMasSize ) {
            //     // 文件大小自定义限制
            //     that.modal_error.status =true
            //     that.modal_error.title ='操作失败'
            //     that.modal_error.content ='（音频仅支持大小在 5M 内的 mp3、wav 格式）'
            //     //that.$Message.info('文件大小不能超过2MB');
            //     return;
            // }
            // console.log(file)
            const formData = new FormData();
            //formData.append("action", "UploadVMKImagePath");
            formData.append("file", file); //加入文件对象

            $.ajax({
                type: 'POST',
                url: domin_url + '/live/upload_voice',
                data: formData,
                contentType: false,
                processData: false,
                mimeType: "multipart/form-data",
                beforeSend: function() {
                    const msg = that.$Message.loading({
                        content: '正在上传语音中...',
                        duration: 0
                    });
                },
                complete: function() { //在success之后就进行
                    that.$Message.destroy()
                },
                success: function(res) {
                    // console.log(res)
                    res = JSON.parse(res)
                    if (res.code) {
                        that.sendLocalAudioMsg(res.data)
                        // that.footerTabIndex = null
                        // console.log('图片上传成功');
                    } else {
                        that.modal_error.status = true
                        that.modal_error.title = '操作失败'
                        that.modal_error.content = '('+res.data+')'
                        //that.$Message.info(res.msg);
                    }
                },
                error: function(res) {
                    //服务器连接失败
                    that.modal_error.status = true
                    that.modal_error.title = '服务器连接失败'
                    that.modal_error.content = ''
                }
            });
            // post('/live/upload_voice', postData,'', function(res) {
            //     if (res.code) {
            //         that.scrollBottom(that)
            //     } else {
            //         that.$Message.info('错误: ' + res.msg);
            //     }
            // }, false, false)

        },
        // 将File append进 FormData
        transformFileToFormData(file) {
            const formData = new FormData();
            // 自定义formData中的内容
            // type
            formData.append('type', file.type);
            // size
            formData.append('size', file.size || "image/jpeg");
            // name
            formData.append('name', file.name);
            // lastModifiedDate
            formData.append('lastModifiedDate', file.lastModifiedDate);
            // append 文件
            formData.append('file', file);
            // 上传图片
            this.uploadImg(formData);
        },
        sendLocalAudioMsg(data) {
            let that = this
            let url  ='/live/send_msg'
            let postData = {
                uid: that.userInfo.uid,
                live_room_id: that.config.live_room_id,
                audio_src: data.oss_url,
                duration: data.duration?data.duration:0,
                media_type: 'audio',
                user_type: that.userInfo.user_type,
                audio_time: data.duration?data.duration:0,
                ppt_id: this.swiperImg[this.mySwiper.activeIndex].ppt_id
            }
            that.footerTabIndex = null
            //判断是否为教师端回复提问
            if ((that.teacher_reply_id != null) && (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team')) {
                postData['reply_question_id'] = that.teacher_reply_id
                url  ='/live/answer'
            }

            if (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team') {
                postData['ppt_id'] = that.swiperImg[that.mySwiper.activeIndex].ppt_id
            }
            post(url, postData, '', function(res) {
                if (res.code) {
                    that.scrollBottom(that)

                } else {
                    that.modal_error.status = true
                    that.modal_error.title = res.msg
                    that.modal_error.content = ''
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
        },
        sendPicMsg(data) {
            let that = this
            let url = '/live/send_msg'
            let postData = {
                uid: that.userInfo.uid,
                live_room_id: that.config.live_room_id,
                image_src: data,
                media_type: 'image',
                user_type: that.userInfo.user_type,
                ppt_id: this.swiperImg[this.mySwiper.activeIndex].ppt_id
            }
            that.footerTabIndex = null
            if ((that.teacher_reply_id != null) && (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team')) {
                postData['reply_question_id'] = that.teacher_reply_id
                url  ='/live/answer'
            }

            if (that.userInfo.user_type === 'teacher' || that.userInfo.user_type === 'team') {
                postData['ppt_id'] = that.swiperImg[that.mySwiper.activeIndex].ppt_id
            }
            post(url, postData, '', function(res) {
                //alert(res.msg)
                if (res.code) {
                    that.scrollBottom(that)
                } else {
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
        },
        //教师端 - 全局设置 关闭直播
        changeConfigEndLive(status) {
            let that = this
            if (status) {
                that.$Modal.confirm({
                    render: (h) => {
                        return h('p', '确认结束直播？')
                    },
                    okText: '确定',
                    cancelText: '取消',
                    onOk: () => {
                        post('/live/close', { id: that.config.live_room_id }, '', function(res) {
                            if (res.code) {
                                //that.footerTabIndex = null
                                that.$Message.info('已结束直播');
                            } else {
                                that.$Message.info('错误: ' + res.msg);
                            }
                        }, false, false)
                    },
                    onCancel: () => {
                        that.config.endLive = false
                        return
                    }
                });
            }
        },
        //教师端 - 全局设置 关闭回复
        changeConfigBanned(status) {
            let that = this
            let postData = { id: that.config.live_room_id, is_keep_silent: status ? 1 : 0 }

            post('/live/keep_silent', postData, '', function(res) {
                if (res.code) {
                    //that.config.banned = status
                    //console.log(res)
                } else {
                    that.$Message.info('错误: ' + res.msg);
                }
            }, false, false)
            //that.$Message.info('禁言开关状态：' + status);
        },
        //教师端 - 全局设置 关闭弹幕
        changeConfigDanmu(status) {
            this.config.danmu = status
        },
        //从子组件监听count的变化
        _countChange(newCount) {
            this.count = newCount
            //console.log('当前播放的数量：' + this.count)
        },
        //获取播放列表的dom
        getPlayerList() {
            let _this = this;
            this.$nextTick(function() {
                _this.playerListDom = document.querySelectorAll('.talk-container audio')
                //console.log(_this.playerListDom)
            })
        },
        //从player组件获取最近播放的音频
        _nearPlayAudio(newAudio, newId, audioState) {
            let that = this
            // console.log(newAudio)
            // console.log(newId)
            // console.log(audioState)
            that.nearAudio = newAudio
            //that.audioIndex = newIndex
            that.audioId = newId
            that.audioIndex = that.playerList.findIndex(function(item) {
                // console.log(parseInt(item.mid))
                // console.log(parseInt(that.audioId))
                // console.log(parseInt(item.mid) == parseInt(that.audioId))
                return parseInt(item.mid) == parseInt(that.audioId);
            });
            //console.log(that.audioIndex)
            that.audioPlayState = audioState
        },
        //player组件的回调函数
        playerCallBack(pptId) { //imgIndex：顶部banner图的索引
            let ppt_index = this.swiperImg.findIndex(function(item) {
                return item.ppt_id == pptId;
            });
            this.changeSwiper(ppt_index)
        },
        //播放下一段音频
        _audioPlayNext(nowAudio,nowAudioId) {
            this.audioIndex = this.playerList.findIndex(function(item) {
                return parseInt(item.mid) == parseInt(nowAudioId);
            });
            nowAudio.pause();
            if (nowAudioId > -1 && this.audioIndex != this.playerList.length - 1) {
                let _ = this
                // if (_.isWxEnv) {
                //     if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
                //         // _.playerListDom[_.audioIndex + 1].load()
                //         // let nextAudioId = _.playerList[_.audioIndex + 1].mid
                //         // _.playerListDom[_.audioIndex + 1].load();
                //         // document.getElementById("palyerid"+nextAudioId).click()
                //         // document.getElementById("palyerid"+nextAudioId).play()
                //         // document.addEventListener('WeixinJSBridgeReady', function() {
                //         //     document.getElementById("palyerid"+nextAudioId).play();
                //         // }, false);
                //         //return
                //     }else{
                //         _.playerListDom[_.audioIndex + 1].play();
                //     }
                // }else{
                //     _.playerListDom[_.audioIndex + 1].play();
                //     //_.nearAudio = _.playerListDom[_.audioIndex + 1];
                // }
                let nextAudioId = _.playerList[_.audioIndex + 1].mid
                //document.getElementById("palyerid"+nextAudioId).click()
                _.playerListDom[_.audioIndex + 1].play()
                _.playerCallBack(_.playerList[_.audioIndex + 1].ppt_id)
                _.audioIndex++;
                _.audioPlayState = true;
            }
            // if(this.audioIndex >= 0 && this.audioIndex != this.playerList.length - 1){
            //     this.nearAudio.pause();
            //     console.log(this.playerList[this.audioIndex + 1])
            //     this.playerList[this.audioIndex + 1].play();
            //     this.nearAudio = this.playerList[this.audioIndex + 1];
            //     this.audioIndex++;
            //     this.audioPlayState = true;
            // }
        },
        goto() {
            //console.log('goto');
            $('.talk-container').scrollTop();
            var container = this.$el.querySelector(".player_active");
            document.body.scrollTop = 0
            document.documentElement.scrollTop = 0
            var h = container.offsetTop;
            container.offsetTop = 0;
            //console.log(container.offsetTop);
            document.body.scrollTop = container.scrollHeight;
        },
        _callback() {
            if (this.callback && this.callback instanceof Function) {
                this.callback(...this);
            }
        },
        //从子组件监听count的变化
        // _countChange(newCount) {
        //     this.count = newCount
        //     console.log('当前播放的数量：' + this.count)
        // },
        //创建client并订阅用户消息
        createClient() {
            console.log('创建连接...');
            let that = this;
            if (apushClient == null) {
                // 实际使用时请在你自己的app后台中调用apush的getToken方法实现此url
                //var tokenUrl = getUrlBase() + "/demo/getDemoToken.do?appId=9999999999&userId=userTest1";
                let tokenUrl = domin_url + '/index/live/apush_get_token/live_room_id/' + that.config.live_room_id;

                let terminalId = null; //不填则系统生成一个随机字符窜作为terminalId
                let terminalType = null; //不填则系统默认为pc

                //收到消息时的处理方法
                let msgCallback = function(msg) {
                    //console.log(msg)
                    // msgType用于消息分类处理，用户可以在发送消息时设置自定义的msgType，
                    //在收到消息时判断msgType，"reqUnReadMsgCount"、"testMsg"、"tokenExpired"为apush预定义的msgType，请不要使用。
                    if (msg.msgType == "msgTypeTest") {
                        let broadcast = JSON.parse(msg.arg)
                        console.log(broadcast)

                        //是否为老师撤回消息
                        if (broadcast.action_type && broadcast.action_type == 'speak_back') {
                            let recall_index = that.wallList.findIndex(function(item) {
                                return item.mid == broadcast.mid;
                            });
                            that.wallList.splice(recall_index, 1)

                            if (broadcast.question_id && parseInt(broadcast.question_id)) {
                                that.replyStatus = false
                                that.teacher_reply_id = null
                                // let del_q_index = that.questionList.findIndex(function(item) {
                                //     return item.question_id == parseInt(broadcast.question_id);
                                // });
                                // that.questionList.splice(del_q_index, 1)
                            }

                            if (broadcast.media_type == 'audio') {
                                let del_a_index = that.playerList.findIndex(function(item) {
                                    return item.mid == parseInt(broadcast.mid);
                                });
                                that.playerListDom.splice(del_a_index, 1)
                                let del_ad_index = that.playerListDom.findIndex(function(item) {
                                    return item.mid == parseInt(broadcast.mid);
                                });
                                that.playerListDom.splice(del_ad_index, 1)
                            }
                            return
                        }

                        //是否为禁言
                        if (broadcast.action_type && broadcast.action_type == 'keep_silent') {
                            that.config.banned = parseInt(broadcast.is_keep_silent) ? true : false
                            let postData = {
                                media_type: 'system',
                                msg_content: parseInt(broadcast.is_keep_silent) ? '开始禁言' : '禁言结束'
                            }
                            that.wallList.push(postData);
                            //parseInt(broadcast.is_keep_silent)?console.log('当前为禁言模式'):console.log('当前为非禁言模式')
                            return
                        }

                        //是否关闭直播
                        if (broadcast.action_type && broadcast.action_type == 'close_room') {
                            that.config.endLive = true
                            let postData = {
                                media_type: 'system',
                                msg_content: '直播结束'
                            }
                            that.status.user_live_status = 3
                            that.wallList.push(postData);
                            //console.log(that.status.user_live_status)
                            //that.closeClient()
                            //console.log('已关闭直播')
                            return
                        }

                        //是否删除评论
                        if (broadcast.action_type && broadcast.action_type == 'del_discuss') {
                            let del_index = that.discussList.findIndex(function(item) {
                                return item.discuss_id == parseInt(broadcast.id);
                            });
                            let del_comment_index = that.commentList.findIndex(function(item) {
                                return item.id == parseInt(broadcast.id);
                            });
                            that.commentList.splice(del_comment_index, 1)
                            that.discussList.splice(del_index, 1)
                            //console.log('评论区删除了一条消息')
                            return
                        }

                        //是否删除问题
                        if (broadcast.action_type && broadcast.action_type == 'del_question') {
                            let del_index = that.questionList.findIndex(function(item) {
                                return item.question_id == parseInt(broadcast.id);
                            });
                            that.questionList.splice(del_index, 1)
                            let del_comment_index = that.commentList.findIndex(function(item) {
                                return item.id == parseInt(broadcast.id);
                            });
                            that.commentList.splice(del_comment_index, 1)
                            //console.log('提问区删除了一条消息')
                            return
                        }

                        //是否点赞评论
                        if (broadcast.action_type && broadcast.action_type == 'discuss_like') {
                            let like_index = that.discussList.findIndex(function(item) {
                                return item.discuss_id == parseInt(broadcast.id);
                            });
                            that.discussList[like_index].like_nums = broadcast.current_like_number
                            //that.discussList[like_index].like_nums = that.discussList[like_index].like_nums + 1
                            //console.log('点赞评论 id:' + broadcast.id + '消息')
                            return
                        }
                        //是否取消点赞评论
                        if (broadcast.action_type && broadcast.action_type == 'discuss_unlike') {
                            let like_index = that.discussList.findIndex(function(item) {
                                return item.discuss_id == parseInt(broadcast.id);
                            });
                            that.discussList[like_index].like_nums = broadcast.current_like_number
                            //that.discussList[like_index].like_nums = that.discussList[like_index].like_nums - 1
                            //console.log('点赞评论 id:' + broadcast.id + '消息')
                            return
                        }

                        //是否点赞问题
                        if (broadcast.action_type && broadcast.action_type == 'question_like') {
                            let like_index = that.questionList.findIndex(function(item) {
                                return item.question_id == parseInt(broadcast.id);
                            });
                            that.questionList[like_index].like_nums = broadcast.current_like_number
                            //that.questionList[like_index].like_nums = that.questionList[like_index].like_nums + 1
                            //console.log('点赞问题 id:' + broadcast.id + '消息')
                            return
                        }
                        //是否取消点赞问题
                        if (broadcast.action_type && broadcast.action_type == 'question_unlike') {
                            let like_index = that.questionList.findIndex(function(item) {
                                return item.question_id == parseInt(broadcast.id);
                            });
                            that.questionList[like_index].like_nums = broadcast.current_like_number
                            //that.questionList[like_index].like_nums = that.questionList[like_index].like_nums - 1
                            //console.log('点赞问题 id:' + broadcast.id + '消息')
                            return
                        }

                        //发言区
                        if (broadcast.type == 'admin_speak' || broadcast.type == 'teacher_speak') {
                            broadcast.mid = broadcast.id
                            broadcast.reply_question_id ? broadcast.reply_question_id : broadcast.reply_question_id = 0
                            that.wallList.push(broadcast);
                            that.oContent = document.querySelector('.talk-container');
                            //console.log(that.oContent.scrollHeight - that.oContent.scrollTop > that.oContent.clientHeight && broadcast.uid && broadcast.uid != that.userInfo.uid && !that.remindState)
                            //console.log(!that.remindState)
                            if (that.oContent.scrollHeight - that.oContent.scrollTop > that.oContent.clientHeight && broadcast.uid && broadcast.uid != that.userInfo.uid) {
                                that.remindState = true
                                //that.remindHeight = that.oContent.scrollHeight - that.oContent.scrollTop
                            } else {
                                that.scrollBottom(that)
                            }

                            // if (broadcast.ppt_id) {
                            //     let ppt_index = that.swiperImg.findIndex(function(item) {
                            //         return item.ppt_id == parseInt(broadcast.ppt_id);
                            //     });
                            //     that.changeSwiper(ppt_index)
                            // }

                            //广播通知为回答问题
                            if (broadcast.is_recommend) {
                                that.teacher_reply_id = parseInt(broadcast.question_id); //记录教师当前回答的问题id
                                //console.log(that.teacher_reply_id)
                                that.replyStatus = true
                            }

                            //广播通知为结束回答问题
                            if (parseInt(broadcast.is_question_over)) {
                                that.teacher_reply_id = null; //记录教师当前回答的问题id
                                that.replyStatus = false
                                let q_index = that.questionList.findIndex(function(item) {
                                    return item.question_id == parseInt(broadcast.reply_question_id);
                                });
                                that.questionList[q_index].is_recommend = 1
                                //that.questionList.splice(q_index, 1)
                            }

                            if (broadcast.media_type == 'audio') {
                                that.getPlayerList()
                                that.playerList.push(broadcast)
                            }

                        } else if (broadcast.type == 'discuss') {
                            broadcast.discuss_id = broadcast.id
                            broadcast.like_nums = 0
                            broadcast.is_recommend = 0
                            broadcast.current_user_is_like = 0
                            // is_del:0
                            // is_recommend:0
                            // current_user_is_like:0
                            that.discussList.unshift(broadcast);
                            that.commentList.push(broadcast);
                        } else if (broadcast.type == 'question') {
                            broadcast.question_id = broadcast.id
                            broadcast.like_nums = 0
                            broadcast.current_user_is_like = 0
                            broadcast.is_recommend = 0
                            // answer:null
                            // answer_time:null
                            //that.teacher_reply_index = that.teacher_reply_index + 1 //教师回答问题时不断有用户提问，修改当前回答的问题索引
                            that.questionList.unshift(broadcast);
                            that.commentList.push(broadcast);
                        }

                        if (broadcast.uid && broadcast.uid == that.userInfo.uid) {
                            that.scrollBottom(that)
                        }

                        if (that.oContent.scrollHeight - that.oContent.scrollTop > 100) {
                            //console.log('有新消息' + (new Date()).Format("yyyy-MM-dd hh:mm:ss"))
                        }
                    }
                    /* else if (msg.msgType == "youDefinedMsgType1"){
                     //你的业务逻辑
                     } else if (msg.msgType == "youDefinedMsgType2"){
                     //你的业务逻辑
                     }
                     */
                    //demo程序的日志
                    //console.log((new Date()).Format("yyyy-MM-dd hh:mm:ss.S") + " msgCallback:" + JSON.stringify(msg));
                }

                //第一次连接成功时触发的方法
                let connectCallback = function(msg) {
                    //msg.arg变量中存放了userId相同的在线客户端数
                    //this.log((new Date()).Format("yyyy-MM-dd hh:mm:ss.S")+" connectCallback:" + JSON.stringify(msg));
                    console.log('直播连接成功...');
                }

                //意外断开后重连成功时触发的方法
                let reconnectCallback = function(msg) {
                    //this.log((new Date()).Format("yyyy-MM-dd hh:mm:ss.S")+" reconnectCallback:" + JSON.stringify(msg));
                    console.log('重连成功');
                }

                //连接断开时触发的方法,一般你不需要在这里做任何重连的处理,apush会自动重连
                let disconnectCallback = function(msg) {
                    //demo程序的日志
                    //this.log((new Date()).Format("yyyy-MM-dd hh:mm:ss.S")+" disconnectCallback:" + JSON.stringify(msg));
                    this.userActionMark('out_room'); //记录用户离开事件
                    console.log('连接断开重连...');
                }
                //开启连接
                apushClient = Apush.createClient(this.pushConfig.appId, tokenUrl, msgCallback, terminalId, terminalType, connectCallback, reconnectCallback, disconnectCallback);
                //demo程序的日志
                console.log((new Date()).Format("yyyy-MM-dd hh:mm:ss") + "开启连接");
            }
        },
        //关闭client
        closeClient() {
            if (apushClient != null) {
                this.userActionMark('out_room'); //记录用户离开事件
                apushClient.close();
                apushClient = null;
                //console.log('断开直播连接')
            }
        },
        //时间戳转时间
        timestampToTime(timestamp) {
            var date = new Date(timestamp * 1000); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear() + '-';
            let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
            let D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
            let h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
            let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
            let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
            return M + D + h + m;
            //return Y + M + D + h + m ;
        },
        log(msg) {
            // receiveMsg.value = receiveMsg.value + msg +'\n'
            // receiveMsg.scrollTop=receiveMsg.scrollHeight
            console.log(msg);
        },
        //获取id
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            var strValue = "";
            if (r != null) return unescape(r[2]);
            return null;
            return strValue;
        },
        getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        },
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return {//移动终端浏览器版本信息
                trident: u.indexOf('Trident') > -1, //IE内核
                presto: u.indexOf('Presto') > -1, //opera内核
                webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
                iPad: u.indexOf('iPad') > -1, //是否iPad
                webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
            };
        },
        /*
         * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
         * @param fn {function}  需要调用的函数
         * @param delay  {number}    延迟时间，单位毫秒
         * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
         * @return {function}实际调用函数
         */
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
        /*
         * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
         * @param fn {function}  要调用的函数
         * @param delay   {number}    空闲时间
         * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
         * @return {function}实际调用函数
         */
        debounce(fn, delay, immediate) {
            return throttle(fn, delay, immediate, true);
        },
        // handleDocumentClick(e) {
        //     if (!this.$el.contains(e.target)) {
        //         this.isShow = false;
        //     }
        // }
    }
});
// window.onbeforeunload=function(){
//     return false
// }
// if (window.history && window.history.pushState)
// { $(window).on('popstate', function() { var hashLocation = location.hash; var hashSplit = hashLocation.split("#!/");
//  var hashName = hashSplit[1];
//  if (hashName !== '') { var hash = window.location.hash; if (hash === '') {
//     iview.Modal.confirm({
//         render: (h) => {
//             return h('p', '直播尚未结束，确认离开？')
//         },
//         okText: '确定',
//         cancelText: '取消',
//         onOk: () => {
//             //window.history.forward(1);
//             //window.history.go(-1)
//             //window.history.go(-1)
//             wx.miniProgram.navigateTo({url: '/path/to/page'})
//             //window.history.forward(-1)
//             console.log('离开')
//             //this.$Message.info('Clicked ok');
//         },
//         onCancel: () => {
//             console.log('不离开')
//             //this.$Message.info('Clicked cancel');
//         }
//     });
//   } } });
//  window.history.pushState('forward', null, window.location.hash);
// }
// wx.miniProgram.getEnv(function(res) {
//     //在小程序里
//     if (res.miniprogram) {
//         $(function(){
//             pushHistory();
//             window.addEventListener("popstate", function(e) {
//                 //alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
//                 //iview.$Modal.confirm(config)
//                 iview.Modal.confirm({
//                     render: (h) => {
//                         return h('p', '直播尚未结束，确认离开？')
//                     },
//                     okText: '确定',
//                     cancelText: '取消',
//                     onOk: () => {
//                         //window.history.forward(1);
//                         //window.history.go(-1)
//                         //window.location.href = window.history.go(-1)
//                         //window.history.forward(-1)
//                         wx.miniProgram.navigateBack() //小程序里
//                         console.log('离开')
//                         //this.$Message.info('Clicked ok');
//                     },
//                     onCancel: () => {
//                         pushHistory();
//                         console.log('不离开')
//                         //this.$Message.info('Clicked cancel');
//                     }
//                 });
//             }, false);
//             function pushHistory() {
//                 var state = {
//                     title: "icebear_live",
//                     url: "#"
//                 };
//                 window.history.pushState(state, "icebear_live", "#");
//             }
//         });
//     }
// })

// function handleInputChange(e) {
//     alert(handleInputChange)
//     alert(e)
// }



Date.prototype.Format = function(fmt) { //author: meizz
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