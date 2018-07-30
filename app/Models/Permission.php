<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
  protected $fillable = [
      'permissionV','modules','controllers','apis'
  ];
}
