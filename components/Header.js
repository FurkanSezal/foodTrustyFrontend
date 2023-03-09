import { ConnectButton } from "@web3uikit/web3";
import { Checkbox } from "@web3uikit/core";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { languageDoc } from "../constants/languageDoc";
import FoodTrustyJPG from "../public/FoodTrustyJPG.jpg";
import { useRouter } from "next/router";

export default function Header({ setLanguage }) {
  const router = useRouter();
  const { lang } = router.query;
  const [language, setLanguagee] = useState(lang);

  const handleClick = () => {
    router.push(`/?lang=${language}`);
  };

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.checked ? "EN" : "FR";
    setLanguagee(newLanguage);
    setLanguage && setLanguage(newLanguage);
  };

  useEffect(() => {
    if (lang == "EN") {
      setLanguagee("EN");
    } else {
      setLanguagee("FR");
    }
  }, [lang]);

  return (
    <nav>
      <div className="border-b-2 flex flex-row">
        <div className="px-4 py-6 sm:px-10 sm:flex sm:items-center">
          <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
              <Image
                src={FoodTrustyJPG}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="ml-auto py-2 px-4"></div>
        <ul className="flex flex-row">
          <li className="mr-4 p-6">
            <Link href={`/?lang=${language}`}>
              {languageDoc[language ? language : "FR"]["Home"]}
            </Link>
          </li>
          <li className="mr-4 p-6">
            <Link href={`/register?lang=${language}`}>
              {languageDoc[language ? language : "FR"]["AddProduct"]}
            </Link>
          </li>
        </ul>
        <div className="px-4 py-6">
          <Checkbox
            checked={language === "EN" ? true : false}
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
