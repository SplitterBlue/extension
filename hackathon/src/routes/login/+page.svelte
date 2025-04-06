<script>
	import { onMount } from 'svelte';

	let balance = 0;
	let tasks = [];
	let userPreferences = {};
	let calendarEvents = [];
	let userProfile = {
		name: 'Guest',
		avatar: 'https://via.placeholder.com/40'
	};

	let accessToken = null;

	onMount(async () => {
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;
		document.head.appendChild(script);

		await new Promise((resolve) => {
			script.onload = resolve;
		});

        

    if (localStorage.getItem('authToken')) {
        accessToken = localStorage.getItem('authToken');
        console.log('🔐 Using existing access token:', accessToken);
        useToken();
    } else {
        console.log('🔐 No existing access token found, requesting new one...');
    }
	});

	function handleCredentialResponse(response) {
		const id_token = response.credential;
		const payload = JSON.parse(atob(id_token.split('.')[1]));
		const { sub: auth_id, email, name, picture } = payload;

		userProfile = {
			name: name,
			avatar: picture || 'https://via.placeholder.com/40'
		};

		console.log('✅ Logged in as:', userProfile.name);

		// Send to backend (optional)
		fetch('https://focus-coin-api.onrender.com/auth', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id_token,
				profile: { email, name },
				auth_id
			})
		});
	}

    // if the token is already in localStorage, use it
    

	function requestAccessToken() {
		const tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: '806927995382-2f5dn1a69e023129jrhtq0ldbka1ohhb.apps.googleusercontent.com',
			scope: 'https://www.googleapis.com/auth/tasks.readonly',
			callback: (tokenResponse) => {
				accessToken = tokenResponse.access_token;
				console.log('🔐 Got access token:', accessToken);

				// Example: Fetch tasks list
				localStorage.setItem('id_token', accessToken);
                useToken();
			}
		});

		tokenClient.requestAccessToken();
        
	}

   function useToken() {
    const accessToken = localStorage.getItem('id_token');
     fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				})
					.then((res) => res.json())
					.then((data) => {
						console.log('📋 Google Tasks lists:', data);
						tasks = data.items || [];
					})
					.catch((err) => console.error('❌ Error fetching tasks:', err));
				fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
					headers: {
						Authorization: `Bearer ${accessToken}`
					}
				})
					.then((res) => res.json())
					.then((profile) => {
                        let id_token = accessToken
						let email = profile.email;
						let name = profile.name;
						let auth_id = profile.sub;
						console.log('👤 User Profile:', profile);
                        const pfp = JSON.parse(atob(localStorage.getItem("jwt_token").split('.')[1])).picture
						userProfile = {
							name: profile.name,
							avatar: profile.picture || 'https://via.placeholder.com/40'
						};
                        // log the 4 values to console
                        console.log('ID Token:', id_token);
                        console.log('Email:', email);
                        console.log('Name:', name);
                        console.log('Auth ID:', auth_id);
                        console.log({
								id_token,
								profile: { email, name },
								auth_id
							});
                            localStorage.setItem('authToken', id_token);
						fetch('https://focus-coin-api.onrender.com/auth', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({
								id_token,
								profile: { email, name },
								auth_id
							})
						}).then(async (res) => {
                            if (res.ok) {
                                let body = await res.json();

                                console.log(body);
                                localStorage.setItem('coinToken', body.app_token);
                                console.log('✅ Authenticated successfully');
                            } else {
                                console.error('❌ Authentication failed');
                            }
                        }).catch((err) => console.error('❌ Error during authentication:', err));
					})
					.catch((err) => console.error('❌ Error fetching profile info:', err));}

	function markAsDone(task) {
		balance += task.coins || 1;
		tasks = tasks.filter((t) => t !== task);

		fetch('/api/mark-task-done', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ taskId: task.id })
		});
	}

	function goToSettings() {
		window.location.href = '/settings';
	}
</script>

<div class="mx-auto max-w-7xl p-6">
	<!-- User Profile Section -->
	<div
		id="user-profile"
		class="absolute right-0 top-0 mb-6 mr-6 mt-4 flex items-center rounded-lg bg-gray-100 p-4"
	>
		<img src={userProfile.avatar} alt="User Avatar" class="mr-4 h-10 w-10 rounded-full" />
		<div>
			<p class="text-lg font-semibold text-gray-700">{userProfile.name}</p>
		</div>
	</div>

	<h1 class="mb-6 text-3xl font-bold text-blue-600">Settings</h1>

	<!-- Coin Balance -->
	<div id="coin-balance" class="mb-6">
		<h2 class="text-xl font-semibold text-gray-700">
			Coin Balance:
			<span id="balance" class="font-bold text-blue-500">{balance}</span>
		</h2>
	</div>

	<!-- Button to fetch Google Tasks -->
	<div class="mt-4 flex justify-center">
		<button
			on:click={requestAccessToken}
			class="rounded bg-blue-600 px-4 py-2 font-semibold text-white shadow hover:bg-blue-700"
		>
			Connect Google Tasks
		</button>
	</div>

	<!-- Google Sign-In Button -->
	<div id="g_id_signin" class="mt-4 flex justify-center"></div>

	<!-- Task list -->
	{#if tasks.length}
		<div class="mt-6">
			<h2 class="mb-2 text-xl font-semibold">Your Task Lists:</h2>
			<ul class="list-disc pl-5">
				{#each tasks as task}
					<li>{task.title}</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
