<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\ApiController;
use App\Http\Resources\Game\GameCollection;
use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends ApiController
{
    /**
     * Display a listing of the resource.
     *  分頁查詢
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $size = $request['size'];
        $games = Game::paginate($size);
        $count = count($games->toArray()['data']);
        if($count || $count === 0) {
          return $this->findSuccess($games);
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
        $game = $request['data'];
        $res = Game::create($game);
        if($res->toArray()['id']) {
          return $this->storeSuccess($res);
        } else {
          return $this->storeFail();
        }
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
        $game = Game::find($id);
        if($game->update($data)) {
          return $this->updateSuccess($data);
        } else {
          return $this->updateFail();
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
        $game = Game::findOrFail($id);
        if ($game->delete()) {
          return $this->deleteSuccess($game);
        } else {
          return $this->deleteFail();
        }
    }

    public function getGame() {
        $games = Game::get();
        return new GameCollection($games);
    }
}
