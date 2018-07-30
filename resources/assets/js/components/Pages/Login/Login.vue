<template>
  <section class="uk-section-muted login-page">
    <section class="uk-container uk-container-expand uk-flex uk-flex-center uk-flex-middle login-container">
      <div class="uk-card uk-card-default uk-card-hover uk-card-body login-card uk-flex uk-flex-center">
        <div class="login-img">
          <div class="mask"></div>
        </div>
        <div class="login-form uk-flex uk-flex-column uk-flex-middle uk-flex-center">
          <form method="POST" class="uk-flex uk-flex-column uk-flex-middle uk-flex-around" @submit.prevent="login">
            <div class="uk-inline">
              <input class="uk-input" type="text" placeholder="請輸入郵箱" name="email" v-model="loginData.email" v-validate="{required: true, email: true}" data-vv-as="郵箱">
              <p v-show="errors.has('email')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('email') }}</p>
            </div>
            <div class="uk-inline">
              <input class="uk-input" type="password" placeholder="請輸入密碼" name="password" v-model="loginData.password" v-validate="{required: true, min: 6}" data-vv-as="密碼">
              <p v-show="errors.has('password')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('password') }}</p>
            </div>
            <div class="uk-flex uk-flex-center uk-flex-middle">
              <button class="uk-button uk-button-primary" type="submit">登錄</button>
              <router-link :to="{name: 'Register'}"><button class="uk-button uk-button-primary" style="margin-left: 20px;">沒有賬號</button></router-link>
            </div>
          </form>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        loginData: {
          email: '',
          password: ''
        }
      }
    },
    methods: {
      login() {
        this.$store.dispatch('loginRequest', this.loginData)
      }
    },
    computed: {
      getAuthenticate() {
        return this.$store.state.Login.Authenticate
      }
    },
    watch: {
      getAuthenticate(val) {
        if(val) {
          this.$Notice.success({
            title: '恭喜你登錄成功',
            desc: '請耐心等待,頁面即將跳轉'
          })
          setTimeout(() => {
            this.$router.push({path: '/'})
          }, 1500)
        }
      }
    }
  }
</script>


<style lang="less" scoped>
  @import "Login";
</style>
