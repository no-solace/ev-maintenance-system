import { useState, useEffect } from "react";

// Danh sách 4 ảnh background
const bgImages = [
  "/images/gioi-thieu-6.png",
  "/images/gioi-thieu-2.png",
  "/images/gioi-thieu-3.png",
  "/images/gioi-thieu-5.png",
];

export default function ImageSlider_1() {
  const [current, setCurrent] = useState(0);

  // Auto chạy
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[700px] overflow-hidden">
      {/* Ảnh nền */}
      {bgImages.map((img, index) => (
        <div
          key={index}
          className={`
            absolute inset-0
            bg-cover bg-center bg-no-repeat
            transition-opacity duration-1000 ease-in-out
            ${index === current ? "opacity-100" : "opacity-0"}
          `}
          style={{ backgroundImage: `url(${img})` }}
        ></div>
      ))}

      {/* Dấu chấm indicator có thể bấm */}
      <div className="absolute bottom-5 w-full flex justify-center space-x-2">
        {bgImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === current ? "bg-white" : "bg-gray-400 hover:bg-gray-500"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
