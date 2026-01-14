import React, { useState, useEffect } from "react"; //
import { router, usePage } from "@inertiajs/react";
import Swal from 'sweetalert2';
import MainLayout from '../Layouts/MainLayout';

//Helper Modal Component for Editing
const EditModal = ({ ticket, users, onClose }) => {
    const [formData, setFormData] = useState({
        title: ticket.title,
        description: ticket.description,
        assigned_to: ticket.assigned_to
    });
    const [processing, setProcessing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);
        
        router.put(`/tickets/${ticket.id}`, formData, {
            onSuccess: () => {
                Swal.fire('Updated!', 'Ticket details updated successfully.', 'success');
                onClose();
            },
            onError: () => {
                Swal.fire('Error', 'Failed to update ticket.', 'error');
                setProcessing(false);
            }
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="dashboard-card" style={{ width: '500px', margin: 0, animation: 'fadeIn 0.2s' }}>
                <h3 style={{ marginTop: 0 }}>Edit Ticket #{ticket.id}</h3>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Title</label>
                        <input 
                            value={formData.title} 
                            onChange={(e) => setFormData({...formData, title: e.target.value})} 
                            required 
                        />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                            required 
                            style={{ 
                                width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', 
                                borderRadius: '0.5rem', minHeight: '100px', fontFamily: 'inherit'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Reassign To</label>
                        <select 
                            value={formData.assigned_to} 
                            onChange={(e) => setFormData({...formData, assigned_to: e.target.value})} 
                            required
                        >
                            <option value="">Select User...</option>
                            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={onClose} style={{ background: '#94a3b8', width: 'auto', marginTop: 0 }}>Cancel</button>
                        <button type="submit" disabled={processing} style={{ width: 'auto', marginTop: 0 }}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default function Dashboard({ tickets, assignableUsers, allUsers, auth }) {
    const user = auth.user;
    
    // list of users available for assignment
    const userList = user.role === 'admin' ? allUsers : assignableUsers;

    const [view, setView] = useState(user.role === 'admin' ? "users" : "tickets");
    const [newTicket, setNewTicket] = useState({ title: "", description: "", assigned_to: "", file: null });
    const [loading, setLoading] = useState(false);
    
    // Ticket Editing
    const [editingTicket, setEditingTicket] = useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return "---";
        return new Date(dateString).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleCreateTicket = (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("title", newTicket.title);
        formData.append("description", newTicket.description);
        formData.append("assigned_to", newTicket.assigned_to);
        if (newTicket.file) formData.append("file", newTicket.file);

        router.post('/tickets/create', formData, {
            onSuccess: () => {
                Swal.fire('Success', 'Ticket Created Successfully', 'success');
                setNewTicket({ title: "", description: "", assigned_to: "", file: null });
                setLoading(false);
            },
            onError: () => {
                Swal.fire('Error', 'Failed to create ticket', 'error');
                setLoading(false);
            }
        });
    };

    const handleUpdateStatus = (id, status) => {
        router.post(`/tickets/${id}/status`, { status }, {
            preserveScroll: true,
            onSuccess: () => {
                const toast = Swal.mixin({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                toast.fire({ icon: 'success', title: `Status updated to ${status}` });
            }
        });
    };

    const handleDeleteTicket = (id) => {
        Swal.fire({
            title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(`/tickets/${id}`, {
                    onSuccess: () => Swal.fire('Deleted!', 'Ticket has been deleted.', 'success')
                });
            }
        });
    };

    const handleChangeRole = (userId, newRole) => {
        router.post(`/users/${userId}/role`, { role: newRole }, {
            onSuccess: () => Swal.fire('Success', `User role updated to ${newRole}`, 'success'),
            onError: (errors) => Swal.fire('Error', errors.msg || 'Failed', 'error')
        });
    };

    const handleDeleteUser = (userId) => {
        Swal.fire({ title: 'Delete User?', text: "Cannot be undone.", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' })
        .then((result) => {
            if (result.isConfirmed) {
                router.delete(`/users/${userId}`, {
                    onSuccess: () => Swal.fire('Deleted', 'User removed.', 'success'),
                    onError: (errors) => Swal.fire('Error', errors.msg || 'Failed', 'error')
                });
            }
        });
    };

    return (
        <MainLayout user={user}>
           {/* Edit Modal Overlay */}
            {editingTicket && (
                <EditModal 
                    ticket={editingTicket} 
                    users={userList}
                    onClose={() => setEditingTicket(null)} 
                />
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, color: '#334155' }}>
                    {view === 'users' ? 'User Management' : 'Dashboard Overview'}
                </h2>
                
                {user.role === 'admin' && (
                    <div style={{ display: 'flex', background: 'white', padding: '4px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                        <button onClick={() => setView('users')} style={{ background: view === 'users' ? '#eff6ff' : 'transparent', color: view === 'users' ? '#2563eb' : '#64748b', margin: 0, width: 'auto', padding: '8px 16px', borderRadius: '4px' }}>Users</button>
                        <button onClick={() => setView('tickets')} style={{ background: view === 'tickets' ? '#eff6ff' : 'transparent', color: view === 'tickets' ? '#2563eb' : '#64748b', margin: 0, width: 'auto', padding: '8px 16px', borderRadius: '4px' }}>Tickets</button>
                    </div>
                )}
            </div>

            {/* Content table */}
            {view === 'users' && user.role === 'admin' ? (
                <div className="dashboard-card">
                    <table>
                        <thead>
                            <tr><th>Name</th><th>Email</th><th>Role</th><th>Action</th></tr>
                        </thead>
                        <tbody>
                            {allUsers.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name} {u.email === 'admin@gmail.com' && <span style={{ color: '#2563eb', fontWeight: 'bold' }}>(You)</span>}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        {u.email === 'admin@gmail.com' ? (
                                            <span style={{ fontWeight: 'bold', color: '#ef4444' }}>ADMIN</span>
                                        ) : (
                                            <select value={u.role} onChange={(e) => handleChangeRole(u.id, e.target.value)} style={{ width: 'auto', padding: '4px 8px', margin: 0 }}>
                                                <option value="user">User</option>
                                                <option value="author">Author</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        {u.email !== 'admin@gmail.com' && (
                                            <button onClick={() => handleDeleteUser(u.id)} style={{ background: '#ef4444', width: 'auto', padding: '6px 12px', margin: 0, fontSize: '0.9em' }}>Delete</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <>
                    {user.role === 'author' && (
                        <div className="dashboard-card" style={{ background: '#fff', borderLeft: '4px solid #2563eb' }}>
                            <h3 style={{ marginTop: 0, color: '#1e293b' }}>Create New Ticket</h3>
                            <form onSubmit={handleCreateTicket} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <input placeholder="Ticket Title" value={newTicket.title} onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })} required />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <input placeholder="Description" value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} required />
                                </div>
                                <div>
                                    <select value={newTicket.assigned_to} onChange={(e) => setNewTicket({ ...newTicket, assigned_to: e.target.value })} required>
                                        <option value="">Assign to User...</option>
                                        {assignableUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <input type="file" onChange={(e) => setNewTicket({ ...newTicket, file: e.target.files[0] })} style={{ background: '#f1f5f9' }} />
                                </div>
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <button type="submit" disabled={loading} style={{ width: 'auto' }}>{loading ? 'Creating...' : 'Create Ticket'}</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="dashboard-card">
                        <h3 style={{ marginTop: 0 }}>{user.role === 'admin' ? 'All System Tickets' : 'My Tickets'}</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%' }}>Details</th>
                                    <th style={{ width: '15%' }}>Status</th>
                                    <th style={{ width: '15%' }}>Assigned To</th>
                                    <th style={{ width: '15%' }}>Created By</th>
                                    <th style={{ width: '30%' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.length > 0 ? (
                                    tickets.map(ticket => (
                                        <tr key={ticket.id}>
                                            <td>
                                                <div style={{ fontWeight: '600', color: '#1e293b' }}>{ticket.title}</div>
                                                <div style={{ fontSize: '0.9em', color: '#64748b' }}>{ticket.description}</div>
                                                {ticket.file_path && (
                                                    <a href={`/storage/${ticket.file_path}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.8em', color: '#2563eb', textDecoration: 'underline' }}>View Attachment</a>
                                                )}
                                                <div style={{ fontSize: '0.75em', color: '#94a3b8', marginTop: '4px' }}>{formatDate(ticket.created_at)}</div>
                                            </td>
                                            <td><span className={`status-${ticket.status}`}>{ticket.status}</span></td>
                                            <td>{ticket.assignee ? ticket.assignee.name : 'Unassigned'}</td>
                                            <td>{ticket.author ? ticket.author.name : 'Unknown'}</td>
                                            <td>

                                                {/* ACTION BUTTONS */}
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                                    <select 
                                                        value={ticket.status} 
                                                        onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)} 
                                                        style={{ width: 'auto', padding: '6px', fontSize: '0.9em', margin: 0 }}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="inprogress">In Progress</option>
                                                        <option value="completed">Completed</option>
                                                        <option value="onhold">On Hold</option>
                                                    </select>

                                                    {/* Edit Button (Admin & Author Only) */}
                                                    {(user.role === 'admin' || (user.role === 'author' && ticket.created_by === user.id)) && (
                                                        <button 
                                                            onClick={() => setEditingTicket(ticket)}
                                                            style={{ 
                                                                background: '#3b82f6', width: 'auto', padding: '6px 10px', 
                                                                margin: 0, fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '4px' 
                                                            }}
                                                        >
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                            </svg>
                                                            Edit
                                                        </button>
                                                    )}
                                                    
                                                    {(user.role === 'admin' || (user.role === 'author' && ticket.created_by === user.id)) && (
                                                        <button 
                                                            onClick={() => handleDeleteTicket(ticket.id)} 
                                                            style={{ 
                                                                background: '#ef4444', width: 'auto', padding: '6px 10px', 
                                                                margin: 0, fontSize: '0.9em' 
                                                            }}
                                                        >
                                                            Delete
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No tickets found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </MainLayout>
    );
}