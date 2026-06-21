import { formatJournalDate } from "@wanderloom/ui";

export interface PostCardData {
  title: string | null;
  body: string | null;
  photoUrl: string | null;
  placeName: string | null;
  postDate: string | null;
}

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="overflow-hidden rounded-lg bg-background-elevated shadow-sm">
      {post.photoUrl && (
        <div className="aspect-[3/2] w-full bg-cover bg-center" style={{ backgroundImage: `url(${post.photoUrl})` }} />
      )}
      <div className="p-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          {post.placeName && (
            <span className="rounded-pill bg-accent-primary/10 px-2 py-0.5 text-accent-primary">
              {post.placeName}
            </span>
          )}
          {post.postDate && <span>{formatJournalDate(post.postDate)}</span>}
        </div>
        {post.title && <h4 className="mt-2 font-display text-lg">{post.title}</h4>}
        {post.body && <p className="mt-1 text-sm text-text-secondary">{post.body}</p>}
      </div>
    </article>
  );
}
