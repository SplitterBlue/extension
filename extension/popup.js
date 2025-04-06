const siteUrl = "http://localhost:5173"; // Replace with your actual site URL
let coinToken = null;
chrome.runtime.sendMessage({ type: "getAuthToken" }, (response) => {
	if (chrome.runtime.lastError) {
		console.error("❌ Could not get token:", chrome.runtime.lastError.message);
		return;
	}
	console.log("✅ Got token from background:", response?.token);
});

chrome.runtime.sendMessage({ type: "getCoinToken" }, async (response) => {
	if (chrome.runtime.lastError) {
		console.error("❌ Could not get token:", chrome.runtime.lastError.message);
		return;
	}
	console.log("✅ Got token from background:", response?.token);
    coinToken = response?.token; // Store the coin token for later use
    try {
    const resp = await fetch("https://focus-coin-api.onrender.com/suggestions", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${coinToken}`,
        },
    });
    
    const body = await resp.json();
    const tasks = body.tasks;

    // let displayTasks = tasks.length <= 3 ? tasks : tasks.slice(0, 3)
    

    const container = document.querySelector("div#tasks");
    tasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "bg-white rounded-lg shadow-sm flex items-center justify-between relative";

        taskElement.innerHTML = `
            <div class="bg-gray-300 bg-opacity-50 text-black flex items-center text-center justify-center w-full h-full bg-white p-3 rounded-lg shadow-sm flex relative">
                Mark as Done
            </div>
            <div class="w-full h-full absolute bg-white p-3 rounded-lg shadow-sm flex items-center justify-between hover:opacity-0 transition-opacity duration-300 cursor-pointer bg-white">
                <span class="text-gray-700">${task.task || "Untitled Task"}</span>
                <span class="text-blue-500 font-bold">+ ${task.score}</span>
            </div>
        `;

        container.appendChild(taskElement);
    });

    document.body.appendChild(container);
} catch (error) {
    console.log("❌ Error fetching tasks:", error);
}
    

    
    

});

(async () => {
    
  try {


    
  } catch (err) {
    login();
    alert("Error: " + err.message);
  }

  function login() {
    chrome.tabs.create({
      url: `${siteUrl}/login`// external URL
    });
  }
  
})();

(async () => {
 
})//();


