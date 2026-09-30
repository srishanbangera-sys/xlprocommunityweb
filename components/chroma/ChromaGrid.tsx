"use client"

import { useRef, useEffect } from "react"
import { gsap } from "gsap"
import "./ChromaGrid.css"

export const ChromaGrid = ({
  items,
  className = "",
  radius = 300,
  columns = 4,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = "power3.out",
  onCardClick,
}) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const fadeRef = useRef<HTMLDivElement>(null)
  const setX = useRef<any>(null)
  const setY = useRef<any>(null)
  const pos = useRef({ x: 0, y: 0 })

  const data = Array.isArray(items) ? items : []

  // Detect mobile
  const isMobile =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || window.innerWidth < 1024)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    setX.current = gsap.quickSetter(el, "--x", "px")
    setY.current = gsap.quickSetter(el, "--y", "px")

    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)

    if (isMobile) {
      // Mobile: fully colored, no overlay
      gsap.set(fadeRef.current, { opacity: 0 })
      el.style.setProperty("--r", `${radius}px`)
    } else {
      // Desktop: grayscale overlay + spotlight
      gsap.set(fadeRef.current, { opacity: 1 })
      el.style.setProperty("--r", `${radius * 1.5}px`) // larger spotlight radius
    }
  }, [isMobile, radius])

  const moveTo = (x: number, y: number) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e: PointerEvent) => {
    if (isMobile) return
    const r = rootRef.current!.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    if (isMobile) return
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true })
  }

  const handleCardClick = (item: any) => {
    if (onCardClick && item.id) {
      onCardClick(item.id)
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    }
  }

  const handleCardMove = (e: MouseEvent) => {
    if (isMobile) return
    const card = e.currentTarget as HTMLElement
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty("--mouse-x", `${x}px`)
    card.style.setProperty("--mouse-y", `${y}px`)
  }

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{
        "--cols": columns,
        "--rows": rows,
      }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={i}
          className="chroma-card"
          onMouseMove={handleCardMove}
          onClick={() => handleCardClick(c)}
          style={{
            "--card-border": c.borderColor || "transparent",
            "--card-gradient": c.gradient,
            cursor: "pointer",
          }}
        >
          <div className="chroma-img-wrapper">
            <img src={c.image || "/placeholder.svg"} alt={c.title} loading="lazy" />
          </div>
          <footer className="chroma-info">
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            <p className="role">{c.subtitle}</p>
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      {/* Desktop: grayscale overlay + spotlight */}
      {!isMobile && <div className="chroma-overlay" />}
      <div ref={fadeRef} className="chroma-fade" />
    </div>
  )
}

export default ChromaGrid
