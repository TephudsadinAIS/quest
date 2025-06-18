// SvelteManager.svelte.ts

export enum GameState {
    MainMenu,
    Playing,
    GameOver,
    MaxAttempts
}

export enum GAME_STATUS {
    READY,
    RESUME,
    COMPLETED,
    MAINTENANCE,
    CLOSED
}

// ✅ Icon SVG
export const icons = {
    play: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd" /></svg>`,
    close: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
    check: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>`,
    cross: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`,
    limit: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-16 h-16"><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" /></svg>`
};

// ✅ Svelte Manager Class (เฉพาะ state)
class SvelteManager {
    currentState = $state(GameState.MainMenu);
    showRules = $state(false);
    showQuizInfo = $state(false);

    userId = '50112'; // ค่าเริ่มต้น — จะถูกแก้ใน getLogin

    theme = $state({
        mascotImage: '/default_mascot.png',
        missionImage: '/default_mission.png',
        ruleImage: '/default_rule.png',
        mainColor: '#8b5cf6'
    });

    currentQuestion = $state<any>(null);
    userAnswers = $state<Record<number, string>>({});
    quizResults = $state<any[]>([]);
    submitted = $state(false);
    score = $state(0);
    roundSummary = $state({ items: [], total: 0 });
    lastAnswerResult = $state<any>(null);
}

export const svelteManager = new SvelteManager();
