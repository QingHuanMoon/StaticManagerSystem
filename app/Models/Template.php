<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Template extends Model
{
  protected $fillable = [
      'game_name', 'list', 'single', 'controller', 'action'
  ];


}
