import { Job } from "https://deno.land/x/fluent_gitlab_ci@v0.3.2/mod.ts";

export const npmInstall = new Job().script("npm install");

export const yarnInstall = new Job().script("yarn install");

export const npmBuild = new Job().script("npm run build");

export const npmTest = new Job().script("npm run test");
