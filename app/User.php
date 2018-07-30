<?php

namespace App;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password','isActive','isOnline',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


    /**
     * 获取表的字段名
     * @return array
     */
    public function getTableColumns()
    {
        $check = ['created_at','updated_at','deleted_at','remember_token','password'];
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
            if($res[$i]->column_comment && $res[$i]->column_comment != '密碼')
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
