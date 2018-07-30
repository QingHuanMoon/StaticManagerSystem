(function flexible (window, document) {
  console.log('rem Run');
  let docEl = document.documentElement;
  let dpr = window.devicePixelRatio || 1;
  // adjust body font size
  function setBodyFontSize () {
    if (document.body) {
      document.body.style.fontSize = (12 * dpr) + 'px'
    }
    else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize();

  /**
   *  移動端
   */
  // 如果是640的設計稿 把 375 換成 320
  // 如果是750的設計稿 375 不變
  // 20 的意思是 默認 以375的設計稿為基準, 1rem = 20px

  /**
   *  Pc 端
   */
  // 這裡的1920可以替換成你Pc設計稿的尺寸,
  // 100 的意思是 默認 以1920的設計稿為基準, 1rem = 100px
  function setRemUnit () {
    let rem = docEl.clientWidth / 10 ;
    if( rem > 64 ) {
      rem = docEl.clientWidth / 1920 * 100;
    }
    docEl.style.fontSize = rem + 'px'

  }

  setRemUnit();

  // reset rem unit on page resize
  window.addEventListener('resize', setRemUnit);
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // detect 0.5px supports
  if (dpr >= 2) {
    let fakeBody = document.createElement('body');
    let testElement = document.createElement('div');
    testElement.style.border = '.5px solid transparent';
    fakeBody.appendChild(testElement);
    docEl.appendChild(fakeBody);
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document);