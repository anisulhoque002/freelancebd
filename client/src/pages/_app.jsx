import "../globals.css";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../utils/i18n";
import RainBackground from "../components/Landing/RainBackground";

import Head from "next/head";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { useEffect } from "react";
import { StateProvider } from "../context/StateContext";
import reducer, { initialState } from "../context/StateReducers";
import { appWithTranslation } from 'next-i18next';
import { useTranslation } from "react-i18next";

function App({ Component, pageProps }) {
  const router = useRouter();
  const [cookies] = useCookies();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Ensure Bangla is set as default language
    if (i18n.language !== 'bn') {
      i18n.changeLanguage('bn');
    }
  }, [i18n]);

  useEffect(() => {
    if (
      router.pathname.includes("/seller") ||
      router.pathname.includes("/buyer")
    ) {
      if (!cookies.jwt) {
        router.push("/");
      }
    }
  }, [cookies, router]);

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>FreelanceBD</title>
      </Head>
      <div className="relative flex flex-col h-screen justify-between">
        <RainBackground />
        <Navbar />
        <div
          className={`${
            router.pathname !== "/" ? "mt-36" : ""
          } mb-auto w-full mx-auto`}
        >
          <Component {...pageProps} />
        </div>
        <Footer />
      </div>
    </StateProvider>
  );
}

export default appWithTranslation(App);
