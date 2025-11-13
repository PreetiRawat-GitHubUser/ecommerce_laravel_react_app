<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::select('id' ,'name', 'is_admin', 'email', 'created_at')->get();
        return response()->json(["user" =>$user]);
    }

    /**
     * Store a newly created resource in storage.
     */
   public function demote($id)
{
    try {
        $user = User::findOrFail($id);
        $user->is_admin = false;  // demote user
        $user->save();

        return response()->json(['message' => 'User demoted successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error demoting user',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function promote($id)
{
    try {
        $user = User::findOrFail($id);
        $user->is_admin = true;  // promote user
        $user->save();

        return response()->json(['message' => 'User promoted successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Error promoting user',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::find($id);
          if(!$user){
            return response()->json(["message"=> "user not found"],404);
        }

        $user->delete();
       // $user->save();
        return response()->json(['message' => 'User deleted successfully']);
    
    }
}
