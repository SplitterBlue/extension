const token = localStorage.getItem("authToken");
chrome.runtime.sendMessage({ type: "authToken", token: token });
chrome.runtime.sendMessage({ type: "getToken" }, async (response) => {
  if (chrome.runtime.lastError) {
    console.error("❌ Message failed:", chrome.runtime.lastError.message);
    return;
  }
  console.log("✅ Token received from background:", response?.token);
  let coinToken = response?.token;
  const resp2 = await fetch("https://focus-coin-api.onrender.com/wallet", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${coinToken}`,
    },
  });

  const resp3 = await fetch("https://focus-coin-api.onrender.com/site-metric", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${coinToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ site: window.location.hostname}),
  });
  
  const body3 = await resp3.json();
  const body2 = await resp2.json();
  const wallet_balance = parseInt(body2.wallet_balance) || 0; // Fallback to 0 if wallet_balance is not available
  if (wallet_balance <= 0 && !body3.is_productive) {
    console.error(
      "❌ Insufficient funds to access this page. Wallet balance is 0 or less."
    );
    // Show overlay message
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    overlay.style.color = "white";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "10000";
    overlay.innerText =
      "Insufficient funds to access this page. Do some of your tasks!";
    overlay.style.fontWeight = "bold";
    overlay.style.fontSize = "24px";
    
document.documentElement.style.overflow = "hidden";

    // Append the overlay to the body
    document.body.appendChild(overlay);
  }
});

const c = localStorage.getItem("coinToken");
chrome.runtime.sendMessage({ type: "coinToken", token: c });
// Create overlay element
const overlay = document.createElement("div");
overlay.style.position = "fixed";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = "100%";
overlay.style.height = "100%";
overlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
overlay.style.color = "white";
overlay.style.display = "flex";
overlay.style.justifyContent = "center";
overlay.style.alignItems = "center";
overlay.style.zIndex = "10000";
overlay.innerText =
  "Insufficient funds to access this page. Do some of your tasks!";
overlay.style.fontWeight = "bold";
overlay.style.fontSize = "24px";
// Apply blur effect to the background page
//document.body.style.filter = "blur(2px)";

// Append overlay to the body
//document.body.appendChild(overlay);

// Disable scrolling on the page