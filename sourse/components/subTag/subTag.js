let subTag = {
  template: `
  <div ref="subTags" class="subTag">
    <div class="item" v-if="subTags.length" v-for="(item, index) in subTags">
      <span class="subTagsItem" @click.stop="_subTagsDetail(event, item, index)">{{ item.tag_name }}</span>
      <div class="subDetail" @click.stop style="display: none;">
        <div class="itemRow itemRow1">
          <span class="name">{{ item.tag_name }}</span>
          <span class="subBtn" :class="item.follow ? 'active' : ''" @click="_subSubmit(item)">{{ item.follow ? "已订阅" : "订阅" }}</span>
        </div>
        <div class="itemRow2">
          <img class="subImg" :src="item.logo" alt="">
          <span class="about">{{item.content}}</span>
        </div>
        <div class="itemRow itemRow3">
          <span class="peopleNum">{{item.flow_num}} 人订阅</span>
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
    </div>
  </div>`,
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
  data() {
    return {
      //点击订阅按钮的弹窗的显示状态
      subStateAlertShow: false,
      //点击订阅按钮的弹窗的内容显示状态
      subAlertState: 0,
      subTagAlertElement: Object,

    }
  },
  created() {
  },
  mounted() {
    this._subTagsInit()
    this._bodyCloseAlert()
  },
  methods: {
    //点击订阅标签的逻辑
    _subTagsDetail(e, data, index) {

      let _this = this
      let element = e.target.nextSibling.nextSibling
      let state = 1

      post('/job/tag_detail', { tag_id: data.id }, function (res) {
        if (res.code == 1) {

          _this.subTags[index] = res.data

          if (_this.subTagAlertElement.style && _this.subTagAlertElement != element) {
            _this.subTagAlertElement.flag = false
            _this.subTagAlertElement.style.display = 'none'
          }

          element.flag = !element.flag
          element.flag ? element.style.display = '' : element.style.display = 'none'

          _this.subTagAlertElement = element
          _this._events.nearsubalertel[0](_this.subTagAlertElement)

        }
      }, function (res) {
        console.log(res)
      })

    },
    //点击订阅按钮后弹出的弹窗 关闭
    _closeSubStateAlert() {
      this.subStateAlertShow = false
    },
    //订阅提交
    _subSubmit(data) {
      let follow = data.follow
      let _this = this
      let state = 2


      if (this.loginState) {
        post('/job/tag_flow', {
          tag_id: data.id,
          follow: follow ? 0 : 1
        }, function (res) {
          if (res.code == 1) {
            let is_first_time = res.data.is_first_time
            let is_follow_weixin = res.data.is_follow_weixin

            _this._events.updatasubdata[0](data.id, !follow)
            if (_this.subTagAlertElement.style) {
              _this.subTagAlertElement.flag = false
              _this.subTagAlertElement.style.display = 'none'
            }

            if (is_follow_weixin != 1) {
              state = 0
            } else if (is_follow_weixin == 1 && is_first_time == 1) {
              state = 1
            } else {
              state = 2
            }

            if (state == 0) {
              _this.subStateAlertShow = true
              _this.subAlertState = 0
            } else if (state == 1) {
              _this.subStateAlertShow = true
              _this.subAlertState = 1
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
            if (_this.subTagAlertElement.style) {
              _this.subTagAlertElement.flag = false
              _this.subTagAlertElement.style.display = 'none'
            }
            // 输出错误信息
            console.log(res.msg)
          }
        }, function(res){
          console.log(res)
        })
      } else {
        _this.subStateAlertShow = false
        header._loginAlertShow()
      }
    },
    //初始化订阅标签
    _subTagsInit() {
      let _this = this
      Vue.nextTick(function () {
        _this.$refs.subTags.querySelectorAll('.subTagsItem').forEach(function (elItem) {
          elItem.nextSibling.nextSibling.flag = false
        })
      })
    },
    //点击外部关闭弹窗
    _bodyCloseAlert() {
      let _this = this
    }
  }
}