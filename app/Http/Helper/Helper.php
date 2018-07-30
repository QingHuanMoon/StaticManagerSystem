<?php
/**
 * Created by PhpStorm.
 * User: lc-ms-tmp
 * Date: 2018/7/26
 * Time: 上午9:35
 */
// 自定義助手工具類
namespace App\Http\Helper;


use App\Http\Controllers\Home\ArticleController;

class Helper
{
  public static $cache_path;


    /**  --> 獲取當前網站的基礎域名
     * @return string 網站基礎域名
     */
    public static function getHost()
    {
        $scheme = empty($_SERVER['HTTPS']) ? 'http://' : 'https://';
        return $url = $scheme . $_SERVER['HTTP_HOST'];
    }

    public static function getShortHost()
    {
      return $_SERVER['HTTP_HOST'];
    }

  /**
   *   --> 刪除指定目錄下所有文件
   * @param $dir   目錄路徑字符串
   * @return bool  成功/失敗
   */
    public static function deleteDir($dir)
    {
      if (!is_dir($dir)) {
        return false;
      }
      $handle = opendir($dir);
      while (($file = readdir($handle)) !== false) {
        if ($file != "." && $file != "..") {
          is_dir("$dir/$file") ? del_dir("$dir/$file") : @unlink("$dir/$file");
        }
      }
      if (readdir($handle) == false) {
        closedir($handle);
        @rmdir($dir);
      }
    }

  public static function CacheView($view = null, $data = [], $mergeData = [])
  {
    self::$cache_path = resource_path('views'). '/' . env('CACHE_PATH_NAME');
    $factory = app(\Illuminate\Contracts\View\Factory::class);
    // 重置當前的控制器和方法名
    list($controller, $action, $paramsList) = self::getControllerActionParamsList();
    // 組裝靜態緩存路徑名
    list($filename, $path, $id, $template) = self::buildStaticPath($controller, $action, $paramsList, $view);
    // 寫文件
    if (file_exists($filename)) {
      return redirect()->action('Home\ArticleController@showCacheSingle', ['id' => $id, 'template_name' => $template]);
    } else {
      if( is_dir($path)) {
        $html = $factory->make($view, $data, $mergeData)->__toString();
        self::WriteCache($filename, $html);
      } else {
        mkdir($path,0777,true);
      }
      $html = $factory->make($view, $data, $mergeData)->__toString();
      self::WriteCache($filename, $html);
      header("location:" . '/cache/' . $id . '/' . $template);
    }
  }



  public static function ResetControllerAction()
    {
      $controller = 'App\Http\Controllers\Home\ArticleController';
      $action = 'showSingle';
      return [$controller, $action];
    }

    public static function ArrayShift(Array $array, $times)
    {
      for($i = 0; $i < $times; $i++)
      {
        array_shift($array);
      }
      return $array;
    }


    // 獲取當前的控制器和方法名
    public static function getControllerActionParamsList()
    {
      if(isset($_SERVER['PARAMS'])) {
        $paramsList = $_SERVER['PARAMS'];
      } else {
        $paramsList = request()->route()->parameters();
      }
      list($controller, $action) = self::ResetControllerAction();
      return [$controller, $action, $paramsList];
    }

    public static function getRouterInfo()
    {
      if(isset($_SERVER['DIY'])) {
        $info = $_SERVER['DIY'];
      } else {
        $info = request()->route()->getAction()['controller'];
      }
      return $info;
    }

    public static function buildStaticPath($controller, $action, $paramsList, $view)
    {
      $path = self::$cache_path;
      if(isset($_SERVER['article_id'])) {
        $GLOBALS['id'] = $_SERVER['article_id'];
        $GLOBALS['template'] = $_SERVER['template'];
        $path .= '/' . $_SERVER['template'] . '/' . $_SERVER['article_id'];
      } else {
        if(count($paramsList) >= 1) {
          $path .= '/' . $paramsList['id'] . '/' . $paramsList['template_name'];
          $GLOBALS['id'] = $paramsList['id'];
        }
      }
      $filename = $path . '/' . env('CACHE_FILE_NAME') . '.' . env('CACHE_FILE_TYPE');
      return [$filename, $path, $paramsList['id'], $paramsList['template_name']];
    }

    public static function WriteCache($filename, $html)
    {
      $fp = fopen($filename,'w');
      fwrite($fp, $html);
      fclose($fp);
      dd('');
    }



}
