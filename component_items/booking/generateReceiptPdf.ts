import jsPDF from "jspdf";
import { format } from "date-fns";
import { cairoFontBase64 } from "./cairoFont";

interface ReceiptData {
  bookingRef: string;
  hotelName: string;
  roomName: string;
  hotelStars: number;
  checkIn: Date | null;
  checkOut: Date | null;
  nights: number;
  adults: number;
  children: number;
  totalPrice: number;
  currency: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestCountry: string;
}

// كشف بسيط: لو النص فيه حروف عربية، هنستخدم خط Cairo بدل الافتراضي
function isArabic(text: string) {
  return /[\u0600-\u06FF]/.test(text);
}

export function generateReceiptPdf(data: ReceiptData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // تسجيل خط Cairo مرة واحدة في بداية الملف
  doc.addFileToVFS("Cairo-Regular.ttf", cairoFontBase64);
  doc.addFont("Cairo-Regular.ttf", "Cairo", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  let y = 60;

  // دالة مساعدة: تكتب أي نص بالخط المناسب تلقائيًا (Cairo لو عربي، الافتراضي لو إنجليزي)
  const writeText = (text: string, x: number, yPos: number, options?: any) => {
    if (isArabic(text)) {
      doc.setFont("Cairo", "normal");
    } else {
      doc.setFont("helvetica", "normal");
    }
    doc.text(text, x, yPos, options);
  };

  // شعار مسار
  doc.setFontSize(22);
  doc.setTextColor(217, 119, 6);
  writeText("Masar", marginX, y);

  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  writeText("Booking Receipt", marginX, y + 18);

  y += 50;
  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 30;

  // رقم الحجز
  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  writeText("Booking Reference", marginX, y);
  doc.setFontSize(13);
  doc.setTextColor(20, 20, 20);
  writeText(data.bookingRef, marginX, y + 16);
  y += 45;

  // اسم الفندق
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  writeText(data.hotelName, marginX, y);
  y += 18;

  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  writeText(`${data.hotelStars}-star hotel  |  ${data.roomName}`, marginX, y);
  y += 35;

  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 30;

  // التواريخ
  const checkInStr = data.checkIn ? format(data.checkIn, "d MMMM yyyy") : "-";
  const checkOutStr = data.checkOut
    ? format(data.checkOut, "d MMMM yyyy")
    : "-";
  const col2X = pageWidth / 2 + 20;

  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  writeText("Check-in", marginX, y);
  writeText("Check-out", col2X, y);

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  writeText(checkInStr, marginX, y + 16);
  writeText(checkOutStr, col2X, y + 16);
  y += 45;

  doc.setFontSize(10);
  doc.setTextColor(140, 140, 140);
  writeText("Nights", marginX, y);
  writeText("Guests", col2X, y);

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  writeText(String(data.nights), marginX, y + 16);
  writeText(
    `${data.adults} adults${data.children > 0 ? `, ${data.children} children` : ""}`,
    col2X,
    y + 16,
  );
  y += 45;

  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 30;

  // بيانات الضيف
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  writeText("Guest Details", marginX, y);
  y += 20;

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  writeText(data.guestName, marginX, y);
  y += 16;
  writeText(data.guestEmail, marginX, y);
  y += 16;
  writeText(data.guestPhone, marginX, y);
  y += 16;
  writeText(data.guestCountry, marginX, y);
  y += 40;

  doc.setDrawColor(230, 230, 230);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 35;

  // الإجمالي
  doc.setFontSize(11);
  doc.setTextColor(140, 140, 140);
  writeText("Total Paid", marginX, y);

  doc.setFontSize(20);
  doc.setTextColor(217, 119, 6);
  writeText(
    `${data.totalPrice.toLocaleString()} ${data.currency}`,
    pageWidth - marginX,
    y,
    { align: "right" },
  );
  y += 50;

  // فوتر
  doc.setFontSize(9);
  doc.setTextColor(160, 160, 160);
  writeText(
    "Thank you for booking with Masar.",
    marginX,
    doc.internal.pageSize.getHeight() - 40,
  );

  doc.save(`masar-receipt-${data.bookingRef}.pdf`);
}
