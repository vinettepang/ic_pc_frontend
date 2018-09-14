var userWindow = {
  template: `
  <div class="userWindow" v-if="loginStatus">
    <img class="useAvater" :src="userMessage.avaterurl" alt="">
    <div class="userName">{{ userMessage.name }}</div>
    <div class="vip" v-show="userMessage.vip">{{ userMessage.vip }}</div>
    <div class="about">
      <a :href="item.url ? item.url : 'javascript:void(0)'" class="item" v-for="item in userMessage.about">
        <div class="number">{{ item.number }}</div>
        <span class="text">{{ item.title }}</span>
      </a>
    </div>
  </div>
  <div class="userWindow-loginAlert loginAlert" v-else>
    <slot></slot>
    <img class="weixinImg" :src="global.loginCodeImg" alt="">
    <div class="about">
      <p>微信扫码关注「白熊小助手」</p>
      <p>进行登录/注册</p>
    </div>
  </div>`,
  props: {
    loginStatus: '',
    userMessage: {
      type: Object,
      default: {}
    }
  },
  created(){
  }
}