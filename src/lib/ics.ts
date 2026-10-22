import { fromIsoDate, parseTime } from "@/lib/dates";

// Builds an .ics calendar file and starts a download in the browser.
// Times are "floating" (no time zone), so they show at the same local time.

function stamp(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}00`
  );
}

function escape(text: string) {
  return text.replace(/[\\,;]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
}

export function downloadIcs({
  title,
  description,
  location,
  date,
  time,
  durationMinutes = 60,
  fileName,
}: {
  title: string;
  description: string;
  location: string;
  date: string; // ISO date
  time: string; // "1:00 PM"
  durationMinutes?: number;
  fileName: string;
}) {
  const { hours, minutes } = parseTime(time);
  const start = fromIsoDate(date);
  start.setHours(hours, minutes, 0, 0);
  const end = new Date(start.getTime() + durationMinutes * 60_000);

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Haven//Tour request//EN",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${escape(title)}`,
    `DESCRIPTION:${escape(description)}`,
    `LOCATION:${escape(location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
