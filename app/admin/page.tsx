"use client"

import { useEffect, useState } from "react"

export default function AdminPage() {

  const [activeTab, setActiveTab] =
    useState("users")

  const [users, setUsers] =
    useState<any[]>([])

  const [bookings, setBookings] =
    useState<any[]>([])

  const [showCreateUser, setShowCreateUser] =
    useState(false)

  const [name, setName] =
    useState("")

  const [mobile, setMobile] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [role, setRole] =
    useState("customer")

  const [editUserData, setEditUserData] =
    useState<any>(null)

  const [editName, setEditName] =
    useState("")

  const [editMobile, setEditMobile] =
    useState("")

  const [editEmail, setEditEmail] =
    useState("")

  const [editRole, setEditRole] =
    useState("customer")

  const [editPassword, setEditPassword] =
    useState("")

  useEffect(() => {

    getUsers()
    getBookings()

  }, [])

  const getUsers = async () => {

    try {

      const res =
        await fetch("/api/users")

      const data =
        await res.json()

      setUsers(data || [])

    } catch (err) {

      console.log(err)
    }
  }

  const getBookings = async () => {

    try {

      const res =
        await fetch(
          "/api/bookings?all=true"
        )

      const data =
        await res.json()

      setBookings(data || [])

    } catch (err) {

      console.log(err)
    }
  }

  const createUser = async () => {

    const res =
      await fetch(
        "/api/create-user",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            name,
            mobile,
            email,
            password,
            role
          })
        }
      )

    const data =
      await res.json()

    if (data.success) {

      alert("User Created")

      setShowCreateUser(false)

      getUsers()

    } else {

      alert(data.error)
    }
  }

  const editUser = (user: any) => {

    setEditUserData(user)

    setEditName(user.name || "")

    setEditMobile(user.mobile || "")

    setEditEmail(user.email || "")

    setEditRole(user.role || "customer")

    setEditPassword("")
  }

  const updateUser = async () => {

    const res =
      await fetch(
        "/api/update-user",
        {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({

            id:
              editUserData.id,

            name:
              editName,

            mobile:
              editMobile,

            email:
              editEmail,

            role:
              editRole
          })
        }
      )

    const data =
      await res.json()

    if (data.success) {

      if (editPassword) {

        await fetch(
          "/api/update-password",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({

              userId:
                editUserData.id,

              password:
                editPassword
            })
          }
        )
      }

      alert("Updated")

      setEditUserData(null)

      getUsers()
    }
  }

  const cancelBooking =
    async (id: string) => {

      const res =
        await fetch(
          "/api/cancel-booking",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              id
            })
          }
        )

      const data =
        await res.json()

      if (data.success) {

        alert(
          "Booking Cancelled"
        )

        getBookings()
      }
    }

  return (

    <div style={pageStyle}>

      <div style={headerStyle}>

        <div>

          <h1 style={headerTitle}>
            Camera Rental Admin
          </h1>

          <p style={headerSubtitle}>
            Manage users and bookings
          </p>

        </div>

      </div>

      <div style={tabContainer}>

        <button
          onClick={() =>
            setActiveTab("users")
          }
          style={{
            ...tabBtn,
            background:
              activeTab === "users"
                ? "#2563eb"
                : "#fff",
            color:
              activeTab === "users"
                ? "#fff"
                : "#000"
          }}
        >
          Users
        </button>

        <button
          onClick={() =>
            setActiveTab(
              "bookings"
            )
          }
          style={{
            ...tabBtn,
            background:
              activeTab ===
              "bookings"
                ? "#2563eb"
                : "#fff",
            color:
              activeTab ===
              "bookings"
                ? "#fff"
                : "#000"
          }}
        >
          Bookings
        </button>

      </div>

      {
        activeTab === "users" && (

          <>

            <div style={topBar}>

              <h2 style={sectionTitle}>
                Users Management
              </h2>

              <button
                style={createBtn}
                onClick={() =>
                  setShowCreateUser(
                    !showCreateUser
                  )
                }
              >
                + Create User
              </button>

            </div>

            {
              showCreateUser && (

                <div style={sectionCard}>

                  <div style={formGrid}>

                    <input
                      placeholder="Name"
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Mobile"
                      onChange={(e) =>
                        setMobile(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Email"
                      onChange={(e) =>
                        setEmail(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <input
                      placeholder="Password"
                      type="password"
                      onChange={(e) =>
                        setPassword(
                          e.target.value
                        )
                      }
                      style={inputStyle}
                    />

                    <select
                      onChange={(e) =>
                        setRole(
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

                  </div>

                  <button
                    style={createBtn}
                    onClick={createUser}
                  >
                    Create User
                  </button>

                </div>
              )
            }

            <div style={sectionCard}>

              <table style={tableStyle}>

                <thead>

                  <tr>

                    <th style={thStyle}>
                      Name
                    </th>

                    <th style={thStyle}>
                      Mobile
                    </th>

                    <th style={thStyle}>
                      Email
                    </th>

                    <th style={thStyle}>
                      Role
                    </th>

                    <th style={thStyle}>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {
                    users.map(
                      (user: any) => (

                        <tr
                          key={user.id}
                        >

                          <td style={tdStyle}>
                            {user.name}
                          </td>

                          <td style={tdStyle}>
                            {user.mobile}
                          </td>

                          <td style={tdStyle}>
                            {user.email}
                          </td>

                          <td style={tdStyle}>
                            {user.role}
                          </td>

                          <td style={tdStyle}>

                            <button
                              style={editBtn}
                              onClick={() =>
                                editUser(
                                  user
                                )
                              }
                            >
                              Edit
                            </button>

                          </td>

                        </tr>
                      )
                    )
                  }

                </tbody>

              </table>

            </div>

          </>
        )
      }

      {
        activeTab === "bookings" && (

          <div style={sectionCard}>

            <table style={tableStyle}>

              <thead>

                <tr>

                  <th style={thStyle}>
                    Customer
                  </th>

                  <th style={thStyle}>
                    Camera
                  </th>

                  <th style={thStyle}>
                    Date
                  </th>

                  <th style={thStyle}>
                    Time
                  </th>

                  <th style={thStyle}>
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {
                  bookings.map(
                    (
                      booking: any
                    ) => (

                      <tr
                        key={
                          booking.id
                        }
                      >

                        <td style={tdStyle}>
                          {
                            booking.customer_name
                          }
                        </td>

                        <td style={tdStyle}>
                          {
                            booking.camera_name
                          }
                        </td>

                        <td style={tdStyle}>
                          {
                            booking.booking_date
                          }
                        </td>

                        <td style={tdStyle}>

                          {
                            booking.full_day
                              ? "Full Day"
                              : `${booking.start_hour}:00 - ${booking.end_hour}:00`
                          }

                        </td>

                        <td style={tdStyle}>

                          <button
                            style={
                              cancelBtn
                            }
                            onClick={() =>
                              cancelBooking(
                                booking.id
                              )
                            }
                          >
                            Cancel
                          </button>

                        </td>

                      </tr>
                    )
                  )
                }

              </tbody>

            </table>

          </div>
        )
      }

      {
        editUserData && (

          <div style={popupOverlay}>

            <div style={popupCard}>

              <h2>
                Edit User
              </h2>

              <div style={formGrid}>

                <input
                  value={editName}
                  onChange={(e) =>
                    setEditName(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  value={editMobile}
                  onChange={(e) =>
                    setEditMobile(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  value={editEmail}
                  onChange={(e) =>
                    setEditEmail(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

                <input
                  placeholder="New Password"
                  value={editPassword}
                  onChange={(e) =>
                    setEditPassword(
                      e.target.value
                    )
                  }
                  style={inputStyle}
                />

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

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px"
                }}
              >

                <button
                  style={createBtn}
                  onClick={updateUser}
                >
                  Update
                </button>

                <button
                  style={cancelBtn}
                  onClick={() =>
                    setEditUserData(
                      null
                    )
                  }
                >
                  Close
                </button>

              </div>

            </div>

          </div>
        )
      }

    </div>
  )
}

const pageStyle = {
  minHeight: "100vh",
  background: "#e2e8f0",
  padding: "24px"
}

const headerStyle = {
  background:
    "#020617",
  borderRadius: "20px",
  padding: "24px",
  marginBottom: "20px"
}

const headerTitle = {
  color: "white",
  fontSize: "40px",
  fontWeight: "bold"
}

const headerSubtitle = {
  color: "#cbd5e1"
}

const tabContainer = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px"
}

const tabBtn = {
  border: "none",
  padding: "12px 20px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}

const topBar = {
  display: "flex",
  justifyContent:
    "space-between",
  marginBottom: "20px"
}

const sectionTitle = {
  fontSize: "26px",
  fontWeight: "bold"
}

const createBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: "bold"
}

const sectionCard = {
  background: "white",
  padding: "24px",
  borderRadius: "20px",
  marginBottom: "20px"
}

const formGrid = {
  display: "grid",
  gap: "14px",
  marginBottom: "20px"
}

const inputStyle = {
  padding: "14px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "10px"
}

const tableStyle = {
  width: "100%",
  borderCollapse:
    "collapse" as const
}

const thStyle = {
  background: "#020617",
  color: "white",
  padding: "16px",
  textAlign: "left" as const
}

const tdStyle = {
  padding: "16px",
  borderBottom:
    "1px solid #e2e8f0"
}

const editBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
}

const cancelBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer"
}

const popupOverlay = {
  position: "fixed" as const,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background:
    "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent:
    "center"
}

const popupCard = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  width: "90%",
  maxWidth: "600px"
}