# Node.js Pipeline

[![fluentci pipeline](https://img.shields.io/badge/dynamic/json?label=pkg.fluentci.io&labelColor=%23000&color=%23460cf1&url=https%3A%2F%2Fapi.fluentci.io%2Fv1%2Fpipeline%2Fnodejs_pipeline&query=%24.version)](https://pkg.fluentci.io/nodejs_pipeline)
[![deno module](https://shield.deno.dev/x/nodejs_pipeline)](https://deno.land/x/nodejs_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.41)
[![dagger-min-version](https://img.shields.io/badge/dagger-v0.10.0-blue?color=3D66FF&labelColor=000000)](https://dagger.io)
[![](https://jsr.io/badges/@fluentci/nodejs)](https://jsr.io/@fluentci/nodejs)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/nodejs-pipeline)](https://codecov.io/gh/fluent-ci-templates/nodejs-pipeline)
[![ci](https://github.com/fluent-ci-templates/nodejs-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/fluent-ci-templates/nodejs-pipeline/actions/workflows/ci.yml)

A ready-to-use CI/CD Pipeline for your [Node.js](https://nodejs.org/en) projects.

## 🚀 Usage

Run the following command:

```bash
fluentci run nodejs_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t nodejs
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
fluentci run .
```

Or simply:

```bash
fluentci
```

## 🧩 Dagger Module

Use as a [Dagger](https://dagger.io) module:

```bash
dagger install github.com/fluent-ci-templates/nodejs-pipeline@main
```

Call a function from the module:

```bash
dagger -m github.com/fluent-ci-templates/nodejs-pipeline@main call \
  test --src .

dagger -m github.com/fluent-ci-templates/nodejs-pipeline@main call \
  build --src .
```

## 🛠️ Environment variables

| Variable          | Description                                | Default    |
| ----------------- | ------------------------------------------ | ---------- |
| NODE_VERSION      | Node version to use                        |  18.16.1   |
| PACKAGE_MANAGER   | Package manager to use (npm, yarn, pnpm)   |  npm       |

## ✨ Jobs

| Job     | Description          |
| ------- | -------------------- |
| build   | Build the project    |
| install | Install dependencies |
| test    | Run the tests        |
| run     | Run a custom task    |

```typescript
test(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<string>

build(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Directory | string>

run(
  src: Directory | string | undefined = ".",
  task: string,
  packageManager?: string,
  nodeVersion?: string
): Promise<string>

install(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Container | string>

dev(
  src: Directory | string | undefined = ".",
  packageManager?: string,
  nodeVersion?: string
): Promise<Container | string>
```

## 👨‍💻 Programmatic usage

You can also use this pipeline programmatically:

```ts
import { test, build } from "jsr:@fluentci/nodejs";

await test();
await build();
```
