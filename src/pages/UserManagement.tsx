import { useState, useEffect } from "react";
import supabase from "../helper/supabaseClient";
import { UserPlus, Edit, Trash2, Search } from "lucide-react";
import AddUserForm from "../pages/AddUserForm"; 
import EditUserForm from "../components/EditUser";
import React from "react";
import { useNavigate } from "react-router-dom"; 

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  phone: string;
  validity: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");  // 🔍 Search State

  // Fetch Users from Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Error fetching users:", error.message);
    } else {
      setUsers(data || []);
      setFilteredUsers(data || []); // Initially set filtered users
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const navigate = useNavigate();

  // Delete User Function
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("users").delete().eq("id", id);
    if (!error) {
      const updatedUsers = users.filter((user) => user.id !== id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // 🔍 Search Function
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* User Form */}
      {isFormOpen && (
        <div className="p-4 border rounded-lg shadow-md bg-white">
          <AddUserForm onClose={() => setIsFormOpen(false)} refreshUsers={fetchUsers} />
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <EditUserForm
              user={selectedUser}
              onClose={() => setIsEditModalOpen(false)}
              refreshUsers={fetchUsers}
            />
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchQuery} // 🔍 Controlled input
              onChange={(e) => setSearchQuery(e.target.value)} // 🔍 Update search query
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="p-4 text-center">Loading users...</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>            
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}
                  className="cursor-pointer hover:bg-gray-100 transition"
              onClick={() => navigate(`/user/${user.id}/courses`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.validity).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditClick(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
