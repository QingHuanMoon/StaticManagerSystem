<template>
  <div>
    <Row class-name="info-row">
      <Col span="24">
        <Tabs class="tab-row">
          <TabPane label="控制台">
            <Console />
          </TabPane>
          <TabPane label="性能監控">
            開發中
          </TabPane>
          <TabPane label="運行狀態">
            開發中
          </TabPane>
          <TabPane label="訪問狀態">
            開發中
          </TabPane>
          <TabPane label="圖表統計">
            圖表統計
          </TabPane>
          <TabPane label="系統日誌">
            <Log />
          </TabPane>
          <TabPane label="任務協同">
            開發中
          </TabPane>
          <TabPane label="工作流">
            開發中
          </TabPane>
          <TabPane label="更新信息">
            <UpdateInfo />
          </TabPane>
        </Tabs>
      </Col>
    </Row>
  </div>
</template>

<script>
  import UpdateInfo from './UpdateInfo/UpdateInfo'
  import Console from './Console/Console'
  import Log from './Log/Log'
  export default {
    name: 'IndexInfo',
    data () {
      return {

      }
    },
    components: {
      UpdateInfo,
      Console,
      Log
    }
  }
</script>

<style scoped lang="less">
  @import "Index";
</style>