import Client from "../../deps.ts";

export enum Job {
  test = "test",
  build = "build",
}

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

export const test = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const packageManager = Deno.env.get("PACKAGE_MANAGER") || "npm";
  const nodeVersion = Deno.env.get("NODE_VERSION") || "18.16.1";
  const ctr = client
    .pipeline(Job.test)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest")
    .withExec(["devbox", "global", "add", `nodejs@${nodeVersion}`])
    .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec([
      "sh",
      "-c",
      `eval "$(devbox global shellenv)" && ${packageManager} install`,
    ])
    .withExec(["sh", "-c", 'eval "$(devbox global shellenv)" && npm run test']);

  const result = await ctr.stdout();

  console.log(result);
};

export const build = async (client: Client, src = ".") => {
  const context = client.host().directory(src);
  const packageManager = Deno.env.get("PACKAGE_MANAGER") || "npm";
  const nodeVersion = Deno.env.get("NODE_VERSION") || "18.16.1";
  const ctr = client
    .pipeline(Job.build)
    .container()
    .from("ghcr.io/fluent-ci-templates/devbox:latest")
    .withExec(["devbox", "global", "add", `nodejs@${nodeVersion}`])
    .withExec([
      "sh",
      "-c",
      `eval "$(devbox global shellenv)" && npm install -g yarn pnpm`,
    ])
    .withMountedCache("/app/node_modules", client.cacheVolume("node_modules"))
    .withMountedCache("/app/dist", client.cacheVolume("dist"))
    .withEnvVariable("NIX_INSTALLER_NO_CHANNEL_ADD", "1")
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec([
      "sh",
      "-c",
      `eval "$(devbox global shellenv)" && ${packageManager} install`,
    ])
    .withExec([
      "sh",
      "-c",
      'eval "$(devbox global shellenv)" && npm run build',
    ]);

  const result = await ctr.stdout();

  console.log(result);
};

export type JobExec = (
  client: Client,
  src?: string
) =>
  | Promise<void>
  | ((
      client: Client,
      src?: string,
      options?: {
        ignore: string[];
      }
    ) => Promise<void>);

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
};
