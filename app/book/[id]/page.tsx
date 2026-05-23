"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function BookPage() {
  const params = useParams()
  const cameraId = params.id as string

  const [name, setName] = useState("")
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  )

  const [selected, setSelected] = useState<number[]>([])
  const [booked, setBooked] = useState<number[]>([])
  const [myBookings, setMyBookings] = useState<any[]>([])

  const [loading, setLoading] = useState(false)
  const [fullDay, setFullDay] = useState(false)

  const hours = [
    7,8,9,10,11,12,13,14,15,16,17,18,19,20
  ]

  useEffect(() => {
    loadBookings()
  }, [date])

  async function loadBookings() {
    const res = await fetch(
      `/api/bookings?cameraId=${cameraId}&date=${date}`
    )

    const data = await res.json()

    let slots: number[] = []

    data.forEach((b: any) => {

      if (b.is_full_day) {
        slots = hours
        return
      }

      for (let i = b.start_hour; i < b.end_hour; i++) {
        slots.push(i)
      }
    })

    setBooked(slots)
    setMyBookings(data)
  }

  function toggleHour(hour: number) {

    if (booked.includes(hour)) return

    if (selected.includes(hour)) {
      setSelected(selected.filter((h) => h !== hour))
    } else {
      setSelected([...selected, hour])
    }
  }

  async function confirmBooking() {

    if (!name) {
      alert("Enter name")
      return
    }

    if (!fullDay && selected.length === 0) {
      alert("Select slot")
      return
    }

    setLoading(true)

    let body: any = {
      customer_name: name,
      camera_id: cameraId,
      booking_date: date,
    }

    if (fullDay) {
      body.is_full_day = true
      body.start_hour = 7
      body.end_hour = 21
    } else {
      body.start_hour = Math.min(...selected)
      body.end_hour = Math.max(...selected) + 1
    }

    const res = await fetch("/api/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    const result = await res.json()

    setLoading(false)

    if (result.success) {
      alert("Booking Confirmed")

      setSelected([])
      setFullDay(false)

      loadBookings()
    } else {
      alert(result.error || "Booking failed")
    }
  }

  async function cancelBooking(id: string) {

    const ok = confirm("Cancel booking?")

    if (!ok) return

    await fetch("/api/cancel-booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ id })
    })

    loadBookings()
  }

  function formatHour(hour: number) {

    const start =
      hour > 12
        ? `${hour - 12} PM`
        : `${hour} AM`

    const end =
      hour + 1 > 12
        ? `${hour + 1 - 12} PM`
        : `${hour + 1} AM`

    return `${start} - ${end}`
  }

  return (
    <div
      style={{
        padding: 25,
        fontFamily: "Arial",
        background: "#f3f4f6",
        minHeight: "100vh"
      }}
    >

      <div
        style={{
          background: "white",
          padding: 25,
          borderRadius: 12
        }}
      >

        <h2>📷 Camera Booking</h2>

        <input
          placeholder="Enter Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <div style={{ marginTop: 20 }}>
          <label>Select Date:</label>

          <br /><br />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={{ marginTop: 25 }}>

          <button
            onClick={() => {
              setFullDay(!fullDay)
              setSelected([])
            }}
            style={{
              ...dayBtn,
              background: fullDay
                ? "#dc2626"
                : "#2563eb"
            }}
          >
            {fullDay
              ? "Full Day Selected"
              : "Book Full Day"}
          </button>

        </div>

        {!fullDay && (
          <>
            <h3 style={{ marginTop: 30 }}>
              Select Time Slots
            </h3>

            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap"
              }}
            >
              {hours.map((hour) => {

                const isBooked =
                  booked.includes(hour)

                const isSelected =
                  selected.includes(hour)

                return (
                  <button
                    key={hour}
                    disabled={isBooked}
                    onClick={() => toggleHour(hour)}
                    style={{
                      padding: "14px 18px",
                      borderRadius: 10,
                      border: "none",
                      cursor: isBooked
                        ? "not-allowed"
                        : "pointer",
                      fontWeight: "bold",
                      background: isBooked
                        ? "#9ca3af"
                        : isSelected
                        ? "#ea580c"
                        : "#16a34a",
                      color: "white"
                    }}
                  >
                    {formatHour(hour)}
                  </button>
                )
              })}
            </div>
          </>
        )}

        <button
          onClick={confirmBooking}
          disabled={loading}
          style={confirmBtn}
        >
          {loading
            ? "Booking..."
            : "Confirm Booking"}
        </button>

        <div style={{ marginTop: 25 }}>

          <div style={legend}>
            <div
              style={{
                ...legendColor,
                background: "#16a34a"
              }}
            />
            Available
          </div>

          <div style={legend}>
            <div
              style={{
                ...legendColor,
                background: "#ea580c"
              }}
            />
            Selected
          </div>

          <div style={legend}>
            <div
              style={{
                ...legendColor,
                background: "#9ca3af"
              }}
            />
            Booked
          </div>

        </div>
      </div>

      <div
        style={{
          marginTop: 30,
          background: "white",
          padding: 25,
          borderRadius: 12
        }}
      >
        <h2>My Bookings</h2>

        {myBookings.length === 0 && (
          <p>No bookings found</p>
        )}

        {myBookings.map((b: any) => (

          <div
            key={b.id}
            style={{
              border: "1px solid #ddd",
              padding: 15,
              marginBottom: 12,
              borderRadius: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >

            <div>
              <b>{b.customer_name}</b>

              <div>
                {b.is_full_day
                  ? "Full Day Booking"
                  : `${formatHour(b.start_hour)} to ${formatHour(b.end_hour - 1)}`
                }
              </div>

              <div>{b.booking_date}</div>
            </div>

            <button
              onClick={() => cancelBooking(b.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

          </div>
        ))}
      </div>
    </div>
  )
}

const inputStyle = {
  padding: 12,
  width: 320,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginTop: 10
}

const confirmBtn = {
  marginTop: 25,
  padding: "14px 22px",
  background: "black",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer"
}

const dayBtn = {
  padding: "12px 18px",
  color: "white",
  border: "none",
  borderRadius: 10,
  fontWeight: "bold",
  cursor: "pointer"
}

const legend = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 10
}

const legendColor = {
  width: 20,
  height: 20,
  borderRadius: 4
}