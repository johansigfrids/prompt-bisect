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

const splitPromptIntoTwo = (prompt: string): { firstHalf: string; secondHalf: string } => {
    const lines = prompt.split('\n');
    const middleIndex = Math.floor(lines.length / 2);
    const firstHalf = lines.slice(0, middleIndex).join('\n');
    const secondHalf = lines.slice(middleIndex).join('\n');
    return { firstHalf, secondHalf };
};

export const bisectPrompt = async (
    apiKey: string,
    model: string,
    prompt: string,
    depth: number = 0
): Promise<BisectResult> => {
    if (depth > MAX_RECURSION_DEPTH) {
        throw new Error('Maximum recursion depth reached. Unable to bisect further.');
    }

    const response: OpenAIResponse = await fetchOpenAICompletion(apiKey, model, prompt);

    let isPromptFilter = false;
    if ('error' in response) {
        if (response.error.code === 'invalid_prompt') {
            isPromptFilter = true;
        } else {
            throw new Error(`OpenAI API error: ${response.error.message}`)
        }
    }

    if (!isPromptFilter) {
        return {
            result: 'no_segment_found',
            message: 'No invalid_prompt issues were found in the provided prompt.'
        };
    }

    if (!prompt.includes('\n')) {
        return {
            result: 'segment_found',
            problematicSegment: prompt
        };
    }

    const { firstHalf, secondHalf } = splitPromptIntoTwo(prompt);

    const firstResult = await bisectPrompt(apiKey, model, firstHalf, depth + 1);
    if (firstResult.result === 'segment_found') {
        return firstResult;
    }

    const secondResult = await bisectPrompt(apiKey, model, secondHalf, depth + 1);
    if (secondResult.result === 'segment_found') {
        return secondResult;
    }

    return {
        result: 'no_segment_found',
        message: 'No invalid_prompt issues were found in the provided prompt.'
    };
};
