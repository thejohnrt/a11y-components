# a11y-components: carousel

Constructed according to [WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/#carousel), this carousel has next and previous buttons that allow for looping navigation of the content items.

## Implementation

Follow these steps to use this component in your project:

1. Cut and paste `.a11y-carousel` from `index.html` and replace the elements inside `.a11y-carousel__items` with your content.
2. Update the `aria-label` of each instance of `.a11y-carousel`.
3. Add `carousel.js` and `carousel.css` to your file.
4. Call `generateCarousels()`, passing it the argument `".a11y-carousel"`.

## License

This folder and its [parent repository](https://github.com/thejohnrt/a11y-components) are licensed under the [Creative Commons CC0](https://creativecommons.org/publicdomain/zero/1.0/) license. If you build on or are inspired by this project, attribution is appreciated, but not required; GLHF!
