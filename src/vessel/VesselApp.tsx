import { useEffect } from "react";
import { Outlet, Route, Routes } from "react-router";
import "./vessel.css";
import { loadVesselAnalytics } from "@/vessel/lib/analytics";
import LandingPage from "@/vessel/pages/Main";
import RoadmapPage from "@/vessel/pages/Roadmap";
import UsecasePage from "@/vessel/pages/UseCase";
import { PrivacyPage } from "@/vessel/pages/Privacy";
import PrivacyPolicyPage from "@/vessel/pages/PrivacyPolicy";
import PricingPage from "@/vessel/pages/Pricing";
import CapsulePage from "@/vessel/pages/Capsule";
import ContactPage from "@/vessel/pages/Contact";
import TermsPage from "@/vessel/pages/Terms";
import DisclaimerPage from "@/vessel/pages/Disclaimer";
import { NotFound } from "../pages/NotFound";

const VESSEL_TITLE = "Vessel: The Open-Source C2 Platform";
const VESSEL_DESCRIPTION =
  "Connect, orchestrate, and automate your physical devices. Vessel is an open-source platform for building proactive security and automation flows with a visual editor to protect your home and assets.";
const PAGE_CLASS = "vessel-page";

function setMetaDescription(content: string | null) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta && content !== null) meta.content = content;
}

// Gives the Vessel pages their own tab title and description, and switches the
// document to window scrolling (see vessel.css) while they are mounted.
function VesselLayout() {
  useEffect(() => {
    const root = document.documentElement;
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector<HTMLMetaElement>('meta[name="description"]')?.content ?? null;

    root.classList.add(PAGE_CLASS);
    document.title = VESSEL_TITLE;
    setMetaDescription(VESSEL_DESCRIPTION);
    loadVesselAnalytics();

    return () => {
      root.classList.remove(PAGE_CLASS);
      document.title = previousTitle;
      setMetaDescription(previousDescription);
    };
  }, []);

  return (
    <div className='vessel-scope vessel-root'>
      <Outlet />
    </div>
  );
}

export default function VesselApp() {
  return (
    <Routes>
      <Route element={<VesselLayout />}>
        <Route index element={<LandingPage />} />
        <Route path='roadmap' element={<RoadmapPage />} />
        <Route path='usecase' element={<UsecasePage />} />
        <Route path='privacy' element={<PrivacyPage />} />
        <Route path='privacy-policy' element={<PrivacyPolicyPage />} />
        <Route path='pricing' element={<PricingPage />} />
        <Route path='capsule' element={<CapsulePage />} />
        <Route path='contact' element={<ContactPage />} />
        <Route path='terms' element={<TermsPage />} />
        <Route path='disclaimer' element={<DisclaimerPage />} />
      </Route>
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}
