<template>
  <div id="page-top">
    <div id="wrapper">
      <LeftNav />
      <div class="d-flex flex-column" id="content-wrapper">
        <div id="content">
          <TopNav />
          <div class="container-fluid">
            <div
              class="d-sm-flex justify-content-between align-items-center mb-4"
            >
              <h3 class="text-dark mb-0">Налаштування профілю</h3>
            </div>
            <div style="margin-left: 80px">
              <b-form @submit.prevent="changeProfile" style="width: 500px">
                <b-form-group label="Прізвище:">
                  <b-form-input
                    v-model="last_name"
                    type="text"
                    @blur="$v.last_name.$touch()"
                    :class="{ 'is-invalid': $v.last_name.$error }"
                  ></b-form-input>
                </b-form-group>
                <b-form-group label="Ім'я:">
                  <b-form-input
                    v-model="first_name"
                    type="text"
                    @blur="$v.first_name.$touch()"
                    :class="{ 'is-invalid': $v.first_name.$error }"
                  ></b-form-input>
                  <div v-if="!$v.first_name.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.first_name.maxLength" class="invalid-feedback">
                    {{ msgMaxLength150 }}
                  </div>
                </b-form-group>
                <b-form-group label="По-батькові:">
                  <b-form-input
                    v-model="middle_name"
                    type="text"
                    @blur="$v.middle_name.$touch()"
                    :class="{ 'is-invalid': $v.middle_name.$error }"
                  ></b-form-input>
                  <div v-if="!$v.middle_name.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div
                    v-if="!$v.middle_name.maxLength"
                    class="invalid-feedback"
                  >
                    {{ msgMaxLength50 }}
                  </div>
                </b-form-group>
                <b-form-group label="Ім'я користувача (нік):">
                  <b-form-input
                    v-model="username"
                    type="text"
                    @blur="$v.username.$touch()"
                    :class="{ 'is-invalid': $v.username.$error }"
                  ></b-form-input>
                  <div v-if="!$v.username.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.username.alpha" class="invalid-feedback">
                    {{ msgAlpha }}
                  </div>
                  <div v-if="!$v.username.maxLength" class="invalid-feedback">
                    {{ msgMaxLength150 }}
                  </div>
                </b-form-group>
                <b-form-group label="Електронна пошта:">
                  <b-form-input
                    v-model="email"
                    type="email"
                    @blur="$v.email.$touch()"
                    :class="{ 'is-invalid': $v.email.$error }"
                  ></b-form-input>
                  <div v-if="!$v.email.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.email.email" class="invalid-feedback">
                    {{ msgEmail }}
                  </div>
                  <div v-if="!$v.email.maxLength" class="invalid-feedback">
                    {{ msgMaxLength254 }}
                  </div>
                </b-form-group>
                <b-form-group label="Посада:">
                  <b-form-input
                    v-model="position"
                    type="text"
                    @blur="$v.position.$touch()"
                    :class="{ 'is-invalid': $v.position.$error }"
                  ></b-form-input>
                  <div v-if="!$v.position.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.position.maxLength" class="invalid-feedback">
                    {{ msgMaxLength150 }}
                  </div>
                </b-form-group>
                <b-form-group label="Номер телефону:">
                  <b-form-input
                    v-model="phone"
                    type="tel"
                    @blur="$v.phone.$touch()"
                    :class="{ 'is-invalid': $v.phone.$error }"
                  ></b-form-input>
                  <div v-if="!$v.phone.required" class="invalid-feedback">
                    {{ msgRequired }}
                  </div>
                  <div v-if="!$v.phone.maxLength" class="invalid-feedback">
                    {{ msgMaxLength14 }}
                  </div>
                  <div v-if="!$v.phone.numeric" class="invalid-feedback">
                    {{ msgNumeric }}
                  </div>
                </b-form-group>
                <b-form-group label="Фото:">
                  <b-form-file
                    browse-text="Вибрати"
                    type="file"
                    v-model="avatar"
                    @change="selectFile"
                    accept="image/*"
                  ></b-form-file>
                </b-form-group>
                <b-button variant="primary" type="submit"> Зберегти </b-button>
              </b-form>
            </div>
          </div>
        </div>
        <Footer />
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
  numeric
} from 'vuelidate/lib/validators'
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'
import LeftNav from '../components/LeftNav'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'

const alpha = helpers.regex('alpha', /^[\w.@+-]+$/)

export default {
  name: 'create_project',
  data() {
    return {
      last_name: this.$store.state.currentUserAPI.last_name,
      first_name: this.$store.state.currentUserAPI.first_name,
      middle_name: this.$store.state.currentUserAPI.middle_name,
      username: this.$store.state.currentUserAPI.username,
      position: this.$store.state.currentUserAPI.position,
      email: this.$store.state.currentUserAPI.email,
      phone: this.$store.state.currentUserAPI.phone,
      avatar: null,
      msgRequired: "Поле обов'язкове для заповнення",
      msgAlpha:
        'Можуть бути присутні тільки тільки букви, цифри та знаки @/./+/-/_',
      msgMaxLength150: 'Максимальна довжина поля - 150 символів',
      msgMaxLength50: 'Максимальна довжина поля - 50 символів',
      msgEmail: 'Поле повинне містити адресу електронної пошти',
      msgMaxLength254: 'Максимальна довжина поля - 254 символів',
      msgMaxLength14: 'Максимальна довжина поля - 14 символів',
      msgNumeric: 'Поле має містити тільки цифри'
    }
  },
  validations: {
    username: { required, alpha, maxLength: maxLength(150) },
    email: { required, email, maxLength: maxLength(254) },
    last_name: { required, maxLength: maxLength(150) },
    first_name: { required, maxLength: maxLength(150) },
    middle_name: { required, maxLength: maxLength(50) },
    position: { required, maxLength: maxLength(150) },
    phone: { required, maxLength: maxLength(14), numeric }
  },
  components: {
    LeftNav,
    TopNav,
    Footer
  },
  onIdle() {
    this.$store.dispatch('LOGOUT').then(() => {
      this.$router.push({ name: 'login' })
    })
  },
  computed: mapState(['currentUserAPI']),
  created() {
    getAPI
      .get('/api/v1/profile/', {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.$store.state.currentUserAPI = response.data
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    selectFile(event) {
      this.avatar = event.target.files[0]
    },
    changeProfile() {
      const data = new FormData()
      data.append('last_name', this.last_name)
      data.append('first_name', this.first_name)
      data.append('middle_name', this.middle_name)
      data.append('username', this.username)
      data.append('position', this.position)
      data.append('email', this.email)
      data.append('phone', this.phone)
      if (this.avatar) data.append('avatar', this.avatar)
      console.log(this.middle_name)
      this.$store
        .dispatch('UPDATE_PROFILE', data)
        .then((succes) => {})
        .catch((e) => {
          if (e.response.status === 400) {
            this.makeError(e.response.data.username[0])
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
