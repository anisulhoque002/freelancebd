import React from "react";
import Navbar from "../components/Navbar";
//import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import { useStateProvider } from "../context/StateContext";
import AuthWrapper from "../components/AuthWrapper";

function AboutUs() {
  const { t } = useTranslation();
  const [{ showLoginModal, showSignupModal }] = useStateProvider();

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] px-32 py-16">
        <h1 className="text-4xl font-bold text-[#404145] mb-12">
          {t("about.title")}
        </h1>

        {/* Mission Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#404145] mb-4">
            {t("about.mission.title")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("about.mission.description")}
          </p>
        </div>

        {/* Vision Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#404145] mb-4">
            {t("about.vision.title")}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {t("about.vision.description")}
          </p>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-2xl font-semibold text-[#404145] mb-6">
            {t("about.values.title")}
          </h2>
          <div className="grid grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-[#1DBF73] mb-3">
                  {t(`about.values.value${index}.title`)}
                </h3>
                <p className="text-gray-600">
                  {t(`about.values.value${index}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {showLoginModal && <AuthWrapper type="login" />}
      {showSignupModal && <AuthWrapper type="signup" />}
    </>
  );
}

export default AboutUs; 