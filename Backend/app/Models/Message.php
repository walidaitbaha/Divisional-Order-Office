<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        "num",
        "ref",
        'created_by',
        'from_division_id',
        'to_division_id',
        'objet',
        'type',
        'date_reception',
        'date_envoi',
        'expediteur',
        'destinataire',
        'fichier_path',
    ];
    
}
