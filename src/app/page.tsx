'use client';

import React, { useState, useEffect } from 'react';
const rapidApiKey = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;

const Page = () => {
  const [power, setPower] = useState('');
  const [voltage, setVoltage] = useState('');
  const [powerFactor, setPowerFactor] = useState('');
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lambdaResponse, setLambdaResponse] = useState('');

  useEffect(() => {
    const fetchLambdaResponse = async () => {
      try {
        const response = await fetch('https://gdctk5uavz64ikcotkvkypid3y0sehrx.lambda-url.us-east-1.on.aws');
        const data = await response.json();
        setLambdaResponse(data);
      } catch {
        setError('Error fetching Lambda response');
      }
    };

    fetchLambdaResponse();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!power) {
      setError('Power is required');
      return;
    }
    setLoading(true);
    setError('');
    const url = `https://electrical-units.p.rapidapi.com/power_to_current/single_phase?power=${power}&voltage=${voltage}&powerfactor=${powerFactor}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'electrical-units.p.rapidapi.com',
        'x-rapidapi-key': rapidApiKey || '',
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setCurrent(data.current);
    } catch {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">{lambdaResponse || 'Single Phase Power to Current Converter'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="power">Power (Watts)</label>
            <input
              type="number"
              id="power"
              value={power}
              onChange={(e) => setPower(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="voltage">Voltage (Volts)</label>
            <input
              type="number"
              id="voltage"
              value={voltage}
              onChange={(e) => setVoltage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="powerFactor">Power Factor</label>
            <input
              type="number"
              step="0.01"
              id="powerFactor"
              value={powerFactor}
              onChange={(e) => setPowerFactor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
            {loading ? 'Converting...' : 'Convert'}
          </button>
          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
        {current !== null && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
            <p className="text-lg text-center text-gray-800 dark:text-gray-200">Current: <span className="font-bold">{current} Amperes</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;