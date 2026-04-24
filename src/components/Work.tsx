import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const Work = () => {
  useGSAP(() => {
  let translateX: number = 0;

  function setTranslateX() {
    const box = document.getElementsByClassName("work-box");
    const rectLeft = document
      .querySelector(".work-container")!
      .getBoundingClientRect().left;
    const rect = box[0].getBoundingClientRect();
    const parentWidth = box[0].parentElement!.getBoundingClientRect().width;
    let padding: number =
      parseInt(window.getComputedStyle(box[0]).padding) / 2;
    translateX = rect.width * box.length - (rectLeft + parentWidth) + padding;
  }

  setTranslateX();

  let timeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".work-section",
      start: "top top",
      end: `+=${translateX}`, // Use actual scroll width
      scrub: true,
      pin: true,
      id: "work",
    },
  });

  timeline.to(".work-flex", {
    x: -translateX,
    ease: "none",
  });

  // Clean up (optional, good practice)
  return () => {
    timeline.kill();
    ScrollTrigger.getById("work")?.kill();
  };
}, []);
  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Mes <span>
portfolios</span>
        </h2>
        <div className="work-flex">
          {/* <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>01</h3>
                <div>
                  <h4>Artiist</h4>
                  <p>Portfolio Créatif</p>
                </div>
              </div>
              <h4>Outils et Fonctionnalités</h4>
              <p>WordPress, Elementor, HTML, CSS, JavaScript</p>
            </div>
            <WorkImage image="https://res.cloudinary.com/de03l56z6/image/upload/v1776951878/artiist_1_ik88vl_w7nmzj.jpg" alt="Artiist" />
          </div> */}
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>02</h3>
                <div>
                  <h4>Robin Ruth</h4>
                  <p>Site Web Professionnel</p>
                </div>
              </div>
              <h4>Outils et Fonctionnalités</h4>
              <p>WordPress, Elementor, HTML, CSS, JavaScript</p>
            </div>
            <WorkImage image="https://res.cloudinary.com/de03l56z6/image/upload/v1776951670/rr_ngvcyf.png" alt="Robin Ruth" />
          </div>
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>03</h3>
                <div>
                  <h4>Mada Digital</h4>
                  <p>Agence Digitale</p>
                </div>
              </div>
              <h4>Outils et Fonctionnalités</h4>
              <p>React, Next.js, JavaScript, TypeScript, CSS</p>
            </div>
            <WorkImage image="https://res.cloudinary.com/de03l56z6/image/upload/v1776951760/mda-1_yyrvzg.png" alt="Mada Digital" />
          </div>
          <div className="work-box">
            <div className="work-info">
              <div className="work-title">
                <h3>04</h3>
                <div>
                  <h4>Createak</h4>
                  <p>Création Web</p>
                </div>
              </div>
              <h4>Outils et Fonctionnalités</h4>
              <p>WordPress, Elementor, HTML, CSS, JavaScript</p>
            </div>
            <WorkImage image="https://res.cloudinary.com/de03l56z6/image/upload/v1776951560/createak_aal1kl.png" alt="Createak" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
