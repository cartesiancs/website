import type { Lang } from "./manifest";

const STRINGS = {
  docs: { en: "Docs", ko: "문서" },
  tutorial: { en: "Tutorial", ko: "튜토리얼" },
  search: { en: "Search docs", ko: "문서 검색" },
  search_placeholder: {
    en: "Search the tutorial...",
    ko: "튜토리얼 검색...",
  },
  search_empty: { en: "No results for", ko: "검색 결과가 없습니다:" },
  search_hint: {
    en: "Type to search every page of the tutorial.",
    ko: "튜토리얼의 모든 페이지에서 검색합니다.",
  },
  search_loading: { en: "Loading...", ko: "불러오는 중..." },
  on_this_page: { en: "On this page", ko: "이 페이지의 내용" },
  previous: { en: "Previous", ko: "이전" },
  next: { en: "Next", ko: "다음" },
  menu: { en: "Menu", ko: "메뉴" },
  close: { en: "Close", ko: "닫기" },
  download: { en: "Download", ko: "다운로드" },
  copy: { en: "Copy", ko: "복사" },
  copied: { en: "Copied", ko: "복사됨" },
  code: { en: "Code", ko: "코드" },
  terminal: { en: "Terminal", ko: "터미널" },
  tip: { en: "Tip", ko: "팁" },
  note: { en: "Note", ko: "참고" },
  important: { en: "Important", ko: "중요" },
  warning: { en: "Warning", ko: "주의" },
  loading: { en: "Loading...", ko: "불러오는 중..." },
  not_found_title: { en: "Page not found", ko: "페이지를 찾을 수 없습니다" },
  not_found_text: {
    en: "This page does not exist or has moved. Pick another page from the menu.",
    ko: "존재하지 않거나 이동한 페이지입니다. 메뉴에서 다른 페이지를 선택하세요.",
  },
  back_to_start: { en: "Go to the first page", ko: "첫 페이지로 이동" },
  edit_suggestion: {
    en: "Found something wrong or missing?",
    ko: "틀리거나 빠진 내용이 있나요?",
  },
  open_issue: { en: "Open an issue on GitHub", ko: "GitHub에 이슈 남기기" },
  sample_credit: {
    en: "Sample footage in the screenshots: Sintel and Big Buck Bunny (CC BY, Blender Foundation), volcano footage (CC0, Wikimedia Commons).",
    ko: "스크린샷의 예제 영상: Sintel, Big Buck Bunny (CC BY, Blender Foundation), 화산 영상 (CC0, Wikimedia Commons).",
  },
} as const;

export type StringKey = keyof typeof STRINGS;

export function ui(lang: Lang, key: StringKey): string {
  return STRINGS[key][lang];
}
