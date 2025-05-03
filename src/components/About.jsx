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
    <main>
      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={["cat about_me.txt"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </section>

      <section className="content-section hero animate-fade-in">
        <h1 itemProp="name">Rejebov Arslan</h1>
        <p className="title" itemProp="jobTitle">
          Python/Django Developer
        </p>
        <div
          className="contact-info"
          itemScope
          itemType="http://schema.org/Person"
        >
          <meta itemProp="name" content="Rejebov Arslan" />
          <meta itemProp="jobTitle" content="Python/Django Developer" />
          <a href="tel:+86155293315711" aria-label="Phone" itemProp="telephone">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <span className="contact-text">+86 155 2933 1571</span>
          </a>
          <a
            href="mailto:arslanrejepow223@gmail.com"
            aria-label="Email"
            itemProp="email"
          >
            <i className="fas fa-envelope" aria-hidden="true"></i>
            <span className="contact-text">arslanrejepow223@gmail.com</span>
          </a>
          <a
            href="https://github.com/leen2233"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            itemProp="sameAs"
          >
            <i className="fab fa-github" aria-hidden="true"></i>
            <span className="contact-text">github.com/leen2233</span>
          </a>
        </div>
      </section>

      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={[1000, "./show_experience.sh"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </section>

      <section
        className="content-section experience"
        role="region"
        aria-label="Work Experience"
      >
        <div
          className="career-path"
          itemScope
          itemType="http://schema.org/ItemList"
        >
          {/* Current Role */}
          <article
            className="experience-step current"
            itemScope
            itemType="http://schema.org/WorkPosition"
          >
            <div className="step-marker" data-date="2024"></div>
            <div className="experience-content">
              <h3 itemProp="jobTitle">Backend Developer @ Galkyn Inc.</h3>
              <span className="work-type">Remote</span>
              <div className="duration" itemProp="dateRange">
                May 2024–Current
              </div>
              <div className="role-details" itemProp="description">
                • Built backend services for yolugry.com, ensuring scalability.
                • Designed RESTful APIs for frontend/external integrations. •
                Improved system responsiveness using Celery and Redis. •
                Achieved 15% performance boost via database/architecture
                optimizations.
              </div>
            </div>
          </article>

          {/* Past Roles */}
          <article
            className="experience-step past"
            itemScope
            itemType="http://schema.org/WorkPosition"
          >
            <div className="step-marker" data-date="2023"></div>
            <div className="experience-content">
              <h3 itemProp="jobTitle">Full Stack Developer @ Peydalan</h3>
              <span className="work-type">Hybrid</span>
              <div className="duration" itemProp="dateRange">
                Sep 2023–May 2024
              </div>
              <div className="role-details" itemProp="description">
                • Redesigned architecture for Peydalan.com.tm, improving
                performance and UX by 20%. • Full-stack development with Django
                (backend) and React (frontend). • Reduced load times by 30%
                through query optimization.
              </div>
            </div>
          </article>

          <article
            className="experience-step past"
            itemScope
            itemType="http://schema.org/WorkPosition"
          >
            <div className="step-marker" data-date="2022"></div>
            <div className="experience-content">
              <h3 itemProp="jobTitle">Backend Developer @ Gozle LLC</h3>
              <span className="work-type">Remote</span>
              <div className="duration" itemProp="dateRange">
                Nov 2022–Sep 2023
              </div>
              <div className="role-details" itemProp="description">
                • Developed high-availability services: Gozle Video, Gozle ID,
                and Gozle News. • Focused on security and system reliability.
              </div>
            </div>
          </article>

          <article
            className="experience-step past"
            itemScope
            itemType="http://schema.org/WorkPosition"
          >
            <div className="step-marker" data-date="2021"></div>
            <div className="experience-content">
              <h3 itemProp="jobTitle">Full Stack Developer @ Yakynyol</h3>
              <span className="work-type">On-site</span>
              <div className="duration" itemProp="dateRange">
                Sep 2021–Nov 2022
              </div>
              <div className="role-details" itemProp="description">
                • Enhanced client-side interfaces and backend systems for
                various projects.
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={[2000, "./display_skills.sh"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </section>

      <section
        className="content-section skills animate-slide-in"
        role="region"
        aria-label="Skills"
        itemScope
        itemType="http://schema.org/ItemList"
      >
        <div className="skills-container">
          <div className="skills-category">
            <h2 className="skills-category-title">Languages</h2>
            <div className="skills-list">
              <span className="skill-item" itemProp="itemListElement">
                Python
              </span>
              <span className="skill-item" itemProp="itemListElement">
                JavaScript
              </span>
            </div>
          </div>

          <div className="skills-category">
            <h2 className="skills-category-title">Frameworks</h2>
            <div className="skills-list">
              <span className="skill-item" itemProp="itemListElement">
                Django
              </span>
              <span className="skill-item" itemProp="itemListElement">
                React
              </span>
            </div>
          </div>

          <div className="skills-category">
            <h2 className="skills-category-title">Databases</h2>
            <div className="skills-list">
              <span className="skill-item" itemProp="itemListElement">
                PostgreSQL
              </span>
              <span className="skill-item" itemProp="itemListElement">
                MySQL
              </span>
            </div>
          </div>

          <div className="skills-category">
            <h2 className="skills-category-title">Tools</h2>
            <div className="skills-list">
              <span className="skill-item" itemProp="itemListElement">
                Git
              </span>
              <span className="skill-item" itemProp="itemListElement">
                Linux
              </span>
              <span className="skill-item" itemProp="itemListElement">
                Celery
              </span>
              <span className="skill-item" itemProp="itemListElement">
                Redis
              </span>
            </div>
          </div>

          <div className="skills-category">
            <h2 className="skills-category-title">Expertise</h2>
            <div className="skills-list">
              <span className="skill-item" itemProp="itemListElement">
                RESTful API Development
              </span>
              <span className="skill-item" itemProp="itemListElement">
                System Architecture Design
              </span>
              <span className="skill-item" itemProp="itemListElement">
                Asynchronous Task Management
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
