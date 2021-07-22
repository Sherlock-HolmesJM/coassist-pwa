import Lottie from "lottie-react";
import { getAnim } from "../../utils/getAnim";

export interface LottieWrapProps {
  className?: string;
  data: any;
  display: boolean;
}

const LottieWrap: React.FC<LottieWrapProps> = ({
  data,
  className,
  display,
}) => {
  if (!display) return null;

  return (
    <Lottie
      className={className}
      animationData={data}
      loop={false}
      data-aos={getAnim("fade-down")}
      data-aos-delay={100}
    />
  );
};

export default LottieWrap;
