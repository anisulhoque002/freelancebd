import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import Typewriter from "typewriter-effect";
import { useTranslation } from "react-i18next";
import BangladeshFlag from "./BangladeshFlag";

function HomeBanner() {
  const router = useRouter();
  const [searchData, setSearchData] = useState("");
  const { t, i18n } = useTranslation();

  return (
    <div className="h-[600px] relative">
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="w-full h-full flex justify-between items-center relative z-10 px-24">
        {/* Left Content */}
        <div className="w-[650px] flex flex-col items-start gap-8">
          <h1 className="text-[#404145] text-3xl leading-snug font-bold text-left">
            <Typewriter
              key={i18n.language}
              onInit={(typewriter) => {
                typewriter
                  .typeString(t("hero.title"))
                  .start();
              }}
              options={{
                delay: 50,
                cursor: "",
              }}
            />
          </h1>
          <div className="flex align-middle w-full">
            <div className="relative">
              <IoSearchOutline className="absolute text-gray-500 text-2xl flex align-middle h-full left-4" />
              <input
                type="text"
                className="h-16 w-[500px] pl-12 rounded-md rounded-r-none text-lg border-2 border-[#1DBF73] bg-white/70"
                placeholder={t("hero.searchPlaceholder")}
                value={searchData}
                onChange={(e) => setSearchData(e.target.value)}
              />
            </div>
            <button
              className="bg-[#1DBF73]/90 text-white px-12 text-lg font-semibold rounded-r-md hover:bg-[#19a563] transition-colors"
              onClick={() => router.push(`/search?q=${searchData}`)}
            >
              <IoSearchOutline className="h-6 w-6" />
            </button>
          </div>
          <div className="flex gap-4 items-center">
            <span className="text-lg text-[#404145] font-medium">{t("hero.popularTags")}</span>
            <ul className="flex gap-5">
              <li
                className="text-base py-2 px-4 border border-[#1DBF73] rounded-full hover:bg-[#1DBF73] hover:text-white transition-all duration-300 cursor-pointer text-[#404145] bg-white/50"
                onClick={() => router.push("/search?q=website design")}
              >
                {t("hero.popularSearches.webDesign")}
              </li>
              <li
                className="text-base py-2 px-4 border border-[#1DBF73] rounded-full hover:bg-[#1DBF73] hover:text-white transition-all duration-300 cursor-pointer text-[#404145] bg-white/50"
                onClick={() => router.push("/search?q=wordpress")}
              >
                {t("hero.popularSearches.wordpress")}
              </li>
              <li
                className="text-base py-2 px-4 border border-[#1DBF73] rounded-full hover:bg-[#1DBF73] hover:text-white transition-all duration-300 cursor-pointer text-[#404145] bg-white/50"
                onClick={() => router.push("/search?q=logo design")}
              >
                {t("hero.popularSearches.logoDesign")}
              </li>
              <li
                className="text-base py-2 px-4 border border-[#1DBF73] rounded-full hover:bg-[#1DBF73] hover:text-white transition-all duration-300 cursor-pointer text-[#404145] bg-white/50"
                onClick={() => router.push("/search?q=ai services")}
              >
                {t("hero.popularSearches.aiServices")}
              </li>
            </ul>
          </div>
        </div>

        {/* Right Content - Flag */}
        <div className="flex items-center justify-center w-[500px] h-[400px] transform translate-y-[-20px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-white/20 rounded-lg"></div>
            <BangladeshFlag />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeBanner;
