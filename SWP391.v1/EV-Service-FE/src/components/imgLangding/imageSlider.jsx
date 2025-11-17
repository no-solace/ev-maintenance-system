// src/components/ImageSlider.jsx
import { useState } from "react";

// Mảng chứa đường dẫn ảnh và alt text
const images = [
 
  "/images/Technician_1.png",
  "/images/Technician.png",
  "/images/ky-thuat-xe-dien.png",
  "/images/Technician_2.png",
  "/images/gioi-thieu-ev.png",
];

export default function ImageSlider() {
  const [current, setCurrent] = useState(0); // Quản lý ảnh đang hiển thị

  // Chuyển về ảnh trước
  const prevSlide = () =>
    setCurrent((current - 1 + images.length) % images.length);

  // Chuyển sang ảnh tiếp theo
  const nextSlide = () =>
    setCurrent((current + 1) % images.length);

  return (
    <div className="relative max-w-screen-xl mx-auto h-[400px] overflow-hidden shadow-xl rounded-xl">
      {/* Ảnh hiện tại */}
      <img
        src={images[current]}
        alt={`Kỹ thuật viên ${current + 1}`}
        className="w-full h-full object-cover transition-transform duration-500"
      />

      {/* Nút chuyển về ảnh trước */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ‹
      </button>

      {/* Nút chuyển sang ảnh tiếp theo */}
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        ›
      </button>
    </div>
  );
}
