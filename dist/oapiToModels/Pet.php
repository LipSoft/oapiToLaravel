<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pet extends Model
{
    protected $fillable = [
        'id',
        'name',
        'tag',
    ];

    protected $hidden = [
        
    ];
}
