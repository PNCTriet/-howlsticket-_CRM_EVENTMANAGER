import type { Locale } from "date-fns";
import { addDays, format, parseISO, subDays } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

export const VIETNAM_TZ = "Asia/Ho_Chi_Minh";

/**
 * Ngày hôm nay theo múi giờ Vietnam (yyyy-MM-dd).
 * Dùng cho dashboard để "today" / "yesterday" thống nhất theo giờ VN, không phụ thuộc múi giờ máy user.
 */
export function getTodayInVietnam(): string {
  return formatInTimeZone(new Date(), VIETNAM_TZ, "yyyy-MM-dd");
}

/**
 * Ngày hôm qua theo múi giờ Vietnam (yyyy-MM-dd).
 */
export function getYesterdayInVietnam(): string {
  return formatInTimeZone(subDays(new Date(), 1), VIETNAM_TZ, "yyyy-MM-dd");
}

/**
 * Ngày cách đây N ngày theo múi giờ Vietnam (yyyy-MM-dd).
 * getDateInVietnamOffset(0) = hôm nay, getDateInVietnamOffset(29) = 29 ngày trước.
 */
export function getDateInVietnamOffset(daysAgo: number): string {
  return formatInTimeZone(subDays(new Date(), daysAgo), VIETNAM_TZ, "yyyy-MM-dd");
}

/**
 * Ngày tiếp theo (yyyy-MM-dd). Dùng khi backend dùng `to` exclusive.
 */
export function getNextDayDateStr(dateStr: string): string {
  const d = parseISO(dateStr + "T00:00:00.000Z");
  return format(addDays(d, 1), "yyyy-MM-dd");
}

/**
 * Danh sách các ngày từ fromStr đến toStr (yyyy-MM-dd), inclusive.
 * Dùng để build danh sách ngày khớp với API (timezone Vietnam) mà không phụ thuộc múi giờ máy.
 */
export function getDaysInRange(fromStr: string, toStr: string): string[] {
  const out: string[] = [];
  let d = parseISO(fromStr + "T00:00:00.000Z");
  const end = parseISO(toStr + "T00:00:00.000Z");
  while (d <= end) {
    out.push(format(d, "yyyy-MM-dd"));
    d = addDays(d, 1);
  }
  return out;
}

/**
 * Chuyển khoảng ngày (theo Vietnam) sang params from/to cho API.
 * Backend có thể dùng end date exclusive (date < to), nên gửi to + 1 ngày
 * để đảm bảo ngày kết thúc được bao gồm.
 * Lưu ý: Nếu backend group theo UTC, doanh thu "trong ngày" VN có thể sai (order 1h–7h sáng VN
 * sẽ nằm vào ngày UTC trước đó). Cần backend group by day theo timezone Asia/Ho_Chi_Minh.
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

/**
 * Format chuỗi ngày (yyyy-MM-dd) để hiển thị theo locale.
 * Dùng cho key từ API (đã là ngày Vietnam); dùng noon UTC để tránh lệch ngày khi format.
 */
export function formatDateKeyForDisplay(
  dateKey: string,
  formatStr: string,
  locale?: Locale
): string {
  const d = parseISO(dateKey + "T12:00:00.000Z");
  return formatInTimeZone(d, VIETNAM_TZ, formatStr, { locale });
}
