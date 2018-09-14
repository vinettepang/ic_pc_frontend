var login = {
  template: `
  <div class="loginAlert">
    <slot></slot>
    <img class="weixinImg" :src="wexinImg" alt="">
    <div class="about">
      <p>微信扫码关注「白熊小助手」</p>
      <p>进行登录/注册</p>
    </div>
  </div>`,
  props: {
    wexinImg: {
      type: String,
      default: ''
    }
  }
}