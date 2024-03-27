import type { Metadata, ResolvingMetadata } from "next";
import { i18n, type Locale } from "../../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";

type Props = {
  params: { lang: "en" | "es" | "pt" };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { lang } = params;
  const dictionary = await getDictionary(lang);

  return {
    title: dictionary.contact.title,
  };
}

export default async function ContactLayout({
  children, // will be a page or nested layout
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  return <section>{children}</section>;
}
