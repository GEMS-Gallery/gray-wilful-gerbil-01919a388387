import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Grid, Card, CardContent, Button, TextField, Slider } from '@mui/material';
import { backend } from 'declarations/backend';

interface Model {
  id: string;
  name: string;
  description: string;
}

interface ModelDetails {
  description: string;
  parameters: {
    temperature: number;
    maxTokens: number;
  };
}

const App: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelDetails, setModelDetails] = useState<ModelDetails | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(100);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      const result = await backend.getModels();
      setModels(result);
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };

  const fetchModelDetails = async (modelId: string) => {
    try {
      const result = await backend.getModelDetails(modelId);
      if ('ok' in result) {
        setModelDetails(result.ok);
        setTemperature(result.ok.parameters.temperature);
        setMaxTokens(result.ok.parameters.maxTokens);
      } else {
        console.error('Error fetching model details:', result.err);
      }
    } catch (error) {
      console.error('Error fetching model details:', error);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    fetchModelDetails(modelId);
  };

  const handleGenerateText = async () => {
    if (!selectedModel) return;
    try {
      const result = await backend.generateText(selectedModel, prompt, {
        temperature: temperature,
        maxTokens: maxTokens,
      });
      if ('ok' in result) {
        setGeneratedText(result.ok);
      } else {
        console.error('Error generating text:', result.err);
      }
    } catch (error) {
      console.error('Error generating text:', error);
    }
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">AI Model Hosting Platform</Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={
            <Grid container spacing={3} style={{ marginTop: '20px' }}>
              {models.map((model) => (
                <Grid item xs={12} sm={6} md={4} key={model.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h5">{model.name}</Typography>
                      <Typography variant="body2">{model.description}</Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleModelSelect(model.id)}
                        style={{ marginTop: '10px' }}
                      >
                        Select Model
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          } />
          <Route path="/model" element={
            selectedModel && modelDetails ? (
              <div style={{ marginTop: '20px' }}>
                <Typography variant="h4">{selectedModel}</Typography>
                <Typography variant="body1">{modelDetails.description}</Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  label="Enter your prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  style={{ marginTop: '20px' }}
                />
                <Typography gutterBottom>Temperature: {temperature}</Typography>
                <Slider
                  value={temperature}
                  onChange={(_, newValue) => setTemperature(newValue as number)}
                  min={0}
                  max={1}
                  step={0.1}
                />
                <Typography gutterBottom>Max Tokens: {maxTokens}</Typography>
                <Slider
                  value={maxTokens}
                  onChange={(_, newValue) => setMaxTokens(newValue as number)}
                  min={1}
                  max={1000}
                  step={1}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGenerateText}
                  style={{ marginTop: '20px' }}
                >
                  Generate Text
                </Button>
                {generatedText && (
                  <Typography variant="body1" style={{ marginTop: '20px' }}>
                    Generated Text: {generatedText}
                  </Typography>
                )}
              </div>
            ) : (
              <Typography variant="h6">Please select a model</Typography>
            )
          } />
        </Routes>
      </Container>
    </div>
  );
};

export default App;
