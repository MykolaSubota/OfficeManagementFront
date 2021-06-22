<template>
  <b-form @submit.prevent="createProject">
    <b-form-group label="Назва проекту:">
      <b-form-input v-model="title" type="text" />
    </b-form-group>
    <b-form-group label="Короткий опис:">
      <b-form-textarea v-model="description" rows="3" />
    </b-form-group>
    <b-form-group label="Категорія:">
      <b-form-radio-group v-model="category">
        <b-form-radio value="Teaching">Навчання</b-form-radio>
        <b-form-radio value="Science">Наука</b-form-radio>
        <b-form-radio value="Business">Бізнес</b-form-radio>
      </b-form-radio-group>
    </b-form-group>
    <b-button v-b-modal="'modal-form'" variant="primary"
      >Вибрати виконавців</b-button
    >
    <b-modal id="modal-form" ok-only>
      <b-form-group>
        <b-form-checkbox-group
          id="checkbox-group-1"
          v-model="performers"
          :options="options"
        ></b-form-checkbox-group>
      </b-form-group>
    </b-modal>
    <div>Вибрано: {{ performers.length }} працівників.</div>
    <b-button variant="primary" type="submit"> Створити </b-button>
  </b-form>
</template>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'

export default {
  name: 'FormCreateProject',
  data() {
    return {
      options: [],
      title: '',
      description: '',
      category: '',
      performers: []
    }
  },
  computed: {
    ...mapState(['usersAPI']),
    rows() {
      return this.items.length
    }
  },
  created() {
    getAPI
      .get('/api/v1/profiles/', {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.$store.state.usersAPI = response.data
        this.$store.state.usersAPI.forEach((option) => {
          this.options.push({
            text: option.last_name + ' ' + option.first_name,
            value: option.id
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
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
    createProject() {
      this.$store
        .dispatch('CREATE_PROJECT', {
          title: this.title,
          description: this.description,
          category: this.category,
          performers: this.performers
        })
        .then((succes) => {
          this.$router.go()
        })
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
