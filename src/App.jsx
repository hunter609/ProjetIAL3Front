import { useState } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [predictionStep, setPredictionStep] = useState(30);
  const [plotUrl, setPlotUrl] = useState('');
  const [isPlotZoomed, setIsPlotZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePredictionStepChange = (event) => {
    setPredictionStep(event.target.value);
  };

  const handlePredictClick = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict`, {
        prediction_step: predictionStep,
      });
      setPlotUrl(response.data.plot_url);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlotClick = () => {
    setIsPlotZoomed(!isPlotZoomed);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Prévision du Prix de l&apos;Or</h1>
        <label className="block mb-4">
          <span className="text-gray-700">Durée de prédiction en jours:</span>
          <input
            type="number"
            value={predictionStep}
            onChange={handlePredictionStepChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <button
          onClick={handlePredictClick}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
        >
          Prédire
        </button>
        {isLoading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
          </div>
        )}
        {plotUrl && !isLoading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-center">Graphique de Prévision</h2>
            <div
              className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${isPlotZoomed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={handlePlotClick}
            >
              <img
                src={`data:image/png;base64,${plotUrl}`}
                alt="Prévision du Prix de l'Or"
                className="w-full h-full object-contain"
              />
            </div>
            <img
              src={`data:image/png;base64,${plotUrl}`}
              alt="Prévision du Prix de l'Or"
              className="w-full rounded-md cursor-pointer transition-transform transform hover:scale-105"
              onClick={handlePlotClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
