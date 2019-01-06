<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in currentPath"
      :href="item.menuPath"
      :key="item.menuId"
    >{{ itemTitle(item) }}
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
  export default {
    name: 'BreadcrumbNav',
    props: {
      currentPath: Array
    },
    methods: {
      itemTitle(item) {
        if (typeof item.menuName === 'object') {
          return this.$t(item.menuName.i18n);
        } else {
          return item.menuName;
        }
      }
    }
  };
</script>
