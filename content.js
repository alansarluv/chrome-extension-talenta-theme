// Run in the context of the web page
// can change DOM, structure, font, color, hyperlinks, etc
// Limitations: can't use all chrome APIs

chrome.runtime.sendMessage({todo: "showPageAction"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "changeColor"){
    const selected_color = request.clickedColor;
    changeColorDom(selected_color);
  }
});

const $currentUrl = document.baseURI;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "changeCustomStyle"){
    const selected_val = request.checkboxVal;
    changeCustomStyle(selected_val);
  }
});

const changeColorDom = (selected_color) => {
  // for intercom
  $('.intercom-lightweight-app-launcher.intercom-launcher').css("background-color", selected_color); 

  // for background pattern
  let stylePattern = `
    <div
      class="pattern-style"
      style="
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 184px;
        background-color: ${selected_color};
        z-index: -1;
      ">
    </div>`;
  
  if (selected_color === '#C02A34') {
    stylePattern = `
      <div
        class="pattern-style"
        style="
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 184px;
          background: url(https://talenta.s3-ap-southeast-1.amazonaws.com/assets/images/img_talenta_pattern_red.png);
          background-repeat: repeat;
          background-size: 50px;
          background-color: ${selected_color};
          z-index: -1;
        ">
      </div>`;
  }

  // append stylePattern inside main
  $('main .pattern-style').remove();
  $('main').prepend(stylePattern);
}

const changeCustomStyle = (val) => {
  if (val) {
    if ($currentUrl.includes("dashboard")){
      let el = document.querySelector('.bodyWeb .row .l9');
      el.classList.remove('l9');
      el.classList.add('l10');

      el = document.querySelector('.bodyWeb .row .col.l3.pad-r-n.pad-l-n'); 
      el.classList.remove('l3');
      el.classList.add('l2');
    }
  } else {
    if ($currentUrl.includes("dashboard")){
      let el = document.querySelector('.bodyWeb .row .l10');
      el.classList.remove('l10');
      el.classList.add('l9');

      el = document.querySelector('.bodyWeb .row .col.l2.pad-r-n.pad-l-n'); 
      el.classList.remove('l2');
      el.classList.add('l3');      
    }
  }
}
