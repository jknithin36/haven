// Date and time formatting for the admin dashboard.

import { fromIsoDate, parseTime, toIsoDate } from "@/lib/dates";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const dateTime = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const shortDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});
const weekdayDate = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});
const longToday = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

// "Oct 22, 2:30 PM"
export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso));
}

// "Oct 22"
export function formatShortDate(isoDate: string) {
  return shortDate.format(fromIsoDate(isoDate));
}

// "Wednesday, October 21"
export function formatToday(now = new Date()) {
  return longToday.format(now);
}

// "just now", "5m ago", "2h ago", "3d ago", "in 2d", or a date past 30 days.
export function relativeTime(iso: string, now = Date.now()) {
  const diff = now - new Date(iso).getTime();
  const future = diff < 0;
  const abs = Math.abs(diff);
  let text: string;
  if (abs < MINUTE) return "just now";
  if (abs < HOUR) text = `${Math.round(abs / MINUTE)}m`;
  else if (abs < DAY) text = `${Math.round(abs / HOUR)}h`;
  else if (abs < 30 * DAY) text = `${Math.round(abs / DAY)}d`;
  else return shortDate.format(new Date(iso));
  return future ? `in ${text}` : `${text} ago`;
}

// "Today", "Tomorrow", "Yesterday", or "Fri, Oct 24".
export function dayLabel(isoDate: string, today = toIsoDate(new Date())) {
  const diff = Math.round(
    (fromIsoDate(isoDate).getTime() - fromIsoDate(today).getTime()) / DAY,
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  return weekdayDate.format(fromIsoDate(isoDate));
}

// A tour's date and time as one Date, for sorting and comparisons.
export function tourDate(isoDate: string, time: string) {
  const d = fromIsoDate(isoDate);
  const { hours, minutes } = parseTime(time);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

// Monday of the week containing `date`.
export function startOfWeek(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const offset = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - offset);
  return d;
}

export function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

// "Good morning", "Good afternoon", or "Good evening".
export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}
