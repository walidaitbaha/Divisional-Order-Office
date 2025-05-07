<?php

namespace App\Http\Controllers;

use App\Models\Devision;
use App\Models\Message;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Tymon\JWTAuth\Facades\JWTAuth;

class MessageController extends Controller
{
    public function getMessageOfDevision()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || !in_array($user->role, ['chef_division', 'saisie', 'admin'])) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $divisionId = $user->division_id;

            $messages = Message::with('expDes')
                    ->Where('from_division_id', $divisionId)
                    ->paginate(6);

            return response()->json(['messages' => $messages]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    public function getMessageOfDevisions()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user || $user->role !== 'admin') {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            $messages = Message::all();

            return response()->json(['messages' => $messages]);
        } catch (Exception $e) {
            return response()->json(["message" => $e->getMessage()], 500);
        }
    }

    

    public function store(Request $request)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || $user->role !== "saisie") {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        if (!$user->division_id) {
            return response()->json(['error' => 'User does not belong to a division.'], 422);
        }


        $validated = $request->validate([
            'num' => 'required|integer',
            'ref' => 'nullable|string|max:255',
            'objet' => 'required|string|max:255',
            'type' => 'required|in:entrant,sortant',
            'date_reception' => 'nullable|date',
            'date_envoi' => 'nullable|date',
            'exp_des_id' => 'nullable|integer|exists:exp_des_id,id',
            'fichier_path' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('fichier_path')) {
            $path = $request->file('fichier_path')->store('public/files');
            $validated['fichier_path'] = Storage::url($path);
        } else {
            $validated['fichier_path'] = null; 
        }

        $message = Message::create([
            'created_by' => $user->id,
            'num' => $validated['num'],
            'ref' => $validated['ref'],
            'from_division_id' => $user->division_id,
            'objet' => $validated['objet'],
            'type' => $validated['type'],
            'date_reception' => $validated['date_reception'],
            'date_envoi' => $validated['date_envoi'],
            'exp_des_id' => $validated['exp_des_id'],
            'fichier_path' => $validated['fichier_path'],
        ]);

        return response()->json([
            'message' => 'Message created successfully.',
            'data' => $message], 201);
    } catch (Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
}

public function update(Request $request, $id)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || !in_array($user->role, ['chef_division', 'admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $message = Message::findOrFail($id);

        $validated = $request->validate([
            'num' => 'sometimes|integer',
            'ref' => 'nullable|string|max:255',
            'objet' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:entrant,sortant',
            'date_reception' => 'nullable|date_format:Y-m-d',
            'date_envoi' => 'nullable|date_format:Y-m-d',
            'exp_des_id' => 'nullable|integer|exists:exp_des,id',
            'fichier_path' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        if ($request->hasFile('fichier_path')) {
            $path = $request->file('fichier_path')->store('public/files');
            $validated['fichier_path'] = Storage::url($path);
        }
        
        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'data' => $message
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422);
    } catch (Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

public function destroy($id)
{
    try {
        $user = JWTAuth::parseToken()->authenticate();
        if (!$user || !in_array($user->role, ['chef_division', 'admin'])) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $message = Message::findOrFail($id);


        $message->delete(); // soft delete
        return response()->json(['message' => 'Message deleted successfully.'],200);
    } catch (Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}

public function getDeletedMessages()
{
    try {
        $user = JWTAuth::parseToken()->authenticate();

        if (!$user || $user->role !== "admin") {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $messages = Message::onlyTrashed()->paginate(6);

        return response()->json(['messages' => $messages], 200);
    } catch (Exception $e) {
        return response()->json(['message' => $e->getMessage()], 500);
    }
}
}
