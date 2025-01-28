import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

function About() {
  useEffect(() => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);

    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={["cat about_me.txt"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </div>

      <div className="content-section hero animate-fade-in">
        <h1>Rejebov Arslan</h1>
        <p className="title">Python/Django Developer</p>
        <div className="contact-info">
          <a href="tel:+86155293315711" aria-label="Phone">
            <i className="fas fa-phone"></i>
            <span className="contact-text">+86 155 2933 1571</span>
          </a>
          <a href="mailto:arslanrejepow223@gmail.com" aria-label="Email">
            <i className="fas fa-envelope"></i>
            <span className="contact-text">arslanrejepow223@gmail.com</span>
          </a>
          <a
            href="https://github.com/leen2233"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <i className="fab fa-github"></i>
            <span className="contact-text">github.com/leen2233</span>
          </a>
        </div>
      </div>

      <div className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={[1000, "./show_experience.sh"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </div>

      <div
        className="content-section experience"
        role="region"
        aria-label="Experience"
      >
        <div className="career-path">
          {/* Current Role */}
          <div className="experience-step current">
            <div className="step-marker" data-date="2024"></div>
            <div className="experience-content">
              <h3>Backend Developer @ Galkyn Inc.</h3>
              <span className="work-type">Remote</span>
              <div className="duration">May 2024–Current</div>
              <div className="role-details">
                • Built backend services for yolugry.com, ensuring scalability.
                • Designed RESTful APIs for frontend/external integrations. •
                Improved system responsiveness using Celery and Redis. •
                Achieved 15% performance boost via database/architecture
                optimizations.
              </div>
            </div>
          </div>

          {/* Past Roles */}
          <div className="experience-step past">
            <div className="step-marker" data-date="2023"></div>
            <div className="experience-content">
              <h3>Full Stack Developer @ Peydalan</h3>
              <span className="work-type">Hybrid</span>
              <div className="duration">Sep 2023–May 2024</div>
              <div className="role-details">
                • Redesigned architecture for Peydalan.com.tm, improving
                performance and UX by 20%. • Full-stack development with Django
                (backend) and React (frontend). • Reduced load times by 30%
                through query optimization.
              </div>
            </div>
          </div>

          <div className="experience-step past">
            <div className="step-marker" data-date="2022"></div>
            <div className="experience-content">
              <h3>Backend Developer @ Gozle LLC</h3>
              <span className="work-type">Remote</span>
              <div className="duration">Nov 2022–Sep 2023</div>
              <div className="role-details">
                • Developed high-availability services: Gozle Video, Gozle ID,
                and Gozle News. • Focused on security and system reliability.
              </div>
            </div>
          </div>

          <div className="experience-step past">
            <div className="step-marker" data-date="2021"></div>
            <div className="experience-content">
              <h3>Full Stack Developer @ Yakynyol</h3>
              <span className="work-type">On-site</span>
              <div className="duration">Sep 2021–Nov 2022</div>
              <div className="role-details">
                • Enhanced client-side interfaces and backend systems for
                various projects.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={[2000, "./display_skills.sh"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </div>

      <div
        className="content-section skills animate-slide-in"
        role="region"
        aria-label="Skills"
      >
        <div className="skills-container">
          <div className="skills-category">
            <div className="skills-category-title">Languages</div>
            <div className="skills-list">
              <span className="skill-item">Python</span>
              <span className="skill-item">JavaScript</span>
            </div>
          </div>

          <div className="skills-category">
            <div className="skills-category-title">Frameworks</div>
            <div className="skills-list">
              <span className="skill-item">Django</span>
              <span className="skill-item">React</span>
            </div>
          </div>

          <div className="skills-category">
            <div className="skills-category-title">Databases</div>
            <div className="skills-list">
              <span className="skill-item">PostgreSQL</span>
              <span className="skill-item">MySQL</span>
            </div>
          </div>

          <div className="skills-category">
            <div className="skills-category-title">Tools</div>
            <div className="skills-list">
              <span className="skill-item">Git</span>
              <span className="skill-item">Linux</span>
              <span className="skill-item">Celery</span>
              <span className="skill-item">Redis</span>
            </div>
          </div>

          <div className="skills-category">
            <div className="skills-category-title">Expertise</div>
            <div className="skills-list">
              <span className="skill-item">RESTful API Development</span>
              <span className="skill-item">System Architecture Design</span>
              <span className="skill-item">Asynchronous Task Management</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default About;
