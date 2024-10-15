import './reset.css';
import './App.css';
import { useState, type FC } from 'react';
import { bisectPrompt, type BisectResult } from './api/bisect';
import InputForm, { type FormData } from './components/InputForm';
import Loading from './components/Loading';
import ErrorDisplay from './components/ErrorDisplay';
import BisectResultDisplay from './components/BisectResultDisplay';

const App: FC = () => {
  const [bisectResult, setBisectResult] = useState<BisectResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [currentSegment, setCurrentSegment] = useState<string>('');
  const [formData, setFormData] = useState<FormData | undefined>(undefined);

  const handleSubmit = async (data: FormData) => {
    const { apiKey, prompt, selectedModel } = data;
    setFormData(data);
    setError('');
    setBisectResult(null);
    setCurrentSegment('');

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
      const bisect = await bisectPrompt(apiKey, selectedModel, prompt, 0, (segment) => {
        setCurrentSegment(segment);
      });
      setBisectResult(bisect);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch the response. Please try again later.');
    } finally {
      setLoading(false);
      setCurrentSegment('');
    }
  };

  const handleBack = () => {
    setError('');
    setBisectResult(null);
    setCurrentSegment('');
  };

  const renderContent = () => {
    if (loading) {
      return <Loading currentSegment={currentSegment} />;
    }

    if (error) {
      return <ErrorDisplay message={error} onBack={handleBack} />;
    }

    if (bisectResult) {
      return <BisectResultDisplay bisectResult={bisectResult} onBack={handleBack} />;
    }

    return (
      <InputForm
        onSubmit={handleSubmit}
        initialData={formData}
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
      <p>
        It uses a binary search and limits completions tokens to 1 in order to cut down on the cost of
        doing the search, but be mindful that it can still end up expensive for o1 models.
      </p>

      {renderContent()}
    </div>
  );
};

export default App;
