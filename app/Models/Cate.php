<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Cate extends Model
{
  protected $fillable = [
      'pid', 'name'
  ];

  public function Articlea()
  {
      return $this->hasMany('App\Models\Article');
  }

}

