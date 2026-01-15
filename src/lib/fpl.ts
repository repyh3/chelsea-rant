import { MatchOutcome } from './types';

export interface FPLFixture {
    team_h: number;
    team_a: number;
    team_h_score: number;
    team_a_score: number;
    finished: boolean;
    kickoff_time: string;
    event: number;
}

export interface FPLTeam {
    id: number;
    name: string;
    short_name: string;
    code: number;
}

export interface ChelseaMatchResult {
    outcome: MatchOutcome;
    chelseaGoals: number;
    opponentGoals: number;
    opponentName: string;
    opponentCode: number;
    date: string;
}

export async function getChelseaResult(): Promise<ChelseaMatchResult> {
    const [fixturesRes, bootstrapRes] = await Promise.all([
        fetch('https://fantasy.premierleague.com/api/fixtures/', { next: { revalidate: 3600 } }),
        fetch('https://fantasy.premierleague.com/api/bootstrap-static/', { next: { revalidate: 86400 } })
    ]);

    const allFixtures: FPLFixture[] = await fixturesRes.json();
    const bootstrapData = await bootstrapRes.json();
    const teams: FPLTeam[] = bootstrapData.teams;

    const CHELSEA_ID = 7;

    const chelseaMatches = allFixtures.filter(f =>
        (f.team_h === CHELSEA_ID || f.team_a === CHELSEA_ID) && f.finished === true
    );

    if (chelseaMatches.length === 0) {
        throw new Error('No finished Chelsea matches found');
    }

    const lastMatch = chelseaMatches.sort((a, b) =>
        new Date(b.kickoff_time).getTime() - new Date(a.kickoff_time).getTime()
    )[0];

    const isHome = lastMatch.team_h === CHELSEA_ID;
    const chelseaGoals = isHome ? lastMatch.team_h_score : lastMatch.team_a_score;
    const opponentGoals = isHome ? lastMatch.team_a_score : lastMatch.team_h_score;
    const opponentId = isHome ? lastMatch.team_a : lastMatch.team_h;

    const opponent = teams.find(t => t.id === opponentId);
    const opponentName = opponent ? opponent.name : 'Unknown Team';

    let outcome: MatchOutcome = 'draw';
    if (chelseaGoals > opponentGoals) outcome = 'win';
    else if (chelseaGoals < opponentGoals) outcome = 'loss';

    return {
        outcome,
        chelseaGoals,
        opponentGoals,
        opponentName,
        opponentCode: opponent ? opponent.code : 0,
        date: new Date(lastMatch.kickoff_time).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    };
}
