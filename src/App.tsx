/** @jsxImportSource @emotion/react */
import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useParams,
} from "react-router";
import "./App.css";
import { About } from "./pages/About";
import { Product } from "./pages/Product";
import { CartCut } from "./pages/CartCut";
import ScrollToTop from "./components/ScrollToTop";
import { PageCurtain } from "./components/PageTransition";
import Post from "./pages/Post";
import { Fleet } from "./pages/Fleet";
import { Career } from "./pages/Career";
import { CareerProductEngineer } from "./pages/CareerProductEngineer";
import { NotFound } from "./pages/NotFound";
import { Tutorial } from "./pages/Tutorial";
import { Showcase } from "./pages/Showcase";
import { VesselDocs } from "./pages/VesselDocs";
import { Sponsors } from "./pages/Sponsors";
import { Research } from "./pages/Research";
import { Brand } from "./pages/Brand";
import { Blog } from "./pages/Blog";
import { blogPostMeta } from "./features/blog/posts";

// The Vessel site brings Tailwind and three.js with it, so it is
// only downloaded when someone opens a /vessel page.
const VesselApp = lazy(() => import("./vessel/VesselApp"));

// Posts used to live at /posts/<slug>; keep those links working.
function OldPostRedirect() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cartcut" element={<CartCut />} />
          <Route path="/cartcut/tutorial" element={<Tutorial />} />
          <Route path="/cartcut/tutorial/:slug" element={<Tutorial />} />
          <Route path="/cartcut/showcase" element={<Showcase />} />
          <Route path="/vessel/docs" element={<VesselDocs />} />
          <Route path="/vessel/docs/:slug" element={<VesselDocs />} />
          <Route
            path="/vessel/*"
            element={
              <Suspense fallback={null}>
                <VesselApp />
              </Suspense>
            }
          />
          <Route path="/blog" element={<Blog />} />
          <Route
            path="/blog/:slug"
            element={<Post folder="post" parent="/blog" meta={blogPostMeta} />}
          />
          <Route path="/posts/:slug" element={<OldPostRedirect />} />
          <Route path="/research" element={<Research />} />
          <Route
            path="/research/:slug"
            element={<Post folder="research" parent="/research" />}
          />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/career" element={<Career />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/brand" element={<Brand />} />
          <Route
            path="/career/product-engineer"
            element={<CareerProductEngineer />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <PageCurtain />
      </BrowserRouter>
    </>
  );
}

export default App;
