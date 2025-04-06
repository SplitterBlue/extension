const token = localStorage.getItem("authToken");
chrome.runtime.sendMessage({ type: "authToken", token: token });
const c = localStorage.getItem("coinToken");
chrome.runtime.sendMessage({ type: "coinToken", token: c });