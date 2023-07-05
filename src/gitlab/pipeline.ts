import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { npmBuild, npmInstall, npmTest } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("node:latest")
  .cache(["node_modules/"])
  .addJob("npm_install", npmInstall)
  .addJob("npm_build", npmBuild)
  .addJob("npm_test", npmTest);

export default gitlabci;
