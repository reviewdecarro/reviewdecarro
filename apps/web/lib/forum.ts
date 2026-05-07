import { API_BASE_URL } from "@/lib/api";
import type {
  ForumPost,
  ForumTopicDetail,
  ForumTopicSummary,
} from "@/types";

type ApiForumUser = {
  id: string;
  username: string;
};

type ApiForumPost = {
  id: string;
  topicId: string;
  authorId: string;
  parentPostId: string | null;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  author?: ApiForumUser;
  replies?: ApiForumPost[];
};

type ApiForumTopic = {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  content: string;
  postsCount: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
  author?: ApiForumUser;
  posts?: ApiForumPost[];
};

type ForumTopicsResponse = {
  topics?: ApiForumTopic[];
};

type ForumTopicResponse = {
  topic?: ApiForumTopic;
};

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength).trimEnd()}...`;
}

function formatRelativeDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffDays <= 0) {
    if (diffHours <= 0) {
      return "há instantes";
    }

    return `há ${diffHours}h`;
  }

  if (diffDays === 1) {
    return "há 1 dia";
  }

  if (diffDays < 30) {
    return `há ${diffDays} dias`;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toForumPost(post: ApiForumPost): ForumPost {
  return {
    id: post.id,
    topicId: post.topicId,
    authorId: post.authorId,
    parentPostId: post.parentPostId,
    content: post.content,
    upvotes: post.upvotes,
    downvotes: post.downvotes,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: post.author?.username ?? "Anônimo",
    date: formatRelativeDate(post.createdAt),
    replies: (post.replies ?? []).map(toForumPost),
  };
}

function toForumTopicSummary(topic: ApiForumTopic): ForumTopicSummary {
  return {
    id: topic.id,
    slug: topic.slug,
    title: topic.title,
    author: topic.author?.username ?? "Anônimo",
    date: formatRelativeDate(topic.createdAt),
    createdAt: topic.createdAt,
    votes: topic.upvotes - topic.downvotes,
    comments: topic.postsCount,
    body: truncate(topic.content, 220),
  };
}

function toForumTopicDetail(topic: ApiForumTopic): ForumTopicDetail {
  return {
    ...toForumTopicSummary(topic),
    content: topic.content,
    createdAt: topic.createdAt,
    updatedAt: topic.updatedAt,
    posts: (topic.posts ?? []).map(toForumPost),
  };
}

export async function fetchForumTopics(): Promise<ForumTopicSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/topics`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as ForumTopicsResponse;

    return (data.topics ?? []).map(toForumTopicSummary);
  } catch {
    return [];
  }
}

export async function fetchForumTopicBySlug(
  slug: string,
): Promise<ForumTopicDetail | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/forum/topics/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ForumTopicResponse;

    return data.topic ? toForumTopicDetail(data.topic) : null;
  } catch {
    return null;
  }
}
