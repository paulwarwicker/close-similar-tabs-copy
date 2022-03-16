// close-similar-tabs-copy (https://github.com/paulwarwicker/close-similar-tabs-copy)
// modified copy of https://github.com/webdkt/ff-close-similar-tabs
// excludes any removal of pinned tabs

var id="https://github.com/paulwarwicker/close-similar-tabs-copy";

browser.menus.create({
  id: id,
  title: "Close similar tabs",
  contexts: ["tab"]
});

browser.menus.onClicked.addListener((info, tab) => {
  console.log("Item %o clicked in tab %d (%s)", info.menuItemId, tab.id, tab.url);

  if (info.menuItemId == id) {
    var url = extractHostnameWithProtocol(tab.url);
    console.log(url);

    var querying = browser.tabs.query({ url: url + "/*", currentWindow: true });
    querying.then(function (tabs) {
      for (tab of tabs) {
        if (!tab.active && !tab.pinned) {
          browser.tabs.remove(tab.id);
          console.log("Tab %d closed (%s)", tab.id, tab.url);
        }
      }
    })
  }
});

browser.menus.onShown.addListener(async function (info, tab) {
  console.log("Item %o shown in tab %d (%s)", info.menuItemId, tab.id, tab.url);

  var url = extractHostnameWithProtocol(tab.url);
  console.log(url);

  var querying = browser.tabs.query({ url: url + "/*", currentWindow: true });
  querying.then(function (tabs) {
    var count = tabs.length;
    for (tab of tabs) {
      if (tab.active || tab.pinned) {
        count--;
      }
    }

    browser.menus.update(id, { title: "Close similar tabs (" + count + ")" });
    browser.menus.refresh();
  })
})

function extractHostnameWithProtocol(url) {
  var hostname = url.match(/(([a-z]*:\/\/)?[^\/]+)/i)[1];;
  return hostname;
}