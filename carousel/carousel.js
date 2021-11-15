/*_____ START "Development Use" section _____*/
function activate() {
  const activatedStyles = document.createElement('link');
  const activationBanner = document.getElementById('activation-notice')

  activatedStyles.setAttribute('rel', 'stylesheet');
  activatedStyles.setAttribute('href', '../activated-component.css');

  activationBanner.textContent = "The carousel component has been created.";

  document.head.append(activatedStyles);
  document.getElementById('generator-button').remove();
  setTimeout( () => {
    document.querySelector('.a11y-carousel').focus();
    document.querySelector('.a11y-carousel').setAttribute('tabindex','');
  }, 3000);
}
/*_____ END "Development Use" section _____*/
'use strict';

const errorChecking = validatorFunctions();

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

function appendStylesheet() {
  const carouselStyles = document.createElement('link');
  carouselStyles.setAttribute('rel', 'stylesheet');
  carouselStyles.setAttribute('href', './carousel.css');
  document.head.append(carouselStyles);
}

function generateCarouselButtons(carouselItems, carouselId) {
  let currentActiveItem = 0;
  const buttonWrapper = document.createElement('div');
  const prevButton = document.createElement('button');
  const nextButton = document.createElement('button');
  const incrementCounter = function() {
    currentActiveItem++;
    if (currentActiveItem === carouselItems.length) {
      currentActiveItem = 0;
    }
  }
  const decrementCounter = function() {
    currentActiveItem--;
    if (currentActiveItem < 0) {
      currentActiveItem = carouselItems.length - 1;
    }
  }

  prevButton.classList = 'previous';
  prevButton.setAttribute('aria-controls', carouselId);
  prevButton.innerHTML = 'Previous Item';

  nextButton.classList = 'next';
  nextButton.setAttribute('aria-controls', carouselId);
  nextButton.innerHTML = "Next Item";


  buttonWrapper.classList = 'a11y-carousel__buttons';
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
    }
    carouselItems.item(currentActiveItem).classList.add('active');
  });

  errorChecking.buttons(buttonWrapper);

  return buttonWrapper;
}

function generateCarousels(carouselSelector) {
  // console.log(document.querySelectorAll(carouselSelector));
  document.querySelectorAll(carouselSelector).forEach((carousel, carouselIndex) => {
    carousel.setAttribute('aria-roledescription', 'carousel');
    carousel.setAttribute('aria-live', 'polite');
    carousel.setAttribute('id', 'a11y-carousel-' + carouselIndex);
    errorChecking.wrapper(carousel);

    const carouselId = carousel.getAttribute('id');

    let carouselItems = carousel.children.item(0).children;

    for (let childIndex = 0; childIndex < carouselItems.length; childIndex++) {
      let currentItem = carouselItems.item(childIndex);
      errorChecking.items(currentItem, childIndex);
      currentItem.classList = 'a11y-carousel__item';

      if (childIndex === 0) {
        currentItem.classList.add('active');
      } // END if
    } // END for
    let carouselButtons = generateCarouselButtons(carouselItems, carouselId);
    carousel.append(carouselButtons);
  }); // END forEach
  appendStylesheet();
}
