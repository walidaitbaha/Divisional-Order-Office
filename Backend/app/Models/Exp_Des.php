<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exp_Des extends Model
{
    protected $table = 'exp_des';
    protected $fillable = ["name"];

    public function message(){
        return $this->belongsTo(Message::class);
    }
}
