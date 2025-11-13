import React from "react";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <p className="text-center mt-10">User not found. Please login again.</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-center mb-4">👤 My Profile</h2>
      <div className="space-y-3">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* Add more user info if available */}
      </div>
    </div>
  );
};

export default Profile;
