<div align="center">
    <img src="https://github.com/hiStories-cc/hiStories/blob/main/public/logo/big-white.svg" alt="Histories" />
</div>

<div align="center">
    <a href="https://www.histories.cc"><b>hiStories.cc</b></a>
    •
    <a href="https://www.chromatic.com/library?appId=61a39cca9c186c003a9e202f"><b>Storybook</b></a>
        •
    <a href="https://gitpod.io/#https://github.com/hiStories-cc/hiStories"><b>Gitpod</b></a>
</div>
<br>
<div align="center">
    <img src="https://github.com/hiStories-cc/hiStories/actions/workflows/build-node.yml/badge.svg" /> 
    <img src="https://github.com/hiStories-cc/hiStories/actions/workflows/test-node.yml/badge.svg" alt="test action"/>
    <a href="https://gitpod.io/#https://github.com/histories-cc/histories"><img src="https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod" alt="Gitpod Ready-to-Code"/></a>
</div>

## About


HiStories is a social site for sharing historical photos of places, so anyone can see, how the place has changed over time.
And it also is my high school final project.

## Setup

[![Edit with Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/hiStories-cc/hiStories)

### Setup dev server:

1. copy `.env.local.example` to `.env.local` and change values
2. copy `nodemon.json.example` to `nodemon.json` and change values
3. install dependencies `yarn`
4. setup environment `docker-compose up -d`
5. run `yarn dev`

### Setup storybook

1. install dependencies `yarn`
2. run dev server `yarn sb`

## Tech stack

- [Next.js](https://nextjs.org/)
- [TypeScript](https://github.com/microsoft/TypeScript)
- [GraphQL](https://graphql.org/)
- [Neo4j](https://neo4j.com/)
- [Storybook](https://storybook.js.org/)
- [IPFS](https://ipfs.io/)

## Project structure

```
hiStories/
├── pages (using nextjs routing)
├── src (backend)
│   ├── database
│   ├── email
│   ├── IPFS
│   └── graphql
│       ├── resolvers (resolver functions)
│       └── utils
│           ├── apolloServer
│           ├── schema
│           └── type-defs
├── shared (used by backend and frontend)
├── dist (compiled backend)
├── lib (frontend)
│   ├── graphql
│   ├── hooks
│   ├── stories (storybook stories)
│   └── tranlation (i18n)
├── components (inspired by atomic design principles)
│   ├── elements (small building blocks)
│   ├── layouts (wrappers for templates)
│   ├── modules (more building blocks together)
│   └── templates (page specific content)
└── public
```

# License

Histories is open-sourced software licensed under the [MIT license](https://github.com/hiStories-cc/hiStories/blob/main/LICENSE.md).
