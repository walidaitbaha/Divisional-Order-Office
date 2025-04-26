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

            $messages = Message::where('from_division_id', $divisionId)
                ->paginate(3);

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
            'num' => 'required|integer|max:255',
            'ref' => 'nullable|string|max:255',
            'to_division_id' => 'required|exists:devisions,id',
            'objet' => 'required|string|max:255',
            'type' => 'required|in:entrant,sortant',
            'date_reception' => 'nullable|date',
            'date_envoi' => 'nullable|date',
            'expediteur' => 'nullable|string|max:255',
            'destinataire' => 'nullable|string|max:255',
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
            'to_division_id' => $validated['to_division_id'],
            'objet' => $validated['objet'],
            'type' => $validated['type'],
            'date_reception' => $validated['date_reception'],
            'date_envoi' => $validated['date_envoi'],
            'expediteur' => $validated['expediteur'],
            'destinataire' => $validated['destinataire'],
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
        $message = Message::findOrFail($id);

        if ($message->created_by !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'num' => 'required|integer',
            'ref' => 'nullable|string|max:255',
            'to_division_id' => 'required|exists:devisions,id',
            'objet' => 'required|string|max:255',
            'type' => 'required|in:entrant,sortant',
            'date_reception' => 'nullable|date_format:Y-m-d H:i',
            'date_envoi' => 'nullable|date_format:Y-m-d H:i',
            'expediteur' => 'nullable|string|max:255',
            'destinataire' => 'nullable|string|max:255',
            'fichier_path' => 'sometimes|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:2048',
        ]);

        // File handling
        if ($request->hasFile('fichier_path')) {
            // Delete old file
            if ($message->fichier_path) {
                $oldPath = str_replace('/storage', 'public', $message->fichier_path);
                Storage::delete($oldPath);
            }
            
            // Store new file
            $path = $request->file('fichier_path')->store('public/files');
            $validated['fichier_path'] = Storage::url($path);
        } else {
            // Keep existing file if not updating
            $validated['fichier_path'] = $message->fichier_path;
        }

        // Convert empty strings to null
        $validated = array_map(fn($value) => $value === '' ? null : $value, $validated);

        $message->update($validated);

        return response()->json([
            'message' => 'Message updated successfully.',
            'data' => $message
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
            'message' => 'Validation failed'
        ], 422);
    } catch (Exception $e) {
        return response()->json([
            'error' => 'Server error',
            'message' => $e->getMessage()
        ], 500);
    }
}



}
