// Run in the context of the web page
// can change DOM, structure, font, color, hyperlinks, etc
// Limitations: can't use all chrome APIs

chrome.runtime.sendMessage({todo: "showPageAction"});

chrome.storage.sync.get('theme_val', function(val){
  if (val.theme_val) {
    // init start
    changeColorDom(val.theme_val);
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "changeColor"){
    const selected_color = request.clickedColor;
    changeColorDom(selected_color);
  }
});

const $currentUrl = document.baseURI;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "voiceActivation"){
    const selected_val = request.checkboxVal;
    voiceToggle(selected_val);
  }
});


/* ===============================================
  function for changeColorDom in all pages
=============================================== */ 
  // create an object for collect style custom, append all custom style right there
  // in the end of line, concat that object and prepend that style in body page

  const changeColorDom = (selected_color) => {
    // convert theme text to color
    const listTheme = {
      "mekari": "#8763A9",
      "talenta": "#C02A34",
      "sleekr": "#018E57",
      "jurnal": "#009bde",
      "klikpajak": "#F57A1E"
    }
    const colorId = listTheme[selected_color];

    // for intercom if any
    let loopz = 0;
    const intercomInterval = setInterval(() => {
      loopz++;
      if ( $('.intercom-lightweight-app-launcher.intercom-launcher').length ) {
        $('.intercom-lightweight-app-launcher.intercom-launcher').css("background-color", colorId); 
        clearInterval(intercomInterval);
      } else if (loopz > 25) {
        clearInterval(intercomInterval);
      }
      $('.intercom-lightweight-app-launcher.intercom-launcher').css("background-color", colorId); 
    }, 1000);
    
    // for alert div if any 
    const alertDivInterval = setInterval(() => {
      loopz++;
      if ($('#warningPop').length) {
        $('#warningPop').css("background-color", colorId); 
        clearInterval(alertDivInterval);
      } else if ($('#warningpop').length) {
        $('#warningpop').css("background-color", colorId); 
        clearInterval(alertDivInterval);
      } else if (loopz > 15) {
        clearInterval(alertDivInterval);
      }
      $('.intercom-lightweight-app-launcher.intercom-launcher').css("background-color", colorId); 
    }, 1000);
    
    // for background pattern in dashboard if any
    if ($('main').length) {
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
            background-color: ${colorId};
            z-index: -1;
          ">
        </div>`;
      
      if (selected_color === 'talenta') {
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
              background-color: ${colorId};
              z-index: -1;
            ">
          </div>`;
      }
  
      // append stylePattern inside main
      $('main .pattern-style').remove();
      $('main').prepend(stylePattern);
    }

    // for theme in company index if any (.card-panel.payrollItem)
    const cardPanelPayrollItem = $('.card-panel.payrollItem');
    if (cardPanelPayrollItem.length) {
      const styleCustom = `
        <style>
          .card-panel.payrollItem {
            border-radius: 4px;
          }
          .card-panel.payrollItem:hover {
            background: ${colorId}
          }
        </style>
      `;
      $('body').prepend(styleCustom);
      console.log("ada");
      // append bunch of style
    }
  };
/* ===============================================
   ------- end of changeColorDom function --------
=============================================== */ 


/* ===============================================
  function for voiceToggle in all pages
=============================================== */ 
  const voiceToggle = (val) => {
    const triggerVoice = document.querySelector('.tl-dashboard-header small.text-dark');

    // only start if pages has that trigger
    if (triggerVoice) {
      if (val) {
        triggerVoice.addEventListener('click', startRecognition);
      } else {
        triggerVoice.removeEventListener('click', startRecognition);
      }
    }
  }

  // let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
  let recognition = new webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.lang = 'id-ID';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  // activate voice recognition
  const startRecognition = () => {
    recognition.start();
  }

  // onresult will fired once a successful result is received
  recognition.onresult = function(event) {
    const rec = event.results[0][0].transcript;
    const transcript = rec.toLocaleLowerCase();
    // const confidence = event.results[0][0].confidence;
    if (transcript.length) {
      commandRun(transcript);
    }
  }

  // once a single word has been recognised and it has finished being spoken,
  // this handler is fired to stop the speech recognition service from running.
  recognition.onspeechend = function() {
    recognition.stop();
  }

  // supposed to handle cases where speech was recognised an error occured
  // after 8s in silence, this function would be trigered
  recognition.onerror = function(event) {
    let errorText = event.error;
    if (event.error === "no-speech") errorText = "Tidak ada suara"
    console.log(errorText);
  }

  // convert fetch text to run command
  const commandRun = (val) => {
    console.log("you said : " + val); 

    const splitKey = val.split("luna ");
    if (splitKey.length > 1) {
      const commandKey = splitKey[1];
      if (commandKey.includes("ganti tema")) {
        const splitCommand = commandKey.split("ganti tema ");
        const themeValText = splitCommand[1];
        if (
            themeValText == "sneaker" ||
            themeValText == "speaker" ||
            themeValText == "flickr"  ||
            themeValText == "trigger" ||
            themeValText == "stiker"  ||
            themeValText == "sliker"
          ) {
          changeColorDom("sleekr");
          chrome.storage.sync.set({'theme_val': "sleekr"});
        } else {
          changeColorDom(themeValText);
          chrome.storage.sync.set({'theme_val': themeValText});
        }
      } else if (commandKey.includes("saldo cuti")) {
        $('.tl-dashboard-right p[data-target="#leaveDetailModal"] i').click()
      } else if (commandKey.includes("cuti minggu ini")) {
        $('.tl-dashboard-right .justify-content-between .btn-group .dropdown-menu a')[1].click();
      } else if (commandKey.includes("cuti hari ini")) {
        $('.tl-dashboard-right .justify-content-between .btn-group .dropdown-menu a')[0].click();
      }
    }
  }

/* ===============================================
   --------- end of voiceToggle function ---------
=============================================== */ 
