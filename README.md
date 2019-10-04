#Igam.io

## Features

- Modern ESNext features: Babel + Webpack handle transpiling before deploys
- Testing: Jest
- Linting: ESLint and the AirBnb config
- Formatting: Prettier

## Install
#### Install dependencies
```bash
yarn install
```

## Development

#### 1. Add your function to `serverless.yml`

In the functions section of [`./serverless.yml`](./serverless.yml), you have to add your new function like so:
(example: welcome)
```yaml
functions:
  welcome:
    handler: src/welcome.default
    events:
      - http:
          path: welcome
          method: get
```

#### 2. Create your function

Then we need to create the handler function we named
(example: welcome)
```yaml
import { runWarm } from './utils';
const Welcome: Function = async (event: AWSLambda.APIGatewayEvent) => {
  ...
}
export default runWarm(Welcome);
```

We need to call runWarm in all serverless functions, as it detects the keep-alive ping from CloudWatch and exit early. This keeps our lambda function running hot.

---

### Serving locally

To spin up a local dev server run:

```bash
yarn serve
```
To watch it run:

```bash
yarn serve:watch
```

### Test your functions with Jest

Jest is installed as the testrunner. To create a test, locate your test in the folder tests/
as `<filename>.test.js` and then run/watch tests with:

```bash
yarn test
```

### Adding new functions/files to Webpack

When you add a new function to your serverless config, you don't need to also add it as a new entry
for Webpack. The `serverless-webpack` plugin allows us to follow a simple convention in our `serverless.yml`
file which is uses to automatically resolve your function handlers to the appropriate file:

```yaml
functions:
  hello:
    handler: src/hello.default
```

As you can see, the path to the file with the function has to explicitly say where the handler
file is. (If your function weren't the default export of that file, you'd do something like:
`src/hello.namedExport` instead.)

### Keep your lambda functions warm

Lambda functions will go "cold" if they haven't been invoked for a certain period of time (estimates vary, and AWS doesn't offer a clear answer). From the [Serverless blog](https://serverless.com/blog/keep-your-lambdas-warm/):

> Cold start happens when you execute an inactive (cold) function for the first time. It occurs while your cloud provider provisions your selected runtime container and then runs your function. This process, referred to as cold start, will increase your execution time considerably.

A frequently running function won't have this problem, but you can keep your function running hot by scheduling a regular ping to your lambda function. Here's what that looks like in your `serverless.yml`:

```yaml
custom:
  warmup:
    enabled: true
    events:
      - schedule: rate(5 minutes)
    prewarm: true
    concurrency: 1
```

The above config would keep all of your deployed lambda functions running warm. The `prewarm` flag will ensure your function is warmed immediately after deploys (so you don't have to wait five minutes for the first scheduled event).

### Pruning old versions of deployed functions

The Serverless framework doesn't purge previous versions of functions from AWS, so the number of previous versions can grow out of hand and eventually filling up your code storage. [serverless-prune-plugin](https://github.com/claygregory/serverless-prune-plugin) automatically prunes old versions from AWS. The config for this plugin can be found in `serverless.yml` file. The defaults are:

```yaml
custom:
  prune:
    automatic: true
    number: 5 # Number of versions to keep
```

The above config removes all but the last five stale versions automatically after each deployment.

Go [here](https://medium.com/fluidity/the-dark-side-of-aws-lambda-5c9f620b7dd2) for more on why pruning is useful.

## Deploy

Assuming you've already set up your default AWS credentials:

```bash
yarn deploy
```

`yarn deploy` will deploy to "dev" environment. You can deploy to `stage` or `production`
with:

```bash
yarn deploy:stage

# -- or --

yarn deploy:production
```
