<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Helper\Helper;
use App\Models\Article;
use App\Models\Game;
use DemeterChain\A;
use function GuzzleHttp\Promise\all;
use Illuminate\Http\Request;
use App\Http\Controllers\Home\ArticleController as ArticleCtrl;

class ArticleController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        $articles = Article::paginate($size);
        $count = count($articles->toArray()['data']);
        if($count || $count === 0) {
          return $this->findSuccess($articles);
        } else {
          return $this->findFail();
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request['data'];
        $res = Article::firstOrCreate($data);
        if($res->toArray()['id']) {
          return $this->storeSuccess($res);
        } else {
          return $this->storeFail();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function show(Article $article)
    {
        return $article->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function edit(Article $article)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $id = $request['id'];
        $data = $request['data'];
        $article = Article::find($id);
        if($article->update($data)) {
          $this->updateSuccess($data);
        } else {
          $this->updateFail();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Article  $article
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id = $request['id'];
        $article = Article::findOrFail($id);
        $template_name = explode(',', $article['template_name']);
        if ($article->delete()) {
          foreach ($template_name as $k => $v) {
            $dirname = resource_path('views') . '/' . env('CACHE_PATH_NAME') . '/' . $id . '/' . $v;
            Helper::deleteDir($dirname);
          }
          return $this->deleteSuccess($article);
        } else {
          return $this->deleteFail();
        }
    }

    public function getGameList()
    {
        $allGame = Article::with('game')->get();
        $games = [];
        foreach ($allGame as $k => $v)
        {
          $games[$k]['id'] = $v['game']['id'];
          $games[$k]['name'] = $v['game']['name'] . '-' . $v['game']['desc'];
        }
        return array_unique($games, SORT_REGULAR);
    }

    public function getCateList(Request $request)
    {
        $id  = $request['game_id'];
        $allCate = Article::with('cate')->where('game_id','=', $id)->get();
        $cateList = [];
      foreach ($allCate as $k => $v)
        {
          $cateList[$k] = ['id' => $v['cate']['id'], 'name' => $v['cate']['name']];
        }
        return array_unique($cateList, SORT_REGULAR);
    }

    public function getArticleList(Request $request)
    {
        $cate_id = $request['cate_id'];
        $game_id = $request['game_id'];
        return Article::where('game_id','=', $game_id)
            ->where('cate_id','=', $cate_id)
            ->get();
    }

    // 獲取對應遊戲的views模板列表
    public function getTemplateList(Request $request) {
        $game_id = $request['game_id'];
        $code = Game::find($game_id)->toArray()['code'];
        $res = [];
        $count = 0;
        $view_path = resource_path('views') . '/games/' . $code . '/Single';
        if($handle = opendir($view_path)){
            while (false !== ($file = readdir($handle))){
                if($file !== '.' && $file !== '..') {
                    $res[$count] = ['value' => str_before($file, '.'), 'label' => str_before($file, '.')];
                    $count++;
                }
            }
            closedir($handle);
            return $res;
        }
    }


    // 重建緩存
    public function refreshCache(Request $request)
    {
        $id = $request['id'];
        $template = $request['template_name'];
        $this->removeCache($template, $id);
        $_SERVER['PARAMS']['id'] = $id;
        $_SERVER['PARAMS']['template_name'] = $template;
        ArticleCtrl::showSingle($id, $template);
    }

  // 刪除緩存
  public function removeCache($template, $id)
  {
    $dirname = resource_path('views') . '/' . env('CACHE_PATH_NAME') . '/' . $id . '/' . $template;
    Helper::deleteDir($dirname);
  }

    // 預覽模板
    public function viewTemp(Request $request)
    {
        $id = $request['id'];
        $template_name = $request['template_name'];
        $_SERVER['DIY'] = 'App\Http\Controllers\Home\ArticleController@showSingle';
        $_SERVER['PARAMS'] = ['template' => $template_name, 'id' => $id];
        return \App\Http\Controllers\Home\ArticleController::showSingle($template_name, $id);
    }



    // 檢查緩存
    public function checkCache(Request $request)
    {
        $ResArray = [];
        $final_time = '';
        $isCached = false;
        $id = $request['id'];
        $article = Article::with('game')->find($id)->toArray();
        $template_name = explode(',', $article['template_name']);
        // 檢測是否存在對應文件
        foreach ($template_name as $k => $v)
        {
          $template_path = resource_path('views') . '/' . env('CACHE_PATH_NAME') . '/' . $id . '/' . $v;
          $file_name = $template_path . '/' . env('CACHE_FILE_NAME') . '.' .env('CACHE_FILE_TYPE');
          if(file_exists($file_name))
          {
            $isCached = true;
            $final_time = date('Y-m-d H:i:s', filemtime($file_name));
          } else {
            $isCached = false;
          };
          $ResArray[$k] =  [
            'id' => $id,
            'templateName' => $v,
            'isCached' => $isCached,
            'finalTime' => $final_time,
          ];
        }
        return $ResArray;
    }


    // 預覽文章
    public function reView(Request $request) {
        $id = $request['id'];
        return $article = Article::find($id);
    }

    // 發佈文章
    public function publishArticle(Request $request) {
        $id = $request['id'];
        $article = Article::find($id);
        if($article->status === 0) {
            $article->status = 1;
            $article->save();
            return response()->json([
                'status' => 208,
                'msg' => '發佈成功!',
                'cur' => 1
            ]);
        } else {
            $article->status = 0;
            $article->save();
            return response()->json([
                'status' => 209,
                'msg' => '取消發佈成功!',
                'cur' => 0
            ]);
        }
        return ($article->status);
    }
}
