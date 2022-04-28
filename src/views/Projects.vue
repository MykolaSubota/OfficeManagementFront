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
              <h3 class="text-dark mb-0">Проекти</h3>
              <b-button v-b-modal.created_project variant="primary"
                ><i class="fas fa-plus"></i> Додати проект</b-button
              >
              <b-modal
                id="created_project"
                title="Створення проекту"
                hide-footer
              >
                <form-create-project />
              </b-modal>
            </div>
            <div class="table-responsive">
              <b-table
                id="projects-table"
                class="table"
                striped
                hover
                :items="$store.state.myProjects"
                :fields="fields"
              >
                <template #cell(title)="data">
                  <router-link
                    style="color: black"
                    :to="{ name: 'project', params: { id: data.item.id } }"
                  >
                    {{ data.item.title }}
                  </router-link>
                </template>
                <template #cell(created_date)="data">
                  <p>{{ date(data) }}</p>
                </template>
                <template #cell(category)="data">
                  <p v-if="data.item.category === 'Teaching'">Навчання</p>
                  <p v-else-if="data.item.category === 'Science'">Наука</p>
                  <p v-else>Бізнес</p>
                </template>
              </b-table>
              <b-pagination
                class="pagin"
                align="center"
                pills
                v-model="currentPage"
                :total-rows="rows"
                aria-controls="projects-table"
              ></b-pagination>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<style>
@import url('../style/bootstrap.min.css');
.router-link-active {
  color: black;
}
</style>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'
import LeftNav from '../components/LeftNav'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
import FormCreateProject from '../components/FormCreateProject.vue'
export default {
  name: 'Projects',
  data() {
    return {
      currentPage: 1,
      fields: [
        {
          key: 'title',
          label: 'Назва проекту',
          sortable: true
        },
        {
          key: 'category',
          label: 'Категорія',
          sortable: false
        },
        {
          key: 'created_date',
          label: 'Дата створення',
          sortable: true
        }
      ]
    }
  },
  components: {
    LeftNav,
    TopNav,
    Footer,
    FormCreateProject
  },
  onIdle() {
    this.$store.dispatch('LOGOUT').then(() => {
      this.$router.push({ name: 'login' })
    })
  },
  computed: {
    ...mapState(['projectsAPI']),
    rows() {
      console.log(this.$store.state.myProjects)
      if (this.$store.state.myProjects)
        return this.$store.state.myProjects.length
      else return 0
    }
  },
  created() {
    getAPI
      .get('/api/v1/projects/', {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        console.log('sdasda')
        this.$store.state.projectsAPI = response.data
        this.$store.state.myProjects = []
        localStorage.myProjects = null
        this.$store.state.projectsAPI.forEach((project) => {
          console.log(99)
          if (project.author === this.$store.state.currentUserAPI.id) {
            this.$store.state.myProjects.push(project)
            console.log(100)
          } else {
            console.log('aaaaaa')
            project.performers.forEach((performer) => {
              if (performer === this.$store.state.currentUserAPI.id) {
                console.log('55555')
                this.$store.state.myProjects.push(project)
              }
            })
          }
        })
        localStorage.setItem(
          'myProjects',
          JSON.stringify(this.$store.state.myProjects)
        )
      })
      .catch((err) => {
        console.log(err)
      })
  },
  methods: {
    date(data) {
      var date = new Date(data.value)
      return date.toLocaleString('ua', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>
