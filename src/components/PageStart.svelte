<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import {
        svelteManager,
        GameState,
        icons,
        GAME_STATUS,
    } from "../SvelteManager.svelte";

    interface GameStatus {
        status: GAME_STATUS;
        statusMessage: string;
        round: number;
        maxRound: number;
    }

    let gameStatus = $state<GameStatus | null>(null);

    const imageUrls = {
        logo: "/gameLogo.png",
        iconRule: "/iconrule.png",
        iconQuiz: "/iconquz.png",
    };

    async function getLogin() {
        const res = await fetch(`https://masque-lab.adldigitalservice.com/services/quiz-game/login`, {
            headers: { "x-user-id": svelteManager.userId },
        });
        const data = await res.json();
        svelteManager.userId = data.userId;
        svelteManager.theme = {
            ...svelteManager.theme,
            mascotImage: data.mascotImage,
            missionImage: data.missionImage,
            ruleImage: data.ruleImage,
            mainColor: data.mainColor,
        };
        if (typeof document !== "undefined") {
            document.documentElement.style.setProperty(
                "--main",
                data.mainColor,
            );
        }
    }

    async function fetchStatus() {
        try {
            const res = await fetch(`https://masque-lab.adldigitalservice.com/services/quiz-game/status`, {
                headers: { "x-user-id": svelteManager.userId },
            });
            gameStatus = await res.json();
        } catch (err) {
            console.error("โหลดสถานะล้มเหลว", err);
            gameStatus = {
                status: GAME_STATUS.MAINTENANCE,
                statusMessage: "ไม่สามารถเชื่อมต่อระบบได้",
                round: 0,
                maxRound: 0,
            };
        }
    }

    function handleStartClick() {
        if (!gameStatus) return;
        svelteManager.currentState = GameState.Playing;
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

    onMount(async () => {
        await getLogin();
        await fetchStatus();
    });
</script>

<!-- ✅ Layout UI -->
<div
    class="relative w-full h-screen flex flex-col items-center justify-center bg-gray-400 p-4"
>
    <!-- BG -->
    <div
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url('https://placehold.co/400x800/cccccc/cccccc'); filter: blur(4px);"
    ></div>
    <div class="absolute inset-0 bg-black/30"></div>

    <!-- ปุ่ม Rules/Info -->
    <div class="absolute top-5 right-5 flex flex-col space-y-3 z-10">
        <button onclick={openRulesModal} class="w-12 h-12">
            <img src={imageUrls.iconRule} alt="Rules" />
        </button>
        <button onclick={openQuizInfoModal} class="w-12 h-12">
            <img src={imageUrls.iconQuiz} alt="Info" />
        </button>
    </div>

    <!-- โลโก้ + ปุ่มเริ่ม -->
    <div class="relative z-10 flex flex-col items-center">
        <img src={imageUrls.logo} alt="Game Logo" class="w-64 md:w-80 mb-8" />

        {#if gameStatus === null}
            <p class="text-white font-bold">กำลังโหลดข้อมูล...</p>
        {:else if gameStatus.status === GAME_STATUS.MAINTENANCE || gameStatus.status === GAME_STATUS.CLOSED || gameStatus.status === GAME_STATUS.COMPLETED}
            <p class="text-white bg-red-500/80 px-4 py-2 rounded-lg">
                {gameStatus.statusMessage || "กิจกรรมไม่พร้อมใช้งาน"}
            </p>
        {:else}
            <button
                onclick={handleStartClick}
                class="bg-main text-white font-bold text-lg px-16 py-3 rounded-full shadow-lg flex items-center space-x-2"
            >
                {@html icons.play}
                <span>เริ่ม ({gameStatus.round}/{gameStatus.maxRound})</span>
            </button>
        {/if}
    </div>
</div>

<!-- ✅ Modal Rules / Quiz Info -->
{#if svelteManager.showRules || svelteManager.showQuizInfo}
    <div
        class="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 p-4"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <div class="w-full max-w-sm">
            <img
                src={svelteManager.showRules
                    ? svelteManager.theme.ruleImage
                    : svelteManager.theme.missionImage}
                alt="Info"
                class="w-full h-auto rounded-2xl"
            />
        </div>
        <button
            onclick={closeModals}
            class="mt-6 bg-white/20 text-white rounded-full p-3"
        >
            {@html icons.close}
        </button>
    </div>
{/if}
