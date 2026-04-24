import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          Mon expérience <span>&</span>
          <br />
          carrière
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Développeur Web</h4>
                <h5>Maki Service SARLU</h5>
              </div>
              <h3>2024</h3>
            </div>
            <p>
              Développement de sites web et applications avec WordPress, Elementor, HTML, CSS, JavaScript, Vue.js et React. Gestion de projets clients et intégration de fonctionnalités personnalisées.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Freelance</h4>
                <h5>Formation et Nouvelles Technologies</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Période de transition vers de nouvelles technologies et de renforcement des compétences en infrastructure web, Docker et déploiement de projets d'envergure.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Développeur Web</h4>
                <h5>Bex Digital</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Développement web avancé avec WordPress, Elementor, HTML, CSS et JavaScript. Gestion d'infrastructure VPS et containerisation avec Docker. Création de sites responsifs et performants.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
