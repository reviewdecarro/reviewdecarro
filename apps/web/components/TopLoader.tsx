"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

const ACTIVE_PROGRESS = 88;
const START_PROGRESS = 18;
const COMPLETE_TIMEOUT = 200;

export function TopLoader() {
	const pathname = usePathname();
	const [visible, setVisible] = useState(false);
	const [progress, setProgress] = useState(0);
	const previousPathnameRef = useRef(pathname);
	const hideTimerRef = useRef<number | null>(null);
	const rampTimerRef = useRef<number | null>(null);

	const clearTimers = useCallback(() => {
		if (hideTimerRef.current) {
			window.clearTimeout(hideTimerRef.current);
			hideTimerRef.current = null;
		}

		if (rampTimerRef.current) {
			window.clearTimeout(rampTimerRef.current);
			rampTimerRef.current = null;
		}
	}, []);

	const startLoader = useCallback(() => {
		clearTimers();
		setVisible(true);
		setProgress(START_PROGRESS);

		rampTimerRef.current = window.setTimeout(() => {
			setProgress((current) => Math.max(current, ACTIVE_PROGRESS));
		}, 120);
	}, [clearTimers]);

	useEffect(() => {
		function handleClick(event: MouseEvent) {
			if (
				event.defaultPrevented ||
				event.button !== 0 ||
				event.metaKey ||
				event.ctrlKey ||
				event.shiftKey ||
				event.altKey
			) {
				return;
			}

			const target = event.target;

			if (!(target instanceof Element)) {
				return;
			}

			const anchor = target.closest("a[href]");

			if (!anchor) {
				return;
			}

			const href = anchor.getAttribute("href");

			if (!href || href.startsWith("#")) {
				return;
			}

			if (
				href.startsWith("http://") ||
				href.startsWith("https://") ||
				href.startsWith("mailto:") ||
				href.startsWith("tel:")
			) {
				return;
			}

			const nextUrl = new URL(href, window.location.origin);
			if (nextUrl.pathname === window.location.pathname) {
				return;
			}

			startLoader();
		}

		document.addEventListener("click", handleClick, true);
		return () => {
			document.removeEventListener("click", handleClick, true);
		};
	}, [startLoader]);

	useEffect(() => {
		if (pathname === previousPathnameRef.current) {
			return;
		}

		previousPathnameRef.current = pathname;
		setVisible(true);
		setProgress(100);
		clearTimers();

		hideTimerRef.current = window.setTimeout(() => {
			setVisible(false);
			setProgress(0);
		}, COMPLETE_TIMEOUT);

		return () => {
			clearTimers();
		};
	}, [pathname, clearTimers]);

	useEffect(() => {
		return () => {
			clearTimers();
		};
	}, [clearTimers]);

	return (
		<div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] overflow-hidden">
			<div
				className="h-full origin-left transition-all duration-300 ease-out"
				style={{
					width: visible ? `${progress}%` : "0%",
					background: "var(--accent)",
					opacity: visible ? 1 : 0,
					boxShadow:
						"0 0 10px color-mix(in oklab, var(--accent) 70%, transparent)",
				}}
			/>
		</div>
	);
}
