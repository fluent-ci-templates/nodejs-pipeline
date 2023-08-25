# Node.js Pipeline

[![deno module](https://shield.deno.dev/x/nodejs_pipeline)](https://deno.land/x/nodejs_pipeline)
![deno compatibility](https://shield.deno.dev/deno/^1.34)
[![codecov](https://img.shields.io/codecov/c/gh/fluent-ci-templates/nodejs-pipeline)](https://codecov.io/gh/fluent-ci-templates/nodejs-pipeline)

A ready-to-use CI/CD Pipeline for your [Node.js](https://nodejs.org/en) projects.

## 🚀 Usage

Run the following command:

```bash
dagger run fluentci nodejs_pipeline
```

Or, if you want to use it as a template:

```bash
fluentci init -t nodejs
```

This will create a `.fluentci` folder in your project.

Now you can run the pipeline with:

```bash
dagger run fluentci .
```

Or simply:

```bash
fluentci
```

## Environment variables (Deno Deploy)

| Variable          | Description                                | Default    |
| ----------------- | ------------------------------------------ | ---------- |
| NODE_VERSION      | Node version to use                        |  18.16.1   |
| PACKAGE_MANAGER   | Package manager to use (npm, yarn, pnpm)   |  npm       |

## Jobs

| Job    | Description         |
| ------ | ------------------- |
| test   | Run the tests       |
| build  | Build the project   |

## Programmatic usage

You can also use this pipeline programmatically:

```ts
import { Client, connect } from "https://esm.sh/@dagger.io/dagger@0.8.1";
import { Dagger } from "https://deno.land/x/nodejs_pipeline/mod.ts";

const { test, build } = Dagger;

function pipeline(src = ".") {
  connect(async (client: Client) => {
    await test(client, src);
    await build(client, src);
  });
}

pipeline();
```
