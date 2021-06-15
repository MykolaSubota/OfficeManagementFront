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
              <h3 class="text-dark mb-0">Працівники</h3>
            </div>
            <div class="table-responsive">
              <b-table
                id="workers-table"
                class="table"
                striped
                hover
                :current-page="currentPage"
                :items="items"
                :fields="fields"
              >
                <template #cell(avatar)="data"
                  ><img
                    v-if="data.item.avatar"
                    class="rounded-circle mr-2"
                    width="40"
                    height="40"
                    :src="data.item.avatar" /><img
                    v-else
                    class="rounded-circle mr-2"
                    width="40"
                    height="40"
                    src="../assets/avatar.jpg"
                /></template>
                <template #cell(PIB)="data">
                  <router-link
                    style="color: black"
                    :to="{ name: 'profile', params: { id: data.item.id } }"
                  >
                    {{ data.item.last_name }} {{ data.item.first_name }}
                    {{ data.item.middle_name }}
                  </router-link>
                </template>
              </b-table>
              <b-pagination
                class="pagin"
                align="center"
                pills
                v-model="currentPage"
                :total-rows="rows"
                aria-controls="workers-table"
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
.pagin {
  margin-top: 20px;
}
</style>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'
import LeftNav from '../components/LeftNav'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'
export default {
  name: 'Workers',
  data() {
    return {
      currentPage: 1,
      fields: [
        {
          key: 'avatar',
          label: '',
          sortable: false
        },
        {
          key: 'PIB',
          label: 'ПІБ',
          sortable: true
        },
        {
          key: 'email',
          label: 'Електронна пошта',
          sortable: false
        },
        {
          key: 'position',
          label: 'Посада',
          sortable: false
        }
      ],
      items: []
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
        this.items = this.$store.state.usersAPI
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
