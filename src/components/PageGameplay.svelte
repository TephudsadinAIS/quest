<script lang="ts">
    import { scale } from "svelte/transition";
    import { onMount } from "svelte";
    // ✅ [แก้ไข] ลบ type SummaryItem ออกจากการ import
    import { svelteManager, GameState, icons } from '../SvelteManager.svelte';

    let isLoadingQuestion = $state(true);

    async function getQuestion() {
        isLoadingQuestion = true;
        svelteManager.submitted = false;
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockApiResponse = {
            questionText: `นี่คือคำถามจาก Server ข้อที่ ${(svelteManager.currentQuestion?.no || 0) + 1}`,
            choiceA: "ตัวเลือก ก",
            choiceB: "ตัวเลือก ข (คำตอบที่ถูก)",
            choiceC: "ตัวเลือก ค",
            choiceD: "ตัวเลือก ง",
            correctAnswer: "B",
            no: (svelteManager.currentQuestion?.no || 0) + 1,
            maxNo: 3
        };
        svelteManager.currentQuestion = {
            ...mockApiResponse,
            choices: [
                { label: "A", text: mockApiResponse.choiceA }, { label: "B", text: mockApiResponse.choiceB },
                { label: "C", text: mockApiResponse.choiceC }, { label: "D", text: mockApiResponse.choiceD }
            ]
        };
        isLoadingQuestion = false;
    }

    onMount(() => {
        getQuestion();
    });

    function handleAnswer(questionNo: number, value: string) {
        if (!svelteManager.submitted) svelteManager.userAnswers[questionNo] = value;
    }
    
    async function postAnswer(selectedChoice: string): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const isCorrect = svelteManager.currentQuestion.correctAnswer === selectedChoice;
        const currentNo = svelteManager.currentQuestion.no;
        const maxNo = svelteManager.currentQuestion.maxNo;
        const mockResponse = {
           choice: selectedChoice,
           correct: svelteManager.currentQuestion.correctAnswer,
           isCorrect: isCorrect,
           score: isCorrect ? 10 : 0,
           isShowResult: currentNo >= maxNo
        };
        return mockResponse;
    }

    async function getSumScore(): Promise<any> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockSummaryResponse = {
            scoreSummary: [
                { description: "ตอบถูก 2 ข้อ", points: 20 }, { description: "โบนัสชุดนี้", points: 10 },
                { description: "ค่าแอคทีฟ", points: 10 }, { description: "ตอบคำถามครบ 1 ชุด", points: 5 }
            ],
            total: 45,
        };
        return mockSummaryResponse;
    }

    async function submitSingleAnswer() {
        const questionNo = svelteManager.currentQuestion.no;
        const selectedChoice = svelteManager.userAnswers[questionNo];
        if (!selectedChoice) return;
        const result = await postAnswer(selectedChoice);
        svelteManager.lastAnswerResult = result;
        svelteManager.score += result.score;
        svelteManager.quizResults.push({ question: `ตอบถูกข้อ ${questionNo}`, points: result.score });
        svelteManager.submitted = true;
    }

    async function goToNext() {
        const result = svelteManager.lastAnswerResult;
        if (!result) return; 

        if (result.isShowResult) {


            svelteManager.currentState = GameState.GameOver;
        } else {
            getQuestion();
        }
    }
</script>

<div class="fixed inset-0 flex items-center justify-center p-4">
    {#if isLoadingQuestion || !svelteManager.currentQuestion}
        <p class="text-xl font-bold">กำลังโหลดคำถาม...</p>
    {:else}
        {@const q = svelteManager.currentQuestion}
        <div class="w-full max-w-sm flex flex-col items-center">
            </div>
    {/if}
</div>