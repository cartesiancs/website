export type Lang = "en" | "ko";

export const LANGS: Lang[] = ["en", "ko"];

export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
};

export const DOCS_ROOT = "/cartcut/tutorial";

// Markdown lives at /docs/cartcut/tutorial/<lang>/<slug>.md, and each language
// keeps its own screenshots beside it in <lang>/img/.
export function sourceFolder(lang: Lang) {
  return `/docs/cartcut/tutorial/${lang}`;
}

export type DocPage = {
  slug: string;
  title: Record<Lang, string>;
};

export type DocGroup = {
  title: Record<Lang, string>;
  pages: DocPage[];
};

const page = (slug: string, en: string, ko: string): DocPage => ({
  slug,
  title: { en, ko },
});

export const NAV: DocGroup[] = [
  {
    title: { en: "Getting started", ko: "시작하기" },
    pages: [
      page("introduction", "Introduction", "소개"),
      page("installation", "Installation", "설치하기"),
      page("quick-start", "Quick start", "빠른 시작"),
      page("interface", "The interface", "화면 구성"),
    ],
  },
  {
    title: { en: "Project", ko: "프로젝트" },
    pages: [
      page("project-settings", "Project settings", "프로젝트 설정"),
      page("saving-and-autosave", "Saving and Auto Save", "저장과 자동 저장"),
      page("preferences", "Language and preferences", "언어와 환경 설정"),
    ],
  },
  {
    title: { en: "Editing", ko: "기본 편집" },
    pages: [
      page("importing-media", "Importing media", "미디어 가져오기"),
      page("timeline", "The timeline", "타임라인 다루기"),
      page("cutting-and-trimming", "Cutting and trimming", "자르기와 다듬기"),
      page("transform", "Position, size and rotation", "위치, 크기, 회전"),
      page("audio", "Audio", "오디오"),
      page("speed-and-reverse", "Speed and reverse", "속도와 역재생"),
    ],
  },
  {
    title: { en: "Graphics and motion", ko: "그래픽과 모션" },
    pages: [
      page("text", "Text", "텍스트"),
      page("shapes-and-masks", "Shapes and masks", "도형과 마스크"),
      page("keyframes", "Keyframe animation", "키프레임 애니메이션"),
      page("groups-and-parenting", "Groups and parenting", "그룹과 부모 연결"),
      page("color", "Color and LUTs", "색 보정과 LUT"),
      page("effects-and-transitions", "Effects and transitions", "효과와 전환"),
      page("templates", "Templates", "템플릿"),
    ],
  },
  {
    title: { en: "Tools", ko: "도구" },
    pages: [
      page("auto-captions", "Automatic captions", "자동 자막"),
      page("screen-recording", "Screen recording", "화면 녹화"),
      page("utilities", "More utilities", "기타 유틸리티"),
    ],
  },
  {
    title: { en: "Export", ko: "내보내기" },
    pages: [page("export", "Exporting a video", "영상 내보내기")],
  },
  {
    title: { en: "Advanced", ko: "고급" },
    pages: [
      page("ai-editing", "Editing with AI", "AI로 편집하기"),
      page("extensions", "Extensions", "확장 프로그램"),
      page("keyboard-shortcuts", "Keyboard shortcuts", "단축키"),
      page("faq", "Troubleshooting and FAQ", "문제 해결과 FAQ"),
    ],
  },
];

export const PAGES: DocPage[] = NAV.flatMap((group) => group.pages);

export const FIRST_SLUG = PAGES[0].slug;

export function findPage(slug: string) {
  const index = PAGES.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    page: PAGES[index],
    group: NAV.find((g) => g.pages.some((p) => p.slug === slug))!,
    previous: PAGES[index - 1] ?? null,
    next: PAGES[index + 1] ?? null,
  };
}

export function docPath(slug: string) {
  return slug === FIRST_SLUG ? DOCS_ROOT : `${DOCS_ROOT}/${slug}`;
}
