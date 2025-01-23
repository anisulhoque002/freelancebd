import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiTwitter,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import FreelanceBDLogo from "./FreelancebdLogo";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const socialLinks = [
    { name: t("footer.social.facebook"), icon: <FiFacebook />, link: "https://www.facebook.com" },
    { name: t("footer.social.twitter"), icon: <FiTwitter />, link: "https://www.twitter.com" },
    { name: t("footer.social.instagram"), icon: <FiInstagram />, link: "https://www.instagram.com" },
    { name: t("footer.social.linkedin"), icon: <FiLinkedin />, link: "https://www.linkedin.com" },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <footer className="w-full mx-auto px-32 py-16 h-max border-t border-gray-200/30 bg-white/30 backdrop-blur-md">
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">{t("footer.contact.title")}</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-gray-600 hover:text-[#1DBF73] transition-all backdrop-blur-sm">
                <FiMail className="text-xl" />
                <a href={`mailto:${t("footer.contact.email")}`} className="hover:text-[#1DBF73] transition-all">
                  {t("footer.contact.email")}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 hover:text-[#1DBF73] transition-all backdrop-blur-sm">
                <FiPhone className="text-xl" />
                <a href={`tel:${t("footer.contact.phone")}`} className="hover:text-[#1DBF73] transition-all">
                  {t("footer.contact.phone")}
                </a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 backdrop-blur-sm">
                <FiMapPin className="text-xl" />
                <span>{t("footer.contact.address")}</span>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800">{t("footer.social.title")}</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ name, icon, link }) => (
                <Link
                  key={name}
                  href={link}
                  className="text-2xl text-gray-600 hover:text-[#1DBF73] transition-all backdrop-blur-sm"
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="flex justify-center pt-8 border-t border-gray-200/30">
          <Link href="/">
            <FreelanceBDLogo fillColor="#404145" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
