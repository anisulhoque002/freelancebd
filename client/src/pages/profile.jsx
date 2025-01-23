import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import {
  HOST,
  IMAGES_URL,
  SET_USER_IMAGE,
  SET_USER_INFO,
} from "../utils/constants";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function Profile() {
  const router = useRouter();
  const [{ userInfo }, dispatch] = useStateProvider();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [image, setImage] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState({
    userName: "",
    fullName: "",
    description: "",
    portfolioLink: "",
  });
  const { t } = useTranslation();

  useEffect(() => {
    const handleData = { ...data };
    if (userInfo) {
      if (userInfo?.username) handleData.userName = userInfo?.username;
      if (userInfo?.description) handleData.description = userInfo?.description;
      if (userInfo?.fullName) handleData.fullName = userInfo?.fullName;
      if (userInfo?.portfolioLink) handleData.portfolioLink = userInfo?.portfolioLink;
      console.log({ userInfo });

      if (userInfo?.imageName) {
        const fileName = image;
        fetch(userInfo.imageName).then(async (response) => {
          const contentType = response.headers.get("content-type");
          const blob = await response.blob();
          // @ts-ignore
          const files = new File([blob], fileName, { contentType });
          // @ts-ignore
          setImage(files);
        });
      }

      setData(handleData);
      setIsLoaded(true);
    }
  }, [userInfo]);

  const handleFile = (e) => {
    let file = e.target.files;
    const fileType = file[0]["type"];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
    if (validImageTypes.includes(fileType)) {
      setImage(file[0]);
    }
  };
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const setProfile = async () => {
    try {
      const response = await axios.post(
        SET_USER_INFO,
        { ...data },
        { withCredentials: true }
      );
      if (response.data.userNameError) {
        setErrorMessage("Enter a Unique Username");
      } else {
        let imageName = "";
        if (image) {
          const formData = new FormData();
          formData.append("images", image);
          const {
            data: { img },
          } = await axios.post(SET_USER_IMAGE, formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          imageName = img;
        }

        const updatedUserInfo = {
          ...userInfo,
          username: data.userName,
          fullName: data.fullName,
          description: data.description,
          portfolioLink: data.portfolioLink,
          image: imageName.length ? HOST + "/" + imageName : userInfo.image,
        };

        dispatch({
          type: reducerCases.SET_USER,
          userInfo: updatedUserInfo,
        });

        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50  focus:ring-blue-500 focus:border-blue-500";
  const labelClassName =
    "mb-2 text-lg font-medium text-gray-900  dark:text-white";
  return (
    <>
      {isLoaded && (
        <div className="flex flex-col items-center justify-start min-h-[80vh] my-10">
          <h1 className="text-2xl font-semibold mb-5">{t("profile.editProfile")}</h1>
          <div className="relative cursor-pointer" onMouseEnter={() => setImageHover(true)} onMouseLeave={() => setImageHover(false)}>
            <label className={labelClassName} htmlFor="">
              {t("profile.selectProfilePicture")}
            </label>
            <div className="bg-purple-500 h-36 w-36 flex items-center justify-center rounded-full relative">
              {image ? (
                <Image
                  src={URL.createObjectURL(image)}
                  alt="profile"
                  fill
                  className="rounded-full"
                />
              ) : (
                <span className="text-6xl text-white">
                  {userInfo.email[0].toUpperCase()}
                </span>
              )}
              <div
                className={`absolute bg-slate-400 h-full w-full rounded-full flex items-center justify-center   transition-all duration-100  ${
                  imageHover ? "opacity-100" : "opacity-0"
                }`}
              >
                <span
                  className={`flex items-center justify-center relative`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 text-white absolute"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    type="file"
                    onChange={handleFile}
                    className="opacity-0"
                    multiple={true}
                    name="profileImage"
                  />
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 w-[500px]">
            <div>
              <label className={labelClassName} htmlFor="userName">
                {t("profile.selectUsername")}
              </label>
              <input
                className={inputClassName}
                type="text"
                name="userName"
                id="userName"
                placeholder={t("profile.usernamePlaceholder")}
                value={data.userName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className={labelClassName} htmlFor="fullName">
                {t("profile.enterFullName")}
              </label>
              <input
                className={inputClassName}
                type="text"
                name="fullName"
                id="fullName"
                placeholder={t("profile.fullNamePlaceholder")}
                value={data.fullName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex flex-col w-[500px]">
            <label className={labelClassName} htmlFor="description">
              {t("profile.description")}
            </label>
            <textarea
              name="description"
              id="description"
              value={data.description}
              onChange={handleChange}
              className={inputClassName}
              placeholder={t("profile.descriptionPlaceholder")}
            ></textarea>
          </div>
          <div className="flex flex-col w-[500px]">
            <label className={labelClassName} htmlFor="portfolioLink">
              {t("profile.portfolioLink")}
            </label>
            <input
              className={inputClassName}
              type="text"
              name="portfolioLink"
              id="portfolioLink"
              placeholder={t("profile.portfolioLinkPlaceholder")}
              value={data.portfolioLink}
              onChange={handleChange}
            />
          </div>
          <button
            className="border text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
            type="button"
            onClick={setProfile}
          >
            {t("profile.setProfile")}
          </button>
        </div>
      )}
    </>
  );
}

export default Profile;
