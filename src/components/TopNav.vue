<template>
  <nav
    class="navbar navbar-light navbar-expand bg-white shadow mb-4 topbar static-top"
  >
    <div class="container-fluid">
      <button
        class="btn btn-link d-md-none rounded-circle mr-3"
        id="sidebarToggleTop"
        type="button"
      >
        <i class="fas fa-bars"></i>
      </button>
      <ul class="navbar-nav flex-nowrap ml-auto">
        <div class="d-none d-sm-block topbar-divider"></div>
        <b-dropdown id="dropdown-1" variant="link" class="nav-item no-arrow">
          <template #button-content>
            <a
              class="dropdown-toggle nav-link"
              aria-expanded="false"
              data-toggle="dropdown"
              href="#"
              ><span class="d-none d-lg-inline mr-2 text-gray-600 small"
                >{{ currentUserAPI.first_name }}
                {{ currentUserAPI.last_name }}</span
              ><img
                v-if="currentUserAPI.avatar"
                class="border rounded-circle img-profile"
                :src="currentUserAPI.avatar" /><img
                v-else
                class="border rounded-circle img-profile"
                src="../assets/avatar.jpg"
            /></a>
          </template>
          <b-dropdown-item
            ><router-link
              class="dropdown-item"
              :to="{ name: 'profile', params: { id: currentUserAPI.id } }"
              ><i class="fas fa-user fa-sm fa-fw mr-2 text-gray-400"></i
              >&nbsp;Мій профіль</router-link
            ></b-dropdown-item
          >
          <b-dropdown-item
            ><router-link class="dropdown-item" to="/settings"
              ><i class="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400"></i
              >&nbsp;Налаштування</router-link
            ></b-dropdown-item
          >
          <b-dropdown-divider></b-dropdown-divider>
          <b-dropdown-item
            ><router-link class="dropdown-item" to="/logout"
              ><i class="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i
              >&nbsp;Вийти</router-link
            ></b-dropdown-item
          >
        </b-dropdown>
      </ul>
    </div>
  </nav>
</template>

<script>
import { getAPI } from '../store/axios-api'
import { mapState } from 'vuex'

export default {
  name: 'TopNav',
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
  }
}
</script>
