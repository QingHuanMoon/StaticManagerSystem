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
        $cats =  Cate::paginate($size);
        $count = count($cats->toArray()['data']);
        if($count || $count === 0) {
          return $this->findSuccess($cats);
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
        $res = Cate::create($data);
        if($res->toArray()['id']) {
          return $this->storeSuccess($res);
        } else {
          return $this->storeFail();
        }
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
    public function update(Request $request)
    {
        $id = $request['id'];
        $data = $request['data'];
        $cate = Cate::find($id);
        if($cate->update($data)) {
          return $this->updateSuccess($data);
        } else {
          return $this->updateFail();
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
        $cate = Cate::findOrFail($id);
        if ($cate->delete()) {
          return $this->deleteSuccess($cate);
        } else {
          return $this->deleteFail();
        }
    }

    public function getCate() {
        $cates = Cate::get();
        return new CateCollection($cates);
    }
}
