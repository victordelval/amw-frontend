import { AntdRegistry } from "@ant-design/nextjs-registry";
import { i18n, type Locale } from "../../../i18n-config";
import MainMap from "./components/Map";
import Nav from "./components/Nav";
import { getDictionary } from "../../get-dictionary";
import { MenuProvider } from "./menuContext";
import Loader from "./components/Loader";
import "./globals.css";

import type { Metadata } from "next";
import "mapbox-gl/dist/mapbox-gl.css";

export const metadata: Metadata = {
  title: "Homepage - Amazon Mining Watch",
  description:
    "A New Platform to Monitor Mining in Amazon Using Artificial Intelligence.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  return (
    <html lang={params.lang}>
      <AntdRegistry>
        <MenuProvider>
          <body>
            <Nav />
            <MainMap />
            {children}
            <Loader />
          </body>
        </MenuProvider>
      </AntdRegistry>
    </html>
  );
}
