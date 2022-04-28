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
            <div
              style="text-align: right; margin-bottom: 10px; margin-right: 20px"
            >
              <b-button
                variant="primary"
                v-if="
                  task.timer_fixations[task.timer_fixations.length - 1] &&
                  task.timer_fixations[task.timer_fixations.length - 1]
                    .duration !== '00:00:00'
                "
                @click="createTimeFixation()"
                ><i class="fas fa-play"></i> Старт</b-button
              ><b-button
                variant="primary"
                v-else-if="
                  !task.timer_fixations[task.timer_fixations.length - 1]
                "
                @click="createTimeFixation()"
                ><i class="fas fa-play"></i> Старт</b-button
              >
              <b-button variant="primary" v-else @click="updateTimeFixation()"
                ><i class="far fa-stop-circle"></i> Стоп</b-button
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
                <template #cell(duration)="data">
                  {{ time_duration(data.item.start, data.item.stop) }}
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
          key: 'start',
          label: 'Початок',
          sortable: false
        },
        {
          key: 'stop',
          label: 'Кінець',
          sortable: false
        },
        {
          key: 'duration',
          label: 'Витрачено часу',
          sortable: true
        }
      ],
      items: [],
      options: [],
      duration: '00:00:00',
      timer_fixation_id: null
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
    time_duration(start, stop) {
      var st = new Date(
        2020,
        1,
        1,
        Number(start.split(':')[0]),
        Number(start.split(':')[1]),
        Number(start.split(':')[2].split('.')[0]),
        Number(start.split(':')[2].split('.')[1])
      )
      var sp = new Date(
        2020,
        1,
        1,
        Number(stop.split(':')[0]),
        Number(stop.split(':')[1]),
        Number(stop.split(':')[2].split('.')[0]),
        Number(stop.split(':')[2].split('.')[1])
      )
      var milliseconds = parseInt(((sp - st) % 1000) / 100)
      var seconds = parseInt(((sp - st) / 1000) % 60)
      var minutes = parseInt(((sp - st) / (1000 * 60)) % 60)
      var hours = parseInt(((sp - st) / (1000 * 60 * 60)) % 24)

      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      return hours + ':' + minutes + ':' + seconds + '.' + milliseconds
    },
    createTimeFixation() {
      this.$store
        .dispatch('CREATE_TIME_FIXATION', {
          task: this.task.id,
          duration: this.duration
        })
        .then((succes) => {
          this.$router.go()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    updateTimeFixation() {
      this.$store
        .dispatch('UPDATE_TIME_FIXATION', {
          task: this.task.id,
          duration: '01:00:00',
          timer_fixation_id: this.task.timer_fixations[
            this.task.timer_fixations.length - 1
          ].id
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
