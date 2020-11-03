var screenSize = window.innerWidth;
var html = document.getElementsByTagName("html")[0];
// get current screen size and save it in variable.
function getScreenSize() {
  screenSize = window.innerWidth;
  return screenSize;
}

// scroll direction
var lastScrollTop = 0;
var scrollDirections = {
  UP: "up",
  DOWN: "down",
};

function getScrollTop() {
  return Math.max(
    window.pageYOffset,
    document.documentElement.scrollTop,
    document.body.scrollTop
  );
}
function getScrollDirection() {
  var direction = "";
  var scrollTop = getScrollTop();
  if (scrollTop > lastScrollTop) {
    // downscroll
    direction = scrollDirections.DOWN;
  } else {
    direction = scrollDirections.UP;
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

  return direction;
}

// SCROLL LISTENER
// document.addEventListener("scroll", function (e) {
//   checkDashboardVisibility(e);
//   //   if (getScrollTop() > 300) {
//   //     var content = document.getElementById("content-section");
//   //     if (content) {
//   //       content.classList.remove("display-none");
//   //     }
//   //   }
// });

// script for landing switch bulb toggle
var guy = document.querySelector(".guy");
var switchOn = document.getElementById("switch-on");
var switchOff = document.getElementById("switch-off");
var lightBulbOn = document.getElementById("light-bulb2");

function toggleElectricity() {
  switchOff.classList.toggle("hidden");
  switchOn.classList.toggle("hidden");
  lightBulbOn.classList.toggle("hidden");
  guy.classList.toggle("guy-angry");
  guy.classList.toggle("floating");
}

var monitorScreen = document.getElementById("bedroom-monitor-screen");
var switchTextOn = document.getElementById("bedroom-switch-text-on");
var switchTextOff = document.getElementById("bedroom-switch-text-off");

function toggleSwitch() {
  monitorScreen.classList.toggle("svg-bedroom-monitor-screen-on");
}

// display nav settings
// var siteDashboard = document.getElementById("site-dashboard");
// var navSettingsWrapper = document.querySelector(".settings-menu-wrapper");
// function displayNavSettings(event) {
//   event.preventDefault();
//   navSettingsWrapper.classList.toggle("menu-active");
// }

// close nav setting wrapper if clicked outside
// document.addEventListener("click", function (event) {
//   if (!event.target.matches(".settings-button")) {
//     if (event.target.matches(".settings-menu-wrapper")) {
//       return;
//     } else {
//       navSettingsWrapper.classList.remove("menu-active");
//     }
//   }
// });

// typed initiator
// add typed js only if width > 768px
if (screenSize > 768) {
  var head = document.getElementsByTagName("body")[0];
  var scriptTag = document.createElement("script");
  scriptTag.type = "text/javascript";
  scriptTag.src = "https://cdn.jsdelivr.net/npm/typed.js@2.0.9";
  head.appendChild(scriptTag);
}

var typed;
function initializeTyped() {
  const stringArray = [
    "~ ashutoshjainvi.com$: Hey " + userName + "! Nice to meet you.",
    "~ ashutoshjainvi.com$: So, let me help you in waking this sloth up.",
    "~ ashutoshjainvi.com$: There's a white switch on top left corner of the desk.",
    "~ ashutoshjainvi.com$: Click on it to turn the lights on.",
    "~ ashutoshjainvi.com$: Be careful, it might break his concentration and make him mad.",
  ];
  var typedOptions = {
    strings: stringArray,
    typeSpeed: 40,
    backDelay: 700,
    attr: "placeholder",
    loop: true,
    onStop: function () {
      typed.reset();
    },
  };
  typed = new Typed(".hero_usernameInformator", typedOptions);
}

// to save user name
const usernameBox = document.querySelector("#usernameInputBox");
const userSentencePunctuation = document.querySelector(
  ".hero_content--punctuation"
);
const usernameDisplay = document.querySelector(".usernameDisplayField");
const usernameInformator = document.querySelector(".hero_usernameInformator");
const usernameEditButton = document.querySelector(".hero_username--edit");
var userName;

function saveUsername(event) {
  if (event.keyCode == 13) {
    userName = usernameBox.value;
    if (userName) {
      usernameBox.classList.add("display-none");
      userSentencePunctuation.innerHTML = ", ";
      usernameEditButton.classList.remove("display-none");
      usernameDisplay.classList.remove("display-none");
      usernameDisplay.innerHTML = userName.toLowerCase();
      usernameInformator.classList.remove("display-none");
      if (screenSize > 768) {
        initializeTyped();
      }
    }
  }
}

function editUsername() {
  usernameBox.classList.remove("display-none");
  usernameBox.focus();
  userSentencePunctuation.innerHTML = "!";
  usernameEditButton.classList.add("display-none");
  usernameDisplay.classList.add("display-none");
  usernameInformator.classList.add("display-none");
  typed.stop();
}

// draggable icons
var iconSlider = document.getElementById("feature-zone-icons");
var mouseIsDown = false;
var startX, scrollLeft;

if (iconSlider) {
  iconSlider.addEventListener("mousedown", function (event) {
    mouseIsDown = true;
    $(".feature_zone-icons").stop(true);
    startX = event.pageX - iconSlider.offsetLeft;
    scrollLeft = iconSlider.scrollLeft;
  });

  iconSlider.addEventListener("mouseleave", function () {
    mouseIsDown = false;
  });

  iconSlider.addEventListener("mouseup", function () {
    mouseIsDown = false;

    var currScrollX = iconSlider.scrollLeft;
    var scrollDiff = (scrollLeft - currScrollX) * -1;
    var newScrollX = currScrollX + scrollDiff * 0.4;

    $(".feature_zone-icons")
      .stop(true)
      .animate({ scrollLeft: newScrollX }, 400, "linear");
  });

  iconSlider.addEventListener("mousemove", function (event) {
    if (!mouseIsDown) {
      return;
    }
    var mousePosX = event.pageX - iconSlider.offsetLeft;
    var slideValue = (mousePosX - startX) * 1.5;
    iconSlider.scrollLeft = scrollLeft - slideValue;
  });
}

// check if element in viewport
// function isElementInViewport(el) {
//   var elBoundingRect = el.getBoundingClientRect();
//   var elHeight = elBoundingRect.height;
//   var elTop = elBoundingRect.top;
//   var offset = elHeight / 4;
//   var windowHeight =
//     window.innerHeight || document.documentElement.clientHeight;

//   return elTop + offset <= windowHeight && elTop + elHeight - offset >= 0;
// }

// show and hide dishboard based on scroll
// function checkDashboardVisibility(event) {
//   if (getScreenSize() < 769) {
//     if (
//       getScrollDirection() === scrollDirections.DOWN &&
//       getScrollTop() > 300
//     ) {
//       siteDashboard.classList.add("site-dashboard-inactive");
//     } else {
//       siteDashboard.classList.remove("site-dashboard-inactive");
//     }
//   }
// }

// uiKit animations using scrollSpy
var topServiceGrids = document.getElementById("top-service-grids");
var options = {
  cls: "animation-fade",
  target: "> div",
  delay: 220,
  repeat: true,
};
UIkit.scrollspy(topServiceGrids, options);

var sectionIntro = document.getElementsByClassName("section-intro");
var sectionOptions = {
  cls: "animation-fade",
  delay: 220,
  repeat: true,
};
for (var i = 0; i < sectionIntro.length; i++) {
  UIkit.scrollspy(sectionIntro[i], sectionOptions);
}
