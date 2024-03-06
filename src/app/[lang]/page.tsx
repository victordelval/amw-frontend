import React, { useState, useEffect } from "react";
import { Locale } from "../../../i18n-config";
import { getDictionary } from "../../../get-dictionary";
import Footer from "./components/Footer";
import MiniMap from "./components/MiniMap";
import Intro from "./components/Intro";

export default async function Page({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  return (
    <div>
      <Intro />
      <Footer />
    </div>
  );
}
