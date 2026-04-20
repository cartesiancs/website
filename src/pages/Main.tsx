/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import "../App.css";
import TopNavBar from "../components/TopNavbar";
import { GlassScene } from "../components/GlassScene";

function Main() {
  return (
    <div
      css={css({
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000000",
      })}
    >
      <GlassScene text="cartesiancs" fullScreen />
      <TopNavBar />
    </div>
  );
}

export default Main;
