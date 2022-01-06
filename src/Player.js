import { useState, useEffect } from "react"

export default function Player({ accessToken, trackUri }) {
  const [play, setPlay] = useState(false)

  useEffect(() => setPlay(true), [trackUri])

  if (!accessToken) return null
  return <a href={item.external_urls.spotify}>
}