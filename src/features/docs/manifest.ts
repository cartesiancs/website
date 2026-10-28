export type Lang = "en" | "ko";

export const LANG_LABEL: Record<Lang, string> = {
  en: "English",
  ko: "한국어",
};

export type Localized = Partial<Record<Lang, string>> & { en: string };

export type DocPage = {
  slug: string;
  title: Localized;
};

export type DocGroup = {
  title: Localized;
  pages: DocPage[];
};

export type DocsSiteConfig = {
  // Also prefixes the stored language choice and the content cache.
  id: string;
  product: string;
  // Shown next to the logo and in the tab title: "Tutorial", "Docs".
  section: Localized;
  root: string;
  // Markdown lives at <folder>/<lang>/<slug>.md, screenshots in <lang>/img/.
  folder: string;
  langs: Lang[];
  nav: DocGroup[];
  logo: {
    src: string;
    alt: string;
    // A mark that needs the product name written beside it.
    wordmark?: string;
    invert?: boolean;
  };
  issuesUrl: string;
  cta: { href: string; label: Localized; icon: "download" | "github" };
  searchPlaceholder: Localized;
  searchHint: Localized;
  credit?: Localized;
};

export type DocsSite = DocsSiteConfig & {
  pages: DocPage[];
  firstSlug: string;
};

export function defineDocsSite(config: DocsSiteConfig): DocsSite {
  const pages = config.nav.flatMap((group) => group.pages);
  return { ...config, pages, firstSlug: pages[0].slug };
}

export function text(value: Localized, lang: Lang): string {
  return value[lang] ?? value.en;
}

export function sourceFolder(site: DocsSite, lang: Lang) {
  return `${site.folder}/${lang}`;
}

export function findPage(site: DocsSite, slug: string) {
  const index = site.pages.findIndex((p) => p.slug === slug);
  if (index === -1) return null;
  return {
    page: site.pages[index],
    group: site.nav.find((g) => g.pages.some((p) => p.slug === slug))!,
    previous: site.pages[index - 1] ?? null,
    next: site.pages[index + 1] ?? null,
  };
}

export function docPath(site: DocsSite, slug: string) {
  return slug === site.firstSlug ? site.root : `${site.root}/${slug}`;
}
