import { fetchOpenAICompletion, OpenAIResponse } from './openai';

export type BisectResult =
    | {
        result: 'segment_found';
        problematicSegment: string;
    }
    | {
        result: 'no_segment_found';
        message: string;
    };

const MAX_RECURSION_DEPTH = 10;

const splitPrompt = (prompt: string, parts: number): string[] => {
    const lines = prompt.split('\n');
    const result: string[] = [];
    const linesPerPart = Math.floor(lines.length / parts);

    for (let i = 0; i < parts; i++) {
        const start = i * linesPerPart;
        const end = i === parts - 1 ? lines.length : (i + 1) * linesPerPart;
        result.push(lines.slice(start, end).join('\n'));
    }

    return result;
};

export const bisectPrompt = async (
    apiKey: string,
    model: string,
    prompt: string,
    depth: number = 0,
    onProgress?: (segment: string) => void,
): Promise<BisectResult> => {
    if (depth > MAX_RECURSION_DEPTH) {
        throw new Error('Maximum recursion depth reached. Unable to bisect further.');
    }

    if (onProgress) {
        onProgress(prompt);
    }

    const response: OpenAIResponse = await fetchOpenAICompletion(apiKey, model, prompt);

    // Check if the response contains an error and if it's an invalid_prompt error
    let isPromptFilter = false;
    if ('error' in response) {
        if (response.error.code === 'invalid_prompt') {
            isPromptFilter = true;
        } else {
            throw new Error(`OpenAI API error: ${response.error.message}`);
        }
    }

    // If the prompt does not trigger invalid_prompt, return no_segment_found
    if (!isPromptFilter) {
        return {
            result: 'no_segment_found',
            message: 'No invalid_prompt issues were found in the provided prompt.',
        };
    }

    const newlineCount = (prompt.match(/\n/g) || []).length;

    // 0 newlines means the prompt is a single line, so return it as the problematic segment
    if (newlineCount === 0) {
        return {
            result: 'segment_found',
            problematicSegment: prompt,
        };
    }

    // Split the prompt into two halves and check each half separately
    const [firstHalf, secondHalf] = splitPrompt(prompt, 2);

    const firstResult = await bisectPrompt(apiKey, model, firstHalf, depth + 1, onProgress);
    if (firstResult.result === 'segment_found') {
        return firstResult;
    }

    const secondResult = await bisectPrompt(apiKey, model, secondHalf, depth + 1, onProgress);
    if (secondResult.result === 'segment_found') {
        return secondResult;
    }

    // If we get here the the full prompt triggers error but neither half did. That suggests that the problematic 
    // segment is larger than a single line and spans both halves.

    // If there are at least three newlines, split the prompt into a quarter and three quarters and check each.
    if (newlineCount >= 3) {
        const [firstQuarter, remainingThreeQuarters] = splitPrompt(prompt, 4);

        const quarterResult = await bisectPrompt(apiKey, model, firstQuarter, depth + 1, onProgress);
        if (quarterResult.result === 'segment_found') {
            return quarterResult;
        }

        const threeQuartersResult = await bisectPrompt(apiKey, model, remainingThreeQuarters, depth + 1, onProgress);
        if (threeQuartersResult.result === 'segment_found') {
            return threeQuartersResult;
        }
    }

    // Entire prompt must be the problematic segment
    return {
        result: 'segment_found',
        problematicSegment: prompt,
    };
};
