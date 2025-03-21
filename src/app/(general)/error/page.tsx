'use client'

import router from "next/router"

export default function Error({ error }: { error: string}) {
  return (
    <div className="text-center">
      <h2 className="text-error font-bold">Something went wrong!</h2>
      <p className="text-base-content">{error}</p>
      <button
        className="btn btn-secondary mt-4"
        onClick={() => router.push('/')}
      >
        Back to Home
      </button>
    </div>
  )
}