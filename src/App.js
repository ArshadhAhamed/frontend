import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "https://acsassbackend.onrender.com/api/users"
      );
      setUsers(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(
          `https://acsassbackend.onrender.com/api/users/${editId}`,
          form
        );
      } else {
        await axios.post("https://acsassbackend.onrender.com/api/users", form);
      }
      setForm({ name: "", email: "", age: "" });
      setEditId(null);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting form");
    }
  };

  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email, age: user.age });
    setEditId(user._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://acsassbackend.onrender.com/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting user");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="container">
      <h2>User Management</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="number"
          name="age"
          value={form.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <button type="submit" className="submit-btn">
          {editId ? "Update" : "Create"} User
        </button>
      </form>

      <h3>All Users</h3>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user._id} className="user-item">
            {user.name} ({user.email}), Age: {user.age}{" "}
            <button onClick={() => handleEdit(user)} className="edit-btn">
              Edit
            </button>
            <button
              onClick={() => handleDelete(user._id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
