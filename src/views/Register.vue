<template>
  <div class="bd d-flex align-items-xl-center bg-primary">
    <div class="container">
      <div class="row">
        <div
          class="col-lg-5 d-none d-lg-flex align-self-center bg-register-image"
        >
          <img
            class="d-xl-flex justify-content-xl-center align-items-xl-end"
            src="../assets/auth.png"
          />
        </div>
        <div class="col-lg-7 align-self-center">
          <div class="p-5">
            <div class="text-center">
              <h4 class="text-dark mb-4">Реєстрація</h4>
              <h3>{{ err }}</h3>
            </div>
            <form class="user" @submit.prevent="registerUser">
              <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
                  <input
                    class="form-control form-control-user"
                    @blur="$v.username.$touch()"
                    :class="{ 'is-invalid': $v.username.$error }"
                    type="text"
                    v-model="username"
                    placeholder="Ім'я користувача"
                  />
                  <div v-if="!$v.username.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.username.alpha" class="invalid-feedback">
                    {{ msgAlpha }}
                  </div>
                  <div v-if="!$v.username.maxLength" class="invalid-feedback">
                    {{ msgMaxLength150 }}
                  </div>
                </div>
                <div class="col-sm-6">
                  <input
                    class="form-control form-control-user"
                    @blur="$v.email.$touch()"
                    :class="{ 'is-invalid': $v.email.$error }"
                    type="text"
                    v-model="email"
                    placeholder="Електронна пошта"
                  />
                  <div v-if="!$v.email.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.email.email" class="invalid-feedback">
                    {{ msgEmail }}
                  </div>
                  <div v-if="!$v.email.maxLength" class="invalid-feedback">
                    {{ msgMaxLength254 }}
                  </div>
                </div>
              </div>
              <div class="form-group row">
                <div class="col-sm-6 mb-3 mb-sm-0">
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
                  <div v-if="!$v.email.minLength" class="invalid-feedback">
                    {{ mdgMinLength8 }}
                  </div>
                </div>
                <div class="col-sm-6">
                  <input
                    class="form-control form-control-user"
                    @blur="$v.repeatPassword.$touch()"
                    :class="{ 'is-invalid': $v.repeatPassword.$error }"
                    type="password"
                    v-model="repeatPassword"
                    placeholder="Повторіть пароль"
                  />
                  <div
                    v-if="!$v.repeatPassword.required"
                    class="invalid-feedback"
                  >
                    {{ msgRequired }}
                  </div>
                  <div
                    v-if="!$v.repeatPassword.sameAs"
                    class="invalid-feedback"
                  >
                    {{ msgSameAs }}
                  </div>
                </div>
              </div>
              <button
                class="btn btn-primary btn-block text-white btn-user"
                type="submit"
              >
                Зареєструватись
              </button>
              <hr />
            </form>
            <div class="text-center">
              <router-link class="small" to="/login">
                Вже маю акаунт!
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  email,
  helpers,
  maxLength,
  minLength,
  sameAs
} from 'vuelidate/lib/validators'

const alpha = helpers.regex('alpha', /^[\w.@+-]+$/)

export default {
  data() {
    return {
      msgRequired: "Поле обов'язкове для заповнення",
      msgAlpha:
        'Можуть бути присутні тільки тільки букви, цифри та знаки @/./+/-/_',
      msgMaxLength150: 'Максимальна довжина поля - 150 символів',
      msgEmail: 'Поле повинне містити адресу електронної пошти',
      msgMaxLength254: 'Максимальна довжина поля - 254 символів',
      mdgMinLength8: 'Мінімальна довжина поля - 8 символів',
      msgSameAs: 'Це поле повинно співпадати з полем "Пароль"',
      username: '',
      email: '',
      password: '',
      repeatPassword: ''
    }
  },
  validations: {
    username: { required, alpha, maxLength: maxLength(150) },
    email: { required, email, maxLength: maxLength(254) },
    password: { required, minLength: minLength(8) },
    repeatPassword: { required, sameAs: sameAs('password') }
  },
  methods: {
    registerUser() {
      this.$store
        .dispatch('REGISTER', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then((succes) => {
          this.$router.push({ name: 'login' })
        })
        .catch((e) => {
          if (e.response.status === 500) {
            this.$bvToast.toast(
              "Для входу в акаунт зв'яжіться з адміністратором",
              {
                title: `Реєстрація пройшла успішно`,
                variant: 'success',
                solid: true
              }
            )
          } else {
            if (e.response.data.username && e.response.data.password) {
              this.makeError(
                e.response.data.username[0] + '\n' + e.response.data.password[0]
              )
            } else if (e.response.data.username) {
              this.makeError(e.response.data.username[0])
            } else if (e.response.data.password) {
              this.makeError(e.response.data.password[0])
            }
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
