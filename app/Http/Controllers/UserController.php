<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Change User Role (User/Author)
    public function updateRole(Request $request, User $user)
    {
        if(Auth::user()->role !== 'admin') abort(403);

        $request->validate(['role' => 'required|in:user,author']);
        
        if ($user->email === 'admin@gmail.com') return back()->withErrors(['msg' => 'Cannot change Admin role']);

        $user->update(['role' => $request->role]);
        return redirect()->back();
    }

    // Delete User
    public function destroy(User $user)
    {
        if(Auth::user()->role !== 'admin') abort(403);

        if ($user->email === 'admin@gmail.com') {
            return back()->withErrors(['msg' => 'Cannot delete Main Admin']);
        }

        // Check active tickets
        $hasActiveTickets = Ticket::where('assigned_to', $user->id)
            ->orWhere('created_by', $user->id)
            ->exists();

        if ($hasActiveTickets) {
            return back()->withErrors(['msg' => 'User has active tickets. Cannot delete.']);
        }

        $user->delete();
        return redirect()->back();
    }
}