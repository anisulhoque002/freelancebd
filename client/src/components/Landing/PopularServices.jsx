import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

function PopularServices() {
  const router = useRouter();
  const { t } = useTranslation();

  const popularServicesData = [
    { 
      name: t("popular.services.aiArtists.name"), 
      label: t("popular.services.aiArtists.label"), 
      image: "/service-1.png",
      query: "ai-artists"
    },
    { 
      name: t("popular.services.logoDesign.name"), 
      label: t("popular.services.logoDesign.label"), 
      image: "/service-2.png",
      query: "logo-design"
    },
    {
      name: t("popular.services.wordpress.name"),
      label: t("popular.services.wordpress.label"),
      image: "/service-3.png",
      query: "wordpress"
    },
    {
      name: t("popular.services.voiceOver.name"),
      label: t("popular.services.voiceOver.label"),
      image: "/service-4.png",
      query: "voice-over"
    },
    {
      name: t("popular.services.socialMedia.name"),
      label: t("popular.services.socialMedia.label"),
      image: "/service-5.png",
      query: "social-media"
    },
    { 
      name: t("popular.services.seo.name"), 
      label: t("popular.services.seo.label"), 
      image: "/service-6.png",
      query: "seo"
    },
    {
      name: t("popular.services.illustration.name"),
      label: t("popular.services.illustration.label"),
      image: "/service-7.png",
      query: "illustration"
    },
    { 
      name: t("popular.services.translation.name"), 
      label: t("popular.services.translation.label"), 
      image: "/service-8.png",
      query: "translation"
    },
  ];

  return (
    <div className="mx-20 my-16">
      <h2 className="text-4xl mb-5 text-[#404145] font-bold">
        {t("popular.title")}
      </h2>
      <ul className="flex flex-wrap gap-12">
        {popularServicesData.map(({ name, label, image, query }) => {
          return (
            <li
              key={name}
              className="relative cursor-pointer group transition-all duration-300"
              onClick={() => router.push(`/search?q=${query}`)}
            >
              <div className="absolute z-10 text-[#404145] left-5 top-4">
                <span className="text-lg font-medium drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)]">{label}</span>
                <h6 className="font-extrabold text-2xl drop-shadow-[0_2px_2px_rgba(255,255,255,0.9)]">{name}</h6>
              </div>
              <div className="relative h-60 w-72 group-hover:transform group-hover:scale-[1.02] group-hover:shadow-xl transition-all duration-300 border-2 border-[#1DBF73] rounded-md">
                <Image 
                  src={image} 
                  fill 
                  alt="service" 
                  className="object-cover" 
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PopularServices;
