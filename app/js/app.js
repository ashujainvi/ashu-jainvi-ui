const docElement = document.documentElement;
const rootElement = document.querySelector(':root');

const COLORS = {
  primary: '#cf042a',
  red: '#cf042a',
};
// var screenSize = window.innerWidth;
// PARALLAX
// var scene = document.getElementById('mouse-move-scene-1');
// var parallaxInstance = new Parallax(scene);

// TYPED.JS
// var head = document.getElementsByTagName('body')[0];
// var scriptTag = document.createElement('script');
// scriptTag.type = 'text/javascript';
// scriptTag.src = 'https://cdn.jsdelivr.net/npm/typed.js@2.0.9';
// head.appendChild(scriptTag);

// var typed;
// function initializeTyped(elementId, typedInfo) {
//   const stringArray = [
//     '~ ashutoshjainvi.com$: Hey! Nice to meet you.',
//     '~ ashutoshjainvi.com$: So, let me help you in waking this sloth up.',
//     "~ ashutoshjainvi.com$: There's a white switch on top left corner of the desk.",
//     '~ ashutoshjainvi.com$: Click on it to turn the lights on.',
//     '~ ashutoshjainvi.com$: Be careful, it might break his concentration and make him mad.',
//   ];
//   var typedOptions = {
//     strings: stringArray,
//     typeSpeed: 40,
//     backDelay: 700,
//     loop: true,
//     onStop: function () {
//       typed.reset();
//     },
//   };
//   typed = new Typed(elementId, typedOptions);
// }

// // POP-UP
// function showPopup(elementId, typedPlaceholder, typedInfo) {
//   const el = document.getElementById(elementId);
//   el.classList.add('pop-up-open');

//   setTimeout(function () {
//     initializeTyped(typedPlaceholder, typedInfo);
//   }, 375);
// }

// ICONS SLIDER
var iconSlider = document.getElementById('feature-zone-icons');
var mouseIsDown = false;
var startX, scrollLeft;

if (iconSlider) {
  iconSlider.addEventListener('mousedown', function (event) {
    mouseIsDown = true;
    startX = event.pageX - iconSlider.offsetLeft;
    scrollLeft = iconSlider.scrollLeft;
  });

  iconSlider.addEventListener('mouseleave', function () {
    mouseIsDown = false;
  });

  iconSlider.addEventListener('mouseup', function () {
    mouseIsDown = false;

    var currScrollX = iconSlider.scrollLeft;
    var scrollDiff = (scrollLeft - currScrollX) * -1;
    var newScrollX = currScrollX + scrollDiff * 0.4;

    // TODO: animate not working
    iconSlider.animate({ scrollLeft: newScrollX }, 400);
  });

  iconSlider.addEventListener('mousemove', function (event) {
    if (!mouseIsDown) {
      return;
    }
    var mousePosX = event.pageX - iconSlider.offsetLeft;
    var slideValue = (mousePosX - startX) * 1.5;
    iconSlider.scrollLeft = scrollLeft - slideValue;
  });
}

// CHAPTER ANIMATIONS BASED ON WINDOW SCROLL.
// SHOWS OR HIDES STICKY CHAPTERS BASED ON SCROLL TOP.

// Pins for each chapter's end.
// Example, Chapter 1 scroll ends at 500px (chapter fades away).
// Chapter 2 starts at 500px, which tiggers:
// - Chapter 1 past animation (see utility.scss `.past-chapter`).
// - Chapter 2 present animation (see utility.scss `.present-chapter`).
const CHAPTER_END_POINTS = [1000, 2200, 3500];

// Contains different CSS props value for each chapter.
// Can be used to dynamically change CSS props like background.
const CHAPTER_PROPS = {
  0: {
    'background-color': '#cf042a',
  },
  1: {
    'background-color': '#f76e48',
  },
  2: {
    'background-color': '#cf042a',
  },
};

// Get all chapters id="chapter-{i}" (where i starts from 0) for element of id="personal-book".
// HTML Collection of all chapter elements.
const chapters = document.getElementById('personal-book').children;
const numberOfChapters = chapters.length;

/**
 * Return Chapter's CSS Property value.
 * @param {number} chapterNumber Chapter index for desired CSS prop.
 * @param {string} propertyName CSS prop name. For example, `background-color`.
 * @returns {string} CSS property value.
 */
const getChapterProperty = (chapterNumber, propertyName) => {
  return CHAPTER_PROPS[chapterNumber][propertyName];
};

// Returns chapter based on index provided.
const getChapter = (chapterNumber) => {
  if (chapterNumber < 0 || chapterNumber >= numberOfChapters) {
    return undefined;
  }
  return chapters[chapterNumber];
};

const getCurrentChapterNumber = (scrollTop) => {
  let chapterNumber = 0;

  chapterNumber = CHAPTER_END_POINTS.find(
    (chapterEndPoint) => scrollTop < chapterEndPoint
  );

  return CHAPTER_END_POINTS.indexOf(chapterNumber);
};

const animateChapter = (scrollTop, prevChapterNumber) => {
  // chapter numbers start with 0 in our book.
  const currentChapterNumber = getCurrentChapterNumber(scrollTop);

  if (currentChapterNumber === prevChapterNumber) {
    return currentChapterNumber;
  }

  // Get chapters to set CSS props on.
  const prevChapter = getChapter(currentChapterNumber - 1);
  const currentChapter = getChapter(currentChapterNumber);
  const nextChapter = getChapter(currentChapterNumber + 1);

  if (currentChapter) {
    requestAnimationFrame(() => {
      currentChapter.classList.remove('future-chapter');
      currentChapter.classList.remove('past-chapter');
      currentChapter.classList.add('present-chapter');

      // Change default background color.
      rootElement.style.setProperty(
        '--background-color',
        getChapterProperty(currentChapterNumber, 'background-color')
      );
    });
  }

  if (prevChapter) {
    requestAnimationFrame(() => {
      prevChapter.classList.remove('present-chapter');
      prevChapter.classList.add('past-chapter');
    });
  }

  // If there is a next chapter, which would be current when scrolling up.
  if (nextChapter) {
    requestAnimationFrame(() => {
      nextChapter.classList.remove('present-chapter');
      nextChapter.classList.add('future-chapter');
    });
  }

  return currentChapterNumber;
};

// SCROLL EVENT
let prevChapterNumber = 0;

window.addEventListener('scroll', function (e) {
  const scrollTop = docElement.scrollTop;
  prevChapterNumber = animateChapter(scrollTop, prevChapterNumber);
});
