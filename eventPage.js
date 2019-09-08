// This is something that running in a 'backgrond' as defined in manifest.json
// So chrome.tabs means select all tabs in chrome, and check the active and currentwindow, then set it to .show to activate the icon

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
  if (request.todo == "showPageAction") {
    chrome.tabs.query({active:true, currentWindow: true}, function(tabs){
      chrome.pageAction.show(tabs[0].id);  
    });
  }
})
