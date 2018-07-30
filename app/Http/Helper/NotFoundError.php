<?php
/**
 * Created by IntelliJ IDEA.
 * User: qh
 * Date: 2018/7/28
 * Time: 上午10:27
 */

namespace App\Http\Helper;


use App\Http\Controllers\Home\ArticleController;
use App\Models\Article;
use Illuminate\Support\Facades\View;

class NotFoundError
{
  public static function redirectUrl() {
    $url = ($_SERVER['REQUEST_URI']);
    $arr = explode('/', $url);
    $arr = Helper::ArrayShift($arr, 2);
    list($id, $template) = $arr;
    ArticleController::showSingle($id, $template);
  }
}
