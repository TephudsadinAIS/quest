<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { svelteManager, GameState, icons, GAME_STATUS } from '../SvelteManager.svelte';

    interface GameStatus {
        status: GAME_STATUS;
        statusMessage: string;
        round: number;
        maxRound: number;
    }

    let gameStatus = $state<GameStatus | null>(null);

    const imageUrls = {
        logo: '/gameLogo.png',
        iconRule: '/iconrule.png',
        iconQuiz: '/iconquz.png'
    };

    async function fetchStatus() {
        gameStatus = null;
        console.log("กำลังดึงข้อมูลสถานะเกม (จาก PageStart)...");
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockStatusResponse = {
            status: GAME_STATUS.COMPLETED, // ลองเปลี่ยนเป็น "ONLINE" เพื่อให้ทดสอบ
            statusMessage: "ปิดปรับปรุงระบบชั่วคราว",
            round: 1,
            maxRound: 5
        };

        console.log("ได้รับข้อมูลสถานะ:", mockStatusResponse);
        gameStatus = mockStatusResponse;
    }

    function startQuiz() {
        svelteManager.currentState = GameState.Playing;
        svelteManager.userAnswers = {};
        svelteManager.quizResults = [];
        svelteManager.submitted = false;
        svelteManager.score = 0;
    }

    function handleStartClick() {
        // ✅ แก้ไข logic ให้ถูกต้อง
        if (!gameStatus || gameStatus.status === GAME_STATUS.MAINTENANCE || gameStatus.status === GAME_STATUS.CLOSED) {
            return;
        }

        if (gameStatus.round < gameStatus.maxRound) {
            startQuiz();
        } else {
            svelteManager.currentState = GameState.MaxAttempts;
        }
    }

    function openRulesModal() {
        svelteManager.showRules = true;
    }

    function openQuizInfoModal() {
        svelteManager.showQuizInfo = true;
    }

    function closeModals() {
        svelteManager.showRules = false;
        svelteManager.showQuizInfo = false;
    }

    onMount(() => {
        fetchStatus();
    });
</script>

<div class="relative w-full h-screen flex flex-col items-center justify-center bg-gray-400 p-4">
    <div class="absolute inset-0 bg-cover bg-center" style="background-image: url('https://placehold.co/400x800/cccccc/cccccc'); filter: blur(4px);"></div>
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- ✅ เปลี่ยนเป็น on:click -->
    <div class="absolute top-5 right-5 flex flex-col space-y-3 z-10">
        <button on:click={openRulesModal} class="w-12 h-12">
            <img src={imageUrls.iconRule} alt="Rules" />
        </button>
        <button on:click={openQuizInfoModal} class="w-12 h-12">
            <img src={imageUrls.iconQuiz} alt="Info" />
        </button>
    </div>

    <div class="relative z-10 flex flex-col items-center">
        <img src={imageUrls.logo} alt="Game Logo" class="w-64 md:w-80 mb-8" />

        {#if gameStatus === null}
            <div class="h-12 flex items-center justify-center">
                <p class="text-white font-bold">กำลังโหลดข้อมูล...</p>
            </div>
        {:else if gameStatus.status === GAME_STATUS.MAINTENANCE || gameStatus.status === GAME_STATUS.CLOSED}
            <div class="text-center">
                <p class="text-white bg-red-500/80 px-4 py-2 rounded-lg">{gameStatus.statusMessage}</p>
            </div>
        {:else}
            <!-- ✅ เปลี่ยนเป็น on:click -->
            <button on:click={handleStartClick} class="bg-main text-white font-bold text-lg px-16 py-3 rounded-full shadow-lg flex items-center space-x-2">
                {@html icons.play}
                <span>เริ่ม ({gameStatus.round}/{gameStatus.maxRound})</span>
            </button>
        {/if}
    </div>
</div>

{#if svelteManager.showRules || svelteManager.showQuizInfo}
    <div class="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4" transition:fly={{ y: 20, duration: 300 }}>
        <div class="w-full max-w-sm">
            <img src={svelteManager.showRules ? svelteManager.theme.ruleImage : svelteManager.theme.missionImage} alt="Info" class="w-full h-auto rounded-2xl" />
        </div>
        <!-- ✅ เปลี่ยนเป็น on:click -->
        <button on:click={closeModals} class="mt-6 bg-white/20 text-white rounded-full p-3">
            {@html icons.close}
        </button>
    </div>
{/if}
