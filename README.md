# ashu-jainvi-ui

Personal portfolio to showcase personal interests, designs, hobbies and professional experiences & projects.

This is a simple multi-page application developed by a web design enthusiast focusing on best practices and clean code.

![Build Status](https://github.com/ashujainvi/ashutoshjainvi-ui-3/workflows/Firebase%20Deploy/badge.svg)

---

## Tools Used

This project does not use any JS framework or library. It is built on HTML5, SCSS (processed to CSS using Gulp) & Vanilla JavaScript with ES6 modules.

This project uses Gulp 4 to streamline basic web dev tasks like:

-   Serving optimized images for production.
-   [Cache busting](https://www.keycdn.com/support/what-is-cache-busting) for CSS file.
-   Minimizing code for small package size when serving in a browser.
-   Bundling JS using [Roll-up](https://blog.openreplay.com/the-ultimate-guide-to-getting-started-with-the-rollup-js-javascript-bundler).

## Develop

Start a local server using Gulp:

```
npm start
```

## Build

To build the app, run command `npm run build`.

## Deployment

This project uses Github Actions for CI/CD. On every push to `master` branch, code is built and deployed to Firebase hosting.
