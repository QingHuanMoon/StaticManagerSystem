<?php

namespace App\Http\Controllers\Api\V1;

use App\Models\Role;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        return Role::paginate($size);
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
        return Role::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function show(Role $role)
    {
        return $role->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function edit(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Role $role)
    {
        $id = $request['id'];
        $data = $request['data'];
        $user = Role::find($id);
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
     * @param  \App\Models\Role  $role
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id = $request['id'];
        $user = Role::findOrFail($id);
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
