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
              <h3 class="text-dark mb-0">{{ task.title }}</h3>
            </div>
            <p>
              <strong>Належність до проекту:</strong>
              {{ task.project.title }}
            </p>
            <p>
              <strong>Автор:</strong>
              {{ task.author.last_name }} {{ task.author.first_name }}
              {{ task.author.middle_name }}
            </p>
            <p>
              <strong>Виконавець:</strong>
              {{ task.author.last_name }} {{ task.author.first_name }}
              {{ task.author.middle_name }}
            </p>
            <p>
              <strong>Дата створення:</strong>
              {{ date(task.created_date) }}
            </p>
            <p>
              <strong>Дедлайн:</strong>
              {{ date_and_time(task.deadline) }}
            </p>
            <h4>00:00:00</h4>
            <div
              style="text-align: right; margin-bottom: 10px; margin-right: 20px"
            >
              <b-button variant="primary" @click="createTimeFixation()"
                ><template v-if="$store.state.stopwatch === '00:00:00'"
                  ><i class="fas fa-play"></i> Старт</template
                ><template v-else
                  ><i class="far fa-stop-circle"></i> Стоп</template
                ></b-button
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
                <template #cell(date)="data">
                  {{ date(data.item.date) }}
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
          key: 'date',
          label: 'Дата',
          sortable: true
        },
        {
          key: 'duration',
          label: 'Витрачено часу',
          sortable: true
        }
      ],
      items: [],
      options: [],
      duration: '05:45:15'
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
      .get(`/api/v1/projects/task/${this.$route.params.id}`, {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.task = response.data
        this.items = this.task.timer_fixations
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
    createTimeFixation() {
      console.log(this.date)
      console.log(this.time)
      this.$store
        .dispatch('CREATE_TIME_FIXATION', {
          task: this.task.id,
          duration: this.duration
        })
        .then((succes) => {})
        .catch((e) => {
          console.log(e)
        })
    }
  }
}
</script>
