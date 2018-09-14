var record = {
  // <h4 style="margin-top: 20px;">调试信息：</h4>
  // <div id="recordingslist" class="recordingslist"></div>
  // <Icon :type="playIcon"></Icon>
  template: `
  <div class="ice_record">
    <div class="section" style="margin-top: 20px;">
      <i class="start-btn nc-icon nc-audio-91" :class="{active: !startDisabled}" v-show="startBtnState" @click="funStart"></i>
      <i class="stop-btn nc-icon nc-button-circle-stop" v-show="stopBtnState" @click="funStop"></i>
      <i class="close-btn" v-show="closeBtnState" @click="funClose">结束</i>
      <i class="reset-btn" v-show="resetBtnState" @click="funReset">重录</i>
      <span class="recTime" v-show="recTimeState">{{ recTime }}"/180</span>

      <div class="audioFinish" ref="audioFinish" v-show="playerUrl">
        <div class="player">
          <audio :src="playerUrl" ref="audio" @timeupdate="updateTime" style="display:none"></audio>
          <a href="javascript:void(0)" @click="playing()">
            <i class="playIcon" :class="playIcon"></i>
          </a>
          <div class="progress-bar">
            <div class="bar-inner" ref="progressBar" @click="progressClick">
              <div class="progress" ref="progress"></div>
              <div class="timeBuffered" ref="timeBuffered"></div>
              <div class="progress-btn-wrapper" ref="progressBtn">
                <div class="progress-btn"></div>
              </div>
            </div>
          </div>
          <span class="time">{{format(playerTime - currentTime)}}</span>
        </div>

      </div>
      <span v-show="deleteBtnState" @click="funDelete" style="font-size: 14px; margin-left: 10px; cursor: pointer">删除</span>
    </div>
  </div>`,
  data() {
    return {
      //开始按钮的disbaled
      startDisabled: true,
      //开始、暂停、结束、重录、删除按钮的现实状态
      startBtnState: true,
      stopBtnState: false,
      closeBtnState: false,
      resetBtnState: false,
      deleteBtnState: false,
      recTimeState: true,
      //recoredr对象
      recorder: '',
      //MP3文件流对象
      mp3Blob: '',
      // 播放器的数据
      playerUrl: '',
      playerTime: 0,
      count: 0,
      //录制的时间
      recTime: 0,
      //进度条按钮宽度
      progressBtnWidth: 2,
      currentTime: 0,    //当前播放的时长
      percent: 0,        //currentTime / playerTime
      audioState: false, //播放的状态
      bufferPercent: 0   //缓存的进度
    }
  },
  created() {
    this.touch = {}
    this.recorder_init()
  },
  computed: {
    playIcon() {
      return this.audioState ? 'nc-icon nc-button-pause' : 'nc-icon nc-button-play'
    }
  },
  watch: {
    //百分比的变化
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        //进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth
        //偏移的宽度
        const offsetWidth = newPercent * barWidth

        this._playOffset(offsetWidth)
      }
    },
    bufferPercent(newBufferPercent) {
      if (newBufferPercent >= 0) {
        //进度条的宽度
        const barWidth = this.$refs.progressBar.clientWidth * 1
        //缓存的宽度
        const offsetWidth = newBufferPercent * barWidth

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
    //录音初始化
    recorder_init() {
      let _this = this

      this.recorder = new MP3Recorder({
        debug: true,
        funOk: function () {
          _this.startDisabled = false;
          // _this.log('初始化成功');
        },
        funCancel: function (msg) {
          // _this.log(msg);
          //console.log(msg)
          _this.recorder = null;
        }
      });
    },
    //录音开始
    funStart() {
      if (this.startDisabled === false) {
        this.startBtnState = false;
        this.stopBtnState = true;
        // this.log('录音开始...');
        this.recorder.start();

        this.recordTimer(1)
      }
    },
    //录音停止
    funStop() {
      this.recorder.stop();
      this.stopBtnState = false;
      this.closeBtnState = true;
      this.resetBtnState = true;

      this.recordTimer(0)
    },
    // 录音结束
    funClose() {
      let _this = this
      let recordingslist = document.querySelector('#recordingslist')

      // this.log('录音结束，MP3导出中...');
      this.recorder.getMp3Blob(function (blob) {
        // _this.log('MP3导出成功');

        _this.mp3Blob = blob;
        _this.closeBtnState = false;
        _this.resetBtnState = false;
        _this.startBtnState = true;
        _this.startDisabled = true;
        _this.deleteBtnState = true;
        _this.recTimeState = false;

        var mp3url = URL.createObjectURL(_this.mp3Blob);
        var au = document.createElement('audio');

        au.controls = true;
        au.src = mp3url;

        setTimeout(function () {
          let time = Math.ceil(au.duration)
          let data = {}
          _this.playerUrl = mp3url
          _this.playerTime = time
          data.blob = _this.mp3Blob
          data.time = time

          _this._events.requestdata[0](data)
        }, 100)


      });
    },
    //重录
    funReset() {
      this.closeBtnState = false;
      this.resetBtnState = false;
      this.stopBtnState = true;
      // this.log('录音重新开始...');
      this.recorder.getMp3Blob()

      this.recorder.start();
      this.recTime = 0;
      this.recordTimer(1);

    },
    funDelete() {
      this.deleteBtnState = false;
      this.recTimeState = true;
      this.playerUrl = '';
      this.playerTime = 0;
      this.startDisabled = false;
      this.recTime = 0
    },
    //输出日志信息
    // log(str) {
    //   let recordingslist = document.querySelector('#recordingslist');
    //   recordingslist.innerHTML += str + '<br/>';
    // },
    //录音上传
    funUpload() {
      // var fd = new FormData();
      // var mp3Name = encodeURIComponent('audio_recording_' + new Date().getTime() + '.mp3');
      // fd.append('mp3Name', mp3Name);
      // fd.append('file', mp3Blob);

      // var xhr = new XMLHttpRequest();
      // xhr.onreadystatechange = function () {
      //   if (xhr.readyState == 4 && xhr.status == 200) {
      //     recordingslist.innerHTML += '上传成功：<a href="' + xhr.responseText + '" target="_blank">' + mp3Name + '</a>';
      //   } else {
      //     console.log(xhr.readyState + '-' + xhr.status)
      //   }
      // };

      // xhr.open('POST', 'upload.ashx');
      // xhr.send(fd);
    },
    //格式化时间
    format(interval) {
      interval = interval | 0
      const minute = interval / 60 | 0
      const second = interval % 60

      return `${minute}:${second}`
    },
    //修改播放的状态
    playing: function () {
      const audio = this.$refs.audio
      let _this = this

      this.audioState = !this.audioState
      this.audioState ? audio.play() : audio.pause()

      if (this.audioState && this.currentTime == this.playerTime) {
        audio.currentTime = 0
      }

      this.audioState ? this.count++ : this.count--

      setTimeout(function () {
        if (_this.count > 1) {
          audio.play()
          _this.audioState = true
          _this.count--
        }
      }, 20)

    },
    //audio的时间更新
    updateTime(e) {
      const audio = this.$refs.audio
      let timeRanges = audio.buffered;
      let timeBuffered;
      if (timeRanges.length) {
        timeBuffered = timeRanges.end(timeRanges.length - 1);
      }

      this.currentTime = Math.ceil(e.target.currentTime)

      this.percent = this.currentTime / this.playerTime
      // 获取缓存进度，值为0到1
      this.bufferPercent = timeBuffered / audio.duration;

      if (this.currentTime === this.playerTime) {
        this.audioState = false
        audio.pause()
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
      this.$refs.timeBuffered.style.width = `${offsetWidth}px`
    },
    progressClick(e) {
      this._offset(e.offsetX)
      this._triggerPercent()
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth * 1 - this.progressBtnWidth
      const percent = this.$refs.progress.clientWidth / barWidth

      this.currentTime = percent * this.playerTime
      this.$refs.audio.currentTime = this.currentTime

      if (this.audioState) {
        this.$refs.audio.play()
      }
    },
    recordTimer(state) {
      let _this = this
      var recTimer;

      if (state) {
        clearInterval(window.recTimer)
        _this.recTime++

        window.recTimer = setInterval(function () {
          _this.recTime++
        }, 1000)
      } else {
        clearInterval(window.recTimer)
      }
    }
  }
}