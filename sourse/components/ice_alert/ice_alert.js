var iceAlert = {
  template: `
  <div class="ice_alert" :style="shadeStyle">
    <div class="content" ref="content">
      <slot></slot>
    </div>
  </div>`,
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
  data() {
    return {
      shadeStyle: ''
    }
  },
  created() {
    this.shade ? this.shadeStyle = '' : this.shadeStyle = 'background-color: rgba(0, 0, 0, 0);'
  },
  mounted() {
    this.ice_alert_init()
  },
  methods: {
    ice_alert_init() {
      let _this = this

      Vue.nextTick(function () {
        _this.$refs.content.style.width = _this.width + 'px'
        _this.$refs.content.style.height = _this.height + 'px'
      }, 20)
    }
  }
}