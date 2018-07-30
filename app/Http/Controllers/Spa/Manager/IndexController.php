<?php

namespace App\Http\Controllers\Spa\Manager;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{
    public function show()
    {
        return view('spa.manager');
    }
}
