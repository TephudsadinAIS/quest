<script lang="ts">
    import { svelteManager, GameState, icons } from '../SvelteManager.svelte';

    function returnToMenu() {
        svelteManager.currentState = GameState.MainMenu;
    }
</script>

<div class="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
    <div class="bg-white w-full max-w-sm rounded-[2rem] p-8 text-center flex flex-col items-center shadow-2xl">
      <div class="mb-4 text-purple-500">
        {@html icons.limit}
      </div>
      <h2 class="text-2xl font-bold mb-2 text-gray-800">คุณทำแบบทดสอบครบแล้ว!</h2>
      <p class="text-gray-500 mb-6">กลับมาทำอีกครั้งในวันพรุ่งนี้นะ</p>
      <button onclick={returnToMenu} class="bg-main w-full text-white font-bold py-3 rounded-full transition">
        ตกลง
      </button>
    </div>
</div>