## Amazon Mining Watch

This is the frontend to Amazon Mining Watch built on [Next.js](https://nextjs.org/) and [react-map-gl](https://visgl.github.io/react-map-gl/). It uses Next's native i18n support and App Router. As Next's language handling is still in flux at time of writing, it uses some custom middlewear and a cookie to persist the user's locale.


## Content management

Content is pulled from markdown files in `./markdown`.

## Translations

Interface translations are stored in `./dictionaries`.

## Developers

Rename env-example.txt to .env and add your env values.

First, install dependences:

```bash
yarn install
```

and then start the dev server:

```bash
yarn dev
```
