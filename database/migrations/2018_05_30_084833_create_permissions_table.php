<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePermissionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('permissions', function (Blueprint $table) {
            $table->increments('id')->comment('權限序號');
            $table->tinyInteger('permissionV')->default(0)->comment('權限值');
            $table->string('modules',500)->default('0')->comment('可用模塊');
            $table->string('controllers',500)->default('0')->comment('可用控制器');
            $table->string('apis',500)->default('0')->comment('可用API');
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
        Schema::dropIfExists('permissions');
    }
}
