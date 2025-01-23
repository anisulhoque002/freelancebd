import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Image from "next/image";
import { HOST, IMAGES_URL, AUTH_ROUTES } from "../../utils/constants";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

function UserProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserData = async () => {
      if (id) {
        try {
          const { data } = await axios.get(`${AUTH_ROUTES}/users/${id}`);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [id]);

  if (!userData) return <div>{t("common.loading")}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center space-y-4">
            {userData.imageName && (
              <div className="relative w-32 h-32 rounded-full overflow-hidden">
                <Image
                  src={userData.imageName}
                  alt={userData.fullName}
                  width={128}
                  height={128}
                  className="rounded-full object-cover"
                  unoptimized={true}
                />
              </div>
            )}
            <h1 className="text-2xl font-bold">{userData.fullName}</h1>
            <p className="text-gray-600">@{userData.username}</p>
            {userData.description && (
              <p className="text-gray-700 text-center">{userData.description}</p>
            )}
            {userData.portfolioLink && (
              <a
                href={userData.portfolioLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {t("profile.viewPortfolio")}
              </a>
            )}
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">{t("profile.reviews")}</h2>
              {/* Add reviews component here */}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default UserProfile; 