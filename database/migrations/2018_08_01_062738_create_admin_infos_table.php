<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdminInfosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admin_infos', function (Blueprint $table) {
            $table->increments('id')->comment('序號');
            $table->tinyInteger('user_id')->comment('管理員編號');
            $table->string('avator', 100)->comment('頭像');
            $table->enum('實時推送',[0,1])->comment('推送開關');
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
        Schema::dropIfExists('admin_infos');
    }
}
