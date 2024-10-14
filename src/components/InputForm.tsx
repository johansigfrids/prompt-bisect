import { useState, type FC, type FormEvent } from 'react';
import './InputForm.css';

interface Model {
    value: string;
    label: string;
}

interface InputFormProps {
    onSubmit: (data: { apiKey: string; prompt: string; selectedModel: string }) => void;
}

const models: Model[] = [
    { value: 'o1-mini', label: 'o1-mini' },
    { value: 'o1-preview', label: 'o1-preview' },
    { value: 'gpt-4o', label: 'gpt-4o' },
    { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
    { value: 'gpt-4', label: 'gpt-4' },
];

const InputForm: FC<InputFormProps> = ({ onSubmit }) => {

    const [apiKey, setApiKey] = useState<string>('');
    const [prompt, setPrompt] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>(models[0].value);

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ apiKey, prompt, selectedModel });
    };

    return (
        <form onSubmit={handleFormSubmit} className="form">
            <div className="form-group">
                <label htmlFor="apiKey">OpenAI API Key:</label>
                <input
                    type="text"
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="model">Select Model:</label>
                <select
                    id="model"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    required
                >
                    {models.map((model) => (
                        <option key={model.value} value={model.value}>
                            {model.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="prompt">Prompt:</label>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt"
                    required
                />
            </div>

            <button type="submit">
                Submit
            </button>
        </form>
    );
};

export default InputForm;
