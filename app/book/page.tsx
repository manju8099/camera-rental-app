'use client'

import Link from 'next/link'

export default function BookListPage() {
  const cameras = [
    {
      id: '3f4f0ab2-4124-4ea7-879e-5cc65124e27b',
      name: 'Canon 200D',
      price: 120,
    },
    {
      id: '7e89e0b3-a281-4e41-8860-51a56d56f263',
      name: 'Nikon D5600',
      price: 100,
    },
  ]

  return (
    <div
      style={{
        padding: 30,
        fontFamily: 'Arial',
      }}
    >
      <h1>📷 Camera Rentals</h1>

      <br />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {cameras.map((cam) => (
          <div
            key={cam.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 12,
              padding: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            <h2>{cam.name}</h2>

            <p>
              <strong>₹{cam.price}</strong> / hour
            </p>

            <br />

            <Link href={`/book/${cam.id}`}>
              <button
                style={{
                  padding: '12px 20px',
                  backgroundColor: 'green',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Book Now
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}