let myrecUrl = "https://kintaiplus.freee.co.jp/independent/recorder/personal/";

const replaceMyrecToNeed = () => {
  chrome.storage.sync.get(["s3Selected", "samlSelected"], (items) => {
    const iframe = document.querySelector("#myrec iframe");
    if (iframe && (items.s3Selected || items.samlSelected)) {
      // 使わない
      // const subdomain = !items.s3Selected ? "s2" : "s3";
      // const recorder = !items.samlSelected ? "recorder" : "recorder2"

      myrecUrl = `https://kintaiplus.freee.co.jp/independent/recorder/personal/`;
      iframe.src = myrecUrl;
    }
  });
};

replaceMyrecToNeed();

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.contentScriptQuery === "NOT_LOGGED_IN") {
    document.getElementById(
      "notice"
    ).innerHTML = `<div class="notification is-info"><a href="${myrecUrl}" target="blank">Myレコーダー</a>から事前のログインとページの再読み込みをしてください。</div>`;
  }

  return true;
});
