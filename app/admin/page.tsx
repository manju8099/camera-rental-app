"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminPage() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("users")

  const [users, setUsers] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])

  const [showCreate, setShowCreate] = useState(false)

  const [name, setName] = useState("")
  const [mobile, setMobile] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("customer")

  const [editingUser, setEditingUser] = useState<any>(null)

  const [editName, setEditName] = useState("")
  const [editMobile, setEditMobile] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("customer")
  const [editPassword, setEditPassword] = useState("")

  useEffect(() => {
    loadUsers()
    loadBookings()
  }, [])

  async function loadUsers() {
    try {
      const res = await fetch("/api/users")
      const data = await res.json()
      setUsers(data || [])
    } catch (err) {
      console.log(err)
    }
  }

  async function loadBookings() {
    try {
      const res = await fetch("/api/bookings?all=true")
      const data = await res.json()

      if (Array.isArray(data)) {
        setBookings(data)
      } else {
        setBookings([])
      }
    } catch (err) {
      console.log(err)
      setBookings([])
    }
  }

  async function createUser() {
    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          mobile,
          email,
          password,
          role,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        alert(data.error)
        return
      }

      alert("User created successfully")

      setName("")
      setMobile("")
      setEmail("")
      setPassword("")
      setRole("customer")

      setShowCreate(false)

      loadUsers()
    } catch (err) {
      console.log(err)
      alert("Failed to create user")
    }
  }

  async function saveUser(userId: string) {
    try {
      await fetch("/api/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: userId,
          name: editName,
          mobile: editMobile,
          email: editEmail,
          role: editRole,
        }),
      })

      if (editPassword.trim() !== "") {
        await fetch("/api/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            password: editPassword,
          }),
        })
      }

      alert("User updated successfully")

      setEditingUser(null)

      loadUsers()
    } catch (err) {
      console.log(err)
      alert("Failed to update user")
    }
  }

  function logout() {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div style={pageStyle}>
      {/* HEADER */}

      <div style={headerStyle}>
        <div>
          <h1 style={{ margin: 0, fontSize: "42px" }}>
            Camera Rental Admin
          </h1>

          <p
            style={{
              marginTop: "10px",
              color: "#d1d5db",
              fontSize: "18px",
            }}
          >
            Manage users and bookings
          </p>
        </div>

        <button onClick={logout} style={logoutBtn}>
          Logout
        </button>
      </div>

      {/* TABS */}

      <div style={{ display: "flex", gap: "15px", marginBottom: "25px" }}>
        <button
          onClick={() => setActiveTab("users")}
          style={{
            ...tabBtn,
            background:
              activeTab === "users" ? "#2563eb" : "white",
            color:
              activeTab === "users" ? "white" : "black",
          }}
        >
          Users
        </button>

        <button
          onClick={() => setActiveTab("bookings")}
          style={{
            ...tabBtn,
            background:
              activeTab === "bookings" ? "#2563eb" : "white",
            color:
              activeTab === "bookings" ? "white" : "black",
          }}
        >
          Bookings
        </button>
      </div>

      {/* USERS TAB */}

      {activeTab === "users" && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontSize: "28px" }}>
              Users Management
            </h2>

            <button
              onClick={() =>
                setShowCreate(!showCreate)
              }
              style={greenBtn}
            >
              {showCreate
                ? "Close"
                : "+ Create User"}
            </button>
          </div>

          {/* CREATE USER */}

          {showCreate && (
            <div style={cardStyle}>
              <h3>Create User</h3>

              <div style={formGrid}>
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  style={inputStyle}
                />

                <input
                  placeholder="Mobile"
                  value={mobile}
                  onChange={(e) =>
                    setMobile(e.target.value)
                  }
                  style={inputStyle}
                />

                <input
                  placeholder="Email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  style={inputStyle}
                />

                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  style={inputStyle}
                />

                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value)
                  }
                  style={inputStyle}
                >
                  <option value="customer">
                    Customer
                  </option>

                  <option value="admin">
                    Admin
                  </option>
                </select>
              </div>

              <button
                onClick={createUser}
                style={greenBtn}
              >
                Create User
              </button>
            </div>
          )}

          {/* USERS LIST */}

          <div style={cardStyle}>
            <h2>Users List</h2>

            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={theadStyle}>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Mobile</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Role</th>
                    <th style={thStyle}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td style={tdStyle}>
                        {editingUser === u.id ? (
                          <input
                            value={editName}
                            onChange={(e) =>
                              setEditName(
                                e.target.value
                              )
                            }
                            style={inputStyle}
                          />
                        ) : (
                          u.name
                        )}
                      </td>

                      <td style={tdStyle}>
                        {editingUser === u.id ? (
                          <input
                            value={editMobile}
                            onChange={(e) =>
                              setEditMobile(
                                e.target.value
                              )
                            }
                            style={inputStyle}
                          />
                        ) : (
                          u.mobile
                        )}
                      </td>

                      <td style={tdStyle}>
                        {editingUser === u.id ? (
                          <input
                            value={editEmail}
                            onChange={(e) =>
                              setEditEmail(
                                e.target.value
                              )
                            }
                            style={inputStyle}
                          />
                        ) : (
                          u.email
                        )}
                      </td>

                      <td style={tdStyle}>
                        {editingUser === u.id ? (
                          <select
                            value={editRole}
                            onChange={(e) =>
                              setEditRole(
                                e.target.value
                              )
                            }
                            style={inputStyle}
                          >
                            <option value="customer">
                              Customer
                            </option>

                            <option value="admin">
                              Admin
                            </option>
                          </select>
                        ) : (
                          u.role
                        )}
                      </td>

                      <td style={tdStyle}>
                        {editingUser === u.id ? (
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              flexWrap: "wrap",
                            }}
                          >
                            <input
                              type="password"
                              placeholder="New Password"
                              value={editPassword}
                              onChange={(e) =>
                                setEditPassword(
                                  e.target.value
                                )
                              }
                              style={{
                                ...inputStyle,
                                width: "140px",
                              }}
                            />

                            <button
                              onClick={() =>
                                saveUser(u.id)
                              }
                              style={saveBtn}
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                setEditingUser(null)
                              }
                              style={cancelBtn}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingUser(u.id)

                              setEditName(
                                u.name || ""
                              )

                              setEditMobile(
                                u.mobile || ""
                              )

                              setEditEmail(
                                u.email || ""
                              )

                              setEditRole(
                                u.role || "customer"
                              )

                              setEditPassword("")
                            }}
                            style={editBtn}
                          >
                            Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* BOOKINGS TAB */}

      {activeTab === "bookings" && (
        <div style={cardStyle}>
          <h2>All Bookings</h2>

          <div style={{ overflowX: "auto" }}>
            <table style={tableStyle}>
              <thead>
                <tr style={theadStyle}>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Camera ID</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Time</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td style={tdStyle}>
                      {b.customer_name}
                    </td>

                    <td style={tdStyle}>
                      {b.camera_id}
                    </td>

                    <td style={tdStyle}>
                      {b.booking_date}
                    </td>

                    <td style={tdStyle}>
                      {b.start_hour} - {b.end_hour}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

/* STYLES */

const pageStyle = {
  padding: "25px",
  background: "#eef2f7",
  minHeight: "100vh",
}

const headerStyle = {
  background: "#020b2d",
  color: "white",
  borderRadius: "20px",
  padding: "30px",
  marginBottom: "25px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "25px",
}

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit,minmax(220px,1fr))",
  gap: "15px",
  marginBottom: "20px",
}

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  width: "100%",
  fontSize: "14px",
}

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
}

const theadStyle = {
  background: "#020b2d",
  color: "white",
}

const thStyle = {
  padding: "14px",
  textAlign: "left" as const,
}

const tdStyle = {
  padding: "14px",
  borderBottom: "1px solid #e5e7eb",
}

const tabBtn = {
  padding: "14px 28px",
  borderRadius: "14px",
  border: "none",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
}

const greenBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px 22px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
}

const logoutBtn = {
  background: "red",
  color: "white",
  border: "none",
  padding: "14px 28px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "16px",
}

const editBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
}

const saveBtn = {
  background: "green",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
}

const cancelBtn = {
  background: "gray",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
}