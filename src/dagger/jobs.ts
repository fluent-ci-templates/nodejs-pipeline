import { Directory, Container } from "../../deps.ts";
import { dag } from "../../sdk/client.gen.ts";
import { getDirectory } from "./lib.ts";

export enum Job {
  test = "test",
  build = "build",
  run = "run",
  install = "install",
  dev = "dev",
}

export const exclude = [".git", ".devbox", "node_modules", ".fluentci"];

/**
 * @function
 * @description Run tests
 * @param {string | Directory} src
 * @param {string} packageManager
 * @param {string} nodeVersion
 * @returns {Promise<string>}
 */
export async function test(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const pm = Deno.env.get("PACKAGE_MANAGER") || packageManager || "npm";
  const version = Deno.env.get("NODE_VERSION") || nodeVersion || "18.16.1";
  const ctr = dag
    .pipeline(Job.test)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${version}`,
      "npm",
      "bun",
      "pnpm",
      "classic.yarnpkg.com",
      "rtx",
    ])
    .withExec(["sh", "-c", "echo 'eval $(rtx activate bash)' >> ~/.bashrc"])
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume(`node_modules_${pm}`)
    )
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec([pm, "install"])
    .withExec(["sh", "-c", "[ -f client.gen.ts ] && rm client.gen.ts || true"])
    .withExec([pm, "run", "test"]);

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Build the project
 * @param {string | Directory} src
 * @param {string} packageManager
 * @param {string} nodeVersion
 * @returns {Promise<Directory | string>}
 */
export async function build(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Directory | string> {
  const context = await getDirectory(dag, src);
  const pm = Deno.env.get("PACKAGE_MANAGER") || packageManager || "npm";
  const version = Deno.env.get("NODE_VERSION") || nodeVersion || "18.16.1";
  const ctr = dag
    .pipeline(Job.build)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${version}`,
      "npm",
      "bun",
      "pnpm",
      "classic.yarnpkg.com",
      "rtx",
    ])
    .withExec(["sh", "-c", "echo 'eval $(rtx activate bash)' >> ~/.bashrc"])
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume(`node_modules_${pm}`)
    )
    .withExec(["mkdir", "-p", "/app/dist"])
    .withMountedCache("/app/dist", dag.cacheVolume("dist"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "[ -f client.gen.ts ] && rm client.gen.ts || true"])
    .withExec([pm, "install"])
    .withExec([pm, "run", "build"])
    .withExec(["cp", "-r", "dist", "/dist"]);

  await ctr.stdout();

  const id = await ctr.directory("/dist").id();
  return id;
}

/**
 * @function
 * @description Run a task
 * @param {string | Directory} src
 * @param {string} packageManager
 * @param {string} nodeVersion
 * @returns {Promise<string>}
 */
export async function run(
  src: Directory | string | undefined = ".",
  task: string,
  packageManager?: string,
  nodeVersion?: string
): Promise<string> {
  const context = await getDirectory(dag, src);
  const pm = Deno.env.get("PACKAGE_MANAGER") || packageManager || "npm";
  const version = Deno.env.get("NODE_VERSION") || nodeVersion || "18.16.1";
  const ctr = dag
    .pipeline(Job.run)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${version}`,
      "npm",
      "bun",
      "pnpm",
      "classic.yarnpkg.com",
      "rtx",
    ])
    .withExec(["sh", "-c", "echo 'eval $(rtx activate bash)' >> ~/.bashrc"])
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume(`node_modules_${pm}`)
    )
    .withMountedCache("/app/dist", dag.cacheVolume("dist"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec(["sh", "-c", "[ -f client.gen.ts ] && rm client.gen.ts || true"])
    .withExec([pm, "install"])
    .withExec([pm, "run", task]);

  const result = await ctr.stdout();
  return result;
}

/**
 * @function
 * @description Install dependencies
 * @param {string | Directory} src
 * @param {string} packageManager
 * @param {string} nodeVersion
 * @returns {Promise<Container | string>}
 */
export async function install(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Container | string> {
  const context = await getDirectory(dag, src);
  const pm = Deno.env.get("PACKAGE_MANAGER") || packageManager || "npm";
  const version = Deno.env.get("NODE_VERSION") || nodeVersion || "18.16.1";
  const ctr = dag
    .pipeline(Job.install)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${version}`,
      "npm",
      "bun",
      "pnpm",
      "classic.yarnpkg.com",
      "rtx",
    ])
    .withExec(["sh", "-c", "echo 'eval $(rtx activate bash)' >> ~/.bashrc"])
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume(`node_modules_${pm}`)
    )
    .withMountedCache("/app/dist", dag.cacheVolume("dist"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app")
    .withExec([pm, "install"]);

  await ctr.stdout();

  const id = await ctr.id();
  return id;
}

/**
 * @function
 * @description Returns a Container with Node.js installed
 * @param {string | Directory} src
 * @param {string} packageManager
 * @param {string} nodeVersion
 * @returns {Promise<Container | string>}
 */
export async function dev(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Container | string> {
  const context = await getDirectory(dag, src);
  const pm = Deno.env.get("PACKAGE_MANAGER") || packageManager || "npm";
  const version = Deno.env.get("NODE_VERSION") || nodeVersion || "18.16.1";
  const ctr = dag
    .pipeline(Job.install)
    .container()
    .from("pkgxdev/pkgx:latest")
    .withExec(["apt-get", "update"])
    .withExec(["apt-get", "install", "-y", "ca-certificates"])
    .withExec([
      "pkgx",
      "install",
      `node@${version}`,
      "npm",
      "bun",
      "pnpm",
      "classic.yarnpkg.com",
      "rtx",
    ])
    .withExec(["sh", "-c", `echo 'eval "$(rtx activate bash)"' >> ~/.bashrc`])
    .withMountedCache(
      "/app/node_modules",
      dag.cacheVolume(`node_modules_${pm}`)
    )
    .withMountedCache("/app/dist", dag.cacheVolume("dist"))
    .withDirectory("/app", context, { exclude })
    .withWorkdir("/app");

  await ctr.stdout();

  const id = await ctr.id();
  return id;
}

export type JobExec = (
  src?: Directory | string,
  ...args: string[]
) => Promise<string | Container | Directory>;

export const runnableJobs: Record<Job, JobExec> = {
  [Job.test]: test,
  [Job.build]: build,
  [Job.run]: run,
  [Job.install]: install,
  [Job.dev]: dev,
};

export const jobDescriptions: Record<Job, string> = {
  [Job.test]: "Run tests",
  [Job.build]: "Build the project",
  [Job.run]: "Run a task",
  [Job.install]: "Install dependencies",
  [Job.dev]: "Returns a Container with Node.js installed",
};
