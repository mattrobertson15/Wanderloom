export function Avatar({ url, label }: { url: string | null; label: string }) {
  if (url) {
    // eslint-disable-next-line @next/next/no-img-element -- avatar_url is arbitrary storage/user content, not a known image domain.
    return <img src={url} alt={label} className="h-10 w-10 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-secondary/20 text-sm font-medium text-text-secondary">
      {label.slice(0, 1).toUpperCase()}
    </div>
  );
}
