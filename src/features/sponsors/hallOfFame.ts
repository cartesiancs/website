export const GITHUB_SPONSORS_URL = "https://github.com/sponsors/cartesiancs";

export type Sponsor = {
  // Shown as written, e.g. a person's name or a company name.
  name: string;
  // GitHub login, without the @. Supplies the avatar and the default link.
  github?: string;
  // Where the name links to, such as the sponsor's own website. Falls back
  // to their GitHub profile.
  url?: string;
  // Month the first sponsorship came in, as "YYYY-MM".
  since: string;
};

// The Hall of Fame on /sponsors. Sponsors are listed here for good, so add
// each new one at the end and never remove anyone, even after they stop
// sponsoring. Their place in this list is the number shown next to them.
// Only name sponsors who sponsored publicly, or who said yes to being named;
// list everyone else as "Anonymous".
//
// Example:
//   { name: "Ada Lovelace", github: "ada", url: "https://ada.dev", since: "2026-11" },
export const HALL_OF_FAME: Sponsor[] = [
  { name: "Anonymous", since: "2026-09" },
  { name: "Anonymous", since: "2026-10" },
  { name: "Anonymous", since: "2026-10" },
];
