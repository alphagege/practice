<template>
  <card class="headline">
    <span v-if="backRoute" class="back-title" @click="goBack()">
      <Icon type="chevron-left" class="icon-back"></Icon>
      <span class="headline-title">{{title}}</span>
    </span>
    <span v-else class="headline-title">{{title}}</span>
    <p v-if="subtitle" class="headline-subtitle">{{subtitle}}</p>
  </card>
</template>

<script>
  export default {
    name: "Headline",
    props: {
      backRoute: String,
      title: String,
      subtitle: String
    },
    methods: {
      goBack() {
        if (!this.$props.backRoute) return;
        this.$router.push(this.$props.backRoute)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .icon-back {
    font-size: 18px;
    margin-right: 8px;
  }

  .back-title {
    cursor: pointer;
  }

  .headline-title {
    font-size: 18px;
    font-weight: bold;
  }
  .headline-subtitle {
    font-size: 13px;
  }
</style>
