import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Badge,
  Spinner,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";

const roleColors = {
  admin: "primary",
  user: "secondary",
};

const statusColors = {
  true: "success",
  false: "secondary",
};

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    role: "user",
    is_verified: false,
  });
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    role: "user",
    is_verified: false,
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      setError("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.is_verified,
    });
    setShowEdit(true);
    setSuccess("");
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({ ...editForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/users/${editUser.id}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("User updated successfully.");
      setShowEdit(false);
      fetchUsers();
    } catch (err) {
      setError("Failed to update user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddForm({ ...addForm, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/users", addForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User added successfully.");
      setShowAdd(false);
      setAddForm({
        name: "",
        email: "",
        role: "user",
        is_verified: false,
        password: "",
      });
      fetchUsers();
    } catch (err) {
      setError("Failed to add user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User deleted successfully.");
      fetchUsers();
    } catch (err) {
      setError("Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="container py-5 min-vh-100" style={{ background: "#f8f9fa" }}>
      <Card className="shadow-lg border-0 mx-auto" style={{ maxWidth: 1100, borderRadius: 18 }}>
        <Card.Header className="bg-white border-0 pb-0 d-flex align-items-center justify-content-between" style={{ borderTopLeftRadius: 18, borderTopRightRadius: 18 }}>
          <div>
            <h2 className="fw-bold mb-1 text-primary">Manage Users</h2>
            <div className="text-secondary small">View, edit, add, or remove users from the platform.</div>
          </div>
          <Button variant="primary" onClick={() => setShowAdd(true)} className="d-flex align-items-center gap-2 fw-semibold rounded-pill px-4 py-2">
            <i className="fa fa-user-plus"></i> Add User
          </Button>
        </Card.Header>
        <Card.Body className="pt-3">
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" /> Loading users...
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle shadow-sm bg-white rounded admin-users-table">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Verified</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="admin-user-row">
                      <td>
                        <div className="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style={{ width: 38, height: 38, fontWeight: 700, color: '#0d6efd', fontSize: 18 }}>
                          {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2)}
                        </div>
                      </td>
                      <td className="fw-semibold">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={roleColors[user.role] || "secondary"} className="px-2 py-1 text-capitalize">
                          {user.role}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={user.is_verified ? "success" : "secondary"} className="px-2 py-1">
                          {user.is_verified ? "Verified" : "Unverified"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2 rounded-pill px-3"
                          onClick={() => handleEdit(user)}
                          disabled={actionLoading}
                        >
                          <i className="fa fa-edit me-1"></i> Edit
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="rounded-pill px-3"
                          onClick={() => handleDelete(user.id)}
                          disabled={actionLoading}
                        >
                          <i className="fa fa-trash me-1"></i> Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
      {/* Edit User Modal */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)} centered>
        <Modal.Header closeButton className="bg-primary bg-opacity-10 border-0">
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit} autoComplete="off">
          <Modal.Body>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="editVerified">
              <Form.Check
                type="checkbox"
                label="Verified"
                name="is_verified"
                checked={!!editForm.is_verified}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editPassword">
              <Form.Label>New Password (leave blank to keep unchanged)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editForm.password || ""}
                onChange={handleEditChange}
                autoComplete="new-password"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEdit(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <Spinner size="sm" /> : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      {/* Add User Modal */}
      <Modal show={showAdd} onHide={() => setShowAdd(false)} centered>
        <Modal.Header closeButton className="bg-primary bg-opacity-10 border-0">
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddSubmit} autoComplete="off">
          <Modal.Body>
            <Form.Group className="mb-3" controlId="addName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={addForm.name}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={addForm.email}
                onChange={handleAddChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={addForm.password}
                onChange={handleAddChange}
                required
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addRole">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={addForm.role}
                onChange={handleAddChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="addVerified">
              <Form.Check
                type="checkbox"
                label="Verified"
                name="is_verified"
                checked={!!addForm.is_verified}
                onChange={handleAddChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={actionLoading}>
              {actionLoading ? <Spinner size="sm" /> : "Add User"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <style>{`
        .admin-users-table th, .admin-users-table td {
          vertical-align: middle !important;
        }
        .admin-users-table tbody tr.admin-user-row:hover {
          background: #f0f6ff !important;
        }
      `}</style>
    </div>
  );
};

export default AdminManageUsers;
