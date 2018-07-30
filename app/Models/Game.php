<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
  protected $fillable = [
      'name','code','desc'
  ];

  public function Articles()
  {
      return $this->hasMany('App\Models\Article');
  }
}
