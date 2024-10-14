import './App.css';
import { useState } from 'react';
import { fetchOpenAICompletion } from './api/openai';

const models = [
  { value: 'gpt-4o', label: 'gpt-4o' },
  { value: 'gpt-4o-mini', label: 'gpt-4o-mini' },
  { value: 'gpt-4', label: 'gpt-4' },
  { value: 'o1-mini', label: 'o1-mini' },
  { value: 'o1-preview', label: 'o1-preview' },
];

const App = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>(models[0].value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResponse('');

    if (!apiKey) {
      setError('Please enter your OpenAI API key.');
      return;
    }

    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setLoading(true);

    try {
      const completion = await fetchOpenAICompletion(apiKey, selectedModel, prompt);
      setResponse(completion);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch the response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content">
      <h1>OpenAI Prompt Bisect</h1>
      <p>This app helps find what part of a prompt is causing an error. It will repeatedly call the OpenAI API with smaller and smaller sections of the prompt until it finds the problematic part.</p>

      <form onSubmit={handleSubmit} className="form">
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

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      {response && (
        <div className="response">
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default App;
