let iceCarousel = {
  template: `
    <div id="ice_carousel" @mouseover="carousel_over" @mouseout="carousel_out">
      <div class="carousel_list">
        <div class="carousel_item" :class="{ active: index === current }" v-for="(item, index) in carouselData" :style="{ background: item.back_color,'z-index': index === current ? 5 : 2  }">
          <a :href="item.href" target="_blank">
          <img :src="item.url" data-rjs="2" :class="{ img_active: index === current }" class="item_img"/>
          </a>
        </div>
        <ol class="dot_wrapper">
          <li class="dot_box" :class="{ box_active: index === current }" v-for="(item, index) in carouselData" @click="dot_updata_current(index)">
            <span class="dot" :class="{ active: index === current }" :style="{ backgroundColor: light ? '#482929' : '#fff' }"></span>
          </li>
        </ol>
        <transition name="prevOrNext_state">
          <div v-show="prevOrNext_state">
            <i class="nc-icon nc-circle-left-38 prev" @click="prev" :style="{ color: light ? '#482929' : '#fff' }"></i>
            <i class="nc-icon nc-circle-right-37 next" @click="next" :style="{ color: light ? '#482929' : '#fff' }"></i>
          </div>
        </transition>
      </div>
    </div>`,
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
  data() {
    return {
      current: 0,
      prevOrNext_state: false,
      light: 1
    }
  },
  watch: {
    current(newCurrent){
      this.light = this.carouselData[newCurrent].light
    }
  },
  methods: {
    carouse_init(){
      this.timer_init()
    },
    dot_updata_current(index){
      this.current = index
    },
    timer_init(){
      let _this = this
      let imgLength = this.carouselData.length

      this.timer = setInterval(function(){
        if(_this.current >= imgLength - 1){
          _this.current = 0
        }else{
          _this.current++
        }
      }, _this.duration)
    },
    prev(){
      if(this.current <= 0){
        this.current = this.carouselData.length - 1
      }else{
        this.current--
      }
    },
    next(){
      if(this.current >= this.carouselData.length - 1){
        this.current = 0
      }else{
        this.current++
      }
    },
    carousel_over(){
      clearInterval(this.timer)
      this.prevOrNext_state = true
    },
    carousel_out(){
      this.timer_init()
      this.prevOrNext_state = false
    }
  },
  mounted(){
    this.light = this.carouselData[0].light
    //console.log(this.light)
    this.carouse_init()
  }
}