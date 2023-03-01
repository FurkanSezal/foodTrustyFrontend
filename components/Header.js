import { ConnectButton } from "@web3uikit/web3";
import { Checkbox } from "@web3uikit/core";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { languageDoc } from "../constants/languageDoc";
import FoodTrustyJPG from "../public/FoodTrustyJPG.jpg";

export default function Header({ setLanguage }) {
  const [language, setLanguagee] = useState("FR");

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.checked ? "EN" : "FR";
    setLanguagee(newLanguage);
    setLanguage && setLanguage(newLanguage);
  };

  return (
    <nav>
      <div className="border-b-2 flex flex-row">
        <div className="flex items-center">
          <div>
            <Image src={FoodTrustyJPG} alt="" width={80} height={80} />
          </div>
        </div>
        <div className="ml-auto py-2 px-4"></div>
        <ul className="flex flex-row">
          <li className="mr-4 p-6">
            <Link href="/">{languageDoc[language]["Home"]}</Link>
          </li>
          <li className="mr-4 p-6">
            <Link href="/register">{languageDoc[language]["AddProduct"]}</Link>
          </li>
        </ul>
        <div className="px-4 py-6">
          <Checkbox
            id="language-switch"
            label="FR/EN"
            layout="switch"
            name="Language switch input"
            onChange={handleLanguageChange}
          />
        </div>
        <div className="py-4 px-4">
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </nav>
  );
}
