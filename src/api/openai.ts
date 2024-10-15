type OpenAIToolCall = {
    id: string;
    type: 'function';
    function: {
        name: string;
        arguments: string;
    };
};

type OpenAIChoice = {
    finish_reason: 'stop' | 'length' | 'content_filter' | 'tool_calls';
    index: number;
    message: {
        content: string | null;
        refusal: string | null;
        role: string;
        tool_calls: OpenAIToolCall[] | null;
    };
};

type OpenAIAnswer = {
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
        };
    };
};

type OpenAIError = {
    error: {
        message: string;
        type: "invalid_request_error" | string;
        param: string | null;
        code: "invalid_prompt" | "unsupported_value" | string;
    };
};

export type OpenAIResponse = OpenAIAnswer | OpenAIError;

export const fetchOpenAICompletion = async (
    apiKey: string,
    model: string,
    prompt: string,
): Promise<OpenAIResponse> => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { "role": "user", "content": prompt },
            ],
            max_completion_tokens: 1,
        }),
    });

    const data: OpenAIResponse = await response.json();
    return data;
};
