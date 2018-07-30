<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTemplatesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('templates', function (Blueprint $table) {
            $table->increments('id')->comment('編號');
            $table->string('game_name',32)->comment('所屬遊戲');
            $table->string('list',100)->comment('列表模板');
            $table->string('single', 100)->comment('內頁模板');
            $table->string('controller', 100)->comment('控制器名稱');
            $table->string('action', 100)->comment('方法名');
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
        Schema::dropIfExists('templates');
    }
}
