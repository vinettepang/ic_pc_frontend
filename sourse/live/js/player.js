var player = {
  template: `
  <div class="ic-player" :class="{ player, 'player_active': audioState }" :style="{ width: playerWidth }">
    <audio @canplay="" @onloadedmetadata="" :src="url" ref="audio" controls="" preload="auto" @timeupdate="updateTime" style="display:none"></audio>
    <a href="javascript:void(0)" @click="playing()" :id="'palyerid'+mid">
      <Icon :type="playIcon"></Icon>
    </a>
    <div class="progress-bar" ref="progressBar">
      <div class="bar-inner" @click="progressClick">
        <div class="progress" ref="progress"></div>
        <div class="timeBuffered" ref="timeBuffered"></div>
        <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="progressTouchStart" @touchmove.prevent="progressTouchMove"
          @touchend="progressTouchEnd">
          <div class="progress-btn"></div>
        </div>
      </div>
    </div>
    <span class="time">{{format(duration - currentTime)}}</span>
    <div class="playState">
      <i class="nc-icon nc-wifi" v-show="playState === 1"></i>
      <i class="nc-icon nc-check-circle-07-2 icon-checked"  v-show="playState === 2"></i>
    </div>
  </div>`,
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
    mid: {
      type: Number,
      default: 0
    },
    pptId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      //进度条按钮宽度
      duration:0,
      progressBtnWidth: 2,
      currentTime: 0,     //当前播放的时长
      percent: 0,         //currentTime / time
      audioState: false,  //播放的状态
      bufferPercent: 0,   //缓存的进度
      nowAudio: null,     //最近播放的音频
      playState: 0,       //播放的状态
      playerWidth: '90%'  //播放器的宽度
    }
  },
  computed: {
    playIcon() {
      return this.audioState ? 'pause' : 'play'
    }
  },
  created() {
    this.touch = {}
  },
  mounted() {
    let _this = this
    Vue.nextTick(function () {
      let audio = _this.$refs.audio
      audio.addEventListener("playing", function () {
        _this.audioState = true
      })
      audio.addEventListener("pause", function () {
        _this.audioState = false
      })
      //audio.addEventListener('timeupdate', _this._currentTime),
      audio.addEventListener('canplay', _this._durationTime)
    })

    _this.playerWidth_init()

  },
  beforeDestroyed() {
    this.removeEventListeners()
  },
  watch: {
    audioState(state){
      if(state){
        this.playState = 1
      }else{
        if(this.playState != 2){
          this.playState = 0
        }
      }
    },
    percent(newPercent) {
      const audio = this.$refs.audio
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth
        //偏移的宽度
        const offsetWidth = newPercent * barWidth

        this._playOffset(offsetWidth)
      }

      if(newPercent >= 1){
        this.playState = 2
        audio.pause()
        audio.currentTime = 0
        this._events.audio_play_next[0](audio, this.mid)
      }

    },
    bufferPercent(newBufferPercent) {
      if (newBufferPercent >= 0) {
        //进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth * 1
        //缓存的宽度
        const offsetWidth = Math.min(newBufferPercent * barWidth, barWidth)

        this._newBufferOffset(offsetWidth)
      }
    },
    count(newCount) {
      if (newCount > 1) {
        this.$refs.audio.pause()
        this.audioState = false
      }
    }
  },
  methods: {
    getTime(){
      // let _ = this
      // wx.ready(function() {
      //     _._durationTime()
      // });

      //alert('getTime')
    },
    removeEventListeners: function () {
      let self = this
      const audio = self.$refs.audio
      //audio.removeEventListener('timeupdate', self._currentTime)
      //audio.removeEventListener('canplay', self._durationTime)
    },
    // _currentTime: function () {
    //   const audio = this.$refs.audio
    //   audio.timeNow = parseInt(audio.currentTime)
    // },
    _durationTime: function () {
      let _ = this
      const audio = _.$refs.audio
      //audio.timeDuration = parseInt(audio.duration)
      audio.timeDuration = parseInt(_.time) != 0? parseInt(_.time) - 1:parseInt(audio.duration)

      _.duration = audio.timeDuration
      //alert(_.duration)
      // document.addEventListener("WeixinJSBridgeReady", function () {
      //   audio.play()
      //     setTimeout(function () {
      //       audio.pause()
      //       audio.timeDuration = parseInt(audio.duration)
      //       _.duration = audio.timeDuration
      //   },100)
      // })
      // let ua = window.navigator.userAgent.toLowerCase();
      // if (ua.match(/MicroMessenger/i) == 'micromessenger') {
      //   //console.log('微信浏览器内')
      //   wx.ready(function() {
      //     audio.play()
      //     setTimeout(function () {
      //       audio.pause()
      //       audio.timeDuration = parseInt(audio.duration)
      //       _.duration = audio.timeDuration
      //     },100)
      //   });
      // }else{
      //   audio.timeDuration = parseInt(audio.duration)
      // _.duration = audio.timeDuration
      // }

      //alert(audio.duration)

    },
    //格式化时间
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 >= 10 ? interval / 60 : '0' + interval / 60 | 0
      const second = interval % 60 >= 10 ? interval % 60 : '0' + interval % 60

      return `${minute}:${second}`
    },
    //修改播放的状态
    playing: function () {
      const audio = this.$refs.audio
      let _this = this
      //console.log(_this.index)
      this.audioState = !this.audioState
      //console.log(this.audioState)
      if(this.audioState){
        audio.play()
        this._events.callback[0](this.pptId)
      }else{
        audio.pause()
      }

      if (this.audioState && this.currentTime == this.duration) {
        audio.currentTime = 0
      }

      this.audioState ? this.count++ : this.count--
      this._events.countchange[0](this.count)

      setTimeout(function () {
        if (_this.count > 1) {
          audio.play()
          _this.audioState = true
          _this.count--
          _this._events.countchange[0](_this.count)
        }
      }, 50)
      //console.log(this.mid)
      //this._events.nearplayaudio[0](audio, this.mid, this.audioState)

    },
    updateTime(e) {

      const audio = this.$refs.audio
      let timeRanges = audio.buffered;
      let  timeBuffered = ''
      if (timeRanges.length !=0) {
        timeBuffered = timeRanges.end(timeRanges.length - 1);
      }

      this.currentTime = e.target.currentTime | 0
      // if(this.duration == 0){
      //   this._durationTime()
      // }
      this.percent = this.currentTime / this.duration
      // 获取缓存进度，值为0到1
      this.bufferPercent = timeBuffered / audio.duration

      if (this.currentTime === this.duration) {
        this.audioState = false
        audio.pause()
      }
    },
    playerWidth_init(){
      if(this.time == 0){
        this._durationTime()
      }else{
        this.duration = this.time
      }
      if(this.duration <= 60 && this.duration >= 36){
        this.playerWidth = this.duration / 60 * 90 + '%'
      }else if(this.duration > 60){
        this.playerWidth = '90%'
      }else{
        this.playerWidth = '54%'
      }
    },
    _offset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transition = ''
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _playOffset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`
      this.$refs.progressBtn.style.transition = 'all .1s'
      this.$refs.progressBtn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
    },
    _newBufferOffset(offsetWidth) {
      this.$refs.timeBuffered.style.width = `${offsetWidth - 2}px`
    },
    //h5端的touch事件
    progressTouchStart(e) {
      this.touch.initiated = true
      this.touch.startX = e.touches[0].pageX
      this.touch.left = this.$refs.progress.clientWidth
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const deltaX = e.touches[0].pageX - this.touch.startX
      const offsetWidth = Math.min(this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth, Math.max(0, this.touch.left + deltaX))

      this._offset(offsetWidth)
    },
    progressTouchEnd() {
      this.touch.initiated = false
      this._triggerPercent()
    },
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth

      this.currentTime = percent * this.duration
      this.$refs.audio.currentTime = this.currentTime

      if (this.audioState) {
        this.$refs.audio.play()
      }
    }
  }
}