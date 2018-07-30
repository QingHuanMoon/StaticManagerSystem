<?php

namespace App\Http\Controllers\Home;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ErrorPageController extends Controller
{
    public function show404()
    {
      return view('errors.404',[], []);
    }
}
