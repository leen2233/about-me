import { TypeAnimation } from "react-type-animation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import projects from "../../data";

function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const toggleDetails = (project) => {
    if (selectedProject?.name === project.name) {
      setSelectedProject(null);
    } else {
      setSelectedProject(project);
    }
  };

  return (
    <main>
      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          sequence={["ls -l ~/projects/"]}
          wrapper="span"
          speed={50}
          className="command-text"
          cursor={false}
        />
      </section>

      <section className="content-section projects animate-fade-in">
        <div
          className="terminal-output"
          itemScope
          itemType="http://schema.org/CollectionPage"
        >
          <meta itemProp="name" content="Portfolio Projects" />
          <meta
            itemProp="description"
            content="Collection of software development projects by Rejebov Arslan"
          />

          {projects.map((project) => (
            <article
              className="project-entry"
              key={project.name}
              itemScope
              itemType="http://schema.org/SoftwareSourceCode"
            >
              <meta
                itemProp="programmingLanguage"
                content="Python, JavaScript, React"
              />
              <meta itemProp="author" content="Rejebov Arslan" />

              <span className={`project-status ${project.status}`}>
                [{project.status}]
              </span>
              <span className="project-date" itemProp="dateCreated">
                {project.date}
              </span>
              <span className="project-name">
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="codeRepository"
                >
                  {project.name}
                </a>
              </span>
              <span className="project-description">
                {project.live && (
                  <div>
                    <a
                      href={project.live}
                      itemProp="url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {project.live}
                    </a>
                  </div>
                )}
                <span itemProp="description">{project.description}</span>
                <button
                  className={`view-details ${
                    selectedProject?.name === project.name ? "active" : ""
                  }`}
                  onClick={() => toggleDetails(project)}
                  aria-expanded={selectedProject?.name === project.name}
                  aria-controls={`details-${project.name}`}
                >
                  [{selectedProject?.name === project.name ? "close" : "view"}{" "}
                  details]
                </button>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="command-section">
        <span className="prompt">$ </span>
        <TypeAnimation
          key={selectedProject ? selectedProject.name : "default"}
          sequence={[
            selectedProject
              ? `cat ~/projects/${selectedProject.name}/README.md`
              : "cat ~/projects/README.md",
          ]}
          wrapper="span"
          speed={60}
          className="command-text"
          cursor={false}
        />
      </section>

      {selectedProject && (
        <section
          className="content-section project-details animate-fade-in"
          id={`details-${selectedProject.name}`}
          aria-label={`Details for ${selectedProject.name}`}
        >
          <ReactMarkdown
            className="details-text"
            components={{
              h1: ({ node, ...props }) => <h1 itemProp="name" {...props} />,
              p: ({ node, ...props }) => <p itemProp="text" {...props} />,
              a: ({ node, ...props }) => (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  itemProp="url"
                  {...props}
                />
              ),
            }}
          >
            {selectedProject.details}
          </ReactMarkdown>
        </section>
      )}
    </main>
  );
}

export default Projects;
