import { useState } from "react";
import supabase from "../helper/supabaseClient";
import React from "react";

interface AddUserFormProps {
  onClose: () => void;
  refreshUsers: () => Promise<void>; // Ensure this matches the actual function type
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, refreshUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password }); // ✅ Fix: Access 'data.user'
    const newUser = data?.user;  // ✅ Ensure we properly access 'user'

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (!newUser) {
      setError("User creation failed.");
      setLoading(false);
      return;
    }

    // Insert user data into Supabase "users" table
    const { error: insertError } = await supabase.from("users").insert([
      { id: newUser.id, name, email, role, created_at: new Date().toISOString() },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      alert("User added successfully!");
      await refreshUsers(); // Ensure it's awaited to prevent race conditions
      onClose();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required className="border p-2 rounded-lg" />
      <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="border p-2 rounded-lg" />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="border p-2 rounded-lg" />
      <button type="submit" disabled={loading} className="bg-green-600 text-white p-2 rounded-lg">
        {loading ? "Creating..." : "Create User"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default AddUserForm;
