<template>
  <div>
    我是首页
    {{msg}}
    <tinymce-editor v-model="msg"
      :disabled="disabled"
      ref="editor"></tinymce-editor>
    <!-- <button @click="clear">清空内容</button>
    <button @click="disabled = true">禁用</button> -->
  </div>
</template>

<script>
import TinymceEditor from '@/components/tinymce'
export default {
  components: {
    TinymceEditor
  },
  data() {
    return {
      msg: '请输入内容',
      disabled: false
    }
  },
  methods: {
    //鼠标单击的事件
    // onClick(e, editor) {
    //   console.log('Element clicked')
    //   console.log(e)
    //   console.log(editor)
    // },
    // //清空内容
    // clear() {
    //   this.$refs.editor.clear()
    // }
  }
}
</script>

<style scoped>