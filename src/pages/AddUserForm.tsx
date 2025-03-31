import { useState } from "react";
import supabase from "../helper/supabaseClient";
import React from "react";
import { createHash } from "crypto";

interface AddUserFormProps {
  onClose: () => void;
  refreshUsers: () => Promise<void>;
}

const AddUserForm: React.FC<AddUserFormProps> = ({ onClose, refreshUsers }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("User");
  const [gender, setGender] = useState(""); 
  const [phoneNumber, setPhoneNumber] = useState(""); 
  const [validity, setValidity] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  // Function to hash the password
  const hashPassword = (plainPassword: string): string => {
    // In a browser environment, we can use Web Crypto API
    // This is a simple example - in production, use a proper password hashing library with salt
    const encoder = new TextEncoder();
    const data = encoder.encode(plainPassword);
    
    // Convert the encoded data to a hex string
    return Array.from(data)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  };

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

    // Hash the password before storing
    const hashedPassword = hashPassword(password);

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

    const { error: insertError } = await supabase.from("users").insert([
      {
        auth_user_id: newUser.id, // Use the auth user ID to link the records
        name,
        email,
        password: password,//hashedPassword, // Store hashed password
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
        <option value="<Male">Male</option>
        <option value="Female">Female</option>
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
        <option value="User">User</option>
        <option value="Admin">Admin</option>
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