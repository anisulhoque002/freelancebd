import { categories } from "../../utils/categories";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useTranslation } from "react-i18next";

function Services() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div id="services" className="mx-20 my-16 ">
      <h2 className="text-4xl mb-10 text-[#404145] font-bold">
        {t("services.title")}
      </h2>
      <ul className="grid grid-cols-5 gap-10">
        {categories.map(({ name, logo }) => {
          return (
            <li
              key={name}
              className="flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl border-2 border-[#1DBF73] p-5 transition-all duration-500 rounded-md"
              onClick={() => router.push(`/search?category=${t(name)}`)}
            >
              <Image src={logo} alt="category" height={50} width={50} />
              <span className="mt-2 text-center">{t(name)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Services;
