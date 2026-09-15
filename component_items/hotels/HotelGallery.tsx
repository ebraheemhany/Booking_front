"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { LayoutGrid, MapPin, Star, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface HotelGalleryProps {
  images: string[];
  hotelName: string;
  location?: string;
  stars?: number;
}

export function HotelGallery({
  images,
  hotelName,
  location,
  stars,
}: HotelGalleryProps) {
  const t = useTranslations("Hotels");
  const [allPhotosOpen, setAllPhotosOpen] = useState(false);

  // أول صورة كبيرة + 4 صور صغيرة بجانبها (شبكة 2×2)
  const mainImage = images[0];
  const gridImages = images.slice(1, 5);
  const remainingCount = Math.max(0, images.length - 5);

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl">
        <div className="grid h-[280px] grid-cols-1 gap-1 sm:h-[420px] sm:grid-cols-4 sm:grid-rows-2 sm:gap-1.5">
          {/* الصورة الرئيسية — تاخد نص العرض وكل الارتفاع */}
          <div className="relative col-span-1 row-span-1 h-full overflow-hidden sm:col-span-2 sm:row-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mainImage}
              alt={hotelName}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* 4 صور فرعية — شبكة 2×2 بجانب الرئيسية، تختفي على الموبايل */}
          {gridImages.map((img, i) => (
            <div key={i} className="relative hidden overflow-hidden sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img}
                alt={`${hotelName} ${i + 2}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              {/* تراكب "+N صورة" على آخر صورة في الشبكة */}
              {i === gridImages.length - 1 && remainingCount > 0 && (
                <button
                  onClick={() => setAllPhotosOpen(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-lg font-bold text-white transition-colors hover:bg-black/60"
                >
                  +{remainingCount}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* تدرّج + عنوان الفندق فوق الصورة الرئيسية */}
        <div className="pointer-events-none absolute inset-y-0 start-0 flex w-full items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-5 sm:w-1/2">
          <div>
            {location && (
              <p className="mb-1 flex items-center gap-1 text-xs text-white/80">
                <MapPin className="h-3 w-3" />
                {location}
              </p>
            )}
            <h1 className="text-xl font-bold text-white drop-shadow-md sm:text-3xl">
              {hotelName}
            </h1>
            {stars !== undefined && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {t("roomTypeHotel")}
                </span>
                <div className="flex">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* زرار عرض كل الصور — عائم في الزاوية زي المواقع العالمية */}
        <button
          onClick={() => setAllPhotosOpen(true)}
          className="absolute bottom-4 end-4 z-10 flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-black shadow-md transition-colors hover:bg-white/90"
        >
          <LayoutGrid className="h-4 w-4" />
          {t("viewAllPhotos", { count: images.length })}
        </button>
      </div>

      {/* مودال كل الصور */}
      <Dialog open={allPhotosOpen} onOpenChange={setAllPhotosOpen}>
        <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto border-white/10 bg-[#0d1728] p-0">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d1728] px-5 py-4">
            <h2 className="text-base font-bold text-white">{hotelName}</h2>
            <button
              onClick={() => setAllPhotosOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-3">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative aspect-[4/3] overflow-hidden rounded-lg"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${hotelName} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
