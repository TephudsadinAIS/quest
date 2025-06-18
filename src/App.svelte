<script lang="ts">
  import './app.css';
  import { svelteManager, GameState } from './SvelteManager.svelte';
  import { onMount } from 'svelte';
  import PageStart from './components/PageStart.svelte';
  import PageGameplay from './components/PageGameplay.svelte';
  import PageGameOver from './components/PageGameOver.svelte';
  import PageMaxAttempts from './components/PageMaxAttempts.svelte';

 onMount(() => {
   svelteManager.currentState === GameState.MainMenu
});

</script>

<main>
  {#if svelteManager.currentState === GameState.MainMenu}
    <PageStart />
    console.log("Current State: Main Menu");
  {:else if svelteManager.currentState === GameState.Playing}
    <PageGameplay />
  {:else if svelteManager.currentState === GameState.GameOver}
    <PageGameOver />
  {:else if svelteManager.currentState === GameState.MaxAttempts}
    <PageMaxAttempts />
  {/if}
</main>