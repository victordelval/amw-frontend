import type { Metadata } from "next";
import { i18n, type Locale } from "../../../../i18n-config";
import { getDictionary } from "../../../../get-dictionary";

export const metadata: Metadata = {
  title: "Case Studies - Amazon Mining Watch",
  description:
    "A New Platform to Monitor Mining in Amazon Using Artificial Intelligence.",
};

export default async function PageLayout({
  children, // will be a page or nested layout
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return <section>{children}</section>;
}