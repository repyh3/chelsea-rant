export type MatchOutcome = 'win' | 'draw' | 'loss';

export interface Fixture {
    opponent: string;
    result: string;
    outcome: MatchOutcome;
    date: string;
    isHome: boolean;
}

export interface Rant {
    id: string;
    text: string;
    outcome: MatchOutcome;
    severity: 1 | 2 | 3 | 4 | 5;
}
