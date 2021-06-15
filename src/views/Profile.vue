<template>
  <div id="page-top">
    <div id="wrapper">
      <LeftNav />
      <div class="d-flex flex-column" id="content-wrapper">
        <div id="content">
          <TopNav />
          <div class="container-fluid"></div>
          <div style="text-align: center">
            <img
              v-if="profile.avatar"
              class="border rounded-circle img-profile center"
              :src="profile.avatar"
              width="300"
              height="300"
            /><img
              v-else
              class="border rounded-circle img-profile"
              src="../assets/avatar.jpg"
              width="300"
              height="300"
            />
            <h2>
              <strong>
                {{ profile.last_name }} {{ profile.first_name }}
                {{ profile.middle_name }}</strong
              >
            </h2>
            <p><strong>Посада:</strong> {{ profile.position }}</p>
            <h5><strong>Контактні дані</strong></h5>
            <p><strong>Електронна пошта:</strong> {{ profile.email }}</p>
            <p><strong>Номер телефону:</strong> {{ profile.phone }}</p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'
import LeftNav from '../components/LeftNav'
import TopNav from '../components/TopNav'
import Footer from '../components/Footer'

export default {
  name: 'profile',
  data() {
    return {
      profile: null
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
  computed: mapState(['currentUserAPI']),
  created() {
    console.log(this.$route)
    getAPI
      .get(`/api/v1/profile/${this.$route.params.id}/`, {
        headers: { Authorization: `JWT ${this.$store.state.accessToken}` }
      })
      .then((response) => {
        this.profile = response.data
        console.log(response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
