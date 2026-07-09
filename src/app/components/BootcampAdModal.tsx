"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const BOOTCAMP_URL = "https://www.imodigitalcity.com/summer-tech-bootcamp-2026";
const PROMO_IMAGE = "/images/summer-bootcamp-2026.jpeg";

const OPEN_DELAY_MS = 1400;

const highlights = ["Drones & Robotics", "Coding & AI", "Certificate Included"];

export default function BootcampAdModal() {
    const [open, setOpen] = useState(false);

    // Fires once per full page load; delayed so it does not fight the hero on first paint.
    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    const close = () => setOpen(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", onKey);
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = "";
        };
    }, [open]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={close}
                    className="fixed inset-0 z-[120] flex items-center justify-center bg-neutral-950/70 p-4 backdrop-blur-sm"
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="bootcamp-ad-title"
                        initial={{ opacity: 0, y: 28, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 16, scale: 0.97 }}
                        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-emerald-950/40"
                    >
                        <button
                            onClick={close}
                            aria-label="Close advertisement"
                            className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-neutral-950/40 text-white backdrop-blur transition hover:bg-neutral-950/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="grid md:grid-cols-2">
                            {/* ---------------- Image ---------------- */}
                            <div className="relative h-44 overflow-hidden md:h-auto">
                                <Image
                                    src={PROMO_IMAGE}
                                    alt="Children at a previous Summer Tech Bootcamp"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 384px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-emerald-900/15 to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />

                                <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold tracking-wider text-primary-green uppercase shadow-lg backdrop-blur">
                                    <Sparkles className="h-3 w-3" />
                                    Registration Now Open
                                </span>
                            </div>

                            {/* ---------------- Content ---------------- */}
                            <div className="relative flex flex-col justify-center gap-5 bg-gradient-to-br from-white via-white to-emerald-50/70 p-7 sm:p-9">
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-emerald-300/25 blur-3xl"
                                />

                                <div className="relative flex flex-col gap-2.5">
                                    <span className="text-primary-green text-xs font-bold tracking-[0.16em] uppercase">
                                        Cohort 3 · August 2026
                                    </span>
                                    <h2
                                        id="bootcamp-ad-title"
                                        className="text-2xl leading-[1.15] font-bold tracking-tight text-neutral-900 text-balance sm:text-[1.9rem]"
                                    >
                                        Summer Tech{" "}
                                        <span className="text-primary-green">Bootcamp 2026</span>
                                    </h2>
                                    <p className="text-[15px] leading-relaxed text-neutral-600 text-pretty">
                                        Four weeks of hands-on technology for children, delivered by Imo Digital City
                                        Limited. Give your child a head start this holiday — places are limited.
                                    </p>
                                </div>

                                <ul className="relative flex flex-wrap gap-2">
                                    {highlights.map((item) => (
                                        <li
                                            key={item}
                                            className="text-primary-green rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[12px] font-semibold"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="relative flex flex-col gap-2.5">
                                    <a
                                        href={BOOTCAMP_URL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={close}
                                        className="group bg-primary-green inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold text-white shadow-lg shadow-emerald-700/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-700/40 active:translate-y-0"
                                    >
                                        Explore the Bootcamp
                                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={close}
                                        className="text-sm text-neutral-500 transition-colors hover:text-neutral-900"
                                    >
                                        Maybe later
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
