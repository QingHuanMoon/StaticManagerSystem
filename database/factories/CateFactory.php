<?php

use Faker\Generator as Faker;

$factory->define(App\Models\Cate::class, function (Faker $faker) {
    return [
        'pid' => 2,
        'name' => '獎勵'
    ];
});
