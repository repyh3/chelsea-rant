import { MatchOutcome } from './types';
import { rants } from './rants';

export const getRandomRant = (outcome: MatchOutcome): string => {
    const filteredRants = rants.filter(r => r.outcome === outcome);
    if (filteredRants.length === 0) return "No words. Just pain.";

    const randomIndex = Math.floor(Math.random() * filteredRants.length);
    return filteredRants[randomIndex].text;
};
