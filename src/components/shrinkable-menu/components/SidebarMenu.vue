<template>
  <Menu ref="sideMenu" :active-name="$route.name" :open-names="openNames" :theme="menuTheme" width="auto">
    <template v-for="item in menuList">
      <MenuItem v-if="item.children.length<1" :name="item.menuId" :key="'menuitem' + item.menuId" @click.native="changeMenu(item)">
        <Icon :type="item.menuIcon || item.menuIcon" :size="iconSize" :key="'menuicon' + item.menuId"></Icon>
        <span class="layout-text" :key="'title' + item.menuId">{{ item.menuName }}</span>
      </MenuItem>

      <Submenu v-if="item.children.length >= 1" :name="item.menuId" :key="item.menuId">
        <template slot="title">
          <Icon :type="item.menuIcon" :size="iconSize"></Icon>
          <span class="layout-text">{{ item.menuName }}</span>
        </template>
        <template v-for="child in item.children">
          <MenuItem :name="child.menuId" :key="'menuitem' + child.menuId" @click.native="changeMenu(child)">
            <Icon :type="child.menuIcon" :size="iconSize" :key="'icon' + child.menuId"></Icon>
            <span class="layout-text" :key="'title' + child.menuId">{{ child.menuName }}</span>
          </MenuItem>
        </template>
      </Submenu>
    </template>
  </Menu>
</template>

<script>
  export default {
    name: 'SidebarMenu',
    props: {
      menuList: Array,
      iconSize: Number,
      menuTheme: {
        type: String,
        default: 'dark'
      },
      openNames: {
        type: Array
      }
    },
    methods: {
      changeMenu(item) {
        this.$emit('on-change', item);
      },
    },
    updated() {
      this.$nextTick(() => {
        if (this.$refs.sideMenu) {
          this.$refs.sideMenu.updateOpened();
          this.$refs.sideMenu.updateActiveName();
        }
      });
    }
  };
</script>

<style>

</style>
