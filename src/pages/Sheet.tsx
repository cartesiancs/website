/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import Footer from "../components/Footer";

const maxWidth = "800px";

const linksData = [
  { title: "X", url: "https://x.com/cartesiancs" },
  { title: "Youtube", url: "https://www.youtube.com/@cartesiancs" },
  { title: "Instagram", url: "https://www.instagram.com/cartesiancs.official" },
  { title: "GitHub", url: "https://github.com/cartesiancs" },
  { title: "LinkedIn", url: "https://www.linkedin.com/company/cartesiancs" },
];

const postsData = [
  { title: "Why We Founded a DAO", slug: "introducing" },
  { title: "Open Source", slug: "open-source" },
];

export function Sheet() {
  return (
    <>
      <div
        css={css({
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        })}
      >
        <TopNavBar />

        <div
          css={css({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            padding: "100px 1rem 1rem 1rem",
            boxSizing: "border-box",
            maxWidth: maxWidth,
            "@media (max-width: 640px)": {
              padding: "80px 1rem 1rem 1rem",
            },
          })}
        >
          <div
            css={css({
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "stretch",
              width: "100%",
              maxWidth: maxWidth,
              flexWrap: "wrap",
              marginBottom: "2rem",
            })}
          >
            <div
              css={css({
                backgroundColor: "#0d0e0f",
                border: "1px solid rgb(36, 36, 43)",
                borderRadius: "8px",
                padding: "1.5rem",
                margin: "0.5rem",
                flex: "1 1 100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                boxSizing: "border-box",
              })}
            >
              <h2
                css={css({
                  color: "#ffffff",
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "1.25rem",
                  marginTop: "0rem",
                  alignSelf: "flex-start",
                  textAlign: "left",
                })}
              >
                Links
              </h2>
              <ul
                css={css({
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  gap: "0.75rem",
                  width: "100%",
                  "@media (max-width: 640px)": {
                    gap: "0.5rem",
                  },
                })}
              >
                {linksData.map((link) => (
                  <li key={link.title}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      css={css({
                        color: "#e6e6eb",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontWeight: 500,
                        fontSize: "0.95rem",
                        transition: "color 0.3s ease",
                        "&:hover": {
                          color: "#ffffff",
                        },
                        "&:hover svg": {
                          opacity: 1,
                          transform: "translateX(0)",
                        },
                      })}
                    >
                      {link.title}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        css={css({
                          marginLeft: "0.25rem",
                          opacity: 0,
                          transform: "translateX(-5px)",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                        })}
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div
          css={css({
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
            maxWidth: maxWidth,
            flexWrap: "wrap",
            marginTop: "0rem",
            padding: "0 1rem",
            boxSizing: "border-box",
          })}
        >
          <div
            css={css({
              backgroundColor: "#0d0e0f",
              border: "1px solid rgb(36, 36, 43)",
              borderRadius: "8px",
              padding: "1.5rem",
              margin: "0.5rem",
              flex: "1 1 100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "100%",
              boxSizing: "border-box",
            })}
          >
            <h2
              css={css({
                color: "#ffffff",
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "1.25rem",
                marginTop: "0rem",
                alignSelf: "flex-start",
                textAlign: "left",
              })}
            >
              Posts
            </h2>
            <ul
              css={css({
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "flex-start",
                gap: "0.75rem",
                width: "100%",
                "@media (max-width: 640px)": {
                  gap: "0.5rem",
                },
              })}
            >
              {postsData.map((post) => (
                <li key={post.slug}>
                  <a
                    href={`/posts/${post.slug}`}
                    css={css({
                      color: "#e6e6eb",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      fontWeight: 500,
                      fontSize: "0.95rem",
                      transition: "color 0.3s ease",
                      "&:hover": {
                        color: "#ffffff",
                      },
                      "&:hover svg": {
                        opacity: 1,
                        transform: "translateX(0)",
                      },
                    })}
                  >
                    {post.title}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      css={css({
                        marginLeft: "0.25rem",
                        opacity: 0,
                        transform: "translateX(-5px)",
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                      })}
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
