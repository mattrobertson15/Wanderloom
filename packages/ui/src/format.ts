/** Journal-style date formatting shared across web and mobile (see DESIGN_DIRECTION.md). */
export function formatJournalDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function formatDateRange(startIso: string | null, endIso: string | null): string {
  if (!startIso && !endIso) return "";
  if (startIso && endIso) return `${formatJournalDate(startIso)} – ${formatJournalDate(endIso)}`;
  return formatJournalDate(startIso ?? endIso!);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}
