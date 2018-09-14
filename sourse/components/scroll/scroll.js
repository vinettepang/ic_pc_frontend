var scroll = {
  template: `
  <div class="scroll">
    <slot></slot>
    <span class="scroll_moreText" v-show="moreTextState"><i class="icon nc-icon nc-dots-05-2"></i>查看更多</span>
  </div>`,
  props: {
    //是否还能加载
    scrollState: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return{
      moreTextState: false,
      isScroll:false
    }
  },
  watch: {
    scrollState(newState){
      this.moreTextState = newState
    }
  },
  methods: {
    scroll_init() {
      let _this = this

      window.onscroll = function (e) {
        let windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight; //窗口的高度
        let bodyHeight = document.body.scrollHeight ||document.body.clientHeight || document.documentElement.clientHeight              //body的高度
        let pageYOffset = window.pageYOffset                     //滚动条到顶端的距离
        let pageBottom = bodyHeight - windowHeight - pageYOffset //滚动条到底部的距离
        if (pageBottom <= 0 && _this.scrollState == true) {
          console.log('加载更多：' + pageBottom)
          _this.isScroll = true
          _this.moreTextState = true
          //console.log(_this.moreTextState)
          _this._events.scrolladddata[0]()
        }
      }
    }
  },
  created() {
    this.scroll_init()
  }
}