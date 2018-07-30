<template>
  <section class="uk-section-muted register-page">
    <section class="uk-container-expand uk-container register-container uk-flex uk-flex-center uk-flex-middle">
      <div class="uk-card uk-card-default uk-card-hover uk-card-body register-card uk-flex uk-flex-center">
        <div class="register-form uk-flex uk-flex-column uk-flex-middle uk-flex-center">
          <form method="POST" class="uk-flex uk-flex-column uk-flex-middle uk-flex-around" @submit.prevent="register">
            <div class="uk-inline">
              <input class="uk-input" type="text" placeholder="請輸入用戶名" name="name" v-model="formData.name" v-validate="{required: true, min: 2}" data-vv-as="用戶名">
              <p v-show="errors.has('name')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('name') }}</p>
            </div>
            <div class="uk-inline">
              <input class="uk-input" type="text" placeholder="請輸入郵箱" name="email" v-model="formData.email" v-validate="{required: true, email: true}" data-vv-as="郵箱">
              <p v-show="errors.has('email')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('email') }}</p>
            </div>
            <div class="uk-inline">
              <input class="uk-input" type="password" placeholder="請輸入密碼" name="password" v-model="formData.password" v-validate="{required: true, min: 6}" data-vv-as="密碼">
              <p v-show="errors.has('password')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('password') }}</p>
            </div>
            <div class="uk-inline">
              <input class="uk-input" type="password" placeholder="請輸入確認密碼" name="confirm" v-model="formData.confirm" v-validate="{required: true, min: 6,confirmed: 'password' }" data-vv-as="確認密碼">
              <p v-show="errors.has('confirm')" class="error uk-flex uk-flex-center uk-flex-middle">{{ errors.first('confirm') }}</p>
            </div>
            <button class="uk-button uk-button-primary" type="submit">註冊</button>
          </form>
        </div>
        <div class="register-img"></div>
      </div>
    </section>
  </section>
</template>

<script>
  export default {
    name: 'Register',
    data() {
      return {
        formData: {
          name: '',
          email: '',
          password: '',
          confirm: ''
        }
      }
    },
    methods: {
      async register() {
        let {data} = await axios.post('/register', this.formData);
        if(data.status === 200) {
          this.$Notice.success({
            title: data.title,
            desc: data.msg
          })
          setTimeout(() => {
            this.$router.push({path: '/login'})
          },1000)
        }
      }
    },
  }
</script>

<style scoped lang="less">
  @import "Register.less";
</style>
