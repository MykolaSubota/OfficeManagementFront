import Vue from 'vue'
import Vuex from 'vuex'
import { getAPI } from './axios-api'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState()],
  state: {
    accessToken: localStorage.accessToken,
    refreshToken: localStorage.refreshToken,
    myProjects: JSON.parse(localStorage.getItem('myProjects')),
    projectsAPI: '',
    usersAPI: '',
    currentUserAPI: '',
    stopwatch: '00:00:00'
  },
  getters: {
    loggedIn(state) {
      return state.accessToken != null || localStorage.accessToken != null
    }
  },
  mutations: {
    updateStorage(state, { access, refresh }) {
      state.accessToken = access
      state.refreshToken = refresh
    },
    destroyToken(state) {
      state.accessToken = null
      state.refreshToken = null
      localStorage.accessToken = null
      localStorage.refreshToken = null
    }
  },
  actions: {
    LOGIN(context, usercredentials) {
      return new Promise((resolve, reject) => {
        getAPI
          .post('/auth/jwt/create/', {
            username: usercredentials.username,
            password: usercredentials.password
          })
          .then((response) => {
            context.commit('updateStorage', {
              access: response.data.access,
              refresh: response.data.refresh
            })
            localStorage.accessToken = response.data.access
            localStorage.refreshToken = response.data.refresh
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    LOGOUT(context) {
      if (context.getters.loggedIn) {
        context.commit('destroyToken')
      }
    },
    REGISTER: ({ commit }, { username, email, password }) => {
      return new Promise((resolve, reject) => {
        getAPI
          .post('/auth/users/', { username, email, password })
          .then(({ data, status }) => {
            if (status === 201) {
              resolve(true)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    CREATE_PROJECT: (
      { commit, state },
      { title, description, category, performers }
    ) => {
      return new Promise((resolve, reject) => {
        getAPI
          .post(
            'api/v1/projects/project',
            {
              title,
              description,
              category,
              performers
            },
            {
              headers: { Authorization: `JWT ${state.accessToken}` }
            }
          )
          .then(({ data, status }) => {
            if (status === 201) {
              resolve(true)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    CREATE_TASK: (
      { commit, state },
      { title, deadline, performer, project }
    ) => {
      return new Promise((resolve, reject) => {
        getAPI
          .post(
            '/api/v1/projects/task',
            {
              title,
              deadline,
              performer,
              project
            },
            {
              headers: { Authorization: `JWT ${state.accessToken}` }
            }
          )
          .then(({ data, status }) => {
            if (status === 201) {
              resolve(true)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    CREATE_TIME_FIXATION: ({ commit, state }, { task, duration }) => {
      return new Promise((resolve, reject) => {
        getAPI
          .post(
            '/api/v1/projects/time_fixation',
            {
              task,
              duration
            },
            {
              headers: { Authorization: `JWT ${state.accessToken}` }
            }
          )
          .then(({ data, status }) => {
            if (status === 201) {
              resolve(true)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    UPDATE_PROFILE: ({ commit, state }, data) => {
      return new Promise((resolve, reject) => {
        getAPI
          .put('/api/v1/profile/', data, {
            headers: { Authorization: `JWT ${state.accessToken}` }
          })
          .then(({ data, status }) => {
            if (status === 201) {
              resolve(true)
            }
          })
          .catch((error) => {
            reject(error)
          })
      })
    }
  }
})
