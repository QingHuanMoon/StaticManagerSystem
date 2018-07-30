<template>
    <section class="uk-section publish-section">
        <div id="modal-full" class="uk-modal-full" uk-modal>
            <div class="uk-modal-dialog">
              <button class="uk-modal-close-full uk-close-large" type="button" uk-close></button>
              <iframe style="width: 100%; height: 100%;" :src="viewUrl" frameborder="0"></iframe>
            </div>
        </div>
        <section class="uk-container uk-container-expand publish-container uk-flex">
            <div class="list uk-flex">
                <div class="game">
                    <div class="uk-card uk-card-default uk-card-hover uk-card-body game-card">
                        <ul class="uk-list uk-list-divider game-list">
                            <li class="uk-text-center" @click="getCateList(item.id)" v-for="(item, index) in ArticleGameList" :key="index">{{ item.name }}</li>
                        </ul>
                    </div>
                </div>
                <div class="cate">
                    <div class="uk-card uk-card-default uk-card-hover uk-card-body cate-card">
                        <ul class="uk-list uk-list-divider cate-list">
                            <li class="uk-text-center" @click="getArticle(item.id)" v-for="(item, index) in ArticleCateList" :key="index">{{ item.name }}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="content">
                <div class="uk-card uk-card-default uk-card-hover uk-card-body content-card">
                    <ul class="uk-list uk-list-divider article-list">
                        <li v-for="(item, index) in ArticleList" :key="index">
                            <div class="header uk-flex uk-flex-between">
                                <p class="title"><Icon type="ios-heart" :class="[item.isCached ? 'cache' : 'no-cache']"></Icon>&nbsp;{{ item.title }}</p>
                                <div class="btns uk-flex">
                                    <Icon size="26" type="edit" @click="showArticleMask(item.id)"></Icon>
                                    <Icon size="26" type="social-vimeo-outline" @click="viewArticle(item.id)"></Icon>
                                    <Icon size="26" type="ios-refresh-outline" @click="checkCache(item.id)"></Icon>
                                    <Icon size="26" type="ios-gear-outline" @click="showSetting(item.id)"></Icon>
                                    <Icon size="26" type="ios-trash-outline" @click="deleteAll(item.id)"></Icon>
                                    <Icon size="26" type="ios-paperplane-outline" :class="[item.status === 1 ? 'is-publish' : 'isnt-publish']" @click="publishArticle(item.id, index)"></Icon>
                                </div>
                            </div>
                            <div class="desc">
                                <p>{{ item.desc }}</p>
                            </div>
                            <div class="author uk-flex uk-flex-between">
                                <p>{{ $store.state.Article.status[item.status].label }}</p>
                                <p>{{ item.author }}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <Modal
                    v-model="viewMask"
                    title="選擇需要預覽的模板"
                    @on-ok="viewMaskOk">
                <Select v-model="prerenderTemp">
                    <Option v-for="(item, index) in TemplateList" :value="item.value" :key="index">{{ item.label }}</Option>
                </Select>
            </Modal>
            <Modal
                v-model="setMask"
                title="設置"
                @on-ok="setInfo(articleObj.id)">
                <Row>
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬遊戲</span>
                    </Col>
                    <Col span="20">
                        <Select v-model="articleObj.game_id" @on-change="getTemplateList">
                            <Option v-for="(item, index) in gameList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬分類</span>
                    </Col>
                    <Col span="20">
                        <Select v-model="articleObj.cate_id">
                            <Option v-for="(item, index) in cateList" :key="index" :value="item.value">{{ item.label }}</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">所屬模板</span>
                    </Col>
                    <Col span="20">
                      <Select v-model="articleObj.template_name" multiple>
                        <Option v-for="(item, index) in templateList" :key="index" :value="item.value">{{ item.label }}</Option>
                      </Select>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">標題</span>
                    </Col>
                    <Col span="20">
                        <i-input v-model="articleObj.title" placeholder="Enter something..."></i-input>
                    </Col>
                </Row>
                <Row style="margin-top: .2rem;">
                    <Col span="4">
                        <span style="font-size: .16rem;">簡介</span>
                    </Col>
                    <Col span="20">
                        <i-input v-model="articleObj.desc" placeholder="Enter something..." type="textarea"></i-input>
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
            <Modal
                v-model="editMask"
                title="編輯文章"
                width="1200"
                @on-ok="changeArticle(articleObj.id)">
                <quill-editor v-model="articleObj.content"
                              ref="mySecQuillEditor"
                              :options="editorOption"
                              @blur="onEditorBlur($event)"
                              @focus="onEditorFocus($event)"
                              @ready="onEditorReady($event)">
                </quill-editor>
            </Modal>
            <Modal
                v-model="refreshMask"
                title="重建緩存"
                on-ok="reBuild"
                width="1200">
                <Row style="font-size: .16rem;">
                  <Spin fix v-show="!cacheInfo.length"></Spin>
                  <Col span="24">
                        <ul class="uk-list uk-list-divider uk-text-center cache-list">
                          <li>
                            <Row>
                              <Col span="3">
                                序號
                              </Col>
                              <Col span="4">
                                模板名稱
                              </Col>
                              <Col span="3">
                                是否緩存
                              </Col>
                              <Col span="6">
                                緩存時間
                              </Col>
                              <Col span="6">
                                操作選項
                              </Col>
                            </Row>
                          </li>
                          <li v-for="(item, index) in cacheInfo" :key="index">
                            <Row>
                              <Col span="3">
                                {{ item.id }}
                              </Col>
                              <Col span="4">
                                {{ item.templateName }}
                              </Col>
                              <Col span="3">
                                <Icon type="checkmark-round" v-show="item.isCached"></Icon>
                                <Icon type="close-round" v-show="!item.isCached"></Icon>
                              </Col>
                              <Col span="6">
                                <span v-show="item.isCached">{{ item.finalTime }}</span>
                                <span v-show="!item.isCached">&nbsp;&nbsp;</span>
                              </Col>
                              <Col span="2">
                                <Button type="success" @click="refreshCache(item.id, item.templateName)">重建緩存</Button>
                              </Col>
                              <Col span="2">
                                <Button type="info" @click="viewMaskOk(item.id, item.templateName)" :disabled="!item.isCached">查看緩存</Button>
                              </Col>
                              <Col span="2">
                                <Button type="error" :disabled="!item.isCached" @click="removeCache(item.id, item.templateName)">刪除緩存</Button>
                              </Col>
                            </Row>
                          </li>
                        </ul>
                    </Col>
                </Row>
            </Modal>
        </section>
    </section>
</template>

<script>
    export default {
      name: 'articlePublish',
      data() {
        return {
          ArticleGameList: [],
          ArticleCateList: [],
          ArticleList: [],
          TemplateList: [],
          cacheInfo: [],
          cacheList: [],
          gameList: [],
          cateList: [],
          templateList: [],
          gameId: '',
          cateId: '',
          prerenderTemp: '',
          viewUrl: '',
          articleObj: {},
          viewMask: false,
          setMask: false,
          editMask: false,
          refreshMask: false,
          editorOption: {
            // some quill options
          },
        }
      },
      methods: {

        onEditorBlur($event) {
          console.log($event)
        },
        onEditorFocus($event) {
          console.log($event)
        },
        onEditorReady($event) {
          console.log($event)
        },

        async initGame() {
          let {data} = await axios.get('/v1/game/get')
          this.gameList = data.data
        },
        async initCate() {
          let {data} = await axios.get('/v1/cate/get')
          this.cateList = data.data
        },
        async getGameList() {
          let {data} = await axios.get('/v1/article/get/gamelist')
          this.ArticleGameList = data
        },
        async getCateList(id) {
          this.ArticleCateList = []
          this.ArticleList = []
          this.gameId = id;
          let {data} = await axios.get('/v1/article/get/catelist', {params: {game_id: id}})
          this.ArticleCateList = data
        },
        async getArticle(id) {
          this.ArticleList = []
          this.cateId  = id;
          let {data} = await axios.get('/v1/article/get/articlelist',
            {params:
                {
                  game_id: this.gameId,
                  cate_id: this.cateId
                }
            })
          this.ArticleList = data
        },


        // 檢查緩存
        checkCache(id) {
          this.cacheInfo = [];
          this.refreshMask = true
          axios.post('/v1/article/cache/check', {
            id: id,
          }).then(res => {
            this.cacheInfo = res.data
          })
        },

        // 重建緩存
        refreshCache(id, template_name) {
          axios.post('/v1/article/cache/refresh', {
            id: id,
            template_name: template_name
          }).then(res => {
            if(res.status === 200) {
              this.checkCache(id)
            }
          })
        },

        viewMaskOk(id = '', template_name = '') {
          this.viewUrl = ''
          if(id !== '' && template_name !== '') {
            this.viewUrl = `${location.origin}/article/${id}/${template_name}`
            this.$ui.modal('#modal-full').show();
          } else {
            this.viewUrl = `${location.origin}/article/${this.articleObj.id}/${this.prerenderTemp}`
            this.$ui.modal('#modal-full').show();
            this.viewMask = false
          }
        },


        // 刪除緩存
        removeCache(id, template_name) {
          axios.post(`/v1/article/cache/remove/${template_name}/${id}`).then(res => {
            if(res.status === 200) {
              this.checkCache(id)
            }
          })
        },


        // 刪除文章及緩存
        deleteAll(id) {
          this.$Modal.confirm({
            title: '你正在刪除文件',
            content: `<p>你確定要刪除文章及所有緩存嗎?</p>`,
            okText: '確認',
            cancelText: '撤銷',
            loading: true,
            onOk: () => {
              axios.post('v1/article/destroy', {
                'id': id
              }).then(response => {
                if (response.status === 200) {
                  this.$Modal.remove();
                  this.$Notice.success({
                    title: response.data.msg,
                    desc: '頁面將更新數據...'
                  })
                  this.getGameList()
                  this.getCateList(this.gameId)
                  this.getArticle(this.articleObj.cate_id)
                }
              })
            }
          })
        },

        async viewArticle(id) {
          this.TemplateList = [];
          this.prerenderTemp = ''
          this.articleObj.id = id;
          let {data} = await axios.get('/v1/article/review', {
            params: {
              id: id
            }
          })
          let newRes = data.template_name.split(',')
          for(let i = 0; i < newRes.length; i++) {
            this.TemplateList[i] = {'value': newRes[i], 'label': newRes[i]}
          }
          this.viewMask = true;
        },

        showSetting(id) {
          axios.get('/v1/article/review', {
            params: {
              id: id
            }
          }).then(response => {
            this.articleObj = response.data
            this.getTemplateList();
            let newRes = response.data.template_name.split(',')
            this.articleObj.template_name = []
            for(let i = 0; i < newRes.length; i++) {
              this.TemplateList[i] = {'value': newRes[i], 'label': newRes[i]}
              this.articleObj.template_name.push(newRes[i])
            }
            if(this.articleObj.template_name.length > 0) {
              this.setMask = true
            }
          })
        },

        setInfo(id) {
          axios.post('/v1/article/update', {
            id: id,
            data: this.articleObj
          }).then(response => {
            if (response.status === 200) {
              this.$Notice.success({
                title: response.data.msg,
                desc: '頁面將更新數據...'
              })
              this.getGameList()
              this.getCateList(this.gameId)
              this.getArticle(this.articleObj.cate_id)
            }
          })
        },

        showArticleMask(id) {
          axios.get('/v1/article/review', {
            params: {
              id: id
            }
          }).then(response => {
            this.articleObj = response.data
            this.editMask = true;
          })
        },

        changeArticle(id) {
          axios.post('/v1/article/update', {
            id: id,
            data: this.articleObj
          }).then(response => {
            if (response.status === 200) {
              this.$Notice.success({
                title: response.data.msg,
                desc: '頁面將更新數據...'
              })
              this.getArticle(this.articleObj.cate_id)
            }
          })
        },

        async publishArticle(id, index) {
          axios.get('/v1/article/review', {
            params: {
              id: id
            }
          }).then(async response => {
            this.articleObj = response.data
            let {data} = await axios.get('v1/article/publish', {
              params: {
                id: id
              }
            })
            if(data.status === 208) {
              this.ArticleList[index].status = data.cur
              this.articleObj.status = data.cur
              this.$Notice.success({
                title: data.msg,
              })
            } else if (data.status === 209) {
              this.articleObj.status = data.cur
              this.ArticleList[index].status = data.cur
              this.$Notice.success({
                title: data.msg,
              })
            }
          })
        },


        async getTemplateList() {
          this.templateList = [];
          let {data} = await axios.get('v1/article/get/templatelist', {
            params: {
              'game_id': this.articleObj.game_id
            }
          });
          this.templateList = data;
        }
      },

      created() {
        this.getGameList();
      },

      mounted() {
        this.initGame();
        this.initCate();
      }
    }
</script>

<style scoped lang="less">
    @import "Publish.less";
</style>
