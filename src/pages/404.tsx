import { Button } from "@components/atoms";

import Layout from "@components/layouts/Main";
import Link from "next/link";
import { useTheme } from "next-themes";
import React from "react";
import { useTranslation } from "react-i18next";
import ReactMapGL from "react-map-gl";

const Error404Page: React.FC = () => {
  const { t } = useTranslation();
  const { resolvedTheme } = useTheme();

  return (
    <Layout>
      <div className="absolute top-0 left-0 z-10 flex flex-col items-center justify-center w-full h-full bg-white/60 dark:bg-black/60 gap-6">
        <h1 className="text-3xl font-semibold">{t("page_not_found")}</h1>
        <Link href="/" passHref>
          <Button>{t("go_to_map")}</Button>
        </Link>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gray-200">
        <ReactMapGL
          // width="100%"
          // height="100%"
          pitch={47}
          bearing={20}
          // className="relative rounded-lg"
          mapStyle={`mapbox://styles/mapbox/${
            resolvedTheme === "dark" ? "dark" : "light"
          }-v10`}
          latitude={50.0911474}
          longitude={14.4019565}
          zoom={16.71}
          // mapboxApiAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        ></ReactMapGL>
      </div>
    </Layout>
  );
};

export default Error404Page;
