import { useEffect, useState } from "react";

export default function NotFoundAnimation() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-32 h-32 mx-auto mb-8">
      <div
        className={`absolute inset-0 rounded-full bg-primary/10 transition-all duration-700 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`absolute inset-2 rounded-full bg-primary/20 transition-all duration-700 delay-100 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`absolute inset-4 rounded-full bg-primary/30 transition-all duration-700 delay-200 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      />
      <div
        className={`absolute inset-6 flex items-center justify-center rounded-full bg-primary transition-all duration-700 delay-300 ease-in-out ${
          isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
        }`}
      >
        <span className="text-white font-bold text-2xl">404</span>
      </div>
    </div>
  );
}
