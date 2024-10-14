import './App.css';
import { useState, type FC } from 'react';
import { bisectPrompt, type BisectResult } from './api/bisect';
import InputForm from './components/InputForm';
import Loading from './components/Loading';
import ErrorDisplay from './components/ErrorDisplay';
import BisectResultDisplay from './components/BisectResultDisplay';

const App: FC = () => {
  const [bisectResult, setBisectResult] = useState<BisectResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (data: { apiKey: string; prompt: string; selectedModel: string }) => {
    const { apiKey, prompt, selectedModel } = data;
    setError('');
    setBisectResult(null);

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
      const bisect = await bisectPrompt(apiKey, selectedModel, prompt);
      setBisectResult(bisect);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch the response. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <ErrorDisplay message={error} />;
    }

    if (bisectResult) {
      return <BisectResultDisplay bisectResult={bisectResult} />;
    }

    return (
      <InputForm
        onSubmit={handleSubmit}
      />
    );
  };

  return (
    <div className="content">
      <h1>OpenAI Prompt Bisect</h1>
      <p>
        The content filters for the o1 models can trip up on smallest things. This app helps find what
        part of a prompt is causing a invalid_prompt error. It will repeatedly call the OpenAI API
        with smaller and smaller sections of the prompt until it finds the problematic part.
      </p>

      {renderContent()}
    </div>
  );
};

export default App;
