import React from "react";
import { useState } from "react";

interface UserAccess {
  id: number;
  name: string;
  accessDuration: number;
}

const AccessControl = () => {
  const [users, setUsers] = useState<UserAccess[]>([
    { id: 1, name: "John Doe", accessDuration: 30 },
    { id: 2, name: "Jane Smith", accessDuration: 15 },
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Access Control</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Access Duration (days)</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.accessDuration} days</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AccessControl;
