<template>
  <Menu mode="horizontal" theme="dark" active-name="1">
    <div class="layout-logo"></div>
    <div class="layout-nav">
      <Submenu name="1">
        <template slot="title">
          应用系统
        </template>
        <router-link :to="`/appSystems/${app.id}`" :key="app.id" v-for="app in appSystems">
          <MenuItem :name="app.name">{{app.name}}</MenuItem>
        </router-link>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          平台系统
        </template>
        <MenuItem :name="platform.name" :key="platform.id" v-for="platform in platformSystems">{{platform.name}}
        </MenuItem>
      </Submenu>
    </div>
  </Menu>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: "Navbar",
    created() {
      this.fetchAppSystems()
      this.fetchPlatformSystems()
    },
    methods: {
      ...mapActions([
        'fetchAppSystems',
        'fetchPlatformSystems'
      ])
    },
    computed: {
      ...mapGetters([
        'appSystems',
        'platformSystems'
      ])
    }
  }
</script>

<style scoped>

</style>
