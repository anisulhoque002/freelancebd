import React from "react";
import { useTranslation } from "react-i18next";

function Profile() {
  const { t } = useTranslation();
  return <div>{t("profile.welcome")}</div>;
}

export default Profile;
