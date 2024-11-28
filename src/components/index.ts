import BackgroundNoise from "./BackgroundNoise/BackgroundNoise";
import GridBase from "./Grid/GridBase/GridBase";
import InjectedContent from "./InjectedContent/InjectedContent";
import HeroImage from "./HeroImage/HeroImage";

export default function init() {
  GridBase();
  BackgroundNoise();
  InjectedContent();
  HeroImage();
}
