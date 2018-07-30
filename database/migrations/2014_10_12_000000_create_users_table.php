<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->increments('id')->comment('用戶序號');
            $table->string('name')->comment('用戶名');
            $table->string('email')->unique()->comment('郵箱賬號');
            $table->string('password')->default(bcrypt('123456'))->comment('密碼');
            $table->tinyInteger('isActive')->default(0)->comment('激活狀態');
            $table->tinyInteger('isOnline')->default(0)->comment('在線狀態');
            $table->rememberToken();
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
        Schema::dropIfExists('users');
    }
}
