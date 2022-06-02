/*_____ START "Development Use" section _____*/
function activate() {
  const activatedStyles = document.createElement('link');
  const activationBanner = document.getElementById('activation-notice')

  activatedStyles.setAttribute('rel', 'stylesheet');
  activatedStyles.setAttribute('href', '../activated-component.css');

  activationBanner.textContent = "The carousel component has been created.";

  document.head.append(activatedStyles);
  document.getElementById('generator-button').remove();
  // setTimeout( () => {
  //   document.querySelector('.a11y-carousel').focus();
  //   document.querySelector('.a11y-carousel').setAttribute('tabindex','');
  // }, 3000);
}
/*_____ END "Development Use" section _____*/
'use strict';
// jQuery(document).ready(function() {
const errorChecking = validatorFunctions();
let buttonWrapper; /* Hoisted to allow clearing of interval from inline scripts */

function validatorFunctions() {
  return {
    buttons: function(buttonWrapper) {
      for (let buttonIndex = 0; buttonIndex < buttonWrapper.children.length; buttonIndex++) {
        const button = buttonWrapper.children.item(buttonIndex);
        const buttonText = button.textContent;
        const buttonLabel = button.getAttribute('aria-label');

        if ((buttonText === "" || buttonText === null) && (buttonLabel === "" || buttonLabel === null)) {
          console.info("Relevant Sufficient Technique (ARIA6) for WCAG 2.1: https://www.w3.org/WAI/WCAG21/Techniques/aria/ARIA6");
          console.warn("Non-conforming element:", button);
          throw new Error("Buttons need accessible names provided by their inner text or the 'aria-label' attribute.");

        }
      }
    },
    items: function(element, index) {
      const isImageEl = element instanceof HTMLImageElement;
      const isFigureEl = element.tagName.toLowerCase() === "figure";
      const isDivEl = element instanceof HTMLDivElement;

      if (isImageEl) {
        if (element.alt == "" || element.alt == null) {
          console.info("Relevant Sufficient Technique (H37) for WCAG 2.1: https://www.w3.org/WAI/WCAG21/Techniques/html/H37.html");
          console.warn("Non-conforming element:", element);
          throw new Error(`Missing alternative text for the <img> element at index ${index}`);
        } else if (isFigureEl) {
          // TODO: Add semantics check for `figure` and `figcaption`
        } else if (isDivEl) {
          // TODO: Add ARIA attributes check on `div` and possible checks for various child nodes
        }
      }
    },
    wrapper: function(carousel) {
      const carouselLabel = carousel.getAttribute('aria-label');
      if (carouselLabel == "" || carouselLabel == null) {
        console.info("Relevant ARIA Authoring Practices section: https://www.w3.org/TR/wai-aria-practices-1.1/#basic-carousel-elements");
        console.warn("Non-conforming element:", carousel);
        throw new Error("Each carousel should have an accessible name provided by the 'aria-label' or 'aria-labelledby' attributes.");

      }
    }
  }
}

function appendStylesheet(cssPath) {
  const carouselStyles = document.createElement('link');
  carouselStyles.setAttribute('rel', 'stylesheet');
  carouselStyles.setAttribute('href', cssPath + '/carousel.css');
  document.head.append(carouselStyles);
}

function generateCarouselButtons(carouselItems, carouselId, indicatorType) {
  let currentActiveItem = 0;
  buttonWrapper = document.createElement('div');
  buttonWrapper.classList = 'a11y-carousel__buttons';

  switch (indicatorType) {
    case 'arrows':
      const prevButton = document.createElement('button');
      const nextButton = document.createElement('button');

      prevButton.classList = 'previous';
      prevButton.setAttribute('aria-controls', carouselId);

      nextButton.classList = 'next';
      nextButton.setAttribute('aria-controls', carouselId);

      if (options.indicator.labels) {
        prevButton.innerHTML = 'Previous Item';
        nextButton.innerHTML = "Next Item";
      }

      if (options.indicator.labels === false) {
        prevButton.setAttribute('aria-label', 'Previous Item');
        nextButton.setAttribute('aria-label', "Next Item");
      }

      buttonWrapper.append(prevButton);
      buttonWrapper.append(nextButton);

      buttonWrapper.addEventListener("click", function() {
        if ( /next/.test(event.target.classList) ) {
          incrementCounter();
        } else if ( /previous/.test(event.target.classList) ) {
          decrementCounter();
        }

        for (let childIndex = 0; childIndex < carouselItems.length; childIndex++) {
          carouselItems.item(childIndex).classList.remove('active');
          carouselItems.item(childIndex).setAttribute('aria-hidden', 'true');
        }
        carouselItems.item(currentActiveItem).classList.add('active');
        carouselItems.item(currentActiveItem).setAttribute('aria-hidden', 'false');
      });
      break;

      case 'dots':
      for (var i = 0; i < carouselItems.length; i++) {
        itemButton = document.createElement('button');

        if (options.indicator.labels) {
        itemButton.textContent = i + 1;
      }

        itemButton.setAttribute('data-index', i);
        itemButton.setAttribute('aria-controls', carouselId);
        itemButton.setAttribute('aria-label', `Go to ${carouselItems[i].getAttribute('data-title')}`);
        itemButton.setAttribute('data-title', carouselItems[i].getAttribute('data-title'));

        if (i === 0) {
          itemButton.setAttribute('aria-pressed', 'true');
        } else {
          itemButton.setAttribute('aria-pressed', 'false');
        }

        buttonWrapper.append(itemButton);
      }

      buttonWrapper.addEventListener("click", function() {

        for (var i = 0; i < buttonWrapper.children.length; i++) {
          buttonWrapper.children.item(i).setAttribute('aria-pressed', 'false');
        }

        currentActiveItem = parseInt( event.target.getAttribute('data-index') );
        buttonWrapper.children.item(currentActiveItem).setAttribute('aria-pressed', 'true');

        console.log(currentActiveItem);

        for (let childIndex = 0; childIndex < carouselItems.length; childIndex++) {
          carouselItems.item(childIndex).classList.remove('active');
        }
        carouselItems.item(currentActiveItem).classList.add('active');
      });
        break;

    default:
    console.error("Invalid indicator (" + indicator.type + ") specified.");
      break;
  }

  function incrementCounter() {
    currentActiveItem++;
    if (currentActiveItem === carouselItems.length) {
      currentActiveItem = 0;
    }
  }

  function decrementCounter() {
    currentActiveItem--;
    if (currentActiveItem < 0) {
      currentActiveItem = carouselItems.length - 1;
    }
  }

  errorChecking.buttons(buttonWrapper);

  return buttonWrapper;
}

function generateCarousels(carouselSelector, options) {
  // console.log(document.querySelectorAll(carouselSelector));
  document.querySelectorAll(carouselSelector).forEach((carousel, carouselIndex) => {
    carousel.setAttribute('aria-roledescription', 'carousel');
    carousel.setAttribute('aria-live', 'polite');
    carousel.setAttribute('id', 'a11y-carousel-' + carouselIndex);
    carouselLabels = {
      "ariaLabel": carousel.getAttribute('aria-label'),
      "ariaLabelledby": carousel.getAttribute('aria-labelledby')
    };
    if (options.carouselNames !== null && carouselLabels.ariaLabel === null && carouselLabels.ariaLabelledby === null) {
      carousel.setAttribute('aria-label', options.carouselNames[carouselIndex]);
    }

    errorChecking.wrapper(carousel);

    const carouselId = carousel.getAttribute('id');

    let carouselItems = carousel.children.item(0).children;

    for (let childIndex = 0; childIndex < carouselItems.length; childIndex++) {
      let currentItem = carouselItems.item(childIndex);
      errorChecking.items(currentItem, childIndex);
      currentItem.classList = 'a11y-carousel__item';
      currentItem.setAttribute('aria-hidden', 'true');
      currentItem.setAttribute('data-count', childIndex + 1);

      if (childIndex === 0) {
        currentItem.classList.add('active');
        currentItem.setAttribute('aria-hidden', 'false');
      } // END if
    } // END for
    let carouselButtons = generateCarouselButtons(carouselItems, carouselId, options.indicator.type);
    switch (options.indicator.location) {
      case 'before':
      carousel.prepend(carouselButtons);
      break;
      case 'after':
      default:
      carousel.append(carouselButtons);
      break;

    }
  }); // END forEach
  appendStylesheet(options.cssPath);
}
// });
