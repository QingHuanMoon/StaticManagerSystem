<?php

namespace App\Http\Controllers\Home;

use App\Http\Helper\Helper;
use App\Models\Article;
use App\Models\Game;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ArticleController extends Controller
{
    // 遊戲公告文章緩存渲染
    public static function showSingle($id, $template, $view_name = '', $article = [])
    {
        if (strpos(Article::find($id)['template_name'], ',')) {
            $allowTemp = explode(',', Article::find($id)['template_name']);
        } else {
            $allowTemp = [0 => Article::find($id)['template_name']];
        }
        if($view_name === '' && $article === [] && in_array($template, $allowTemp)) {
            $article = Article::find($id);
            $game_id = $article['game_id'];
            $template_name = $template;
            $game = Game::find($game_id);
            $code = $game['code'];
            // 指定對應模板路徑
            $view_name = 'games' . '.' .$code . '.' . 'Single.' .  $template_name;
        } else {
          return redirect()->action('Home\ErrorPageController@show404');
        }
        return Helper::CacheView($view_name, $article);
    }

    public function showCacheSingle($id, $template_name)
    {
      $filename = resource_path('views' . '/Cache/' . $id . '/' . $template_name . '/' . 'isCached.blade.php');
      if(!file_exists($filename)) {
        abort(404);
      } else {
        return view('Cache.' . $id . '.' . $template_name . '.isCached');
      }
    }


    // 遊戲公告列表渲染
    public static function showList(Request $request)
    {
        $game_id = $request->route('id');
        $articles = Article::where('game_id','=',$game_id)->paginate(10);
        $game_id = $articles[0]['id'];
        $game = Game::find($game_id);
        $code = $game['code'];
        $view_name = 'games' . '.' .$code . '.List';
        return Helper::CacheView($view_name, ['articles' => $articles]);
    }
}
