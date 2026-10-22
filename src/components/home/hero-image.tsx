import ExpandingImage from "@/components/expanding-image";
import { hero } from "@/data/hero";

function HeroImage() {
  const { image } = hero;

  return (
    <ExpandingImage
      desktop={image.desktop}
      mobile={image.mobile}
      alt={image.alt}
      className="h-[60vh] max-h-225 md:h-[85vh]"
    />
  );
}

export default HeroImage;
