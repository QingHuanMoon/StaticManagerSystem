<template>
    <section>
        <base-table
                :canEdit="canEdit"
                :fieldTypes="fieldTypes"
                :ApiName="ApiName">
        </base-table>
    </section>
</template>


<script>
    import baseTable from '../../../Modules/Table/BaseTable'
    export default {
      name: 'userTable',
      data() {
        return {
          canEdit: [0,1,1,1,0],
          fieldTypes: [1,1,1,3,3],
          ApiName: 'UserTable'
        }
      },
      components: {
        baseTable
      }
    }
</script>

<style scoped lang="less">
    @import "UserTable.less";
</style>
