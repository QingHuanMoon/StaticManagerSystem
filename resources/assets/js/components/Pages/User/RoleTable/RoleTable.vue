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
    name: 'roleTable',
    data() {
      return {
        canEdit: [0,1],
        fieldTypes: [1,1],
        ApiName: 'RoleTable'
      }
    },
    components: {
      baseTable
    }
  }
</script>