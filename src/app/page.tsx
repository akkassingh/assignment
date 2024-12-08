'use client';

import React, { useState } from 'react';

const Page = () => {
  const [power, setPower] = useState('');
  const [voltage, setVoltage] = useState('');
  const [powerFactor, setPowerFactor] = useState('');
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
        'x-rapidapi-key': 'ddc5fc6237msh7d5778b4a26792cp19743ajsn5320a802f1e2'
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
    <div>
      <h1 className="text-2xl font-bold mb-4">Single Phase Power to Current Converter</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="power">Power (Watts)</label>
          <input
            type="number"
            id="power"
            value={power}
            onChange={(e) => setPower(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="voltage">Voltage (Volts)</label>
          <input
            type="number"
            id="voltage"
            value={voltage}
            onChange={(e) => setVoltage(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="powerFactor">Power Factor</label>
          <input
            type="number"
            step="0.01"
            id="powerFactor"
            value={powerFactor}
            onChange={(e) => setPowerFactor(e.target.value)}
          />
        </div>
        <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
          {loading ? 'Converting...' : 'Convert'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
      {current !== null && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <p className="text-lg">Current: <span className="font-bold">{current} Amperes</span></p>
        </div>
      )}
    </div>
  );
};

export default Page;