# ashutosh-jainvi-ui-v3

Personal portfolio to showcase personal interests, designs, hobbies and professional experience in IT world.

This is a simple multi-page application developed by a web design enthusiast focusing on best practices and clean code.

![Build Status](https://github.com/ashujainvi/ashutoshjainvi-ui-3/workflows/Firebase%20Deploy/badge.svg)

---

## Tools Used

This project does not use any JS/UI framework. It is build on HTML5, SCSS (processed to CSS using Gulp) & JavaScript with few heavy-lifters like [UIKit](https://getuikit.com/docs/parallax) for scroll animations & parallax. That's it.

This project uses Gulp 4 to streamline basic web dev tasks like:

-   Serving optimized images for production.
-   [Cache busting](https://www.keycdn.com/support/what-is-cache-busting) for CSS file.
-   Minimizing code for small package size when serving in a browser.

## Develop

Start a local server using Gulp:

```
npm start
```

## Build

To build the app, run command `npm run build`.

> NOTE: CI (test & build) pipeline coming soon.

## Deployment

This project uses Github Actions for CI/CD. On every push to `master` branch, code is built and deployed to Firebase hosting.
