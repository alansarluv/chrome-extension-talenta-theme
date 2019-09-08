// Run in the context of the web page
// can change DOM, structure, font, color, hyperlinks, etc
// Limitations: can't use all chrome APIs

chrome.runtime.sendMessage({todo: "showPageAction"});
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "changeColor"){
    const selected_color = request.clickedColor;
    $('nav.nav2').css("background-color", selected_color);
    $('nav.nav2 ul li.active').css("background-color", selected_color);
    $('.bodyWeb .dashboard-outRight').css("background-color", selected_color);
    $('iframe.intercom-launcher-frame').css("background-color", selected_color)
  }
});

const $currentUrl = document.baseURI;
if($currentUrl.includes("dashboard")){
  let el = document.querySelector('.bodyWeb .row .l9');
  el.classList.remove('l9');
  el.classList.add('l10');

  el = document.querySelector('.bodyWeb .row .col.l3.pad-r-n.pad-l-n'); 
  el.classList.remove('l3');
  el.classList.add('l2');
}
