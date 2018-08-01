<template>
    <section class="uk-section-muted index-section">
        <section class="uk-container uk-container-expand uk-flex index-container">
            <div id="offcanvas-slide" uk-offcanvas="mode: push; overlay: true">
                <div class="uk-offcanvas-bar">
                    <button class="uk-offcanvas-close" type="button" uk-close></button>
                    <ul class="uk-nav-default uk-nav-parent-icon" uk-nav>
                        <li class="uk-parent" v-for="(item, index) in navData" :key="index">
                            <router-link to="#" style="color:#abcdef; font-size: .4rem">{{ item.itemName }}</router-link>
                            <ul class="uk-nav-sub" v-if="item.hasChildren">
                                <li v-for="(cItem, cIndex) in item.childrenItem" :key="cIndex" @click="addTag(cItem)">
                                    <router-link :to="{name: cItem.routerName}" style="color:hotpink; font-size: .3rem;">{{cItem.itemName}}</router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="container-box">
                <div class="whale" uk-toggle="target: #offcanvas-slide"></div>
                <div class="header uk-flex uk-flex-between uk-flex-column">
                    <div class="header-up uk-flex uk-flex-between">
                        <ul class="uk-breadcrumb bread">
                            <router-link :to="{path: '/'}"><li>主頁</li></router-link>
                            <router-link to="#" class="uk-disabled" v-show="$store.state.Nav.curFather"><li>{{ $store.state.Nav.curFather }}</li></router-link>
                            <router-link :to="{ name: $store.state.Nav.curRouter }" v-show="$store.state.Nav.curChild"><li><span class="bread-active">{{ $store.state.Nav.curChild }}</span></li></router-link>
                        </ul>
                        <div class="btns uk-flex uk-flex-around" v-if="!this.$store.state.Login.Authenticate">
                            <router-link :to="{name: 'Login'}"><button class="uk-button-text login">登錄</button></router-link>
                            <router-link :to="{name: 'Register'}"><button class="uk-button-text register">註冊</button></router-link>
                        </div>
                        <div class="btns uk-flex uk-flex-around" v-if="this.$store.state.Login.Authenticate">
                            <router-link :to="{name: 'AdminInfo'}"><button class="uk-button-text login">個人中心</button></router-link>
                            <router-link to=''><button class="uk-button-text register" @click="logout">退出登錄</button></router-link>
                        </div>
                    </div>
                    <div class="header-down">
                        <ul uk-tab class="tag-list">
                            <li v-for="(item, index) in tagData" :key="index" :class="item.isActive ? 'uk-active' : ''" @click="changeTag(item)">
                                <router-link :to="{name: item.routerName}">{{ item.itemName }}</router-link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="content-box uk-flex uk-flex-center">
                    <div class="close-btn" @click="removeTag($store.state.Nav.tagData)"></div>
                    <div class="add-btn" @click="addRow" v-if="$store.state.Page.total > -1"></div>
                    <div class="add-btn" @click="addArticle" v-if="$store.state.Page.total === -1"></div>
                    <div class="uk-card uk-card-default uk-card-hover uk-card-body card-box">
                        <p class="uk-card-title uk-text-center item-title" v-if="$store.state.Nav.curChild && $store.state.Nav.curChild != '編輯文章' ">{{ $store.state.Nav.curChild }}</p>
                        <div class="article-info uk-flex uk-flex-around" v-if="$store.state.Nav.curChild === '編輯文章'">
                            <div>
                                <span class="uk-flex uk-flex-center uk-flex-middle">標題: {{$store.state.Article.articleInfo.title}}</span>
                            </div>
                            <div>
                                <span class="uk-flex uk-flex-center uk-flex-middle">所屬遊戲: {{$store.state.Article.game_name}}</span>
                            </div>
                            <div>
                                <span class="uk-flex uk-flex-center uk-flex-middle">所屬分類: {{$store.state.Article.cate_name}}</span>
                            </div>
                        </div>
                        <router-view />
                    </div>
                </div>
            </div>
        </section>
        <div class="page" v-if="$store.state.Page.total > -1">
            <Page :total="parseInt($store.state.Page.total)" show-total @on-change="changePage" :page-size="15"></Page>
        </div>
        <div class="button-group uk-flex uk-flex-around" v-if="$store.state.Page.total === -1 && $route.name === 'articleEdit'">
            <Button type="primary" @click="postArticle">發佈提交</Button>
            <Button type="success" @click="saveArticle">保存草稿</Button>
            <Button type="info">在線預覽</Button>
            <Button type="error" @click="cancelArticle">清空刪除</Button>
        </div>
    </section>
</template>

<script>
    import baseTable from '../components/Modules/Table/BaseTable'
    export default {
      data() {
        return {

        }
      },
      components: {
        baseTable,
      },
      computed: {
        navData() {return this.$store.state.Nav.navData},
        tagData() {return this.$store.state.Nav.tagData}
      },
      methods: {
        addTag(item) {
          this.$store.dispatch('addTag',item)
        },
        removeTag(item) {
          this.$store.dispatch('removeTag', item);
          if(item.length > 0) {
            item.forEach((cItem, index) => {
              if(cItem.isActive === true) {
                if(item[index].routerName !== '') {
                  this.$router.push({name: item[index].routerName})
                }
              }
            })
          } else {
            this.$router.push({path: '/'})
          }
        },
        changeTag(item) {
          this.$store.dispatch('changeTag', item)
        },
        changePage(item) {
          $(".card-box").animate({scrollTop:0}, 100);
          $('.card-box').css({
            "overflow-y": "hidden"
          });
          this.$store.dispatch('changePage', item)
        },
        addRow() {
          this.$store.dispatch('setCreateStatus')
        },
        async logout() {
          let {data} = await axios.post('/logout')
          if(data.status === 204) {
            this.$store.dispatch('logoutRequest')
            this.$Notice.success({
              title: data.msg,
              desc: '頁面即將跳轉...'
            })
            setTimeout(() => {
              this.$router.push({path: '/'})
            }, 1500)
          }

        },
        postArticle() {
          this.$store.dispatch('setEditComplete')
        },
        cancelArticle() {
          this.$store.dispatch('cancelEditData')
        },
        addArticle() {
          this.$store.dispatch('setIsShow')
        },
        saveArticle() {
          alert('功能正在開發中!');
        },
      }
    }
</script>

<style lang="less" scoped>
    @import "../../less/manager";
</style>

<style>
    @font-face
    {
        font-family: myCode;
        src: url('../../static/font/myCode.otf');
    }

    body {
        font-family: myCode !important;
    }
</style>
