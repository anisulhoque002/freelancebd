import AuthWrapper from "../components/AuthWrapper";
import WhyAndHow from "../components/Landing/WhyAndHow";
import HeroBanner from "../components/Landing/HeroBanner";
import FAQ from "../components/Landing/FAQ";
import PopularServices from "../components/Landing/PopularServices";
import Services from "../components/Landing/Services";
import WindEffect from "../components/Landing/WindEffect";
import { useStateProvider } from "../context/StateContext";
import React from "react";

function Index() {
  const [{ showLoginModal, showSignupModal }] = useStateProvider();

  return (
    <div>
      <WindEffect>
        <HeroBanner />
      </WindEffect>
      <WindEffect>
        <PopularServices />
      </WindEffect>
      <WindEffect>
        <Services />
      </WindEffect>
      <WindEffect>
        <WhyAndHow />
      </WindEffect>
      <WindEffect>
        <FAQ />
      </WindEffect>
      {(showLoginModal || showSignupModal) && (
        <AuthWrapper type={showLoginModal ? "login" : "signup"} />
      )}
    </div>
  );
}

export default Index;
