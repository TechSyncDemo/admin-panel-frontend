import { useState } from "react";
import supabase from "../helper/supabaseClient";
import React from "react";

interface AddUserFormProps {
  onClose: () => void;
  refreshUsers: () => Promise<void>;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, refreshUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("user");
  const [gender, setGender] = useState(""); // New gender field
  const [phoneNumber, setPhoneNumber] = useState(""); // New phone number field
  const [validity, setValidity] = useState(""); // New validity date field
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    const newUser = data?.user;
    if (!newUser) {
      setError("User creation failed.");
      setLoading(false);
      return;
    }

    // Insert user data into Supabase "users" table with new fields
    const { error: insertError } = await supabase.from("users").insert([
      {
        name,
        email,
        role,
        gender,
        phone: phoneNumber,
        validity: validity,
        created_at: new Date().toISOString()
      },
    ]);

    if (insertError) {
      setError(insertError.message);
    } else {
      alert(`User ${email} added successfully! ✅`);
      await refreshUsers();
      onClose();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input 
        type="text" 
        placeholder="Full Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />

      {/* Gender Selection Dropdown */}
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
        className="border p-2 rounded-lg"
      >
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

      {/* Phone Number Input */}
      <input 
        type="tel" 
        placeholder="Phone Number" 
        value={phoneNumber} 
        onChange={(e) => setPhoneNumber(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />

      {/* Validity Date Input */}
      <input 
        type="date" 
        placeholder="Validity" 
        value={validity} 
        onChange={(e) => setValidity(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />

      {/* Role Selection Dropdown */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border p-2 rounded-lg"
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button 
        type="submit" 
        disabled={loading} 
        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
      >
        {loading ? "Creating..." : "Create User"}
      </button>
      
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default AddUserForm;