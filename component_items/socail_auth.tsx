"use client";

import Link from "next/link";
import google from "@/public/icons/google.png";
import facebook from "@/public/icons/facebook.png";
import snabchat from "@/public/icons/snapchat.png";
import tiktok from "@/public/icons/tiktok.png";
import Image from "next/image";
import { usePathname } from "next/navigation";
const logos = [
  {
    image: google,
    alt: "google",
  },
  {
    image: facebook,
    alt: "facebook",
  },
  {
    image: snabchat,
    alt: "snabchat",
  },
  {
    image: tiktok,
    alt: "tiktok",
  },
];
const links = [
  { href: "/feature/register", label: "register" },
  { href: "/feature/login", label: "login" },
];

export const Socail_auth = () => {
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex items-center gap-10">
        {/* <Link
            href="/feature/register"
            className="text-gray-700 text-[18px] font-bold cursor-pointer"
          >
            register
          </Link>
        </div>
        <div>
          <Link
            href="/feature/login"
            className="text-gray-700 text-[18px] font-bold cursor-pointer"
          >
            login
          </Link> */}
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <div key={link.href}>
              <Link
                href={link.href}
                className={`text-gray-700 text-[18px] font-bold cursor-pointer relative pb-1 ${
                  isActive ? "border-b-3 border-amber-400 pb-3" : ""
                }`}
              >
                {link.label}
              </Link>
            </div>
          );
        })}
      </div>

      <div className="w-full h-[1px] bg-gray-300 mt-3" />

      <div className="flex items-center gap-3">
        {logos.map((item, idx) => (
          <div
            key={idx}
            className="w-10 h-10 border border-gray-300 rounded-sm cursor-pointer hover:border-amber-300 mt-4 flex items-center justify-center"
          >
            <Image src={item.image} alt={item.alt} width={18} height={18} />
          </div>
        ))}
      </div>

      <div className="w-full flex items-center gap-3 mt-3">
        <div className="flex-1 h-[1px] mt-1 bg-gray-300" />

        <p className="whitespace-nowrap text-sm text-gray-500">
          or sign in with your details
        </p>

        <div className="flex-1 h-[1px] mt-1 bg-gray-300" />
      </div>
    </div>
  );
};
