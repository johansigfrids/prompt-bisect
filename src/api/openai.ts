interface OpenAIToolCall {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
}

interface OpenAIChoice {
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
    index: number;
    message: {
        content: string | null;
        refusal: string | null;
        role: string;
        tool_calls: OpenAIToolCall[] | null;
    };
}

export interface OpenAIResponse {
    id: string;
    choices: OpenAIChoice[];
    created: number;
    model: string;
    service_tier: string | null;
    system_fingerprint: string;
    object: 'chat.completion';
    usage: {
        completion_tokens: number;
        prompt_tokens: number;
        total_tokens: number;
        completion_tokens_details: {
            audio_tokens: number;
            reasoning_tokens: number;
        };
        prompt_tokens_details: {
            audio_tokens: number;
            cached_tokens: number;
        }
    };
}

export const fetchOpenAICompletion = async (
    apiKey: string,
    model: string,
    prompt: string,
    maxTokens: number = 150,
    temperature: number = 0.7
): Promise<OpenAIResponse> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [{ "role": "user", "content": prompt }],
            max_tokens: maxTokens,
            temperature: temperature,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error && errorData.error.code === 'content_filter') {
            throw new Error("Your prompt violated OpenAI's content policy.");
        } else {
            throw new Error(errorData.error.message || 'An error occurred while fetching the response.');
        }
    }

    const data: OpenAIResponse = await response.json();
    return data;
};
