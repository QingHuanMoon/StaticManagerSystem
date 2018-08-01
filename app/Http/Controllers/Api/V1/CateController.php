<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\Cate\CateCollection;
use App\Models\Cate;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CateController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        return Cate::paginate($size);
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
        return Cate::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Cate  $cate
     * @return \Illuminate\Http\Response
     */
    public function show(Cate $cate)
    {
        return $cate->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Cate  $cate
     * @return \Illuminate\Http\Response
     */
    public function edit(Cate $cate)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Cate  $cate
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Cate $cate)
    {
        $id = $request['id'];
        $data = $request['data'];
        $user = Cate::find($id);
        if($user->update($data)) {
            return response()->json([
                'status' => 200,
                'msg' => '數據更新成功',
            ]);
        } else {
            return response()->json([
                'status' => -1,
                'msg' => '數據更新失敗',
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Cate  $cate
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id = $request['id'];
        $user = Game::findOrFail($id);
        if ($user->delete()) {
            return response()->json([
                'status' => 200,
                'msg' => '數據刪除成功',
            ]);
        } else {
            return response()->json([
                'status' => -1,
                'msg' => '數據刪除失敗',
            ]);
        }
    }

    public function getCate() {
        $cates = Cate::get();
        return new CateCollection($cates);
    }
}
