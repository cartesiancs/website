import { Navbar } from "@/vessel/components/Navbar";
import { Footer } from "@/vessel/components/Footer";
import { CapsuleHero } from "@/vessel/components/sections/capsule/CapsuleHero";
import { CapsuleSubheading } from "@/vessel/components/sections/capsule/CapsuleSubheading";
import { CapsuleFeatures } from "@/vessel/components/sections/capsule/CapsuleFeatures";
import { CapsuleHowItWorks } from "@/vessel/components/sections/capsule/CapsuleHowItWorks";
import { CapsuleArchitecture } from "@/vessel/components/sections/capsule/CapsuleArchitecture";
import { CapsuleFaq } from "@/vessel/components/sections/capsule/CapsuleFaq";
import { CapsuleFooterCta } from "@/vessel/components/sections/capsule/CapsuleFooterCta";

function CapsulePage() {
  return (
    <>
      <Navbar />
      <main className='w-screen bg-background text-foreground'>
        <CapsuleHero />
        <CapsuleSubheading />
        <CapsuleFeatures />
        <CapsuleHowItWorks />
        <CapsuleArchitecture />
        <CapsuleFaq />
        <CapsuleFooterCta />
      </main>
      <Footer />
    </>
  );
}

export default CapsulePage;
