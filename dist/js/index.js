'use strict';

window.onload = function () {
  var main = document.createElement('main');
  main.classList.add('app');
  document.body.appendChild(main);
  var app = document.querySelector('.app');
  var typingSpeed = 20;
  var loadingText = '<i>•</i><i>•</i><i>•</i>';
  var messageIndex = 0;

  var messageTime = '<b>' + new Date().getHours() + ':' + new Date().getMinutes() + '</b>';

  var getCurrentTime = function getCurrentTime() {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var current = hours + minutes * 0.01;
    if (current >= 5 && current < 19) return 'Have a nice day! ✨';
    if (current >= 19 && current < 22) return 'Have a nice evening! ☀️';
    if (current >= 22 || current < 5) return 'Have a good night! 🌛';
  };
  var messages = ['Hello there 🤘🏻', 'I\'m Ramil. Front-End Developer who loves to code things on the web', 'I\'m currently accepting freelance works.<br>\n     You can see my\n     <a href="https://rommel7.github.io/" target="_blank" rel="noopener">CV</a> and\n     <a target="_blank" rel="noopener" href="https://github.com/juliangarnier">GitHub</a> by these links.', 'or you just can reach me via these methods:<br>\n     <a href="mailto:rommelmamedov@gmail.com">rommelmamedov@gmail.com</a><br>\n     <a target="_blank" rel="noopener" href="https://www.facebook.com/rommelmamedov">fb.com/ramilmamedov</a><br>\n     <a target="_blank" rel="noopener" href="https://www.linkedin.com/in/ramil-mamedov">linkedin.com/ramilmamedov</a>\n    ', '<span class="last-message">Thank you!  ' + getCurrentTime() + '</span>'];

  var getFontSize = function getFontSize() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  };

  var pxToRem = function pxToRem(px) {
    return px / getFontSize() + 'rem';
  };

  var createBubbleElements = function createBubbleElements(message, position) {
    var bubbleEl = document.createElement('section');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    // Time
    var messageTime = document.createElement('b');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    // Time
    messageTime.innerHTML = new Date().getHours() + ':' + new Date().getMinutes();
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    };
  };

  setTimeout(function () {
    var bubblesList = document.querySelectorAll('.bubble');
    console.log(bubblesList);
    var lastBubble = bubblesList[bubblesList.length - 1];
    console.log(lastBubble);
  }, 14500);

  var getDimentions = function getDimentions(elements) {
    return dimensions = {
      loading: {
        w: '5.85rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    };
  };

  var sendMessage = function sendMessage(message, position) {
    var loadingDuration = message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed + 500;
    var elements = createBubbleElements(message, position);
    app.appendChild(elements.bubble);
    app.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > app.offsetHeight) {
      var scrollMessages = anime({
        targets: app,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, 0.95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [0.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic'
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('i'),
      scale: [1, 1.25],
      opacity: [0.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function delay(i) {
        return i * 100 + 50;
      }
    });
    setTimeout(function () {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function update(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w],
        height: [dimensions.loading.h, dimensions.bubble.h],
        marginTop: 0,
        marginLeft: 0
      });
    }, loadingDuration - 50);
  };

  var sendMessages = function sendMessages() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed + anime.random(900, 1200));
  };
  sendMessages();
};