<template>
  <div>
    <template v-for="(item, index) in menuList">
      <div style="text-align: center;" :key="index">
        <Dropdown transfer v-if="item.children.length > 0" placement="right-start" :key="index">
          <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
            <Icon :size="20" :color="iconColor" :type="item.menuIcon"></Icon>
          </Button>
          <DropdownMenu style="width: 200px;" slot="list">
            <template v-for="(child, i) in item.children">
              <DropdownItem :name="child.menuId" :key="i" @click.native="changeMenu(child)">
                <Icon :type="child.menuIcon"></Icon>
                <span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
            </template>
          </DropdownMenu>
        </Dropdown>
        <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu(item)">
          <Button @click="changeMenu(item)" style="width: 70px;margin-left: -5px;padding:10px 0;"
                  type="text">
            <Icon :size="20" :color="iconColor" :type="item.menuIcon"></Icon>
          </Button>
          <DropdownMenu style="width: 200px;" slot="list">
            <DropdownItem :name="item.menuName" :key="'d' + index">
              <Icon :type="item.menuIcon"></Icon>
              <span style="padding-left:10px;">{{ itemTitle(item) }}</span></DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SidebarMenuShrink',
    props: {
      menuList: {
        type: Array
      },
      iconColor: {
        type: String,
        default: 'white'
      },
      menuTheme: {
        type: String,
        default: 'darck'
      }
    },
    methods: {
      changeMenu(active) {
        this.$emit('on-change', active);
      },
      itemTitle(item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title.i18n);
        } else {
          return item.menuName;
        }
      }
    }
  };
</script>
