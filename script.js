const portfolio = {
  githubUsername: "frvargasu",
  featuredProject: {
    name: "Tarimas Count",
    url: "https://github.com/frvargasu/tarimas-count",
    demoUrl: "https://tarimas-count.vercel.app",
    description:
      "Proyecto personal para la gestión y el conteo de tarimas. Explora el código en GitHub o prueba la demo.",
    technologies: ["Angular", "Ionic", "Capacitor", "Dexie"],
  },
  stack: [
    { category: "Frontend", technologies: ["Angular", "TypeScript", "JavaScript"] },
    { category: "Desarrollo móvil", technologies: ["Ionic", "Capacitor"] },
    { category: "Backend y APIs", technologies: ["Node.js", "Express", "JWT", "APIs REST"] },
    { category: "Bases de datos", technologies: ["MySQL", "SQL", "Modelado de datos"] },
    { category: "Herramientas", technologies: ["Git", "GitHub"] },
    {
      id: "learning-stack-card",
      category: "Aprendiendo ahora",
      description: "Desde cero, con Copilot e inteligencia artificial.",
      technologies: ["Power BI", "DAX", "Power Query", "Copilot", "IA"],
    },
  ],
};

const stackList = document.querySelector("#stack-list");
const projectsList = document.querySelector("#projects-list");
const githubNote = document.querySelector("#github-note");
const githubLinks = document.querySelectorAll(".github-link");

function renderStack() {
  stackList.innerHTML = portfolio.stack
    .map(
      ({ id, category, description, technologies }) => `
        <article class="stack-card"${id ? ` id="${id}"` : ""}>
          <h3>${category}</h3>
          ${description ? `<p class="stack-description">${description}</p>` : ""}
          <div class="stack-tags">
            ${technologies.map((technology) => `<span class="stack-tag">${technology}</span>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function highlightLearningStack() {
  const learningCard = document.querySelector("#learning-stack-card");
  learningCard.classList.remove("learning-highlight");
  requestAnimationFrame(() => learningCard.classList.add("learning-highlight"));
}

function renderProjects(repositories) {
  if (repositories.length === 0) {
    projectsList.innerHTML = renderFeaturedProject();
    return;
  }

  const otherRepositories = repositories
    .filter((repository) => repository.full_name.toLowerCase() !== "frvargasu/tarimas-count")
    .slice(0, 5);

  projectsList.innerHTML = otherRepositories
    .map(
      (repository) => `
        <a class="project-card" href="${repository.html_url}" target="_blank" rel="noreferrer">
          <div class="project-topline">
            <span>REPOSITORIO PÚBLICO</span>
            <span class="project-icon" aria-hidden="true">↗</span>
          </div>
          <h3>${escapeHTML(repository.name)}</h3>
          <p class="project-description">${escapeHTML(repository.description || "Proyecto personal disponible en GitHub.")}</p>
          <div class="project-meta">
            <span class="project-language">${repository.language ? `<span class="language-dot"></span>${escapeHTML(repository.language)}` : "Código abierto"}</span>
            <span>★ ${repository.stargazers_count}</span>
          </div>
        </a>
      `,
    )
    .join("");
  projectsList.insertAdjacentHTML("afterbegin", renderFeaturedProject());
}

function renderFeaturedProject() {
  const project = portfolio.featuredProject;
  return `
    <article class="project-card featured-project">
      <div class="project-topline">
        <span>PROYECTO DESTACADO</span>
        <span class="project-icon" aria-hidden="true">✳</span>
      </div>
      <h3>${escapeHTML(project.name)}</h3>
      <p class="project-description">${escapeHTML(project.description)}</p>
      <div class="project-tech-list">
        ${project.technologies.map((technology) => `<span>${escapeHTML(technology)}</span>`).join("")}
      </div>
      <div class="project-meta">
        <a href="${project.url}" target="_blank" rel="noreferrer">GitHub ↗</a>
        <a class="project-demo" href="${project.demoUrl}" target="_blank" rel="noreferrer">Ver demo ↗</a>
      </div>
    </article>
  `;
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

async function loadGitHubProjects() {
  const username = portfolio.githubUsername.trim();
  if (!username) return;

  const profileUrl = `https://github.com/${encodeURIComponent(username)}`;
  githubLinks.forEach((link) => {
    link.href = profileUrl;
  });

  try {
    const response = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100`,
    );

    if (!response.ok) {
      throw new Error(`GitHub respondió con estado ${response.status}`);
    }

    const repositories = await response.json();
    renderProjects(repositories.filter((repository) => !repository.fork && repository.size > 0));
    githubNote.textContent = `Proyectos públicos de @${username}, cargados desde GitHub.`;
  } catch (error) {
    projectsList.innerHTML = renderFeaturedProject();
    githubNote.textContent = error instanceof Error ? error.message : "No se pudieron cargar los proyectos de GitHub.";
  }
}

renderStack();
document.querySelector(".button-outline[href='#stack']").addEventListener("click", highlightLearningStack);
loadGitHubProjects();
