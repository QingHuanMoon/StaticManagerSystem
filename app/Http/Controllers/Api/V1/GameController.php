<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Resources\Game\GameCollection;
use App\Models\Game;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class GameController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        return Game::paginate($size);
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
        return Game::create($data);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function show(Game $game)
    {
        return $game->getColName();
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function edit(Game $game)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $id = $request['id'];
        $data = $request['data'];
        $user = Game::find($id);
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
     * @param  \App\Models\Game  $game
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

    public function getGame() {
        $games = Game::get();
        return new GameCollection($games);
    }
}
