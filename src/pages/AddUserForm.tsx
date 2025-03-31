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
  const [gender, setGender] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [validity, setValidity] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Phone number validation function
  const validatePhoneNumber = (phone: string) => {
    if (phone.length < 10) {
      setPhoneError("Phone number must be at least 10 digits");
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate phone number before submission
    if (!validatePhoneNumber(phoneNumber)) {
      setLoading(false);
      return;
    }

    // First, create the user in Supabase Auth
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

    // Then, insert the user info into your custom users table
    // Note: We're not storing the password in the users table, which is correct
    const { error: insertError } = await supabase.from("users").insert([
      {
        auth_user_id: newUser.id, // Use the auth user ID to link the records
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
  
  // Handle phone number input change with validation
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only digits
    const phoneDigits = value.replace(/\D/g, '');
    setPhoneNumber(phoneDigits);
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

      {/* Phone Number Input with validation */}
      <div>
        <input 
          type="tel" 
          placeholder="Phone Number (minimum 10 digits)" 
          value={phoneNumber} 
          onChange={handlePhoneChange}
          onBlur={() => validatePhoneNumber(phoneNumber)}
          required 
          className={`border p-2 rounded-lg w-full ${phoneError ? 'border-red-500' : ''}`} 
        />
        {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
      </div>

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