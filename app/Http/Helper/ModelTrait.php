<?php
/**
 * Created by IntelliJ IDEA.
 * User: qh
 * Date: 2018/7/28
 * Time: 上午9:58
 */

namespace App\Http\Helper;


trait ModelTrait
{



  public function __construct()
  {
//    $this->connection = Helper::getShortHost();
  }

  /**
   * 获取表的字段名
   * @return array
   */
  public function getTableColumns()
  {
    $check = ['created_at','updated_at','deleted_at'];
    $columns =  $this->getConnection()->getSchemaBuilder()->getColumnListing($this->getTable());
    for($i=0;$i<count($columns);$i++)
    {
      if(in_array($columns[$i],$check))
      {
        array_splice($columns,$i,1);
        $i = 0;
      }
    }
    return $columns;
  }


  /**
   * 获取字段注释名
   * @return array
   */
  public function getComment()
  {
    $comment = [];
    $sql = "select column_comment from INFORMATION_SCHEMA.Columns where table_name='" .$this->getTable().
      "' and table_schema='" . $this->getConnection()->getDatabaseName() . "'";
    $res = $this->getConnection()->select($sql);
    for($i=0;$i<count($res);$i++)
    {
      if($res[$i]->column_comment)
      {
        array_push($comment,$res[$i]->column_comment);
      }
    }
    return $comment;
  }


  protected function getTableName()
  {
    return $this->getTable();
  }


  /**
   *  綜合獲取可用列名數據結構
   */
  public function getColName() {
    $res = [];
    $cols = $this->getTableColumns();
    $title = $this->getComment();
    for($i = 0;$i < count($cols);$i++) {
      $res[$i]  = ['title' => $title[$i],'key' => $cols[$i]];
    }
    return $res;
  }
}
