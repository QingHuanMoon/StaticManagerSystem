<template>
    <div class="uk-flex uk-flex-middle info-box uk-flex-column">
        <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center uk-flex-column">
            <h3 class="title">這裡暫時會提供一些更新信息</h3>
            <p class="f-title">已經實現:</p>
            <ol>
                <li>正常登陸註冊, 退出登錄(使用Oauth2.0)</li>
                <li>新聞正常發佈流程</li>
                <li>文章自動緩存(包括圖片->轉換base64編碼)</li>
                <li>文章靜態頁404跳轉邏輯(有規則的正確的靜態地址->自動重建緩存->跳轉)</li>
            </ol>
        </div>
        <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center uk-flex-column">
            <p class="p-title">正在開發:</p>
            <ol>
                <li>手動刷新緩存功能,多模板使用隊列實現</li>
                <li>前端實現無限極分類的添加管理</li>
                <li>註冊用戶郵件激活</li>
                <li>根據子域名的不同鏈接不一樣的數據庫</li>
            </ol>
        </div>
        <div class="uk-flex uk-flex-center uk-flex-middle uk-text-center uk-flex-column">
            <p class="p-title">計劃實現:</p>
            <ol>
                <li>全站數據實時更新(使用websocket實現)</li>
                <li>用戶個性化配置及云存儲</li>
                <li>圖床管理</li>
            </ol>
        </div>
    </div>
</template>

<script>
    export default
    {
      data() {
        return {

        }
      }
    }
</script>

<style scoped lang="less">
    @import "UpdateInfo";
</style>