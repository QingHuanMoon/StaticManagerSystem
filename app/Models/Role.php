<?php

namespace App\Models;

use App\Http\Helper\ModelTrait;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
  protected $fillable = ['name'];
}
