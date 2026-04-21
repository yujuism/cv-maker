<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		getUser,
		isLoading,
		signOut,
		signInWithGoogle,
		loginWithEmail,
		registerWithEmail
	} from '$lib/authStore.svelte';

	type Mode = 'login' | 'register' | 'verify-pending';
	let mode = $state<Mode>('login');
	let pendingEmail = $state('');

	// Email/password fields
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let error = $state('');
	let info = $state('');
	let submitting = $state(false);

	// Redirect if already logged in and verified
	$effect(() => {
		if (!isLoading() && getUser()?.emailVerified) goto('/');
	});

	function reset() {
		error = '';
		info = '';
	}

	async function handleLogin() {
		reset();
		if (!email || !password) { error = 'Please fill in all fields.'; return; }
		submitting = true;
		try {
			const u = await loginWithEmail(email, password);
			if (!u.emailVerified) {
				error = 'Please verify your email before signing in. Check your inbox.';
				await signOut();
			} else {
				goto('/');
			}
		} catch (e: any) {
			error = friendlyError(e.code);
		} finally {
			submitting = false;
		}
	}

	async function handleRegister() {
		reset();
		if (!email || !password || !confirmPassword) { error = 'Please fill in all fields.'; return; }
		if (password !== confirmPassword) { error = 'Passwords do not match.'; return; }
		if (password.length < 6) { error = 'Password must be at least 6 characters.'; return; }
		submitting = true;
		try {
			await registerWithEmail(email, password);
			pendingEmail = email;
			// sign out so they can't bypass verification by browsing directly
			await signOut();
			mode = 'verify-pending';
			password = '';
			confirmPassword = '';
		} catch (e: any) {
			error = friendlyError(e.code);
		} finally {
			submitting = false;
		}
	}

	async function handleGoogle() {
		reset();
		submitting = true;
		try {
			await signInWithGoogle();
			goto('/');
		} catch (e: any) {
			error = friendlyError(e.code);
		} finally {
			submitting = false;
		}
	}

	function friendlyError(code: string): string {
		const map: Record<string, string> = {
			'auth/user-not-found': 'No account found with this email.',
			'auth/wrong-password': 'Incorrect password.',
			'auth/invalid-credential': 'Invalid email or password.',
			'auth/email-already-in-use': 'An account with this email already exists.',
			'auth/weak-password': 'Password must be at least 6 characters.',
			'auth/invalid-email': 'Invalid email address.',
			'auth/invalid-phone-number': 'Invalid phone number. Use international format e.g. +628...',
			'auth/too-many-requests': 'Too many attempts. Please try again later.',
			'auth/invalid-verification-code': 'Invalid OTP code.',
		};
		return map[code] ?? 'Something went wrong. Please try again.';
	}
</script>

<svelte:head>
	<title>Sign In — CV Maker</title>
</svelte:head>


<div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
	<div class="bg-white rounded-2xl shadow-lg w-full max-w-md p-8">
		<!-- Logo -->
		<div class="text-center mb-6">
			<a href="/" class="text-2xl font-bold text-blue-600">CV Maker</a>
		</div>

		{#if mode === 'verify-pending'}
			<!-- VERIFY EMAIL STATE -->
			<div class="text-center py-4 space-y-4">
				<div class="text-5xl">✉️</div>
				<h2 class="text-lg font-bold text-gray-800">Check your inbox</h2>
				<p class="text-sm text-gray-500">
					We sent a verification link to <strong>{pendingEmail}</strong>.<br />
					Click it to activate your account — you'll be taken straight to the app.
				</p>
				<p class="text-xs text-gray-400">Didn't receive it? Check your spam folder.</p>
				<button onclick={() => { mode = 'login'; reset(); }} class="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 mt-2">
					Back to Login
				</button>
			</div>
		{:else}

		<!-- Tabs: Login / Register -->
		<div class="flex border-b border-gray-200 mb-6 text-sm font-medium">
			<button
				onclick={() => { mode = 'login'; reset(); }}
				class="flex-1 pb-2 {mode === 'login' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}"
			>Login</button>
			<button
				onclick={() => { mode = 'register'; reset(); }}
				class="flex-1 pb-2 {mode === 'register' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-400 hover:text-gray-600'}"
			>Register</button>
		</div>

		<!-- Error / Info -->
		{#if error}
			<div class="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg mb-4">{error}</div>
		{/if}
		{#if info}
			<div class="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg mb-4">{info}</div>
		{/if}

		<!-- LOGIN -->
		{#if mode === 'login'}
		<div class="space-y-4">
			<div>
				<label for="login-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
				<input id="login-email" bind:value={email} type="email" placeholder="you@example.com"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<div>
				<label for="login-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
				<input id="login-password" bind:value={password} type="password" placeholder="••••••••"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<button onclick={handleLogin} disabled={submitting}
				class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
				{submitting ? 'Signing in…' : 'Sign In'}
			</button>
		</div>

		<!-- REGISTER -->
		{:else if mode === 'register'}
		<div class="space-y-4">
			<div>
				<label for="reg-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
				<input id="reg-email" bind:value={email} type="email" placeholder="you@example.com"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<div>
				<label for="reg-password" class="block text-sm font-medium text-gray-700 mb-1">Password</label>
				<input id="reg-password" bind:value={password} type="password" placeholder="Min. 6 characters"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<div>
				<label for="reg-confirm" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
				<input id="reg-confirm" bind:value={confirmPassword} type="password" placeholder="••••••••"
					class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
			</div>
			<button onclick={handleRegister} disabled={submitting}
				class="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
				{submitting ? 'Creating account…' : 'Create Account'}
			</button>
		</div>

		{/if}

		<!-- Divider -->
		<div class="flex items-center gap-3 my-6">
			<div class="flex-1 h-px bg-gray-200"></div>
			<span class="text-xs text-gray-400">or continue with</span>
			<div class="flex-1 h-px bg-gray-200"></div>
		</div>

		<!-- Google -->
		<button onclick={handleGoogle} disabled={submitting}
			class="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
			<svg width="18" height="18" viewBox="0 0 48 48"><path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.7v6.2C6.7 42.8 14.8 48 24 48z"/><path fill="#FBBC05" d="M10.8 28.8c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.7C1 17.1 0 20.4 0 24s1 6.9 2.7 9.9l8.1-5.1z"/><path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.6-6.6C35.9 2.5 30.4 0 24 0 14.8 0 6.7 5.2 2.7 14.1l8.1 6.2C12.7 13.6 17.9 9.5 24 9.5z"/></svg>
			Sign in with Google
		</button>

		{/if}
	</div>
</div>
