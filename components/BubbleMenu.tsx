"use client"

import { useRef, useState, useEffect, useCallback, type ReactNode } from "react"
import gsap from "gsap"
import "./BubbleMenu.css"

interface HoverStyles {
    bgColor: string
    textColor: string
}

interface BubbleMenuItem {
    label: string
    href: string
    ariaLabel?: string
    rotation?: number
    hoverStyles?: HoverStyles
}

interface BubbleMenuProps {
    logo?: ReactNode
    items: BubbleMenuItem[]
    menuAriaLabel?: string
    menuBg?: string
    menuContentColor?: string
    useFixedPosition?: boolean
    animationEase?: string
    animationDuration?: number
    staggerDelay?: number
}

export default function BubbleMenu({
    logo,
    items,
    menuAriaLabel = "Toggle navigation",
    menuBg = "#ffffff",
    menuContentColor = "#111111",
    useFixedPosition = false,
    animationEase = "back.out(1.5)",
    animationDuration = 0.5,
    staggerDelay = 0.12,
}: BubbleMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuItemsRef = useRef<HTMLDivElement>(null)
    const pillRefs = useRef<(HTMLAnchorElement | null)[]>([])
    const labelRefs = useRef<(HTMLSpanElement | null)[]>([])
    const backdropRef = useRef<HTMLDivElement>(null)
    const timelineRef = useRef<gsap.core.Timeline | null>(null)

    const positionClass = useFixedPosition ? "fixed" : "absolute"

    // Split items into rows: first row 3, second row rest
    const firstRow = items.slice(0, 3)
    const secondRow = items.slice(3)

    const toggleMenu = useCallback(() => {
        setIsOpen((prev) => !prev)
    }, [])

    useEffect(() => {
        if (!menuItemsRef.current) return

        // Kill any running timeline
        if (timelineRef.current) {
            timelineRef.current.kill()
        }

        const tl = gsap.timeline()
        timelineRef.current = tl

        const pillEls = pillRefs.current.filter(Boolean) as HTMLAnchorElement[]
        const labelEls = labelRefs.current.filter(Boolean) as HTMLSpanElement[]
        const backdrop = backdropRef.current

        if (isOpen) {
            // Open animation
            if (backdrop) {
                tl.fromTo(
                    backdrop,
                    { opacity: 0, pointerEvents: "none" },
                    { opacity: 1, pointerEvents: "auto", duration: 0.3 }
                )
            }

            tl.fromTo(
                pillEls,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: animationDuration,
                    ease: animationEase,
                    stagger: staggerDelay,
                },
                backdrop ? "-=0.2" : 0
            )

            tl.fromTo(
                labelEls,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out",
                    stagger: staggerDelay,
                },
                `-=${animationDuration * 0.5}`
            )

            menuItemsRef.current.style.pointerEvents = "auto"
        } else {
            // Close animation
            tl.to(labelEls, {
                y: -20,
                opacity: 0,
                duration: 0.2,
                ease: "power2.in",
                stagger: { each: 0.05, from: "end" },
            })

            tl.to(
                pillEls,
                {
                    scale: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    stagger: { each: 0.05, from: "end" },
                },
                "-=0.1"
            )

            if (backdrop) {
                tl.to(backdrop, { opacity: 0, pointerEvents: "none", duration: 0.3 }, "-=0.2")
            }

            tl.eventCallback("onComplete", () => {
                if (menuItemsRef.current) {
                    menuItemsRef.current.style.pointerEvents = "none"
                }
            })
        }

        return () => {
            tl.kill()
        }
    }, [isOpen, animationDuration, animationEase, staggerDelay])

    const setPillRef = (index: number) => (el: HTMLAnchorElement | null) => {
        pillRefs.current[index] = el
    }

    const setLabelRef = (index: number) => (el: HTMLSpanElement | null) => {
        labelRefs.current[index] = el
    }

    const renderPill = (item: BubbleMenuItem, index: number) => {
        const rotation = item.rotation || 0
        const hoverBg = item.hoverStyles?.bgColor || "#f3f4f6"
        const hoverColor = item.hoverStyles?.textColor || "#111"

        return (
            <div className="pill-col" key={item.label}>
                <a
                    ref={setPillRef(index)}
                    href={item.href}
                    className="pill-link"
                    aria-label={item.ariaLabel || item.label}
                    style={{
                        "--item-rot": `${rotation}deg`,
                        "--pill-bg": menuBg,
                        "--pill-color": menuContentColor,
                        "--hover-bg": hoverBg,
                        "--hover-color": hoverColor,
                        transform: `scale(0)`,
                        opacity: 0,
                    } as React.CSSProperties}
                    onClick={() => setIsOpen(false)}
                >
                    <span ref={setLabelRef(index)} className="pill-label">
                        {item.label}
                    </span>
                </a>
            </div>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div
                ref={backdropRef}
                className={`${positionClass}`}
                style={{
                    inset: 0,
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(10px)",
                    zIndex: 97,
                    opacity: 0,
                    pointerEvents: "none",
                }}
                onClick={() => setIsOpen(false)}
            />

            {/* Top bar: logo + hamburger */}
            <div className={`bubble-menu ${positionClass}`}>
                <div className="bubble logo-bubble" style={{ background: menuBg }}>
                    <div className="logo-content" style={{ color: menuContentColor }}>
                        {logo}
                    </div>
                </div>

                <button
                    className={`bubble toggle-bubble menu-btn ${isOpen ? "open" : ""}`}
                    onClick={toggleMenu}
                    aria-label={menuAriaLabel}
                    style={{ background: menuBg }}
                >
                    <span className="menu-line" style={{ background: menuContentColor }} />
                    <span className="menu-line" style={{ background: menuContentColor }} />
                </button>
            </div>

            {/* Menu items overlay */}
            <div
                ref={menuItemsRef}
                className={`bubble-menu-items ${positionClass}`}
                style={{ pointerEvents: "none" }}
            >
                <ul className="pill-list">
                    {firstRow.map((item, i) => renderPill(item, i))}
                    {secondRow.length > 0 && <li className="pill-spacer" />}
                    {secondRow.map((item, i) => renderPill(item, firstRow.length + i))}
                </ul>
            </div>
        </>
    )
}
