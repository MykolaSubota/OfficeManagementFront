<template>
  <nav
    class="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0"
  >
    <div class="container-fluid d-flex flex-column p-0">
      <router-link
        class="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
        to="/"
      >
        <div class="sidebar-brand-icon rotate-n-15">
          <i class="fas fa-tasks"></i>
        </div>
        <div class="sidebar-brand-text mx-3"><span>office</span></div>
      </router-link>
      <hr class="sidebar-divider my-0" />
      <ul class="navbar-nav text-light" id="accordionSidebar">
        <li class="nav-item" v-if="$route.name === 'projects'">
          <router-link class="nav-link active" to="/"
            ><i class="fas fa-tachometer-alt"></i
            ><span>Проекти</span></router-link
          >
        </li>
        <li class="nav-item" v-else>
          <router-link class="nav-link" to="/"
            ><i class="fas fa-tachometer-alt"></i
            ><span>Проекти</span></router-link
          >
        </li>
        <li class="nav-item" v-if="$route.name === 'workers'">
          <router-link class="nav-link active" to="/workers"
            ><i class="fas fa-users"></i
            ><span class="sp">Працівники</span></router-link
          >
        </li>
        <li class="nav-item" v-else>
          <router-link class="nav-link" to="/workers"
            ><i class="fas fa-users"></i><span>Працівники</span></router-link
          >
        </li>
        <li class="nav-item"></li>
        <li class="nav-item"></li>
      </ul>
      <div class="text-center d-none d-md-inline"></div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'LeftNav'
}
</script>
