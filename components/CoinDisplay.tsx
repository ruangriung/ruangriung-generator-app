'use client';

import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';

export default function CoinDisplay() {
  const [coins, setCoins] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCoins = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/coins');
        const data = await response.json();
        setCoins(data.coins);
      } catch (error) {
        console.error("Gagal fetch koin:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoins();
    // Tetap lakukan polling untuk memperbarui tampilan secara berkala
    const interval = setInterval(fetchCoins, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayAmount = isLoading ? '...' : coins;

  return (
    <div className="flex items-center gap-3 p-2 bg-light-bg rounded-lg shadow-neumorphic-button">
      <Coins size={36} className="text-yellow-500" />
      <div className="text-left">
        <span className="font-semibold text-gray-700 text-lg">{displayAmount}</span>
        <p className="text-xs text-gray-500 -mt-1">Koin</p>
      </div>
    </div>
  );
}