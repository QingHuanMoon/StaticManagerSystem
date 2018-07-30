<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="{{ URL::asset('vendors/rem.js') }}"></script>



  <!-- 網站圖標 -->
  <link rel="SHORTCUT ICON" href="./icon.png" type="image/x-icon">
  <link rel="Bookmark" href="icon.png">

    <title>后台管理系統</title>


</head>
<body>
<div id="app">
    <router-view></router-view>
</div>
</body>
<script src="/js/app.js"></script>
</html>
