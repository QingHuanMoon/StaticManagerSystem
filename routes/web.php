<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/




Route::domain('staticmanagersystem.app')->group(function() {
  Route::get('/', function () {
    dd('主頁還在建設中 !!!, 請訪問/manager進入後台管理');
  });
  // 後台管理指向Vue模板
  Route::get('/manager', 'Spa\Manager\IndexController@show');
  Route::get('/cache/{id}/{template_name}', 'Home\ArticleController@showCacheSingle');
  Route::get('/article/list/{id}','Home\ArticleController@showList');
  Route::get('/article/{id}/{template_name}','Home\ArticleController@showSingle');
  Route::group(['prefix' => 'errors'], function() {
    Route::get('/404', 'Home\ErrorPageController@show404');
  });
});







