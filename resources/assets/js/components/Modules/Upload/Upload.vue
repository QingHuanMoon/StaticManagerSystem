<template>
  <section>
    <Upload action="https://www.blog.app/test/upload" name="img">
      <Button type="ghost" icon="ios-cloud-upload-outline">單文件上傳</Button>
    </Upload>
    <Upload
      multiple
      action="https://www.blog.app/test/upload" name="img"
      :on-success="handleSuccess">
      <Button type="ghost" icon="ios-cloud-upload-outline">多文件上傳</Button>
    </Upload>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        msg: 'Hello World'
      }
    },
    methods: {
      handleSuccess(res, file) {
        console.log(res)
        console.log(file)
      }
    }
  }
</script>


<style scoped lang="less">

</style>
