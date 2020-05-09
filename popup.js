// This is js that only work inside the extension icon on top bar,
// we can't change DOM from here, so we should sendMessage to content script first to change DOM

$(function(){  
  chrome.storage.sync.get('theme_val', function(val){
    if (val.theme_val) {
      $('#cext-selected-val').text(val.theme_val);
      const optionSelected = $('.cext-select-item input[type="radio"][value="'+val.theme_val+'"]');
      optionSelected.closest('.cext-select-item').addClass('is-active');
      setThemeStyle(val.theme_val);
    } else {
      const optionSelected = $('.cext-select-item.is-active');
      if (optionSelected) optionSelected.removeClass('is-active');
    }
  });

  chrome.storage.sync.get('is_voice_set', function(val){
    // cheecked on checkbox
    $('#cext-checkbox-css').prop('checked', val.is_voice_set);
    setVoiceActivation(val.is_voice_set)
  });

  $('#cext-select-input').click(function(){
    $('#cext-select-menu').toggleClass('cext-hidden');
  });
  $('#cext-form-radio').change(function(){
    let cext_selected_val = $("input[name='cext-theme']:checked").val();
    $('#cext-selected-val').text(cext_selected_val);
    $('.cext-select-item').removeClass('is-active');
    $("input[name='cext-theme']:checked").closest('.cext-select-item').addClass('is-active');
    chrome.storage.sync.set({'theme_val': cext_selected_val});
    setThemeStyle(cext_selected_val);
  });
  $('#cext-checkbox-css').change(function(e){
    setVoiceActivation(e.currentTarget.checked);
    chrome.storage.sync.set({'is_voice_set': e.currentTarget.checked});
  });

  const setThemeStyle = function(val){
    chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {todo: "changeColor", clickedColor: val });
    });
  }

  const setVoiceActivation = function(val){
    chrome.tabs.query({active:true,currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id, {todo: "voiceActivation", checkboxVal: val });
    });
  }  
});
