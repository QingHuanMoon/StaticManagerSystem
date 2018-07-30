<?php

namespace App\Http\Resources\Cate;

use Illuminate\Http\Resources\Json\JsonResource;

class Cate extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'label' => $this->name,
            'value' => $this->id
        ];
    }


}
