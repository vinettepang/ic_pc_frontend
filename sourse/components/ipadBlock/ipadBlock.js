let ipadBlock = {
    template: `
    <div class="unclose-dialog" v-show="isIpadBlock && agreeOpenWatchInPad">
        <div class="unclose-dialog-content">
            <div class="unclose-dialog-box">
                <div class="unclose-dialog-text"><p>由于移动端网页暂时无法准确记录看课情况，
影响押金课退款。</p><p>建议在微信使用「<span id="miniprogram">白熊学院</span>」小程序进行学习。</p></div>
                <img class="unclose-img" data-rjs="2" :src="miniImage">
                <button class="unclose-btn ic-clipboard" data-clipboard-target="#miniprogram">复制小程序名称</button>
                <button class="unclose-btn" @click="setIpadWatchCookie" >依然使用网页看课</button>
            </div>
        </div>
        <div class="unclose-dialog-cover"></div>
    </div>`,
    props: {
        isIpadBlock: {
            type: Boolean,
            default: false
        },
        miniImage:{
          type: String,
          default: ''
        }
    },
    data() {
        return {
            agreeOpenWatchInPad:true, //pad是否
        }
    },
    watch: {
      isIpadBlock(status) {
            if (status == true) {
              this.isIpadBlock =true
            }
        }
    },
    created() {

    },
    mounted() {
      // Vue.prototype.global.getCookie('agree_watch_in_pad') == 'true'
      // ? this.agreeOpenWatchInPad = false : this.agreeOpenWatchInPad = true
    },
    methods: {
        setIpadWatchCookie(){
            // Vue.prototype.global.setCookie('agree_watch_in_pad','true',365)
            this.agreeOpenWatchInPad = false
            this._events.agree_open_watch_in_pad[0](false)
        }
    }
}