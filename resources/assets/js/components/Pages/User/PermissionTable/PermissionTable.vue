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
    name: 'permissionTable',
    data() {
      return {
        canEdit: [0,1,1,1,1],
        fieldTypes: [1,1,1,1,1],
        ApiName: 'PermissionTable'
      }
    },
    components: {
      baseTable
    }
  }
</script>