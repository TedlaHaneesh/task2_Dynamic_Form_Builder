import React, { useState } from "react";
import Login from "./components/Login";
import DynamicForm from "./components/DynamicForm";
import { User } from "./types";

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {!user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <DynamicForm user={user} onLogout={handleLogout} />
        )}
      </div>
    </div>
  );
}

export default App;
