import { Composition, Still } from "remotion";
import { LaunchThumbnail, MaxPortfolioLaunch } from "./MaxPortfolioLaunch";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="MaxPortfolioLaunch"
        component={MaxPortfolioLaunch}
        durationInFrames={750}
        fps={30}
        width={1920}
        height={1080}
      />
      <Still
        id="MaxPortfolioLaunchThumbnail"
        component={LaunchThumbnail}
        width={1920}
        height={1080}
      />
    </>
  );
};
