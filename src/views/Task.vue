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
              <h3 class="text-dark mb-0">{{ ефіл.title }}</h3>
            </div>
            <div>
              <p v-if="project.category === 'Teaching'">
                <strong>Категорія:</strong> Навчання
              </p>
              <p v-if="project.category === 'Science'">
                <strong>Категорія:</strong> Наука
              </p>
              <p v-if="project.category === 'Business'">
                <strong>Категорія:</strong> Бізнес
              </p>
              <div>
                <p>
                  <strong>Дата створення:</strong>
                  {{ date(project.created_date) }}
                </p>
              </div>
              <div v-for="worker in $store.state.usersAPI" :key="worker.id">
                <p v-if="worker.username === project.author">
                  <strong>Керівник проекту:</strong>
                  {{ worker.last_name }} {{ worker.first_name }}
                  {{ worker.middle_name }}
                </p>
              </div>
              <strong>Виконавці: </strong>
              <div
                id="line"
                v-for="performer in project.performers"
                :key="performer.id"
              >
                <div
                  id="line"
                  v-for="worker in $store.state.usersAPI"
                  :key="worker.id"
                >
                  <div id="line" v-if="performer === worker.id">
                    {{ worker.last_name }} {{ worker.first_name }}
                    {{ worker.middle_name }};
                  </div>
                </div>
              </div>
              <div style="margin-top: 20px; margin-bottom: 10px">
                {{ project.description }}
              </div>
            </div>
            <div
              style="text-align: right; margin-bottom: 10px; margin-right: 20px"
            >
              <b-button v-b-modal.created_task variant="primary"
                ><i class="fas fa-plus"></i> Додати завдання</b-button
              >
            </div>
            <div class="table-responsive">
              <b-table
                id="projects-table"
                class="table"
                striped
                hover
                :items="items"
                :fields="fields"
              >
                <template #cell(author)="data">
                  <template v-for="worker in $store.state.usersAPI">
                    <template v-if="data.item.author === worker.id">
                      {{ worker.last_name }} {{ worker.first_name }}
                      {{ worker.middle_name }}
                    </template>
                  </template>
                </template>
                <template #cell(performer)="data">
                  <template v-for="worker in $store.state.usersAPI">
                    <template v-if="data.item.performer === worker.id">
                      {{ worker.last_name }} {{ worker.first_name }}
                      {{ worker.middle_name }}
                    </template>
                  </template>
                </template>
                <template #cell(created_date)="data">{{
                  date(data.item.created_date)
                }}</template>
                <template #cell(deadline)="data">
                  {{ date_and_time(data.item.deadline) }}
                </template>
              </b-table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style>
#line {
  display: inline-block;
}
</style>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'
import LeftNav from '../components/LeftNav'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'

export default {
  name: 'task',
  data() {
    return {
      task: null,
      fields: [
        {
          key: 'title',
          label: 'Назва завдання',
          sortable: true
        },
        {
          key: 'author',
          label: 'Автор',
          sortable: true
        },
        {
          key: 'created_date',
          label: 'Дата створення',
          sortable: true
        },
        {
          key: 'performer',
          label: 'Виконавець',
          sortable: true
        },
        {
          key: 'created_date',
          label: 'Дата створення',
          sortable: true
        },
        {
          key: 'deadline',
          label: 'Дедлайн',
          sortable: true
        }
      ],
      items: [],
      options: [],
      title: '',
      deadline: '',
      performer: ''
    }
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
  computed: mapState(['currentUserAPI', 'usersAPI']),
  created() {
    getAPI
      .get(`/api/v1/projects/project/${this.$route.params.id}`, {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.project = response.data
        this.items = this.project.tasks
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
    getAPI
      .get('/api/v1/profiles/', {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.$store.state.usersAPI = response.data
        this.$store.state.usersAPI.forEach((worker) => {
          // if (this.project.performers.includes(worker.id))
          this.options.push({
            text: worker.last_name + ' ' + worker.first_name,
            value: worker.id
          })
        })
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    date_and_time(data) {
      var date = new Date(data)
      return date.toLocaleString('ua', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      })
    },
    date(data) {
      var date = new Date(data)
      return date.toLocaleString('ua', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    createTask() {
      console.log(this.date)
      console.log(this.time)
      this.$store
        .dispatch('CREATE_TASK', {
          title: this.title,
          deadline: this.date + 'T' + this.time,
          performer: this.performer,
          project: this.$route.params.id
        })
        .then((succes) => {})
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
