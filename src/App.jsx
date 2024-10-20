import { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

console.log(API_URL);

const App = () => {
  const [predictionStep, setPredictionStep] = useState(30);
  const [plotUrl, setPlotUrl] = useState('');

  const handlePredictionStepChange = (event) => {
    setPredictionStep(event.target.value);
  };

  const handlePredictClick = async () => {
    try {
      const response = await axios.post(`${API_URL}/predict`, {
        prediction_step: predictionStep,
      });
      setPlotUrl(response.data.plot_url);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    }
  };

  return (
    <div>
      <h1>Prévision du Prix de l&apos;Or</h1>
      <label>
        Durée de prédiction en jours:
        <input
          type="number"
          value={predictionStep}
          onChange={handlePredictionStepChange}
        />
      </label>
      <button onClick={handlePredictClick}>Prédire</button>
      {plotUrl && (
        <div>
          <h2>Graphique de Prévision</h2>
          <img src={`data:image/png;base64,${plotUrl}`} alt="Prévision du Prix de l'Or" />
        </div>
      )}
    </div>
  );
};

export default App;
