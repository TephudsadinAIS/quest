<script lang="ts">
    import { onMount } from "svelte";
    import { svelteManager, GameState } from "../SvelteManager.svelte";

    let isLoadingQuestion = $state(true);

    async function getQuestion() {
        isLoadingQuestion = true;
        svelteManager.submitted = false;

        try {
            const res = await fetch(
                `https://masque-lab.adldigitalservice.com/services/quiz-game/question`,
                {
                    headers: { "x-user-id": svelteManager.userId },
                },
            );
            const data = await res.json();
            svelteManager.currentQuestion = {
                ...data,
                choices: [
                    { label: "A", text: data.choiceA },
                    { label: "B", text: data.choiceB },
                    { label: "C", text: data.choiceC },
                    { label: "D", text: data.choiceD },
                ],
            };
        } catch (err) {
            console.error("โหลดคำถามล้มเหลว:", err);
        } finally {
            isLoadingQuestion = false;
        }
    }

    function handleAnswer(no: number, val: string) {
        if (!svelteManager.submitted) {
            svelteManager.userAnswers[no] = val;
        }
    }

    async function submitSingleAnswer() {
        const q = svelteManager.currentQuestion;
        const selected = svelteManager.userAnswers[q.no];
        if (!selected) return;

        const res = await fetch(
            `https://masque-lab.adldigitalservice.com/services/quiz-game/answer`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-user-id": svelteManager.userId,
                },
                body: JSON.stringify({ choice: selected }),
            },
        );

        const result = await res.json();
        svelteManager.lastAnswerResult = result;
        svelteManager.score += result.score;
        svelteManager.quizResults.push({
            question: `ข้อ ${q.no}`,
            points: result.score,
        });
        svelteManager.submitted = true;
    }

    async function goToNext() {
        const result = svelteManager.lastAnswerResult;
        if (!result) return;
        if (result.isShowResult) {
            svelteManager.currentState = GameState.GameOver;
        } else {
            await getQuestion();
        }
    }

    onMount(() => {
        getQuestion();
    });
</script>

<div class="fixed inset-0 flex items-center justify-center p-4">
    {#if isLoadingQuestion || !svelteManager.currentQuestion}
        <p class="text-xl font-bold">กำลังโหลดคำถาม...</p>
    {:else}
        {@const q = svelteManager.currentQuestion}
        {@const selected = svelteManager.userAnswers[q.no]}
        {@const result = svelteManager.lastAnswerResult}

        <div
            class="bg-white rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-xl"
        >
            <div class="text-lg font-bold">คำถามข้อ {q.no}/{q.maxNo}</div>
            <div class="bg-gray-700 text-white p-4 rounded-xl">
                {q.questionText}
            </div>

            <div class="space-y-2">
                {#each q.choices as c}
                    {@const isSelected = selected === c.label}
                    {@const isCorrectAnswer = result?.correct === c.label}
                    {@const isWrongSelected =
                        svelteManager.submitted &&
                        isSelected &&
                        !isCorrectAnswer}

                    <div class="relative">
                        <button
                            class={`w-full text-left px-4 py-3 rounded-xl font-semibold shadow transition
                                ${isSelected ? "bg-main text-white" : "bg-white text-gray-800"}`}
                            onclick={() => handleAnswer(q.no, c.label)}
                            disabled={svelteManager.submitted}
                        >
                            {c.text}
                        </button>

                        {#if svelteManager.submitted && isCorrectAnswer}
                            <div
                                class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
                                        flex items-center justify-center
                                        ${isWrongSelected
                                    ? 'bg-black text-white'
                                    : 'bg-white text-main'} border-2 border-main"
                            >
                                ✔️
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

    <div class="relative mt-2 flex items-center justify-center min-h-[4rem]">
    <img src={svelteManager.theme.mascotImage} alt="Mascot" class="w-16 h-16" />

    {#if svelteManager.submitted}
        <p
            class="absolute -top-2 left-[200px] text-3xl font-extrabold text-main animate-pop"
        >
            +{result.score}
        </p>
    {/if}
</div>


            {#if !svelteManager.submitted}
                <button
                    onclick={submitSingleAnswer}
                    class={`w-full py-3 rounded-full font-bold
                        ${selected ? "bg-main text-white" : "bg-gray-700 text-white opacity-60"}`}
                    disabled={!selected}
                >
                    ส่งคำตอบ
                </button>
            {:else}
                <button
                    onclick={goToNext}
                    class="w-full py-3 rounded-full font-bold bg-main text-white"
                >
                    {result.isShowResult ? "สรุปคะแนน" : "ถัดไป"}
                </button>
            {/if}
        </div>
    {/if}
</div>
