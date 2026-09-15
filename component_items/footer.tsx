"use client";

import Image from "next/image";
import logo from "@/public/image/logo.png";
import { useTranslations } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/navigation";

import {
  FaFacebook,
  FaInstagram,
  FaTiktok,
  FaXTwitter,
  FaApplePay,
} from "react-icons/fa6";

import { BiLogoMastercard } from "react-icons/bi";
import { IoCard } from "react-icons/io5";

import { LocationEditIcon, PhoneIcon, Mail } from "lucide-react";

import ThemeToggle from "@/component_items/ThemeToggle";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  { label: "TikTok", href: "https://tiktok.com", icon: FaTiktok },
  { label: "X", href: "https://x.com", icon: FaXTwitter },
];

const languageOptions = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" },
  { code: "pl", label: "Polski" },
  { code: "ru", label: "Русский" },
  { code: "ar", label: "العربية" },
];

export const Footer = () => {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const router = useRouter();
  const pathname = usePathname();

  function switchLanguage(code: string) {
    router.replace(pathname, { locale: code });
  }

  return (
    <footer className="w-full bg-background text-foreground ">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Logo & Description */}
        <div className="w-full hidden justify-between px-6  md:flex">
          <div className=" flex-col gap-2 py-6 w-[600px]">
            <div className="flex items-center gap-3">
              <Image src={logo} alt="Masar logo" width={100} height={50} />
              <h2 className="text-2xl font-extrabold text-foreground">
                {t("tagline")}
              </h2>
            </div>

            <p className="text-[16px] text-muted-foreground font-normal ml-4">
              {t("description")}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-10">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground border border-[#C9A96E]/40 transition-all duration-200 hover:bg-amber-400 hover:text-white hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="w-[90%] mx-auto h-px bg-[#C9A96E]/40 hidden md:block" />

        {/* Links */}
        <div className="hidden md:flex w-full  justify-between px-6 py-10">
          {/* Services */}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t("servicesTitle")}
            </h3>
            <ul className="text-[16px] text-muted-foreground font-normal py-2 space-y-2">
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {tNav("limousine")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {tNav("fastTrack")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {tNav("stays")}
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t("companyTitle")}
            </h3>
            <ul className="text-[16px] text-muted-foreground font-normal py-2 space-y-2">
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("home")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("aboutUs")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("contact")}
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t("accountTitle")}
            </h3>
            <ul className="text-[16px] text-muted-foreground font-normal py-2 space-y-2">
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("signIn")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("createAccount")}
              </li>
              <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
                {t("myProfile")}
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {t("contactTitle")}
            </h3>
            <ul className="text-[16px] text-muted-foreground font-normal py-2">
              <li className="flex items-center gap-2 hover:text-foreground hover:underline cursor-pointer transition-colors">
                <PhoneIcon className="h-4 w-4 text-amber-600" />
                {t("phoneLabel")}: +1 234 567 890
              </li>
              <li className="flex items-center gap-2 pt-2 hover:text-foreground hover:underline cursor-pointer transition-colors">
                <Mail className="h-4 w-4 text-amber-600" />
                {t("emailLabel")}: info@masar.com
              </li>
              <li className="flex items-center gap-2 pt-2 hover:text-foreground hover:underline cursor-pointer transition-colors">
                <LocationEditIcon className="h-4 w-4 text-amber-600" />
                {t("addressLabel")}: 123 Main Street, City, Country
              </li>
            </ul>
          </div>
        </div>

        <div className="w-[90%] mx-auto h-px bg-[#C9A96E]/40 hidden md:block" />

        {/* Payment Methods */}
        <div className="w-full flex flex-col items-center justify-center md:px-6 md:py-10">
          <h3 className="text-sm font-normal md:text-lg md:font-bold text-foreground">
            {t("paymentMethodsTitle")}
          </h3>

          <div className="flex gap-4 items-center mt-3">
            <div className="h-8 w-12 flex items-center justify-center bg-muted rounded-md cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-amber-500 hover:text-white">
              <FaApplePay className="h-6 w-6 text-amber-700" />
            </div>
            <div className="h-8 w-12 flex items-center justify-center bg-muted rounded-md cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-amber-500 hover:text-white">
              <BiLogoMastercard className="h-6 w-6 text-amber-700" />
            </div>
            <div className="h-8 w-12 flex items-center justify-center bg-muted rounded-md cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-amber-500 hover:text-white">
              <IoCard className="h-6 w-6 text-amber-700" />
            </div>
          </div>
        </div>

        {/* Links in mobile view */}
        <ul className="text-[16px] text-muted-foreground font-normal mt-3  gap-3 flex  items-center justify-center md:hidden w-full">
          <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
            {tNav("limousine")}
          </li>
          <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
            {tNav("fastTrack")}
          </li>
          <li className="hover:text-foreground hover:underline cursor-pointer transition-colors">
            {tNav("stays")}
          </li>
        </ul>

        <div className="w-[90%] mx-auto h-px bg-[#C9A96E]/40 hidden md:block" />

        {/* Languages */}
        <div className="w-full flex py-4 flex-col items-center md:items-start justify-center md:justify-start md:px-6 md:py-10">
          <p className="text-sm font-normal md:text-lg md:font-bold text-foreground">
            {t("languageTitle")}
          </p>

          <div className="flex gap-4 py-2 flex-wrap">
            {languageOptions.map((option) => (
              <button
                key={option.code}
                onClick={() => switchLanguage(option.code)}
                className="text-[16px] text-muted-foreground font-normal hover:text-foreground hover:underline cursor-pointer transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-3 md:hidden">
          <div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-center gap-3 mb-10 ">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground border border-[#C9A96E]/40 transition-all duration-200 hover:bg-amber-400 hover:text-white hover:scale-110"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="w-[90%] mx-auto h-px bg-[#C9A96E]/40" />

        {/* Copyright & Theme */}
        <div className="w-full flex items-center justify-between py-3 md:px-6 md:py-10">
          <div className="text-sm text-muted-foreground w-full mx-auto text-center md:text-left md:mx-0 md:w-[50%]">
            <p>{t("copyright")}</p>
            <p>
              {t("developedBy")}{" "}
              <span className="text-foreground font-semibold hover:text-amber-500 underline cursor-pointer transition-colors">
                Ibrahim Hany
              </span>
            </p>
          </div>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
};
