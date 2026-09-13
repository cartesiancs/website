/** @jsxImportSource @emotion/react */
import { BrowserRouter, Routes, Route } from "react-router";
import "./App.css";
import { About } from "./pages/About";
import { Product } from "./pages/Product";
import { CartCut } from "./pages/CartCut";
import ScrollToTop from "./components/ScrollToTop";
import Post from "./pages/Post";
import { Fleet } from "./pages/Fleet";
import { Career } from "./pages/Career";
import { CareerProductEngineer } from "./pages/CareerProductEngineer";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/product" element={<Product />} />
          <Route path="/cartcut" element={<CartCut />} />
          <Route path="/posts/:slug" element={<Post />} />
          <Route path="/fleet" element={<Fleet />} />
          <Route path="/career" element={<Career />} />
          <Route
            path="/career/product-engineer"
            element={<CareerProductEngineer />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
