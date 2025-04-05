<script>
    import { onMount } from 'svelte';
    
    import Calendar from '$lib/components/Calendar.svelte';
    import Preferences from '$lib/components/Preferences.svelte';

    let balance = 0;
    let tasks = [];
    let userPreferences = {};
    let calendarEvents = [];
    let userProfile = {
        name: "John Doe", // Replace with dynamic data if available
        avatar: "https://via.placeholder.com/40", // Replace with user's Google avatar URL
    };

    onMount(async () => {
        const response = await fetch('/api/dashboard-data');
        const data = await response.json();
        tasks = data.tasks;
        balance = data.balance;
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
        balance += task.coins;
        tasks = tasks.filter(t => t !== task);
        // Optionally, send the updated task status to the backend
        fetch('/api/mark-task-done', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskId: task.id })
        });
    }
</script>

<div class="max-w-7xl mx-auto p-6">
    <!-- User Profile Section -->
    <div id="user-profile" class="flex items-center mb-6 absolute top-0 right-0 mt-4 mr-6 bg-gray-100 p-4 rounded-lg ">
        <img
            src="{userProfile.avatar}"
            alt="User Avatar"
            class="w-10 h-10 rounded-full mr-4"
        />
        <div>
            <p class="text-lg font-semibold text-gray-700">{userProfile.name}</p>
        </div>
    </div>

    <h1 class="text-3xl font-bold text-blue-600 mb-6">Settings</h1>

    <!-- Coin Balance -->
    <div id="coin-balance" class="mb-6">
        <h2 class="text-xl font-semibold text-gray-700">
            Coin Balance:
            <span id="balance" class="text-blue-500 font-bold">{balance}</span>
        </h2>
    </div>

    
</div>
