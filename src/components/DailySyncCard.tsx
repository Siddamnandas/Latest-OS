'use client';

import { useState } from 'react';
import { Smile, Battery, Clock, CheckCircle, Heart, Sparkles } from 'lucide-react';

interface DailySyncCardProps {
  onCompleteSync: (data: any) => void;
}

export function DailySyncCard({ onCompleteSync }: DailySyncCardProps) {
  const [mood, setMood] = useState<number>(3);
  const [energy, setEnergy] = useState<number>(7);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [partnerSynced, setPartnerSynced] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const moodEmojis = ['😔', '😐', '😊', '😍', '🚀'];
  const moodLabels = ['Low', 'Okay', 'Good', 'Great', 'Amazing'];
  
  const availableTags = [
    '#work', '#excited', '#kids', '#tired', '#grateful', 
    '#stressed', '#playful', '#romance', '#overwhelmed', '#happy'
  ];

  const handleTagToggle = (tag: string) => {
    setIsAnimating(true);
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
    setTimeout(() => setIsAnimating(false), 200);
  };

  const handleSubmit = () => {
    setIsAnimating(true);
    const syncData = {
      mood,
      energy,
      tags: selectedTags,
      timestamp: new Date().toISOString()
    };
    setTimeout(() => {
      onCompleteSync(syncData);
      setStep(3);
      setIsAnimating(false);
    }, 500);
  };

  if (step === 3) {
    return (
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-75"></div>
        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-2xl transform transition-all duration-500 scale-105 rounded-2xl p-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-xs">✨</span>
              </div>
            </div>
            <h3 className="text-xl font-bold text-center mb-2">Sync Complete!</h3>
            <p className="text-sm text-center opacity-90 mb-4">
              {partnerSynced ? 'Both partners synced today!' : 'Waiting for your partner...'}
            </p>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-lg rounded-full px-4 py-2">
              <span className="text-2xl animate-bounce">🪙</span>
              <span className="font-semibold">+10 Lakshmi Coins</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur opacity-30"></div>
      <div className="relative bg-white/90 backdrop-blur-lg border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daily Sync</h3>
              <p className="text-sm text-gray-600">Step {step} of 2</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-purple-50 text-purple-700 border-purple-200 px-2 py-1 rounded-full text-xs flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              30 sec
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${step * 50}%` }}
          ></div>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <label className="text-sm font-semibold mb-3 block text-gray-800">
                How are you feeling today?
              </label>
              <div className="flex justify-between mb-2">
                {moodEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => setMood(index + 1)}
                    className={`text-3xl p-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                      mood === index + 1 
                        ? 'bg-white shadow-lg scale-110 ring-2 ring-purple-400' 
                        : 'hover:bg-white/50'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-center text-sm font-medium text-gray-700">
                {moodLabels[mood - 1]}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
              <label className="text-sm font-semibold mb-3 block text-gray-800 flex items-center gap-2">
                <Battery className="w-4 h-4 text-blue-600" />
                Energy Level: {energy}/10
              </label>
              <div className="relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      rgb(239 68 68) 0%, 
                      rgb(245 158 11) 50%, 
                      rgb(34 197 94) 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)} 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Next Step
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <label className="text-sm font-semibold mb-3 block text-gray-800 flex items-center gap-2">
                <Smile className="w-4 h-4 text-green-600" />
                What's on your mind?
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedTags.includes(tag)
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                    } ${isAnimating ? 'animate-pulse' : ''}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setStep(1)}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 rounded-xl border"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isAnimating}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50"
              >
                {isAnimating ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Syncing...
                  </span>
                ) : (
                  'Complete Sync'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}