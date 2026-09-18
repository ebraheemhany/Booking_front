"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Building2,
  Waves,
  Landmark,
  Car,
  Fuel,
  Users,
  Plane,
  Luggage,
  Ticket,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CategorySidebar } from "./hero_category";
import { HotelCard } from "./hero_card";
import { StaysHero } from "./hero_service";

interface Offer {
  image: string;
  badgeLabel: string;
  title: string;
  subtitle?: string;
  rating?: number;
  priceFrom: number;
  priceUnit: string;
  currency: string;
  ctaLabel: string;
}

interface Category {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface HeroSectionData {
  id: string;
  heroImage: string;
  heroImageAlt: string;
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  heroCta: string;
  offers: Offer[];
  sidebarLabel: string;
  featuredTitle: string;
  featuredPriceUnit: string;
  featuredPriceFrom: number;
  featuredDescriptionPrefix: string;
  featuredIcon: React.ElementType;
  categories: Category[];
}

// الصور ثابتة (مش نص، فمش محتاجة ترجمة)
const sectionImages: Record<string, string> = {
  stays: "/image/hero_stays.jpg",
  carRental: "/image/hero_cars.jpg",
  travel: "/image/hero_travel.jpg",
};

// function useSections(): HeroSectionData[] {
//   const t = useTranslations("HeroSections");

//   return [
//     // ============ قسم الفنادق والإقامات ============
//     {
//       id: "stays",
//       heroImage: "/image/hero_2.jpg",
//       heroImageAlt: t("stays.imageAlt"),
//       heroBadge: t("stays.badge"),
//       heroTitle: t("stays.title"),
//       heroDescription: t("stays.description"),
//       heroCta: t("stays.cta"),
//       sidebarLabel: t("stays.sidebarLabel"),
//       featuredTitle: t("stays.featuredTitle"),
//       featuredDescription: t("stays.featuredDescription"),
//       featuredIcon: Building2,
//       categories: [
//         { icon: Landmark, title: "القاهرة", description: "فنادق وشقق فندقية" },
//         {
//           icon: Building2,
//           title: "الإسكندرية",
//           description: "فنادق وشقق داخل المدينة",
//         },
//         {
//           icon: Waves,
//           title: "الساحل الشمالي",
//           description: "شاليهات وإقامات على الساحل",
//         },
//       ],
//       offers: [
//         {
//           image: "/image/stay_1.png",
//           badgeLabel: "Masar من الإقامات",
//           title: "Kempinski Nile Hotel Garden City",
//           rating: 5,
//           priceFrom: 7889.5,
//           priceUnit: "الليلة",
//           currency: "EGP",
//           ctaLabel: "احجز الآن",
//         },
//         {
//           image: "/image/stay_1.png",
//           badgeLabel: "Masar من الإقامات",
//           title: "Al Masa Hotel Nasr City",
//           rating: 5,
//           priceFrom: 8144,
//           priceUnit: "الليلة",
//           currency: "EGP",
//           ctaLabel: "احجز الآن",
//         },
//         {
//           image: "/image/stay_1.png",
//           badgeLabel: "Masar من الإقامات",
//           title: "Pyramisa Suites Hotel Cairo",
//           rating: 5,
//           priceFrom: 6362.5,
//           priceUnit: "الليلة",
//           currency: "EGP",
//           ctaLabel: "احجز الآن",
//         },
//         {
//           image: "/image/stay_1.png",
//           badgeLabel: "Masar من الإقامات",
//           title: "Safir Cairo",
//           rating: 5,
//           priceFrom: 4581,
//           priceUnit: "الليلة",
//           currency: "EGP",
//           ctaLabel: "احجز الآن",
//         },
//       ],
//     },

//     // ============ قسم تأجير السيارات ============
//     {
//       id: "carRental",
//       heroImage: "/image/hero_car.webp",
//       heroImageAlt: t("carRental.imageAlt"),
//       heroBadge: t("carRental.badge"),
//       heroTitle: t("carRental.title"),
//       heroDescription: t("carRental.description"),
//       heroCta: t("carRental.cta"),
//       sidebarLabel: t("carRental.sidebarLabel"),
//       featuredTitle: t("carRental.featuredTitle"),
//       featuredDescription: t("carRental.featuredDescription"),
//       featuredIcon: Fuel,
//       categories: [
//         {
//           icon: Car,
//           title: "اقتصادية",
//           description: "مناسبة للتنقل داخل المدينة",
//         },
//         { icon: Users, title: "عائلية", description: "7 ركاب فأكثر" },
//         {
//           icon: Car,
//           title: "فاخرة",
//           description: "سيارات مرسيدس وبي إم دبليو",
//         },
//       ],
//       offers: [
//         {
//           image: "/image/car_1.png",
//           badgeLabel: "أفضل عرض",
//           title: "Hyundai Elantra 2024",
//           subtitle: "أوتوماتيك · 5 ركاب",
//           priceFrom: 950,
//           priceUnit: "اليوم",
//           currency: "EGP",
//           ctaLabel: "احجز السيارة",
//         },
//         {
//           image: "/image/car_2.png",
//           badgeLabel: "الأكثر طلبًا",
//           title: "Toyota Fortuner 2023",
//           subtitle: "أوتوماتيك · 7 ركاب",
//           priceFrom: 2100,
//           priceUnit: "اليوم",
//           currency: "EGP",
//           ctaLabel: "احجز السيارة",
//         },
//         {
//           image: "/image/car_3.png",
//           badgeLabel: "فاخرة",
//           title: "Mercedes-Benz C200",
//           subtitle: "أوتوماتيك · 5 ركاب",
//           priceFrom: 3400,
//           priceUnit: "اليوم",
//           currency: "EGP",
//           ctaLabel: "احجز السيارة",
//         },
//         {
//           image: "/image/car_4.png",
//           badgeLabel: "اقتصادية",
//           title: "Chevrolet Optra 2023",
//           subtitle: "مانيوال · 5 ركاب",
//           priceFrom: 650,
//           priceUnit: "اليوم",
//           currency: "EGP",
//           ctaLabel: "احجز السيارة",
//         },
//       ],
//     },

//     // ============ قسم خدمات السفر ============
//     {
//       id: "travel",
//       heroImage: "/image/air_1.jpg",
//       heroImageAlt: t("travel.imageAlt"),
//       heroBadge: t("travel.badge"),
//       heroTitle: t("travel.title"),
//       heroDescription: t("travel.description"),
//       heroCta: t("travel.cta"),
//       sidebarLabel: t("travel.sidebarLabel"),
//       featuredTitle: t("travel.featuredTitle"),
//       featuredDescription: t("travel.featuredDescription"),
//       featuredIcon: Plane,
//       categories: [
//         {
//           icon: Luggage,
//           title: "استقبال من المطار",
//           description: "توصيل من المطار لأي مكان",
//         },
//         {
//           icon: Car,
//           title: "توصيل إلى المطار",
//           description: "احجز موعدك ووصل في الوقت",
//         },
//         {
//           icon: Ticket,
//           title: "حجز تذاكر الطيران",
//           description: "أفضل الأسعار للرحلات الداخلية والدولية",
//         },
//       ],
//       offers: [
//         {
//           image: "/image/travel_1.png",
//           badgeLabel: "الأكثر طلبًا",
//           title: "استقبال من مطار القاهرة",
//           subtitle: "سيارة خاصة · حتى 4 ركاب",
//           priceFrom: 350,
//           priceUnit: "الرحلة",
//           currency: "EGP",
//           ctaLabel: "احجز الاستقبال",
//         },
//         {
//           image: "/image/travel_2.png",
//           badgeLabel: "سريع",
//           title: "توصيل إلى مطار برج العرب",
//           subtitle: "سيارة خاصة · حتى 4 ركاب",
//           priceFrom: 400,
//           priceUnit: "الرحلة",
//           currency: "EGP",
//           ctaLabel: "احجز التوصيل",
//         },
//         {
//           image: "/image/travel_3.png",
//           badgeLabel: "عرض خاص",
//           title: "تذاكر طيران القاهرة - شرم الشيخ",
//           subtitle: "ذهاب وعودة",
//           priceFrom: 2800,
//           priceUnit: "التذكرة",
//           currency: "EGP",
//           ctaLabel: "احجز التذكرة",
//         },
//         {
//           image: "/image/travel_4.png",
//           badgeLabel: "دولي",
//           title: "تذاكر طيران القاهرة - دبي",
//           subtitle: "ذهاب وعودة",
//           priceFrom: 6200,
//           priceUnit: "التذكرة",
//           currency: "EGP",
//           ctaLabel: "احجز التذكرة",
//         },
//       ],
//     },
//   ];
// }
function useSections(): HeroSectionData[] {
  const t = useTranslations("HeroSections");

  return [
    // ============ قسم الفنادق والإقامات ============
    {
      id: "stays",
      heroImage: "/image/hero_2.jpg",
      heroImageAlt: t("stays.imageAlt"),
      heroBadge: t("stays.badge"),
      heroTitle: t("stays.title"),
      heroDescription: t("stays.description"),
      heroCta: t("stays.cta"),
      sidebarLabel: t("stays.sidebarLabel"),
      featuredTitle: t("stays.featuredTitle"),
      featuredDescriptionPrefix: t("stays.featuredDescriptionPrefix"),
      featuredPriceFrom: 4581,
      featuredPriceUnit: t("stays.offerCommon.priceUnit"),
      featuredIcon: Building2,
      categories: [
        {
          icon: Landmark,
          title: t("stays.categories.cairo.title"),
          description: t("stays.categories.cairo.description"),
        },
        {
          icon: Building2,
          title: t("stays.categories.alexandria.title"),
          description: t("stays.categories.alexandria.description"),
        },
        {
          icon: Waves,
          title: t("stays.categories.northCoast.title"),
          description: t("stays.categories.northCoast.description"),
        },
      ],
      offers: [
        {
          image: "/image/hotal_3.jpg",
          badgeLabel: t("stays.offerCommon.badgeLabel"),
          title: "Kempinski Nile Hotel Garden City",
          rating: 5,
          priceFrom: 7889.5,
          priceUnit: t("stays.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("stays.offerCommon.ctaLabel"),
        },
        {
          image: "/image/stay_1.png",
          badgeLabel: t("stays.offerCommon.badgeLabel"),
          title: "Al Masa Hotel Nasr City",
          rating: 5,
          priceFrom: 8144,
          priceUnit: t("stays.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("stays.offerCommon.ctaLabel"),
        },
        {
          image: "/image/hotal_2.jpg",
          badgeLabel: t("stays.offerCommon.badgeLabel"),
          title: "Pyramisa Suites Hotel Cairo",
          rating: 5,
          priceFrom: 6362.5,
          priceUnit: t("stays.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("stays.offerCommon.ctaLabel"),
        },
        {
          image: "/image/hotal_1.jpg",
          badgeLabel: t("stays.offerCommon.badgeLabel"),
          title: "Safir Cairo",
          rating: 5,
          priceFrom: 4581,
          priceUnit: t("stays.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("stays.offerCommon.ctaLabel"),
        },
      ],
    },

    // ============ قسم تأجير السيارات ============
    {
      id: "carRental",
      heroImage: "/image/hero_car.webp",
      heroImageAlt: t("carRental.imageAlt"),
      heroBadge: t("carRental.badge"),
      heroTitle: t("carRental.title"),
      heroDescription: t("carRental.description"),
      heroCta: t("carRental.cta"),
      sidebarLabel: t("carRental.sidebarLabel"),
      featuredTitle: t("carRental.featuredTitle"),
      featuredDescriptionPrefix: t("stays.featuredDescriptionPrefix"),
      featuredPriceFrom: 4581,
      featuredPriceUnit: t("stays.offerCommon.priceUnit"),
      featuredIcon: Fuel,
      categories: [
        {
          icon: Car,
          title: t("carRental.categories.economy.title"),
          description: t("carRental.categories.economy.description"),
        },
        {
          icon: Users,
          title: t("carRental.categories.family.title"),
          description: t("carRental.categories.family.description"),
        },
        {
          icon: Car,
          title: t("carRental.categories.luxury.title"),
          description: t("carRental.categories.luxury.description"),
        },
      ],
      offers: [
        {
          image: "/image/car_1.webp",
          badgeLabel: t("carRental.offers.hyundai.badgeLabel"),
          title: "Hyundai Elantra 2024",
          subtitle: t("carRental.offers.hyundai.subtitle"),
          priceFrom: 950,
          priceUnit: t("carRental.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("carRental.offerCommon.ctaLabel"),
        },
        {
          image: "/image/car_2.webp",
          badgeLabel: t("carRental.offers.fortuner.badgeLabel"),
          title: "Toyota Fortuner 2023",
          subtitle: t("carRental.offers.fortuner.subtitle"),
          priceFrom: 2100,
          priceUnit: t("carRental.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("carRental.offerCommon.ctaLabel"),
        },
        {
          image: "/image/car_3.jfif",
          badgeLabel: t("carRental.offers.mercedes.badgeLabel"),
          title: "Mercedes-Benz C200",
          subtitle: t("carRental.offers.mercedes.subtitle"),
          priceFrom: 3400,
          priceUnit: t("carRental.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("carRental.offerCommon.ctaLabel"),
        },
        {
          image: "/image/car_4.jpg",
          badgeLabel: t("carRental.offers.optra.badgeLabel"),
          title: "Chevrolet Optra 2023",
          subtitle: t("carRental.offers.optra.subtitle"),
          priceFrom: 650,
          priceUnit: t("carRental.offerCommon.priceUnit"),
          currency: "EGP",
          ctaLabel: t("carRental.offerCommon.ctaLabel"),
        },
      ],
    },

    // ============ قسم خدمات السفر ============
    {
      id: "travel",
      heroImage: "/image/air_1.jpg",
      heroImageAlt: t("travel.imageAlt"),
      heroBadge: t("travel.badge"),
      heroTitle: t("travel.title"),
      heroDescription: t("travel.description"),
      heroCta: t("travel.cta"),
      sidebarLabel: t("travel.sidebarLabel"),
      featuredTitle: t("travel.featuredTitle"),
      featuredDescriptionPrefix: t("stays.featuredDescriptionPrefix"),
      featuredPriceFrom: 4581,
      featuredPriceUnit: t("stays.offerCommon.priceUnit"),
      featuredIcon: Plane,
      categories: [
        {
          icon: Luggage,
          title: t("travel.categories.pickup.title"),
          description: t("travel.categories.pickup.description"),
        },
        {
          icon: Car,
          title: t("travel.categories.dropoff.title"),
          description: t("travel.categories.dropoff.description"),
        },
        {
          icon: Ticket,
          title: t("travel.categories.tickets.title"),
          description: t("travel.categories.tickets.description"),
        },
      ],
      offers: [
        {
          image: "/image/air_1.jpg",
          badgeLabel: t("travel.offers.cairoPickup.badgeLabel"),
          title: t("travel.offers.cairoPickup.title"),
          subtitle: t("travel.offers.cairoPickup.subtitle"),
          priceFrom: 350,
          priceUnit: t("travel.offers.cairoPickup.priceUnit"),
          currency: "EGP",
          ctaLabel: t("travel.offers.cairoPickup.ctaLabel"),
        },
        {
          image: "/image/air_2.jfif",
          badgeLabel: t("travel.offers.borgElArabDropoff.badgeLabel"),
          title: t("travel.offers.borgElArabDropoff.title"),
          subtitle: t("travel.offers.borgElArabDropoff.subtitle"),
          priceFrom: 400,
          priceUnit: t("travel.offers.borgElArabDropoff.priceUnit"),
          currency: "EGP",
          ctaLabel: t("travel.offers.borgElArabDropoff.ctaLabel"),
        },
        {
          image: "/image/air_3.jpg",
          badgeLabel: t("travel.offers.sharmTickets.badgeLabel"),
          title: t("travel.offers.sharmTickets.title"),
          subtitle: t("travel.offers.sharmTickets.subtitle"),
          priceFrom: 2800,
          priceUnit: t("travel.offers.sharmTickets.priceUnit"),
          currency: "EGP",
          ctaLabel: t("travel.offers.sharmTickets.ctaLabel"),
        },
        {
          image: "/image/air_4.jpeg",
          badgeLabel: t("travel.offers.dubaiTickets.badgeLabel"),
          title: t("travel.offers.dubaiTickets.title"),
          subtitle: t("travel.offers.dubaiTickets.subtitle"),
          priceFrom: 6200,
          priceUnit: t("travel.offers.dubaiTickets.priceUnit"),
          currency: "EGP",
          ctaLabel: t("travel.offers.dubaiTickets.ctaLabel"),
        },
      ],
    },
  ];
}

function HeroSlide({ section }: { section: HeroSectionData }) {
  const sectionHref =
    section.id === "carRental"
      ? "/feature/lemozeen"
      : section.id === "stays"
        ? "/feature/stays"
        : "/feature/fast-track";

  return (
    <div className="grid gap-4 lg:grid-cols-[1.7fr_0.85fr] xl:grid-cols-[1.7fr_0.85fr_250px]">
      <div className="order-1">
        <StaysHero
          image={section.heroImage}
          imageAlt={section.heroImageAlt}
          badge={section.heroBadge}
          title={section.heroTitle}
          description={section.heroDescription}
          cta={section.heroCta}
        />
      </div>

      <div className="order-2 grid grid-cols-2 gap-2">
        {section.offers.map((offer) => (
          <HotelCard
            key={offer.title}
            {...offer}
            bookingHref={
              section.id === "carRental"
                ? "/feature/lemozeen/2/booking"
                : section.id === "stays"
                  ? "/feature/stays"
                  : "/feature/fast-track"
            }
          />
        ))}
      </div>

      <div className="order-3 lg:col-span-2 xl:col-span-1">
        <CategorySidebar
          label={section.sidebarLabel}
          featuredTitle={section.featuredTitle}
          featuredDescriptionPrefix={section.featuredDescriptionPrefix}
          featuredPriceFrom={section.featuredPriceFrom}
          featuredPriceUnit={section.featuredPriceUnit}
          featuredIcon={section.featuredIcon}
          featuredHref={sectionHref}
          categories={section.categories.map((category) => ({
            ...category,
            href: sectionHref,
          }))}
        />
      </div>
    </div>
  );
}

export default function Hero_top_home() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const sections = useSections();

  return (
    <div className="  p-4 md:p-6">
      <Carousel
        opts={{
          direction: isArabic ? "rtl" : "ltr",
          align: "start",
        }}
        className="w-full"
      >
        <CarouselContent>
          {sections.map((section) => (
            <CarouselItem key={section.id}>
              <HeroSlide section={section} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-4 flex items-center justify-center gap-9">
          <CarouselNext className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />
          <CarouselPrevious className="static h-8 w-8 translate-x-0 translate-y-0 border-white/10 bg-[#101d33] text-white hover:bg-[#152441]" />
        </div>
      </Carousel>
    </div>
  );
}
