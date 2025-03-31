import { useState} from "react";
import supabase from "../helper/supabaseClient";
import React from "react";

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

interface EditUserFormProps {
  user: User;
  onClose: () => void;
  refreshUsers: () => Promise<void>;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ user, onClose, refreshUsers }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [role, setRole] = useState(user.role);
  const [gender, setGender] = useState(user.gender);
  const [phoneNumber, setPhoneNumber] = useState(user.phone);
  const [validity, setValidity] = useState(user.validity);
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

    if (!validatePhoneNumber(phoneNumber)) {
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        email,
        password,
        role,
        gender,
        phone: phoneNumber,
        validity,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    // Update auth email if changed
    if (email !== user.email) {
      const { error: authUpdateError } = await supabase.auth.updateUser({
        email: email
      });

      if (authUpdateError) {
        setError(authUpdateError.message);
        setLoading(false);
        return;
      }
    }

    // Update auth password if changed
    if (password !== user.password) {
      const { error: passwordUpdateError } = await supabase.auth.updateUser({
        password: password
      });

      if (passwordUpdateError) {
        setError(passwordUpdateError.message);
        setLoading(false);
        return;
      }
    }

    alert(`User ${email} updated successfully! ✅`);
    await refreshUsers();
    onClose();
    setLoading(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
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

      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
        required
        className="border p-2 rounded-lg"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

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

      <input 
        type="date" 
        placeholder="Validity" 
        value={validity} 
        onChange={(e) => setValidity(e.target.value)} 
        required 
        className="border p-2 rounded-lg" 
      />

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
        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {loading ? "Updating..." : "Update User"}
      </button>
      
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default EditUserForm;