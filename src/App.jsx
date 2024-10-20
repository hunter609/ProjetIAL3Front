import { useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
  const [predictionStep, setPredictionStep] = useState(30);
  const [plotUrl, setPlotUrl] = useState('');
  const [isPlotZoomed, setIsPlotZoomed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [startDate, setStartDate] = useState('2019-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchViewCount = async () => {
      try {
        const response = await axios.get(`${API_URL}/view-count`);
        setViewCount(response.data.view_count);
      } catch (error) {
        console.error('Error fetching view count:', error);
      }
    };

    fetchViewCount();

    const intervalId = setInterval(fetchViewCount, 500); // Fetch view count every 0.5 seconds

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const handlePredictionStepChange = (event) => {
    setPredictionStep(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate > today) {
      setError('La date de fin ne peut pas dépasser la date d\'aujourd\'hui.');
      setEndDate(today);
    } else {
      setError('');
      setEndDate(selectedDate);
    }
  };

  const handlePredictClick = async () => {
    if (error) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/predict`, {
        prediction_step: predictionStep,
        start_date: startDate,
        end_date: endDate,
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 mt-12">
      <header className="w-full flex bg-gradient-to-r from-indigo-600 to-purple-600 text-white fixed top-0 z-50 justify-center py-4 shadow-lg">
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-extrabold text-center tracking-wide px-4">Bienvenue sur le site de Prévision du Prix de l&apos;Or</h1>
      </header>
      <div className="bg-white shadow-2xl rounded-lg p-6 max-w-md w-full mt-6">
        <h1 className="text-3xl font-extrabold mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Prévision du Prix de l&apos;Or</h1>
        <label className="block mb-4">
          <span className="text-gray-700">Durée de prédiction en jours:</span>
          <input
            type="number"
            value={predictionStep}
            onChange={handlePredictionStepChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Date de début:</span>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Date de fin:</span>
          <input
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}
        <button
          onClick={handlePredictClick}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-md hover:bg-gradient-to-l hover:from-purple-600 hover:to-indigo-600 transition duration-300 transform"
        >
          Prédire
        </button>
        {isLoading && (
          <div className="mt-6 flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 animate-spin"></div>
          </div>
        )}
        {plotUrl && !isLoading && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-center text-transparent bg-clip-text bg-gradient-to-r  from-indigo-500 to-pink-500">Graphique de Prévision</h2>
            <div
              className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300 ${isPlotZoomed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
              onClick={handlePlotClick}
            >
              <img
                src={`data:image/png;base64,${plotUrl}`}
                alt="Prévision du Prix de l'Or"
                className="w-full h-full object-contain transform transition-transform duration-500 ${isPlotZoomed ? 'scale-100' : 'scale-75'}"
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
      <div className="mt-4 text-center text-gray-600">
        <span className="text-lg font-medium">Vous êtes la personne N°</span>
        <span className="text-2xl font-bold text-indigo-600 mx-1">{viewCount}</span>
        <span className="text-lg font-medium"> à voir la prédiction du cours de l&apos;or.</span>
      </div>
    </div>
  );
};

export default App;
