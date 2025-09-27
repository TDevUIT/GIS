<<<<<<< HEAD
# IE402 - Microservices Monorepo Skeleton

Repository: https://github.com/TDevUIT/IE402

This repository hosts a monorepo for an urban GIS project of Ho Chi Minh City (HCMC) using a microservices approach:

- GIS_Server: data discovery, curation, and GIS aggregation for districts (e.g., Q1, Binh Thanh, Q10, Thu Duc).
- Data_Processor: transforms unstructured text sources into structured JSON for APIs.
- Web_Server: provides REST APIs for FE by aggregating data from GIS_Server and Data_Processor.
- Web_Client: frontend client app.

Note: The existing Next.js app in `ie402/` is currently used as the Web Client. The FE team can continue development there.

## Team assignments
- GIS_Server: Hương Giang, Quyền, V. Linh — collect and evaluate district data sources (infrastructure, population, traffic, land, environment). Pick top 3 districts with best quality.
- Web_Server: Lâm, Tài, Tân — define and implement APIs, integrate with GIS_Server and Data_Processor.
- Web_Client: Thái, Thắng — implement a simple UI (start from a reference UI on the web), consume APIs from Web_Server.

## Priorities (this week)
1) Study GIS fundamentals, shortlist data sources, mark usable sections.
2) BE team to draft diagrams and API specs.
3) FE to pick a simple UI reference for a quick prototype.

## Structure
- docs/: shared documentation (architecture, guides, tasks, data sources, intros)
- services/
  - GIS_Server/: GIS data discovery and aggregation
  - Data_Processor/: text -> JSON pipelines
  - Web_Server/: REST API surface and aggregation
- clients/
  - Web_Client/: Readme and guidance (actual FE lives in `ie402/`)
- diagrams/: placeholders for architecture and data flow
- ie402/: existing Next.js app (FE)

## Getting started
- Read `docs/ARCHITECTURE.md` for the big picture.
- Teams: follow your respective guides in `docs/` and your service directory.
- Editor setup: see `.editorconfig` and `.vscode/` for workspace consistency.

## Repo conventions
- One PR per feature/task, reference TASKS.md item IDs.
- Use conventional commits (feat, fix, docs, chore, refactor, test).
- Keep credentials out of the repo. Use `.env` locally; never commit secrets.

## Guidelines
- API conventions: see `docs/API_CONVENTIONS.md`.
- Pull Request guidelines: see `docs/PR_GUIDE.md`.
- Branching conventions: see `docs/BRANCHING_GUIDE.md`.

## Licensing
TBD.
=======
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
>>>>>>> d273b0d (feat: init base api all module)
