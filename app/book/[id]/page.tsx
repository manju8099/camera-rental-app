"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

export default function BookingPage() {

  const params = useParams()

  const cameraId = params.id

  const [cameraName, setCameraName] = useState("")

  const [customerName, setCustomerName] = useState("")

  const [date, setDate] = useState("")

  const [selectedSlots, setSelectedSlots] =
    useState<number[]>([])

  const [bookedSlots, setBookedSlots] =
    useState<number[]>([])

  const [upcomingBookings, setUpcomingBookings] =
    useState<any[]>([])

  const [fullDay, setFullDay] =
    useState(false)

  const slots = [
    7, 8, 9, 10, 11,
    12, 13, 14, 15,
    16, 17, 18, 19, 20
  ]

  useEffect(() => {

    const today = new Date()

    setDate(
      today.toISOString().split("T")[0]
    )

  }, [])

  useEffect(() => {

    getCamera()

  }, [])

  useEffect(() => {

    if (date) {

      getBookings()
    }

  }, [date, customerName])

  // GET CAMERA

  const getCamera = async () => {

    const res = await fetch("/api/book")

    const data = await res.json()

    const cam = data.find(
      (c: any) => c.id === cameraId
    )

    if (cam) {

      setCameraName(cam.name)
    }
  }

  // GET BOOKINGS

  const getBookings = async () => {

    const res = await fetch(
      `/api/bookings?cameraId=${cameraId}&date=${date}`
    )

    const data = await res.json()

    let booked: number[] = []

    data.forEach((b: any) => {

      if (b.full_day) {

        booked = slots

      } else {

        for (
          let i = b.start_hour;
          i < b.end_hour;
          i++
        ) {
          booked.push(i)
        }
      }
    })

    setBookedSlots(booked)

    setUpcomingBookings(data)
  }

  // SLOT SELECT

  const toggleSlot = (hour: number) => {

    if (bookedSlots.includes(hour))
      return

    if (selectedSlots.includes(hour)) {

      setSelectedSlots(
        selectedSlots.filter(
          (s) => s !== hour
        )
      )

    } else {

      setSelectedSlots([
        ...selectedSlots,
        hour
      ])
    }
  }

  // BOOKING

  const handleBooking = async () => {

    if (!customerName) {

      alert("Enter Name")

      return
    }

    if (
      !fullDay &&
      selectedSlots.length === 0
    ) {

      alert("Select Slot")

      return
    }

    const startHour = fullDay
      ? 0
      : Math.min(...selectedSlots)

    const endHour = fullDay
      ? 24
      : Math.max(...selectedSlots) + 1

    const res = await fetch(
      "/api/book",
      {

        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body: JSON.stringify({

          camera_id: cameraId,

          customer_name:
            customerName,

          booking_date: date,

          start_hour: startHour,

          end_hour: endHour,

          full_day: fullDay
        })
      }
    )

    const data = await res.json()

    if (data.success) {

      alert("Booking Success")

      setSelectedSlots([])

      setFullDay(false)

      getBookings()

    } else {

      alert(data.error)
    }
  }

  // SLOT FORMAT

  const formatSlot = (
    hour: number
  ) => {

    const start =
      hour > 12
        ? `${hour - 12} PM`
        : `${hour} AM`

    const endHour = hour + 1

    const end =
      endHour > 12
        ? `${endHour - 12} PM`
        : `${endHour} AM`

    return `${start} - ${end}`
  }

  return (

    <div style={pageStyle}>

      {/* BOOKING CARD */}

      <div style={cardStyle}>

        <h1 style={titleStyle}>
          📸 Camera Booking
        </h1>

        <h2 style={cameraTitle}>
          {cameraName}
        </h2>

        <input
          placeholder="Enter Your Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          style={inputStyle}
        />

        <div
          style={{
            marginTop: "20px"
          }}
        >

          <label style={labelStyle}>
            Select Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(
                e.target.value
              )
            }
            style={inputStyle}
          />

        </div>

        {/* FULL DAY */}

        <button
          onClick={() =>
            setFullDay(!fullDay)
          }
          style={{
            ...buttonStyle,

            background:
              fullDay
                ? "#2563eb"
                : "#16a34a"
          }}
        >
          {
            fullDay
              ? "Full Day Selected"
              : "Book Full Day"
          }
        </button>

        {/* TIME SLOTS */}

        {

          !fullDay && (

            <>
              <h3 style={sectionTitle}>
                Select Time Slots
              </h3>

              <div
                style={slotContainer}
              >

                {
                  slots.map((hour) => {

                    const booked =
                      bookedSlots.includes(
                        hour
                      )

                    const selected =
                      selectedSlots.includes(
                        hour
                      )

                    return (

                      <button
                        key={hour}
                        onClick={() =>
                          toggleSlot(
                            hour
                          )
                        }
                        disabled={booked}
                        style={{
                          ...slotStyle,

                          background:
                            booked
                              ? "#9ca3af"
                              : selected
                              ? "#ea580c"
                              : "#16a34a"
                        }}
                      >
                        {
                          formatSlot(
                            hour
                          )
                        }
                      </button>
                    )
                  })
                }

              </div>
            </>
          )
        }

        {/* BOOK BUTTON */}

        <button
          onClick={handleBooking}
          style={{
            ...buttonStyle,
            marginTop: "30px"
          }}
        >
          Confirm Booking
        </button>

      </div>

      {/* UPCOMING BOOKINGS */}

      <div style={cardStyle}>

        <h2 style={sectionTitle}>
          Upcoming Bookings
        </h2>

        {

          upcomingBookings.length === 0 ? (

            <p style={emptyText}>
              No Bookings
            </p>

          ) : (

            upcomingBookings.map(
              (b: any) => (

                <div
                  key={b.id}
                  style={bookingCard}
                >

                  <div>

                    <div
                      style={
                        bookingText
                      }
                    >
                      {cameraName}
                    </div>

                    <div
                      style={
                        bookingSubText
                      }
                    >
                      {
                        b.customer_name
                      }
                    </div>

                    <div
                      style={
                        bookingSubText
                      }
                    >
                      {
                        b.booking_date
                      }
                    </div>

                    <div
                      style={
                        bookingSubText
                      }
                    >
                      {
                        b.full_day
                          ? "Full Day"
                          : `${b.start_hour}:00 - ${b.end_hour}:00`
                      }
                    </div>

                  </div>

                </div>
              )
            )
          )
        }

      </div>

    </div>
  )
}

// STYLES

const pageStyle: React.CSSProperties = {

  minHeight: "100vh",

  background: "#e2e8f0",

  padding: "20px",

  color: "#111827"
}

const cardStyle: React.CSSProperties = {

  background: "white",

  borderRadius: "18px",

  padding: "25px",

  marginBottom: "25px",

  boxShadow:
    "0 4px 15px rgba(0,0,0,0.08)"
}

const titleStyle: React.CSSProperties = {

  fontSize: "32px",

  fontWeight: "bold",

  marginBottom: "10px",

  color: "#0f172a"
}

const cameraTitle: React.CSSProperties = {

  fontSize: "22px",

  fontWeight: "bold",

  marginBottom: "20px",

  color: "#2563eb"
}

const sectionTitle: React.CSSProperties = {

  fontSize: "22px",

  fontWeight: "bold",

  marginBottom: "18px",

  marginTop: "20px",

  color: "#111827"
}

const labelStyle: React.CSSProperties = {

  display: "block",

  marginBottom: "8px",

  fontWeight: "600",

  color: "#374151"
}

const inputStyle: React.CSSProperties = {

  width: "100%",

  padding: "14px",

  borderRadius: "10px",

  border: "1px solid #cbd5e1",

  background: "#f8fafc",

  color: "#111827",

  fontSize: "15px",

  boxSizing: "border-box"
}

const slotContainer: React.CSSProperties = {

  display: "flex",

  flexWrap: "wrap",

  gap: "12px"
}

const slotStyle: React.CSSProperties = {

  border: "none",

  color: "white",

  padding: "14px 16px",

  borderRadius: "10px",

  fontWeight: "bold",

  cursor: "pointer",

  minWidth: "120px"
}

const buttonStyle: React.CSSProperties = {

  border: "none",

  background: "#2563eb",

  color: "white",

  padding: "14px 24px",

  borderRadius: "10px",

  fontWeight: "bold",

  cursor: "pointer",

  marginTop: "20px"
}

const bookingCard: React.CSSProperties = {

  background: "#f8fafc",

  padding: "18px",

  borderRadius: "12px",

  marginBottom: "12px"
}

const bookingText: React.CSSProperties = {

  fontWeight: "bold",

  fontSize: "18px",

  color: "#111827"
}

const bookingSubText: React.CSSProperties = {

  color: "#6b7280",

  marginTop: "4px"
}

const emptyText: React.CSSProperties = {

  color: "#6b7280"
}