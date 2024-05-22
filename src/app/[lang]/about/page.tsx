import { NextPage } from "next";
import { i18n, type Locale } from "../../../../i18n-config";
import Overlay from "../components/Overlay";
import { getDictionary } from "../../../get-dictionary";
import { getMarkdown } from "../../../get-markdown";
import MarkdownRenderer from "../components/MarkdownRenderer"; // Import the MarkdownRenderer component

interface PageProps {
  params: {
    lang: "en" | "es" | "pt";
  };
}

const Page: NextPage<PageProps> = async ({ params: { lang } }) => {
  const dictionary = await getDictionary(lang);
  const content = await getMarkdown(lang, `${lang}/about.md`);
  
  return (
    <Overlay>
      {/* Render the MarkdownRenderer with the processed content */}
      <MarkdownRenderer content={content.content} />
    </Overlay>
  );
};

export default Page;
