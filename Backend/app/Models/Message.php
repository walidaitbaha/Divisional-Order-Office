<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Message extends Model
{

    use SoftDeletes;

    protected $dates = ['deleted_at'];
    protected $fillable = [
        "num",
        "ref",
        'created_by',
        'from_division_id',
        'objet',
        'type',
        'date_reception',
        'date_envoi',
        'exp_des_id',
        'fichier_path',
    ];

    public function devision(){
        return $this->hasMany(Message::class);
    }

    public function expDes()
{
    return $this->belongsTo(Exp_Des::class, 'exp_des_id');
}

   
    
}
