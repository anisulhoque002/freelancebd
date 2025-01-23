import React from "react";
import { BsCheckCircle } from "react-icons/bs";
import { useTranslation } from "react-i18next";

function WhyAndHow() {
  const { t } = useTranslation();

  const features = [
    {
      title: t("business.features.expertFreelancers.title"),
      description: t("business.features.expertFreelancers.description")
    },
    {
      title: t("business.features.securePayments.title"),
      description: t("business.features.securePayments.description")
    },
    {
      title: t("business.features.qualityWork.title"),
      description: t("business.features.qualityWork.description")
    },
    {
      title: t("business.features.support.title"),
      description: t("business.features.support.description")
    }
  ];

  return (
    <div className="bg-white/20 backdrop-blur-[2px] px-20 py-16">
      <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
        {t("business.title")}
      </h2>
      <div className="flex gap-10">
        <div className="w-1/2 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-3 items-start bg-white/30 rounded-lg p-4 backdrop-blur-[1px] hover:bg-white/40 transition-all duration-300">
                <BsCheckCircle className="text-[#1DBF73] text-2xl mt-1" />
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <div className="w-full aspect-video bg-white/30 p-2 rounded-lg backdrop-blur-[1px]">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/your-video-id" 
              title="How to Use FreelanceBD" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyAndHow;
