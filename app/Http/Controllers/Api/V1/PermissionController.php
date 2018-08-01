<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends ApiController
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        $permissions = Permission::paginate($size);
        $count = count($permissions->toArray()['data']);
        if($count || $count === 0) {
          return $this->findSuccess($permissions);
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
        $res = Permission::create($data);
        if($res->toArray()['id']) {
          return $this->storeSuccess($res);
        } else {
          return $this->storeFail();
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function show(Permission $permission)
    {
        return $permission->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function edit(Permission $permission)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Permission $permission)
    {
        $id = $request['id'];
        $data = $request['data'];
        $permisstion = Permission::find($id);
        if($permisstion->update($data)) {
          return $this->updateSuccess($data);
        } else {
          return $this->updateFail();
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Permission  $permission
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request)
    {
        $id = $request['id'];
        $permission = Permission::findOrFail($id);
        if ($permission->delete()) {
          return $this->deleteSuccess($permission);
        } else {
          return $this->deleteFail();
        }
    }
}
