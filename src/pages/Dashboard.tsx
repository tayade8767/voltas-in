/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, LogOut, UserPlus, Trash2, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuthStore } from '../store/authStore';

interface User {
  [x: string]: any;
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { logout, token } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/users/allusers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const { data } = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteUser = async (userId: string) => {
    console.log(userId);
    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete user');
      fetchUsers();  // Re-fetch users after deleting
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const [newUser, setNewUser] = useState({ name: '', email: '', role: '' });

  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const inviteData = {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    };

    console.log(inviteData);
  
    try {
      const response = await fetch('http://localhost:3000/api/users/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inviteData),
      });
  
      if (!response.ok) throw new Error('Failed to invite user');
  
      const { message } = await response.json();
      console.log(message);
  
      fetchUsers(); // Refresh the users list
      setShowInviteForm(false); // Close the form
      setNewUser({ name: '', email: '', role: '' }); // Reset form
    } catch (error) {
      console.error('Error inviting user:', error);
    }
  };
  

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(editingUser._id)
    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:3000/api/users/${editingUser._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role,
        }),
      });
      if (!response.ok) throw new Error('Failed to update user');
      fetchUsers();  // Re-fetch users after update
      setEditingUser(null);  // Reset editing form
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800/50 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Users className="w-6 h-6 text-indigo-400" />
              <span className="ml-2 text-xl font-semibold">
                User Dashboard
              </span>
            </div>
            <div className="flex items-center">
              <Button variant="secondary" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Users</h2>
            <Button onClick={() => setShowInviteForm(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>

          {showInviteForm && (
            <Card className="mb-8">
              <h3 className="text-lg font-medium mb-4">
                Invite New User
              </h3>
                <form className="space-y-4" onSubmit={handleInviteUser}>
                  <Input
                    label="Name"
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                  <Input
                    label="Role"
                    type="text"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  />
                  <div className="flex justify-end space-x-4">
                    <Button variant="secondary" onClick={() => setShowInviteForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Send Invitation</Button>
                  </div>
                </form>
            </Card>
          )}

          {editingUser && (
            <Card className="mb-8">
              <h3 className="text-lg font-medium mb-4">
                Edit User
              </h3>
              <form className="space-y-4" onSubmit={handleUpdateUser}>
                <Input
                  label="Name"
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                />
                <Input
                  label="Email"
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                <Input
                  label="Role"
                  type="text"
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                />
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Update User</Button>
                </div>
              </form>
            </Card>
          )}

          <div className="bg-gray-800/50 backdrop-blur-lg border border-white/10 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-white/10">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white/60">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-500/10 text-indigo-400">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="secondary"
                        onClick={() => setEditingUser(user)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
