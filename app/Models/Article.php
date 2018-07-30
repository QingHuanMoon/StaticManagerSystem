<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
  protected $fillable = [
      'game_id', 'cate_id', 'template_name', 'title', 'desc', 'img', 'music', 'content', 'author', 'isCached'
  ];

  public function game()
  {
      return $this->belongsTo('App\Models\Game');
  }

  public function cate()
  {
      return $this->belongsTo('App\Models\Cate');
  }



}
