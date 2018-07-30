<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    $id = ($request->user()->id);
    $user = \App\User::find($id);
    $data = ['isOnline' => 1];
    $user->update($data);
    return $request->user();
});


// 測試
Route::get('/test','Api\V1\ArticleController@getArticleList');



// 註冊
Route::post('/register','Auth\RegisterController@register');

// 登錄
Route::post('/login','Auth\LoginController@login');

// 刷新換取RefreshToken
Route::post('/token/refresh', 'Auth\LoginController@refresh');

// 退出登錄
Route::post('/logout','Auth\LoginController@logout');

// User表接口
Route::group(['prefix' => 'v1'],function() {
    Route::group(['prefix' => 'user'],function() {
        Route::get('/users','Api\V1\UserController@index');
        Route::get('/users/show','Api\V1\UserController@show');
        Route::post('/store','Api\V1\UserController@store');
        Route::post('/destroy','Api\V1\UserController@destroy');
        Route::post('/update','Api\V1\UserController@update');
    });
    Route::group(['prefix' => 'role'],function () {
       Route::get('/roles','Api\V1\RoleController@index');
        Route::get('/roles/show','Api\V1\RoleController@show');
        Route::post('/store','Api\V1\RoleController@store');
        Route::post('/destroy','Api\V1\RoleController@destroy');
        Route::post('/update','Api\V1\RoleController@update');
    });
    Route::group(['prefix' => 'permission'],function () {
        Route::get('/permissions','Api\V1\PermissionController@index');
        Route::get('/permissions/show','Api\V1\PermissionController@show');
        Route::post('/store','Api\V1\PermissionController@store');
        Route::post('/destroy','Api\V1\PermissionController@destroy');
        Route::post('/update','Api\V1\PermissionController@update');
    });
    Route::group(['prefix' => 'game'],function () {
        Route::get('/games','Api\V1\GameController@index');
        Route::get('/games/show','Api\V1\GameController@show');
        Route::post('/store','Api\V1\GameController@store');
        Route::post('/destroy','Api\V1\GameController@destroy');
        Route::post('/update','Api\V1\GameController@update');
        Route::get('/get','Api\V1\GameController@getGame');
        Route::get('/get','Api\V1\GameController@getGame');
    });
    Route::group(['prefix' => 'cate'],function () {
        Route::get('/cates','Api\V1\CateController@index');
        Route::get('/cates/show','Api\V1\CateController@show');
        Route::post('/store','Api\V1\CateController@store');
        Route::post('/destroy','Api\V1\CateController@destroy');
        Route::post('/update','Api\V1\CateController@update');
        Route::get('/get','Api\V1\CateController@getCate');
    });
    Route::group(['prefix' => 'article'],function () {
        Route::get('/articles','Api\V1\ArticleController@index');
        Route::get('/articles/show','Api\V1\ArticleController@show');
        Route::post('/store','Api\V1\ArticleController@store');
        Route::post('/destroy','Api\V1\ArticleController@destroy');
        Route::post('/update','Api\V1\ArticleController@update');
        Route::get('/viewtemp', 'Api\V1\ArticleController@viewTemp');
        Route::get('/review','Api\V1\ArticleController@reView');
        Route::get('/publish', 'Api\V1\ArticleController@publishArticle');
        Route::get('/get/gamelist','Api\V1\ArticleController@getGameList');
        Route::get('/get/catelist','Api\V1\ArticleController@getCateList');
        Route::get('/get/articlelist','Api\V1\ArticleController@getArticleList');
        Route::get('/get/templatelist', 'Api\V1\ArticleController@getTemplateList');
        Route::post('/cache/refresh', 'Api\V1\ArticleController@refreshCache');
        Route::post('/cache/check', 'Api\V1\ArticleController@checkCache');
        Route::post('/cache/remove/{template}/{id}', 'Api\V1\ArticleController@removeCache');

    });
    Route::group(['prefix' => 'template'], function() {
        Route::get('/templates','Api\V1\TemplateController@index');
        Route::get('/templates/show','Api\V1\TemplateController@show');
        Route::post('/store','Api\V1\TemplateController@store');
        Route::post('/destroy','Api\V1\TemplateController@destroy');
        Route::post('/update','Api\V1\TemplateController@update');
    });
    Route::group(['prefix'=> 'cache'], function() {
       Route::get('/get/list','Api\V1\CacheController@getCacheData');
    });
});
