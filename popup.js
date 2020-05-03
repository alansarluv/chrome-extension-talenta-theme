// This is js that only work inside the extension icon on top bar,
// we can't change DOM from here, so we should sendMessage to content script first to change DOM

$(function(){  
  $('#cext-select-input').click(function(){
    $('#cext-select-menu').toggleClass('cext-hidden');
  });
  $('#cext-form-radio').change(function(){
    let cext_selected_val = $("input[name='cext-theme']:checked").val();
    $('#cext-selected-val').text(cext_selected_val);
    $('.cext-select-item').removeClass('is-active');
    $("input[name='cext-theme']:checked").closest('.cext-select-item').addClass('is-active');
    setThemeStyle(cext_selected_val);
  });
  $('#cext-checkbox-css').change(function(e){
    setCustomStyle(e.currentTarget.checked);
  });

  const setThemeStyle = function(val){
    listTheme = {
      "Mekari": "#8763A9",
      "Talenta": "#C02A34",
      "Sleekr": "#018E57",
      "Jurnal": "#009bde",
      "Klikpajak": "#F57A1E"
    }
    const selected_color = listTheme[val];

    chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {todo: "changeColor", clickedColor: selected_color });
    });
  }

  const setCustomStyle = function(val){
    chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {todo: "voiceActivation", checkboxVal: val });
    });
  }  
});
