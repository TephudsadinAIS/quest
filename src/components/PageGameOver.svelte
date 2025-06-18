<script lang="ts">
    import { fly } from "svelte/transition";
    import { onMount } from "svelte";
    import { svelteManager, GameState } from "../SvelteManager.svelte";

    let isLoading = $state(true);

    async function getSumScore() {
        isLoading = true;
        console.log("กำลังดึงข้อมูลสรุปคะแนน (จาก PageGameOver)...");
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockSummaryResponse = {
            scoreSummary: [
                { description: "ตอบถูก 2 ข้อ", points: 20, },
                { description: "โบนัสชุดนี้", points: 10, },
                { description: "ค่าแอคทีฟ", points: 10, },
                { description: "ตอบคำถามครบ 1 ชุด", points: 5, },
            ],
            total: 45,
        };
        svelteManager.roundSummary = {
            items: mockSummaryResponse.scoreSummary.map((item: any) => ({
                label: item.description,
                value: item.points,
            })),
            total: mockSummaryResponse.total,
        };
        isLoading = false;
    }

    onMount(() => {
        getSumScore();
    });

    function returnToMenu() {
        svelteManager.currentState = GameState.MainMenu;
    }
</script>

<div
    class="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-40"
    transition:fly={{ y: 20, duration: 300 }}
>
    <div
        class="bg-white w-full max-w-sm rounded-[2rem] p-6 text-center flex flex-col items-center shadow-2xl"
    >
        <h2 class="text-2xl font-bold mb-4 text-gray-800">ทำเสร็จแล้ว!</h2>

        {#if isLoading}
            <div class="w-full h-32 flex items-center justify-center">
                <p class="text-gray-500">กำลังโหลดผลคะแนน...</p>
            </div>
        {:else}
            <div class="w-full text-left text-gray-700 space-y-2 mb-4">
                {#each svelteManager.roundSummary.items as item}
                    <div class="flex justify-between">
                        <span>{item.label}</span>
                        <span class="font-bold text-blue-600">+{item.value}</span>
                    </div>
                {/each}
            </div>
            <hr class="w-full border-gray-200 my-2" />
            <div class="w-full text-center my-4">
                <p class="text-3xl font-extrabold text-blue-600">
                    +{svelteManager.roundSummary.total} คะแนน
                </p>
            </div>
        {/if}

        <button
            onclick={returnToMenu}
            class="bg-main w-full text-white font-bold text-lg py-3 rounded-full shadow-lg"
            disabled={isLoading}
        >
            เล่นอีกครั้ง
        </button>
    </div>
</div>