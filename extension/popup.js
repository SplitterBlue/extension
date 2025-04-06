const siteUrl = "https://hackathon-nine-virid.vercel.app"; // Replace with your actual site URL
let coinToken = null;

const storedToken = localStorage.getItem("coinToken");
if (storedToken) {
  console.log("✅ Token found in local storage:", storedToken);
  coinToken = storedToken;
  useToken(); // Call useToken if token is already available
} else {
  console.log("ℹ️ No token found in local storage. Requesting token...");

  chrome.runtime.sendMessage({ type: "getCoinToken" }, async (response) => {
    if (chrome.runtime.lastError) {
      console.error(
        "❌ Could not get token:",
        chrome.runtime.lastError.message
      );
      return;
    }
    console.log("✅ Got token from background:", response?.token);
    coinToken = response?.token; // Store the coin token for later use
    if (response?.token) {
      localStorage.setItem("coinToken", response.token);

      chrome.storage.local.set({ coinToken: response.token });
      console.log("✅ Token saved to local storage.");
      useToken(); // Call useToken to fetch tasks and wallet balance
    } else {
      console.error("❌ No token received to save to local storage.");
    }
  });
}

async function useToken() {
  try {
    const resp = await fetch(
      "https://focus-coin-api.onrender.com/suggestions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${coinToken}`,
        },
      }
    );

    const body = await resp.json();
    const tasks = body.tasks;

    // let displayTasks = tasks.length <= 3 ? tasks : tasks.slice(0, 3)
    

    const container = document.querySelector("#tasks");
    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className =
        "bg-white rounded-lg shadow-sm flex items-center justify-between relative";
      taskElement.id = "taskel";

      taskElement.innerHTML = `
                <div class="bg-gray-300 bg-opacity-50 text-black flex items-center text-center justify-center w-full h-full bg-white p-3 rounded-lg shadow-sm flex relative">
                    Mark as Done
                </div>
                <div class="w-full h-full absolute bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:opacity-0 transition-opacity duration-300 cursor-pointer bg-white">
                    <span class="text-gray-700">${
                      task.task || "Untitled Task"
                    }</span>
                    <span class="text-blue-500 font-bold">+ ${task.score}</span>
                </div>
            `;

      container.appendChild(taskElement);

      taskElement.addEventListener("click", async () => {
        let mod =
          parseInt(
            taskElement
              .querySelectorAll("div")[1]
              .innerText.split("+")[1]
              .trim()
          ) || 0;
        let bal = parseInt(document.querySelector("#balance").textContent) || 0;

        const resp3 = await fetch(
          "https://focus-coin-api.onrender.com/wallet",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${coinToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: mod }),
          }
        );

        const body3 = await resp3.json();
        walletElement.textContent = body3.new_wallet_balance;
        taskElement.innerHTML = "";
      });
    });

    const resp2 = await fetch("https://focus-coin-api.onrender.com/wallet", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${coinToken}`,
      },
    });

    const body2 = await resp2.json();
    const wallet_balance = body2.wallet_balance || 0; // Fallback to 0 if wallet_balance is not available
    const walletElement = document.querySelector("#balance");
    if (walletElement) {
      walletElement.textContent = wallet_balance;
    } else {
      console.error("❌ Wallet balance element not found in the popup.");
    }
  } catch (error) {
    console.log("❌ Error fetching tasks:", error);
  }
}
