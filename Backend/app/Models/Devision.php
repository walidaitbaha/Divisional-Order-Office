<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devision extends Model
{
    protected $fillable = ["name", "description"];

    public function users()
{
    return $this->hasMany(User::class);
}

public function messages(){
    return $this->belongsTo(Devision::class);
}
}
