<template>
  <div :style="{background: bgColor}" class="ivu-shrinkable-menu">
    <slot name="top"></slot>
    <SidebarMenu
      v-show="!shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :open-names="openNames"
      @on-change="handleChange"
    ></SidebarMenu>
    <SidebarMenuShrink
      v-show="shrink"
      :menu-theme="theme"
      :menu-list="menuList"
      :icon-color="shrinkIconColor"
      @on-change="handleChange"
    ></SidebarMenuShrink>
  </div>
</template>

<script>
  import SidebarMenu from './components/SidebarMenu.vue';
  import SidebarMenuShrink from './components/SidebarMenuShrink.vue';

  export default {
    name: 'ShrinkableMenu',
    components: {
      SidebarMenu,
      SidebarMenuShrink
    },
    props: {
      shrink: {
        type: Boolean,
        default: false
      },
      menuList: {
        type: Array,
        required: true
      },
      theme: {
        type: String,
        default: 'dark'
      },
      openNames: {
        type: Array
      }
    },
    computed: {
      bgColor() {
        return this.theme === 'dark' ? '#495060' : '#fff';
      },
      shrinkIconColor() {
        return this.theme === 'dark' ? '#fff' : '#495060';
      }
    },
    methods: {
      handleChange(item) {
        switch (item.openMode) {
          case 'in_self':
            this.$router.push({name: item.menuId});
            break;
          case 'in_blank':
            window.open(`http://${window.location.host}/#/${item.menuId}`);
            break;
          case 'out_self':
            this.$router.push({name: item.menuId});
            break;
          case 'out_blank':
            window.open(`http://${item.menuPath}`);
            break;
        }
        this.$emit('on-change', item);
      }
    }
  };
</script>

<style scoped>
  .ivu-shrinkable-menu {
    height: 100%;
    width: 100%;
  }
</style>
