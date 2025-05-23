let latestAuthToken = null;
let latestCoinToken = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
	if (msg.type === "authToken") {
        
		latestAuthToken = msg.token;
		console.log("✅ Received token from content.js:", latestAuthToken);
	}
	if (msg.type === "getAuthToken") {
		sendResponse({ token: latestAuthToken });
	}

    if (msg.type === "coinToken") {
		latestCoinToken = msg.token;
		console.log("✅ Received COIN TOKEN from content.js:", latestCoinToken);
	}
	if (msg.type === "getCoinToken") {
		sendResponse({ token: latestCoinToken });
	}
	// return true if you want to send response asynchronously

    if (msg.type === "getToken") {
        chrome.storage.local.get("coinToken", (result) => {
            if (result.coinToken) {
                console.log("✅ Token found in chrome.storage:", result.coinToken);
                sendResponse({ token: result.coinToken });
            } else {
                console.log("ℹ️ No token found in chrome.storage.");
                sendResponse({ token: null });
            }
        });
        return true; // ✅ Required to use sendResponse asynchronously
    }
});
