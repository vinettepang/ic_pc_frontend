var scrollTop = {
  template: `
  <div class="scrollTop_bottom">
    <div class="ivu-back-top" :class="status? 'ivu-back-top-show':''">
      <div class="ivu-back-top-inner" @click="clickScrollTop"><img data-rjs="2" :src="scrollTopImg"/></div>
    </div>
    <div class="global_scroll_service">
      <Poptip trigger="hover" class="scroll_service" content="content" placement="left-end">
        <img data-rjs="2" :src="serviceButtonImg"/>
        <div slot="content">
            <img data-rjs="2" :src="serviceContentImg"/>
        </div>
      </Poptip>
    </div>
  </div>`,
  props: {
    //是否还能加载
    status: {
      type: Boolean,
      default: false
    },
    serviceButtonImg:{
      type: String,
      default: ''
    },
    serviceContentImg:{
      type: String,
      default: ''
    },
    scrollTopImg:{
      type: String,
      default: ''
    },
  },
  data(){
    return{
    }
  },
  watch: {
    status(newState){
      this.status = newState
    }
  },
  methods: {
    clickScrollTop(){
        $('html,body').animate({scrollTop:0},800);
    },
  },
  created() {
  }
}