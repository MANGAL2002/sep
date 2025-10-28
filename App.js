import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [scps, setScps] = useState([]);
  const [form, setForm] = useState({ item: "", class: "", description: "", containment: "" });
  const [editId, setEditId] = useState(null);

  const API_BASE = "http://127.0.0.1:5000";

  const fetchScps = async () => {
    try {
      const res = await fetch(`${API_BASE}/`);
      const data = await res.json();
      setScps(data["scp data"]);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchScps();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const method = editId ? "PUT" : "POST";
    const url = editId ? `${API_BASE}/scp/${editId}` : `${API_BASE}/scp`;

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setForm({ item: "", class: "", description: "", containment: "" });
      setEditId(null);
      fetchScps();
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleEdit = (scp) => {
    setForm({
      item: scp.item,
      class: scp.class,
      description: scp.description,
      containment: scp.containment,
    });
    setEditId(scp.id);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE}/scp/${id}`, { method: "DELETE" });
      fetchScps();
    } catch (err) {
      console.error("Error deleting data:", err);
    }
  };

  return (
    <div className="container">
      <h1>SCP Online Database</h1>

      <div className="form-card">
        <input name="item" placeholder="Item" value={form.item} onChange={handleChange} />
        <input name="class" placeholder="Class" value={form.class} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="containment" placeholder="Containment" value={form.containment} onChange={handleChange} />
        <button onClick={handleSubmit}>{editId ? "Update SCP" : "Add SCP"}</button>
      </div>

      <table className="scp-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Item</th>
            <th>Class</th>
            <th>Description</th>
            <th>Containment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {scps.map((scp) => (
            <tr key={scp.id}>
              <td>{scp.id}</td>
              <td>{scp.item}</td>
              <td>{scp.class}</td>
              <td>{scp.description}</td>
              <td>{scp.containment}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(scp)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(scp.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
