<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AdminProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $admin = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $admin->id,
            'password' => 'nullable|min:6|confirmed',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->has('name')) {
            $admin->name = $request->name;
        }

        if ($request->has('email')) {
            $admin->email = $request->email;
        }

        if ($request->filled('password')) {
            $admin->password = Hash::make($request->password);
        }

        if ($request->hasFile('image')) {
            if ($admin->image) {
                Storage::delete('public/' . $admin->image);
            }
            $path = $request->file('image')->store('profiles', 'public');
            $admin->image = $path;
        }

        $admin->save();

        return response()->json([
            'message' => 'Profile updated successfully!',
            'admin' => $admin
        ]);
    }
}
