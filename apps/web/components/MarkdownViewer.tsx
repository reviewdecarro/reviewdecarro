"use client";

import gfm from "@bytemd/plugin-gfm";
import { Viewer as ByteMdViewer } from "@bytemd/react";
import { useMemo } from "react";

type MarkdownViewerProps = {
	value: string;
};

export function MarkdownViewer({ value }: MarkdownViewerProps) {
	const plugins = useMemo(() => [gfm()], []);

	return (
		<div className="overflow-hidden rounded-lg">
			<ByteMdViewer value={value} plugins={plugins} />
		</div>
	);
}
