'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Thread } from '@/types';
import { VoteButton } from './VoteButton';

type ForumThreadRowProps = {
  thread: Thread;
};

const catColors: Record<string, string> = {
  'Buying Advice': 'oklch(0.60 0.16 250)',
  'Discussion':    'oklch(0.55 0.16 170)',
  'Story':         'oklch(0.57 0.17 148)',
};

export function ForumThreadRow({ thread }: ForumThreadRowProps) {
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(thread.votes);

  function handleVote(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setVotes(v => voted ? v - 1 : v + 1);
    setVoted(v => !v);
  }

  const catColor = catColors[thread.category] ?? 'var(--text-muted)';

  return (
    <Link
      href={`/forum/${thread.id}`}
      className="flex items-center gap-3.5 py-3.5 border-b rounded-lg px-2.5 transition-colors duration-100"
      style={{ borderColor: 'var(--border)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <div className="flex-shrink-0" onClick={handleVote}>
        <VoteButton count={votes} voted={voted} onVote={handleVote} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium leading-snug mb-1" style={{ color: 'var(--text)', textWrap: 'pretty' } as React.CSSProperties}>
          {thread.title}
        </div>
        <div className="text-[12px] flex flex-wrap items-center gap-2" style={{ color: 'var(--text-light)' }}>
          <span className="font-medium" style={{ color: catColor }}>{thread.category}</span>
          <span>·</span>
          <span className="font-medium" style={{ color: 'var(--accent)' }}>{thread.author}</span>
          <span>·</span>
          <span>{thread.date}</span>
          <span>·</span>
          <span>{thread.views} views</span>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center gap-1.5 text-[13px]" style={{ color: 'var(--text-muted)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 2H12V9H7.5L5 12V9H2V2Z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
        </svg>
        {thread.comments}
      </div>
    </Link>
  );
}
