const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repository id is invalid!" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  const selectedRepository = repositories[repositoryIndex];

  const newRepository = { ...selectedRepository, title, url, techs };
  repositories[repositoryIndex] = newRepository;

  return response.json(newRepository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repository id is invalid!" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);

  repositories.splice(repositoryIndex);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Repository id is invalid!" });
  }

  const repositoryIndex = repositories.findIndex((repo) => repo.id === id);
  const selectedRepository = repositories[repositoryIndex];

  const repository = {
    ...selectedRepository,
    likes: selectedRepository.likes + 1,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

module.exports = app;
