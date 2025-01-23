import React, { useEffect, useState } from "react";
import FreelancebdLogo from "./FreelancebdLogo";
import Link from "next/link";
import { IoSearchOutline } from "react-icons/io5";
import { useRouter } from "next/router";
import Image from "next/image";
import { useCookies } from "react-cookie";
import axios from "axios";
import { GET_USER_INFO, HOST } from "../utils/constants";
import ContextMenu from "./ContextMenu";
import { useStateProvider } from "../context/StateContext";
import { reducerCases } from "../context/constants";
import { useTranslation } from "react-i18next";

function Navbar() {
  const [cookies] = useCookies();
  const router = useRouter();
  const [navFixed, setNavFixed] = useState(true);
  const [searchData, setSearchData] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [{ showLoginModal, showSignupModal, isSeller, userInfo }, dispatch] =
    useStateProvider();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'bn' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogin = () => {
    if (showSignupModal) {
      dispatch({
        type: reducerCases.TOGGLE_SIGNUP_MODAL,
        showSignupModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_LOGIN_MODAL,
      showLoginModal: true,
    });
  };

  const handleSignup = () => {
    if (showLoginModal) {
      dispatch({
        type: reducerCases.TOGGLE_LOGIN_MODAL,
        showLoginModal: false,
      });
    }
    dispatch({
      type: reducerCases.TOGGLE_SIGNUP_MODAL,
      showSignupModal: true,
    });
  };

  const handleCategoriesClick = () => {
    if (router.pathname !== '/') {
      router.push('/#services');
    } else {
      document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const links = [
    { linkName: t("navbar.aboutUs"), handler: () => router.push("/about"), type: "link" },
    { linkName: t("navbar.categories"), handler: handleCategoriesClick, type: "link" },
    { linkName: i18n.language === 'bn' ? 'English' : 'বাংলা', handler: handleLanguageChange, type: "link" },
    { linkName: t("navbar.signin"), handler: handleLogin, type: "button" },
    { linkName: t("navbar.join"), handler: handleSignup, type: "button2" },
  ];

  useEffect(() => {
    if (router.pathname === "/") {
      const positionNavbar = () => {
        window.pageYOffset > 0 ? setNavFixed(true) : setNavFixed(true);
      };
      window.addEventListener("scroll", positionNavbar);
      return () => window.removeEventListener("scroll", positionNavbar);
    } else {
      setNavFixed(true);
    }
  }, [router.pathname]);

  const handleOrdersNavigate = () => {
    if (isSeller) router.push("/seller/orders");
    router.push("/buyer/orders");
  };

  const handleModeSwitch = () => {
    if (isSeller) {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/buyer/orders");
    } else {
      dispatch({ type: reducerCases.SWITCH_MODE });
      router.push("/seller");
    }
  };

  useEffect(() => {
    if (cookies.jwt && !userInfo) {
      const getUserInfo = async () => {
        try {
          const {
            data: { user },
          } = await axios.post(
            GET_USER_INFO,
            {},
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${cookies.jwt}`,
              },
            }
          );

          let projectedUserInfo = { ...user };
          if (user.image) {
            projectedUserInfo = {
              ...projectedUserInfo,
              imageName: HOST + "/" + user.image,
            };
          }
          delete projectedUserInfo.image;
          dispatch({
            type: reducerCases.SET_USER,
            userInfo: projectedUserInfo,
          });
          setIsClient(true);
          console.log({ user });
          if (user.isProfileSet === false) {
            router.push("/profile");
          }
        } catch (err) {
          console.log(err);
        }
      };

      getUserInfo();
    } else {
      setIsClient(true);
    }
  }, [cookies, userInfo, dispatch]);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  useEffect(() => {
    const clickListener = (e) => {
      e.stopPropagation();

      if (isContextMenuVisible) setIsContextMenuVisible(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", clickListener);
    }
    return () => {
      window.removeEventListener("click", clickListener);
    };
  }, [isContextMenuVisible]);
  const ContextMenuData = [
    {
      name: t("navbar.editProfile"),
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/profile");
      },
    },
    {
      name: t("navbar.profileDetails"),
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push(`/userprofile/${userInfo.id}`);
      },
    },
    {
      name: i18n.language === 'bn' ? 'English' : 'বাংলা',
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        handleLanguageChange();
      },
    },
    {
      name: t("navbar.logout"),
      callback: (e) => {
        e.stopPropagation();
        setIsContextMenuVisible(false);
        router.push("/logout");
      },
    },
  ];

  if (!isClient) {
    return null;
  }

  return (
    <nav
      className={`w-full px-24 flex justify-between items-center py-6 top-0 z-30 transition-all duration-300 ${
        navFixed || userInfo
          ? "fixed backdrop-blur-md bg-white/70 border-b border-gray-200/50"
          : "absolute bg-transparent border-transparent"
      }`}
    >
      <div>
        <Link href="/">
          <FreelancebdLogo
            fillColor={!navFixed && !userInfo ? "#ffffff" : "#404145"}
          />
        </Link>
      </div>
      <div
        className={`flex ${
          navFixed || userInfo ? "opacity-100" : "opacity-0"
        }`}
      >
        <input
          type="text"
          placeholder={t("hero.searchPlaceholder")}
          className="w-[20rem] py-2.5 px-4 border-2 border-[#1DBF73] bg-white/70 backdrop-blur-sm"
          value={searchData}
          onChange={(e) => setSearchData(e.target.value)}
        />
        <button
          className="bg-gray-900/90 backdrop-blur-sm py-1.5 text-white w-16 flex justify-center items-center"
          onClick={() => {
            setSearchData("");
            router.push(`/search?q=${searchData}`);
          }}
        >
          <IoSearchOutline className="fill-white text-white h-6 w-6" />
        </button>
      </div>
      {!userInfo ? (
        <ul className="flex gap-10 items-center">
          {links.map(({ linkName, handler, type }) => {
            return (
              <li
                key={linkName}
                className={`${
                  navFixed ? "text-black" : "text-white"
                } font-medium`}
              >
                {type === "link" && (
                  <button onClick={handler} className="cursor-pointer hover:text-[#1DBF73] transition-colors duration-300">
                    {linkName}
                  </button>
                )}
                {type === "button" && (
                  <button onClick={handler} className="cursor-pointer hover:text-[#1DBF73] transition-colors duration-300">{linkName}</button>
                )}
                {type === "button2" && (
                  <button
                    onClick={handler}
                    className={`border text-md font-semibold py-1 px-3 rounded-sm backdrop-blur-sm ${
                      navFixed
                        ? "border-[#1DBF73] text-[#1DBF73] bg-white/50"
                        : "border-white text-white bg-transparent"
                    } hover:bg-[#1DBF73] hover:text-white hover:border-[#1DBF73] transition-all duration-500`}
                  >
                    {linkName}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="flex gap-10 items-center">
          {isSeller && (
            <>
              <li
                className="cursor-pointer text-[#1DBF73] font-medium hover:text-[#19a563] transition-colors duration-300"
                onClick={() => router.push("/seller/gigs/create")}
              >
                {t("navbar.createGig")}
              </li>
              <li
                className="cursor-pointer text-[#1DBF73] font-medium hover:text-[#19a563] transition-colors duration-300"
                onClick={() => router.push("/seller")}
              >
                {t("navbar.dashboard")}
              </li>
            </>
          )}
          <li
            className="cursor-pointer text-[#1DBF73] font-medium hover:text-[#19a563] transition-colors duration-300"
            onClick={handleOrdersNavigate}
          >
            {t("navbar.orders")}
          </li>

          {isSeller ? (
            <li
              className="cursor-pointer font-medium hover:text-[#1DBF73] transition-colors duration-300"
              onClick={handleModeSwitch}
            >
              {t("navbar.switchToBuyer")}
            </li>
          ) : (
            <li
              className="cursor-pointer font-medium hover:text-[#1DBF73] transition-colors duration-300"
              onClick={handleModeSwitch}
            >
              {t("navbar.switchToSeller")}
            </li>
          )}
          <li
            className="cursor-pointer font-medium hover:text-[#1DBF73] transition-colors duration-300"
            onClick={handleLanguageChange}
          >
            {i18n.language === 'bn' ? 'English' : 'বাংলা'}
          </li>
          <li
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setIsContextMenuVisible(true);
            }}
            title="Profile"
          >
            {userInfo?.imageName ? (
              <Image
                src={userInfo.imageName}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="bg-purple-500/90 backdrop-blur-sm h-10 w-10 flex items-center justify-center rounded-full relative">
                <span className="text-xl text-white">
                  {userInfo &&
                    userInfo?.email &&
                    userInfo?.email.split("")[0].toUpperCase()}
                </span>
              </div>
            )}
          </li>
        </ul>
      )}
      {isContextMenuVisible && <ContextMenu data={ContextMenuData} />}
    </nav>
  );
}

export default Navbar;
