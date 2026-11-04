import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Bonjour ! Je suis</h2>
            <h1>
              SANTATRA
              <br />
              <span>MICHADO</span>
            </h1>
          </div>

          <div className="landing-info">
            <h3>Développeur Fullstack</h3>

            <h2 className="landing-info-h2">
              <div className="landing-h2-1">React</div>
              <div className="landing-h2-2">Laravel</div>
            </h2>

            <h2>
              <div className="landing-h2-info">Vue.js</div>
              <div className="landing-h2-info-1">WordPress</div>
            </h2>
          </div>
        </div>

        {children}
      </div>
    </>
  );
};

export default Landing;
