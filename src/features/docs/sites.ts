import { defineDocsSite, type DocPage } from "./manifest";

const page = (slug: string, en: string, ko?: string): DocPage => ({
  slug,
  title: ko ? { en, ko } : { en },
});

export const CARTCUT_DOCS = defineDocsSite({
  id: "cartcut",
  product: "CartCut",
  section: { en: "Tutorial", ko: "튜토리얼" },
  root: "/cartcut/tutorial",
  folder: "/docs/cartcut/tutorial",
  langs: ["en", "ko"],
  logo: { src: "/cartcut.png", alt: "CartCut" },
  issuesUrl: "https://github.com/cartesiancs/cartcut/issues",
  cta: { href: "/cartcut", label: { en: "Download", ko: "다운로드" }, icon: "download" },
  searchPlaceholder: { en: "Search the tutorial...", ko: "튜토리얼 검색..." },
  searchHint: {
    en: "Type to search every page of the tutorial.",
    ko: "튜토리얼의 모든 페이지에서 검색합니다.",
  },
  credit: {
    en: "Sample footage in the screenshots: Sintel and Big Buck Bunny (CC BY, Blender Foundation), volcano footage (CC0, Wikimedia Commons).",
    ko: "스크린샷의 예제 영상: Sintel, Big Buck Bunny (CC BY, Blender Foundation), 화산 영상 (CC0, Wikimedia Commons).",
  },
  nav: [
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
  ],
});

export const VESSEL_DOCS = defineDocsSite({
  id: "vessel",
  product: "Vessel",
  section: { en: "Docs" },
  root: "/vessel/docs",
  folder: "/docs/vessel",
  langs: ["en"],
  logo: { src: "/vessel/icon.png", alt: "Vessel", wordmark: "Vessel", invert: true },
  issuesUrl: "https://github.com/cartesiancs/vessel/issues",
  cta: {
    href: "https://github.com/cartesiancs/vessel",
    label: { en: "GitHub" },
    icon: "github",
  },
  searchPlaceholder: { en: "Search the docs..." },
  searchHint: { en: "Type to search every page of the docs." },
  nav: [
    {
      title: { en: "Getting started" },
      pages: [
        page("introduction", "Introduction"),
        page("installation", "Installation"),
        page("quick-start", "Quick start"),
        page("concepts", "Core concepts"),
      ],
    },
    {
      title: { en: "Flows" },
      pages: [
        page("flow", "The flow editor"),
        page("flow-nodes", "Node reference"),
        page("custom-nodes", "Custom nodes"),
      ],
    },
    {
      title: { en: "Monitoring" },
      pages: [
        page("dashboard", "Dashboards"),
        page("map", "Map"),
        page("devices-and-entities", "Devices and entities"),
        page("streams-and-recordings", "Streams and recordings"),
      ],
    },
    {
      title: { en: "Integrations" },
      pages: [page("mqtt", "MQTT"), page("integrations", "Integrations")],
    },
    {
      title: { en: "AI" },
      pages: [page("ai-assistant", "AI assistant")],
    },
    {
      title: { en: "Administration" },
      pages: [
        page("users-and-roles", "Users and roles"),
        page("configuration", "Server configuration"),
        page("remote-access", "Remote access"),
      ],
    },
    {
      title: { en: "Help" },
      pages: [page("troubleshooting", "Troubleshooting and FAQ")],
    },
  ],
});
