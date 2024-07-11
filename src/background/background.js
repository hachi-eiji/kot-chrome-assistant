const postRequest = (endpoint, headers, body, sendResponse) => {
  fetch(endpoint, {
    'method': 'POST',
    'headers': headers,
    'body': body
  })
    .then((res) => res.json())
    .then((res) => {
      if (res && res.ok) {
        sendResponse({ 'status': 'success' });
      } else {
        console.error(JSON.stringify(res));
        sendResponse({ 'status': 'failed' });
      }
    })
    .catch((err) => {
      console.error(err);
      sendResponse({ 'status': 'failed' });
    });
};

const validateEndpoint = (endpoint) => {
  const whitelist = [
    'https://slack.com/api/chat.postMessage',
    'https://slack.com/api/users.profile.set',
    'https://hooks.slack.com/services/',
  ]
  return whitelist.some((l) => endpoint.startsWith(l));
};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (!msg) {
    sendResponse({ 'status': 'listener is missing.\n' + msg });
    return true;
  }

  if (msg.contentScriptQuery === 'postMessage' && validateEndpoint(msg.endpoint)) {
    postRequest(msg.endpoint, msg.headers, msg.body, sendResponse)
    return true;
  }

  if (msg.contentScriptQuery === 'changeStatus' && validateEndpoint(msg.endpoint)) {
    postRequest(msg.endpoint, msg.headers, msg.body, sendResponse)
    return true;
  }

  sendResponse({ 'status': 'listener is missing.\n' + msg });
  return true;
});

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get('openInNewTab', function (data) {
    if (data.openInNewTab) {
      chrome.action.setPopup({ popup: '' });
    } else {
      chrome.action.setPopup({ popup: 'src/browser_action/browser_action.html' });
    }
  });
});

chrome.action.onClicked.addListener(function () {
  let myrecUrl = "https://s2.ta.kingoftime.jp/independent/recorder/personal/";

  chrome.storage.sync.get(["openInNewTab", "s3Selected", "samlSelected"], (items) => {
    if (items.openInNewTab) {
      chrome.action.setPopup({ popup: '' });

      if (items.s3Selected || items.samlSelected) {
        const subdomain = !items.s3Selected ? "s2" : "s3";
        const recorder = !items.samlSelected ? "recorder" : "recorder2"

        myrecUrl = `https://${subdomain}.ta.kingoftime.jp/independent/${recorder}/personal/`;

      }
      chrome.tabs.query({ url: myrecUrl, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
          chrome.tabs.update(tabs[0].id, { active: true, url: myrecUrl }).catch(function (e) { console.log(e.message) });
        } else {
          chrome.tabs.create({ url: myrecUrl }).catch(function (e) { console.log(e.message) });
        }
      });
    } else {
      chrome.action.setPopup({ popup: 'src/browser_action/browser_action.html' });
    }
  });
});
