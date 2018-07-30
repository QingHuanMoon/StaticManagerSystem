<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateArticlesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->increments('id')->comment('文章序號');
            $table->tinyInteger('game_id')->comment('遊戲序號');
            $table->tinyInteger('cate_id')->comment('分類序號');
            $table->string('template_name', 32)->default('single')->comment('模板名稱');
            $table->string('title',100)->comment('文章標題');
            $table->text('desc')->comment('內容簡介');
            $table->string('img',200)->default(null)->comment('標題圖片');
            $table->string('music',200)->default(null)->comment('文章音樂');
            $table->longText('content')->comment('文章內容');
            $table->string('author',64)->comment('作者');
            $table->string('status', 100)->comment('發佈狀態');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('articles');
    }
}
