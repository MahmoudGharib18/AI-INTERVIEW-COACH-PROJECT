import { AIProvider, GenerateTextOptions, AIMessage } from '../ai-provider.interface';
import { checkForLeak } from './leak-detector';

const FALLBACK_RESPONSE =
  "I can't provide hints, approaches, or solutions during the interview. I can repeat the problem statement or clarify wording if that helps.";

const CORRECTION_INSTRUCTION: AIMessage = {
  role: 'system',
  content:
    'Your previous response violated interview rules by giving a hint, approach, algorithm, or solution. ' +
    'Respond again. This time, only acknowledge the question, repeat or clarify the problem statement if asked, ' +
    'or ask the candidate to continue — do NOT reveal any hint, technique, algorithm name, complexity, or code.',
};

export interface SafeGenerateResult {
  text: string;
  wasFlagged: boolean;
  usedFallback: boolean;
}

/**
 * Wraps AIProvider.generateText with a leak check.
 * On a flagged response: retries once with a correction instruction appended.
 * If the retry is also flagged: returns a hardcoded safe fallback instead of any AI output.
 * Never returns a leaked response to the caller under any circumstance.
 */
export const safeGenerateText = async (
  provider: AIProvider,
  options: GenerateTextOptions
): Promise<SafeGenerateResult> => {
  const firstAttempt = await provider.generateText(options);
  const firstCheck = checkForLeak(firstAttempt);

  if (!firstCheck.flagged) {
    return { text: firstAttempt, wasFlagged: false, usedFallback: false };
  }

  // retry once with a correction instruction injected
  const retryOptions: GenerateTextOptions = {
    ...options,
    messages: [...options.messages, CORRECTION_INSTRUCTION],
  };

  const secondAttempt = await provider.generateText(retryOptions);
  const secondCheck = checkForLeak(secondAttempt);

  if (!secondCheck.flagged) {
    return { text: secondAttempt, wasFlagged: true, usedFallback: false };
  }

  // both attempts flagged — never serve AI output, use hardcoded fallback
  return { text: FALLBACK_RESPONSE, wasFlagged: true, usedFallback: true };
};