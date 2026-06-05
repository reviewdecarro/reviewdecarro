"use client";

import gfm from "@bytemd/plugin-gfm";
import gfmLocale from "@bytemd/plugin-gfm/locales/pt_BR.json";
import { Editor as ByteMdEditor } from "@bytemd/react";
import bytemdLocale from "bytemd/locales/pt_BR.json";
import { useEffect, useMemo, useRef, useState } from "react";

type MarkdownEditorProps = {
	value: string;
	onChange(value: string): void;
	placeholder?: string;
	maxLength?: number;
	height?: number;
};

export function MarkdownEditor({
	value,
	onChange,
	maxLength = 20000,
	height = 320,
}: MarkdownEditorProps) {
	const plugins = useMemo(() => [gfm({ locale: gfmLocale })], []);
	const editorRef = useRef<HTMLDivElement | null>(null);
	const [isActive, setIsActive] = useState(false);

	useEffect(() => {
		const editorElement = editorRef.current;

		if (!editorElement) return;

		const toolbarRight = editorElement.getElementsByClassName(
			"bytemd-toolbar-right",
		)[0] as HTMLElement | undefined;

		const button = toolbarRight?.querySelector<HTMLElement>(
			'[bytemd-tippy-path="2"]',
		);

		button?.click();
	}, []);

	return (
		<div
			ref={editorRef}
			className="overflow-hidden border rounded-lg"
			style={{
				background: isActive ? "white" : "var(--bg)",
				borderColor: "var(--border)",
			}}
			onMouseDownCapture={() => setIsActive(true)}
			onFocusCapture={() => setIsActive(true)}
			onBlurCapture={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
					setIsActive(false);
				}
			}}
		>
			<style jsx global>{`
				.bytemd {
					height: ${height}px;
					border: 0;
				}

				.bytemd .CodeMirror,
				.bytemd .cm-editor,
				.bytemd .bytemd-preview,
				.bytemd .bytemd-editor,
				.bytemd .bytemd-body {
					background: ${isActive ? "white" : "var(--bg)"};
				}

				.bytemd .bytemd-toolbar {
					background: var(--surface);
					border-color: var(--border);
				}

				.bytemd .bytemd-status {
					display: none;
				}

				.bytemd .bytemd-body {
					height: calc(100% - 58px);
				}
			`}</style>
			<ByteMdEditor
				value={value}
				plugins={plugins}
				mode="split"
				locale={bytemdLocale}
				maxLength={maxLength}
				onChange={onChange}
			/>
		</div>
	);
}
