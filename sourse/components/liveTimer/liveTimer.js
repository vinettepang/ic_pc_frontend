var liveTimer = {
  template: `{{timerCount}}`,
  props: {
    time: {
      type: Number, //直播间开始时间
      default: ''
    }
  },
  data() {
    return {
      timerCount: '15:00', //倒计时
      liveStartTime:'', //直播间开始时间
    }
  },
  computed: {
    playIcon() {
      return this.audioState ? 'pause' : 'play'
    }
  },
  created() {
    //console.log(this.time)
  },
  watch: {

  },
  methods: {
    status(){
      this.status ? this.countdowm(this.time) :'';
    },
    //倒计时
    countdowm(timestamp){
      let self = this;
      let countdownTimer = setInterval(function(){
          let nowTime = new Date();
          let endTime = new Date(timestamp * 1000);
          let t = endTime.getTime() - nowTime.getTime();
          if(t>0){
              let day = Math.floor(t/86400000);
              let hour=Math.floor((t/3600000)%24);
              let min=Math.floor((t/60000)%60);
              let sec=Math.floor((t/1000)%60);
              hour = hour < 10 ? "0" + hour : hour;
              min = min < 10 ? "0" + min : min;
              sec = sec < 10 ? "0" + sec : sec;
              if (min < 15) {
                  let format = '';
                  if(day > 0){  format = `${day}天${hour}:${min}:${sec}:`;  }
                  if(day <= 0 && hour > 0 ){  format = `${hour}:${min}:${sec}`;   }
                  if(day <= 0 && hour <= 0){  format =`${min}:${sec}`;  }
                  self.timerCount = format;
              }
          }
          else{
              clearInterval(countdownTimer);
              //this.startLive();
              // self.timerCount = self.endText;
              // self._callback();
          }
      },1000);
    },
  },

}