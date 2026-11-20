export type BlogPost = {
  // The markdown file is public/docs/post/<slug>.md, and the post's URL is
  // /blog/<slug>. The file's "# " heading is the title on the post's page.
  slug: string;
  // Shown in the /blog listing.
  title: string;
  // Publication date, as "YYYY-MM-DD".
  date: string;
  // A line under the title in the listing.
  summary?: string;
};

// Newest first. To publish a post, add public/docs/post/<slug>.md and list it
// here.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "hello",
    title: "Welcome to the cartesiancs Blog",
    date: "2026-07-06",
    summary:
      "We just launched our company blog. Here's what we're building and what you can expect to read here.",
  },
];

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

// "2026-07-06" -> "06-Jul-2026", the way Apache dates a listing.
export function formatPostDate(date: string) {
  const [year, month, day] = date.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${day}-${name}-${year}` : date;
}

// The line under a post's title on its own page.
export function blogPostMeta(slug: string) {
  const post = BLOG_POSTS.find((entry) => entry.slug === slug);
  return post && formatPostDate(post.date);
}
