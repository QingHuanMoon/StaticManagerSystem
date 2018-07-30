<template>
    <div id="main">
        <mavon-editor :ishljs = "true" v-model="value" style="min-height: 800px"></mavon-editor>
    </div>
</template>

<script>
    export default {
      name: 'WFMarkDown',
      data() {
        return {
          value: '',
          helo: 'hello'
        }
      }
    }
</script>

<style>

</style>
