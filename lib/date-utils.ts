import type { Locale } from "date-fns";
import { addDays, format, parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const VIETNAM_TZ = "Asia/Ho_Chi_Minh";

/**
 * Chuyển khoảng ngày sang params cho API.
 * Backend có thể dùng end date exclusive (date < to), nên gửi to + 1 ngày
 * để đảm bảo ngày hiện tại được bao gồm.
 */
export function vietnamToUtcDateRange(
  fromStr: string,
  toStr: string
): { fromUtc: string; toUtc: string } {
  const toDate = parseISO(toStr + "T00:00:00.000Z");
  const toUtcInclusive = format(addDays(toDate, 1), "yyyy-MM-dd");
  return { fromUtc: fromStr, toUtc: toUtcInclusive };
}

/**
 * Format chuỗi ngày UTC (yyyy-MM-dd) theo múi giờ Vietnam để hiển thị.
 */
export function formatUtcDateInVietnam(
  utcDateStr: string,
  formatStr: string,
  locale?: Locale
): string {
  const utcDate = parseISO(utcDateStr + "T00:00:00.000Z");
  return formatInTimeZone(utcDate, VIETNAM_TZ, formatStr, { locale });
}
