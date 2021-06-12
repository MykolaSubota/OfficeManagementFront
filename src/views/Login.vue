<template>
  <div class="bd bg-primary d-flex align-items-xl-center">
    <div class="container">
      <div class="row">
        <div class="col-lg-6 d-none d-lg-flex">
          <div
            class="d-flex flex-grow-1 align-self-center justify-content-xl-center align-items-xl-center bg-login-image"
          >
            <img class="align-self-center" src="../assets/auth.png" />
          </div>
        </div>
        <div class="col-lg-6 align-self-center">
          <div class="p-5">
            <div class="text-center">
              <h4 class="text-dark mb-4">Авторизація</h4>
            </div>
            <form class="user" v-on:submit.prevent="login">
              <div class="form-group">
                <input
                  class="form-control form-control-user"
                  @blur="$v.username.$touch()"
                  :class="{ 'is-invalid': $v.username.$error }"
                  type="username"
                  v-model="username"
                  placeholder="Ім'я користувача"
                />
                <div v-if="!$v.username.required" class="invalid-feedback">
                  {{ msgRequired }}
                </div>
              </div>
              <div class="form-group">
                <input
                  class="form-control form-control-user"
                  @blur="$v.password.$touch()"
                  :class="{ 'is-invalid': $v.password.$error }"
                  type="password"
                  v-model="password"
                  placeholder="Пароль"
                />
                <div v-if="!$v.password.required" class="invalid-feedback">
                  {{ msgRequired }}
                </div>
              </div>
              <button
                class="btn btn-primary btn-block text-white btn-user"
                type="submit"
              >
                Ввійти
              </button>
              <hr />
            </form>
            <div class="text-center">
              <router-link class="small" to="/register">
                Не маю акаунту!
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
export default {
  name: 'login',
  data() {
    return {
      msgRequired: "Поле обов'язкове для заповнення",
      username: '',
      password: '',
      error: false
    }
  },
  validations: {
    username: { required },
    password: { required }
  },
  methods: {
    login() {
      this.$store
        .dispatch('LOGIN', {
          username: this.username,
          password: this.password
        })
        .then((succes) => {
          this.$router.push({ name: 'projects' })
        })
        .catch((e) => {
          if (e.response.status === 401) {
            this.makeError(
              "Введено не правильно ім'я користувача або пароль. Можливо даний акаунт не активний(Зв'яжіться з адміністратором)"
            )
          }
        })
    },
    makeError(e) {
      this.$bvToast.toast(e, {
        title: 'Помилка',
        variant: 'danger',
        solid: true
      })
    }
  }
}
</script>

<style>
@import url('../style/Register_and_Login.css');
</style>
