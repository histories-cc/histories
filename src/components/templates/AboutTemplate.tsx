import Image from "next/image";
import { Button } from "@components/atoms";

import Wave from "@components/atoms/svgs/Wave";
import React from "react";
import { useTranslation } from "react-i18next";

const AboutTemplate: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      {/* BACKGROUND */}
      <div
        className="absolute top-0 left-0 w-full h-full "
        style={{
          backgroundImage: `url(/assets/about-page-bg.svg)`,
        }}
      />

      {/* CONTENT */}
      <main className="absolute top-0 z-20 w-full h-full left-1/2 -translate-x-1/2 max-w-screen-2xl">
        <div className="absolute z-20 w-4/5 lg:w-1/3 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[127px] top-1/2 -translate-y-1/2 h-1/2">
          <div className="pb-2 text-lg font-semibold text-subtle">
            {t("welcome_to")}
          </div>
          {/* LOGO */}
          <Image
            src="/logo/big.svg"
            alt={t("about_page_phones_alt")}
            width="473px"
            height="120px"
          />

          {/* PARAGRAPH */}
          <p className="py-8">{t("about_page_paragraph")}</p>

          {/* START DISCOVERING BUTTON */}
          <div className="flex flex-col gap-6 w-fit">
            <Button>{t("start_discovering")}</Button>
            <Button>{t("sign_up")}</Button>
          </div>
        </div>

        {/* PHONES */}
        <div className="absolute z-10 w-4/5 lg:w-[789px] right-1/2 translate-x-1/2 lg:translate-x-0 lg:right-[60px] transition-all ease-in-out duration-500 top-[100vh] lg:top-1/2 translate-y-0 lg:-translate-y-1/2">
          <Image
            src="/assets/phones.png"
            alt={t("about_page_phones_alt")}
            width="789px"
            height="670px"
          />
        </div>
      </main>
      <div className="absolute bottom-0 w-full translate-y-1/2">
        <Wave />
      </div>
    </>
  );
};

export default AboutTemplate;
