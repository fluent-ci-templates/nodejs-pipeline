import { GitlabCI } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";
import { npmBuild, npmInstall, npmTest, yarnInstall } from "./jobs.ts";

const gitlabci = new GitlabCI()
  .image("node:latest")
  .addJob("npm_install", npmInstall)
  .addJob("yarn_install", yarnInstall)
  .addJob("npm_build", npmBuild)
  .addJob("npm_test", npmTest);

export default gitlabci;
