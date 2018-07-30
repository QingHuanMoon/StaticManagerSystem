<template>
  <section class="table-component uk-overflow-auto">
    <Spin size="large" fix v-if="!$store.state.Page.isComplete"></Spin>
    <div class="header uk-flex uk-flex-between">
      <div class="left"></div>
      <div class="right uk-flex uk-flex-right">
        <Col span="12" style="margin-top: .1rem;">
          <Input placeholder="Search something..." clearable v-model="searchVal"></Input>
        </Col>
      </div>
    </div>
    <table class="uk-table uk-table-divider uk-text-center">
      <thead>
      <tr class="table-title">
        <th class="uk-text-center" v-for="(item, index) in colData" :key="index" :data-key="item.key" >{{ item.title }}</th>
        <th class="uk-text-center" v-show="$store.state.Page.isComplete" style="width: 4rem;">操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(rowItem, rowIndex) in sourceData.data" :key="rowIndex">
        <td v-for="(item, key, index) in rowItem" :key="index" v-if="$store.state.Table.fieldExcept.indexOf(key) === -1">
          <span v-if="!(curEdit === rowIndex) || !canEdit[index]">
            <span v-if="fieldTypes[index] === 1">{{ item }}</span>
            <span v-else-if="fieldTypes[index] === 2">{{ item }}</span>
            <span v-else-if="fieldTypes[index] === 3">
             <i-switch v-model="sourceData.data[rowIndex][key] === 1" :disabled="true">
               <Icon type="android-done" slot="open"></Icon>
               <Icon type="android-close" slot="close"></Icon>
            </i-switch>
          </span>
          </span>
          <span v-if="curEdit === rowIndex">
            <input type="text" v-if="fieldTypes[index] === 1 && canEdit[index]" v-model="sourceData.data[rowIndex][key]" class="td-input">
            <input type="text" v-else-if="fieldTypes[index] === 2 && canEdit[index]" v-model="sourceData.data[rowIndex][key]">
            <span v-else-if="fieldTypes[index] === 3 && canEdit[index]">
              <i-switch v-model="sourceData.data[rowIndex][key] === 1" @on-change="switchChange(sourceData.data[rowIndex][key], rowIndex, key)">
               <Icon type="android-done" slot="open"></Icon>
               <Icon type="android-close" slot="close"></Icon>
              </i-switch>
            </span>
          </span>
        </td>
        <td class="action-btn uk-flex uk-flex-center">
          <button v-if="curEdit === rowIndex  && isCreate" class="uk-button uk-button-default uk-button-small" style="margin-right: .2rem;" @click="create">創建</button>
          <button v-if="curEdit !== rowIndex" class="uk-button uk-button-secondary uk-button-small" style="margin-right: .2rem;" @click="edit(rowIndex)">編輯</button>
          <button v-if="curEdit === rowIndex && !isCreate" class="uk-button uk-button-primary uk-button-small" style="margin-right: .2rem;" @click="save(rowIndex)">保存</button>
          <button  v-if="curEdit !== rowIndex" class="uk-button uk-button-danger uk-button-small" @click="deleteRow(rowIndex)">刪除</button>
          <button  v-if="curEdit === rowIndex && !isCreate" class="uk-button uk-button-default uk-button-small" @click="cancelEdit">取消</button>
          <button  v-if="curEdit === rowIndex && isCreate" class="uk-button uk-button-secondary uk-button-small" @click="cancelCreate">撤銷</button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
  export default
  {
    data() {
      return {
        colData: [],
        sourceData: [],
        newRow: {},
        defaulExcept: ['created_at', 'updated_at', 'deleted_at'],
        isEdit: false,
        isCreate:  false,
        curEdit: -1,
        searchVal: '',
        curPage: 1,
      }
    },
    props:
      {
        canEdit: Array,
        fieldTypes: Array,
        except: Array,
        ApiName: String,
      },
    methods: {
      async getCol () {
        let {data} = await axios.get(this.$store.state.API[this.ApiName].R + '/show')
        this.colData = data
        this.colData.forEach((item, index) =>  {
          if(this.fieldTypes[index] === 3 ) {
            this.newRow[item.key] = true
          } else {
            this.newRow[item.key] = ''
          }
        })
      },
      async getSource () {
        let {data} = await axios.get(this.$store.state.API[this.ApiName].R, {
          params: {
            page: this.curPage
          }
        })
        this.sourceData = data;
        this.$store.dispatch('setTotal', data.total)
      },
      setVuexExcept(item) {
        this.$store.dispatch('setExcept', item)
      },
      edit(rowNum) {
        if(this.isCreate) {
          console.log('create')
          this.cancelCreate()
        }
        this.curEdit = rowNum
      },
      async save(rowNum) {
        for (let i in this.sourceData.data[rowNum]) {
          if (this.sourceData.data[rowNum][i] === 1) {
            this.sourceData.data[rowNum][i] === true
          } else if (this.sourceData.data[rowNum][i] === 0) {
            this.sourceData.data[rowNum][i] === false
          }
        }
        let {status, data} = await axios.post(this.$store.state.API[this.ApiName].U, {
          id: this.sourceData.data[rowNum].id,
          data: this.sourceData.data[rowNum]
        })
        this.pushTips(status, data)
        this.curEdit = -1
      },
      async deleteRow(rowNum) {
        let {status, data} = await axios.post(this.$store.state.API[this.ApiName].D, {
          id: this.sourceData.data[rowNum].id
        })
        this.pushTips(status, data)
        this.drawTable();
      },
      async create() {
        this.isCreate = false
        this.curEdit = -1
        this.$store.dispatch('setCreateStatus')
        let {status, data} = await axios.post(this.$store.state.API[this.ApiName].C, {data: this.newRow})
        for(let key in this.newRow) {
          this.newRow[key] = ''
        }
        this.pushTips(status, data)
        this.drawTable();
      },
      switchChange(item, rowIndex, key) {
        if (item === 1)  {
          this.sourceData.data[rowIndex][key] = 0
        } else {
          this.sourceData.data[rowIndex][key] = 1
        }
      },
      pushTips(status, data) {
        if (status === 200 && data.status === 200) {
          this.$Notice.success({
            title: '很遺憾,成功了!',
            desc: data.msg
          })
        } else if(status === 201) {
          this.$Notice.success({
            title: '很遺憾,成功了!',
            desc: '創建數據成功!'
          })
        } else  {
          this.$Notice.error({
            title: '恭喜你,失敗了!',
            desc: data.msg
          })
        }
      },
      drawTable() {
        setTimeout(() => {
          this.getSource()
        }, 500)
      },
      cancelEdit() {
        this.curEdit = -1
      },
      cancelCreate() {
        this.sourceData.data.shift()
        this.curEdit = -1
        this.isCreate = false
        this.$store.dispatch('setCreateStatus')
      }
    },
    beforeCreate() {
      this.$nextTick(function() {
        this.getCol()
        this.getSource()
      })
    },
    destroyed() {
      this.$store.dispatch('initTotal')
    },
    mounted() {
      if(this.except) {
        let arr = []
        arr = [...this.except,...this.defaulExcept]
        this.setVuexExcept(arr)
      } else  {
        this.setVuexExcept(this.defaulExcept)
      }
    },
    computed: {
      getCurPage() {
        return this.$store.state.Page.curPage;
      },
      getCreateStatus() {
        return this.$store.state.Table.createStatus
      }
    },
    watch: {
      getCurPage(val) {
        this.curPage = val
        this.getSource()
      },
      getCreateStatus(val) {
        if(val) {
          this.sourceData.data.unshift(this.newRow)
          this.curEdit =  0;
          this.isCreate = true
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "BaseTable";
</style>

<style>
</style>
