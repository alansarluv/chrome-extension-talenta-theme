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
  if (request.todo == "voiceActivation"){
    const selected_val = request.checkboxVal;
    voiceToggle(selected_val);
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
};

const triggerVoice = document.querySelector('.tl-dashboard-header small.text-dark');

const startRecognition = () => {
  recognition.start();
}

// let SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
let recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.lang = 'id-ID';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
  const rec = event.results[0][0].transcript;
  const transcript = rec.toLocaleLowerCase();
  // const confidence = event.results[0][0].confidence;
  if (transcript.length) {
    commandRun(transcript);
  }
}

const voiceToggle = (val) => {
  if (val) {
    triggerVoice.addEventListener('click', startRecognition);
  } else {
    triggerVoice.addEventListener('click', startRecognition);
  }
}

const commandRun = (val) => {
  console.log("you said : " + val); 

  const splitKey = val.split("luna ");
  if (splitKey.length > 1) {
    const commandKey = splitKey[1];
    if (commandKey.includes("ganti tema")) {
      const splitCommand = commandKey.split("ganti tema ");
      const themeValText = splitCommand[1];
      if (themeValText == "mekari") {
        changeColorDom("#8763A9");
      } else if (themeValText == "klikpajak") {
        changeColorDom("#F57A1E");
      } else if (themeValText == "talenta") {
        changeColorDom("#C02A34");
      } else if (themeValText == "jurnal") {
        changeColorDom("#009bde");
      } else if (
          themeValText == "sneaker" ||
          themeValText == "speaker" ||
          themeValText == "flickr"  ||
          themeValText == "trigger" ||
          themeValText == "stiker"  ||
          themeValText == "sliker"
        ) {
        changeColorDom("#018E57");
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