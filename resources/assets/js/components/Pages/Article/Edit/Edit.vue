<template>
    <section class="uk-section article-section">
        <Spin size="large" fix v-if="!editStatus"></Spin>
        <section class="uk-container uk-container-expand article-container">
            <quill-editor v-model="postData.content"
                          ref="myQuillEditor"
                          :options="editorOption"
                          @blur="onEditorBlur($event)"
                          @focus="onEditorFocus($event)"
                          @ready="onEditorReady($event)">
            </quill-editor>
            <Modal
                    v-model="$store.state.Article.isShow"
                    @on-ok="editOK"
                    @on-cancel="editCancel">
                <Row>
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬遊戲</span>
                    </Col>
                    <Col span="20">
                        <Select v-model="postData.game_id" @on-change="getTemplateList">
                            <Option v-for="(item, index) in gameList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬分類</span>
                    </Col>
                    <Col span="20">
                        <Select v-model="postData.cate_id">
                            <Option v-for="(item, index) in cateList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬模板</span>
                    </Col>
                    <Col span="20">
                        <Select v-model="postData.template_name"  multiple>
                            <Option v-for="(item, index) in templateList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">標題</span>
                    </Col>
                    <Col span="20">
                        <i-input v-model="postData.title" placeholder="Enter something..."></i-input>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">簡介</span>
                    </Col>
                    <Col span="20">
                        <i-input v-model="postData.desc" placeholder="Enter something..." type="textarea"></i-input>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">圖片</span>
                    </Col>
                    <Col span="20">
                        <Upload
                                multiple
                                action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上傳圖片</Button>
                        </Upload>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">背景音樂</span>
                    </Col>
                    <Col span="20">
                        <Upload
                                action="//jsonplaceholder.typicode.com/posts/">
                            <Button type="ghost" icon="ios-cloud-upload-outline">上傳音樂</Button>
                        </Upload>
                    </Col>
                </Row>
            </Modal>
        </section>
    </section>
</template>

<script>
    export default {
      name: 'articleEdit',
      data() {
        return {
          editorOption: {
            // some quill options
          },
          postData: {
            game_id: '',
            cate_id: '',
            template_name: [],
            title: '',
            desc: '',
            img: '1',
            music: '1',
            author: '',
            status: '',
            content: '',
          },
          gameList: [],
          cateList: [],
          templateList: [],
          editStatus: false,
        }
      },
      computed: {
        game_name() {return this.gameList[this.postData.game_id - 1 ].label},
        cate_name() {return this.cateList[this.postData.cate_id -1 ].label},
        getEditComplete() {return this.$store.state.Article.editComplete},
        getEidtCancel() {return this.$store.state.Article.editCancel}
      },
      watch: {
        getEditComplete(val) {
          if (val) {
            this.postData.author = this.$store.state.Login.name
            this.postData.template_name = this.postData.template_name.join(',');
            axios.post('/v1/article/store', {data: this.postData}).then((response) => {
              if(response.status === 201) {
                this.$Notice.success({
                  title: '恭喜你,提交成功',
                  desc: '頁面即將跳轉...'
              })
              this.$store.dispatch('resetEditComplete')
              this.$store.dispatch('cancelEditData')
                setTimeout(() => {
                  this.$router.push({name: 'articlePublish'})
                }, 1500)
              }
            })
          }
        },
        getEidtCancel(val) {
          if (val) {
            this.postData.content = ''
          }
        }
      },
      methods: {
        async initGame() {
          let {data} = await axios.get('/v1/game/get')
          this.gameList = data.data
        },
        async initCate() {
          let {data} = await axios.get('/v1/cate/get')
          this.cateList = data.data
        },
        onEditorBlur($event) {
          console.log($event)
        },
        onEditorFocus($event) {
          console.log($event)
        },
        onEditorReady($event) {
          console.log($event)
        },
        setAuthor() {
          this.postData.author = this.$store.state.Login.name
        },
        editOK() {
          this.editStatus = true;
          this.$store.state.Article.isShow = false;
          this.$store.dispatch('setStoreInfo', {
            data: this.postData,
            gameName: this.game_name,
            cateName: this.cate_name
          })
        },
        editCancel() {
          console.log('cancel')
        },
        async getTemplateList() {
          this.templateList = [];
          let {data} = await axios.get('v1/article/get/templatelist', {
            params: {
              'game_id': this.postData.game_id
            }
          });
          this.templateList = data;
        }
      },
      beforeCreate() {
        this.$nextTick(function () {
          this.initCate();
          this.initGame();
          this.setAuthor();
        })
      }
    }
</script>

<style scoped lang="less">
    @import "Edit";
</style>
