import { useEffect, useState } from "react";

export const useWindowWidth = () => {
  const [width, setWidth] = useState<undefined | number>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;

    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};
