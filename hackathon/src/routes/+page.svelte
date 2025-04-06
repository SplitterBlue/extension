<script>
    import { onMount } from 'svelte';
    import Calendar from '$lib/components/Calendar.svelte';
    import Preferences from '$lib/components/Preferences.svelte';

    let balance = 0;
    let tasks = [];
    let userPreferences = {};
    let calendarEvents = [];
    let userProfile = {
        name: "Alex  Anca", // Replace with dynamic data if available
        avatar: "https://via.placeholder.com/40", // Replace with user's Google avatar URL
    };

    onMount(async () => {
        const coinToken = localStorage.getItem('coinToken');
        if (!coinToken) {
            // Redirect to login or handle the absence of the token
            window.location.href = '/login';
            return;
        }
        const response = await fetch(
      "https://focus-coin-api.onrender.com/suggestions",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${coinToken}`,
        },
      }
    );

    const balance_response = await fetch(
      "https://focus-coin-api.onrender.com/wallet",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${coinToken}`,
        },
      }
    );
        const data = await response.json();
        tasks = data.tasks;
        const balanceData = await balance_response.json();
        balance = balanceData.wallet_balance || 25; // Fallback to 0 if balance is undefined
        userPreferences = data.preferences;
        calendarEvents = data.calendarEvents;

        // Fetch user profile data if needed
        // const userResponse = await fetch('/api/user-profile');
        // userProfile = await userResponse.json();
    });

    function goToSettings() {
        window.location.href = '/settings'; // Redirect to the settings page
    }

    function markAsDone(task) {
        balance += task.score;
        tasks = tasks.filter(t => t !== task);
        // Optionally, send the updated task status to the backend
        fetch(
      "https://focus-coin-api.onrender.com/wallet",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${coinToken}`,
        },
        body: JSON.stringify({
          amount: task.score,
        }),
      })
    }
</script>

<div class="max-w-7xl mx-auto p-6">
    <!-- User Profile Section -->
    <div id="user-profile" class="flex items-center mb-6 absolute top-0 right-0 mt-4 mr-6 bg-gray-100 p-4 rounded-lg ">
        <img
            src="https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?cs=srgb&dl=pexels-kellie-churchman-371878-1001682.jpg&fm=jpg"
            alt="User Avatar"
            class="w-10 h-10 rounded-full mr-4"
        />
        <div>
            <p class="text-lg font-semibold text-gray-700">{userProfile.name}</p>
            <button
                on:click={goToSettings}
                class="text-blue-500 hover:underline text-sm"
            >
                Go to Settings
            </button>
        </div>
    </div>

    <h1 class="text-3xl font-bold text-blue-600 mb-6">Dashboard</h1>

    <!-- Coin Balance -->
    <div id="coin-balance" class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700">
            Coin Balance:
            <span id="balance" class="text-blue-500 font-bold">{balance}</span>
        </h2>
    </div>

    <!-- Tasks Section -->
    <div id="tasks" class="mb-6">
        <div class="bg-blue-50 p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-blue-600 mb-4">Your Tasks</h3>
            <div class="space-y-4">
                {#if tasks?.length > 0}
                    {#each tasks as task}
                        <div class="bg-white rounded-lg shadow-sm flex items-center justify-between p-4">
                            <div>
                                <span class="text-gray-700">{task.task}</span>
                                <span class="text-blue-500 font-bold ml-2">+{task.score} Coins</span>
                            </div>
                            <button
                                on:click={() => markAsDone(task)}
                                class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
                            >
                                Mark as Done
                            </button>
                        </div>
                    {/each}
                {:else}
                    <p class="text-gray-500">No tasks available. Enjoy your day!</p>
                {/if}
            </div>
        </div>
    </div>

    <!-- Calendar Section -->
    <div id="calendar" class="mb-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-blue-600 mb-4">Your Calendar</h3>
            <Calendar {calendarEvents} />
        </div>
    </div>

    <!-- Preferences Section -->
    <div id="preferences" class="mb-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-xl font-semibold text-blue-600 mb-4">Your Preferences</h3>
            <Preferences {userPreferences} />
        </div>
    </div>
</div>
