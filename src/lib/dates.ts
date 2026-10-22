// Date helpers. ISO dates ("2026-10-22") are treated as local calendar days.

export function fromIsoDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// The next `days` days starting tomorrow, without Sundays.
export function upcomingTourDays(days = 7, from = new Date()) {
  const result: string[] = [];
  for (let i = 1; i <= days; i++) {
    const day = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + i,
    );
    if (day.getDay() !== 0) result.push(toIsoDate(day));
  }
  return result;
}

const shortDay = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const longDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// "2026-10-22" → "Thu 22"
export function formatChipDate(iso: string) {
  const date = fromIsoDate(iso);
  return `${shortDay.format(date)} ${date.getDate()}`;
}

// "2026-10-22" → "Thursday, October 22"
export function formatLongDate(iso: string) {
  return longDate.format(fromIsoDate(iso));
}

// Whole days between an ISO date and today (0 = today).
export function daysSince(iso: string, now = new Date()) {
  const start = fromIsoDate(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(
    Math.round((today.getTime() - start.getTime()) / 86_400_000),
    0,
  );
}

// "10:00 AM" → { hours: 10, minutes: 0 }
export function parseTime(time: string) {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return { hours: 0, minutes: 0 };
  let hours = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") hours += 12;
  return { hours, minutes: Number(match[2]) };
}
