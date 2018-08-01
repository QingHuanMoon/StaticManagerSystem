<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        return Template::paginate($size);
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
        return Template::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function show(Template $template)
    {
        return $template->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function edit(Template $template)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $id = $request['id'];
        $data = $request['data'];
        $user = Template::find($id);
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
     * @param  \App\Models\Template  $template
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id = $request['id'];
        $user = Template::findOrFail($id);
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
}
