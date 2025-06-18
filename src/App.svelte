<script lang="ts">
  import './app.css';
  import { svelteManager, GameState } from './SvelteManager.svelte';
  import { onMount } from 'svelte';
  import PageStart from './components/PageStart.svelte';
  import PageGameplay from './components/PageGameplay.svelte';
  import PageGameOver from './components/PageGameOver.svelte';
  import PageMaxAttempts from './components/PageMaxAttempts.svelte';

  onMount(() => {
    svelteManager.getTheme();
  });
</script>

<main>
  {#if svelteManager.currentState === GameState.MainMenu}
    <PageStart />
  {:else if svelteManager.currentState === GameState.Playing}
    <PageGameplay />
  {:else if svelteManager.currentState === GameState.GameOver}
    <PageGameOver />
  {:else if svelteManager.currentState === GameState.MaxAttempts}
    <PageMaxAttempts />
  {/if}
</main>