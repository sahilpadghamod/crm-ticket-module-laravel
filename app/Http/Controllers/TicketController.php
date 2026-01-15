<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class TicketController extends Controller
{
    // Main Dashboard View - Fetches data based on Role
    public function index()
    {
        $user = Auth::user();
        $tickets = [];

        // View Tickets
        if ($user->role === 'admin') {
            $tickets = Ticket::with(['author', 'assignee'])->latest()->get();
        } elseif ($user->role === 'author') {
            $tickets = Ticket::with(['assignee'])->where('created_by', $user->id)->latest()->get();
        } else {
            $tickets = Ticket::with(['author'])->where('assigned_to', $user->id)->latest()->get();
        }

        // Fetch extra data for UI
        $assignableUsers = ($user->role === 'author') ? User::where('role', 'user')->get() : [];
        $allUsers = ($user->role === 'admin') ? User::all() : [];

        return Inertia::render('Dashboard', [
            'auth' => ['user' => $user],
            'tickets' => $tickets,
            'assignableUsers' => $assignableUsers,
            'allUsers' => $allUsers
        ]);
    }

    // Create Ticket
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'description' => 'required',
            'assigned_to' => 'required|exists:users,id',
            'file' => 'nullable|file|max:2048'
        ]);

        $filePath = null;
        if ($request->hasFile('file')) {
            $filePath = $request->file('file')->store('uploads', 'public');
        }

        Ticket::create([
            'title' => $request->title,
            'description' => $request->description,
            'assigned_to' => $request->assigned_to,
            'created_by' => Auth::id(),
            'file_path' => $filePath,
            'status' => 'pending'
        ]);

        return redirect()->back();
    }

    // Update ticket Status
    public function updateStatus(Request $request, Ticket $ticket)
    {
        $ticket->update(['status' => $request->status]);
        return redirect()->back();
    }

    // Soft Delete Ticket
    public function destroy(Ticket $ticket)
    {
        $user = Auth::user();

        // for Admin OR Author of the ticket
        if ($user->role === 'admin' || ($user->role === 'author' && $ticket->created_by === $user->id)) {
            $ticket->delete();
        } else {
            abort(403, 'Unauthorized action.');
        }

        return redirect()->back();
    }

    public function update(Request $request, Ticket $ticket)
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $user->id !== $ticket->created_by) {
            abort(403, 'Unauthorized action.');
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'assigned_to' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'title' => $request->title,
            'description' => $request->description,
            'assigned_to' => $request->assigned_to,
        ]);

        return redirect()->back();
    }
}
