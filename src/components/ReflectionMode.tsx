import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Save, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ReflectionSession } from '../types';
import { getTodaysPrompt, saveReflectionSession } from '../utils/storage';

interface ReflectionModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReflectionMode: React.FC<ReflectionModeProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingTime, setBreathingTime] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [mood, setMood] = useState(5);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [autoMusicEnabled, setAutoMusicEnabled] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const softAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const todaysPrompt = getTodaysPrompt();

  useEffect(() => {
    let interval: number;
    if (isBreathing) {
      interval = window.setInterval(() => {
        setBreathingTime(prev => prev + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [isBreathing]);

  useEffect(() => {
    if (isOpen && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [isOpen, sessionStartTime]);

  useEffect(() => {
    // Initialize audio when component mounts
    if (!audioRef.current) {
      // Create a simple tone using Web Audio API as fallback
      try {
        // First try a simple online audio file
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        audioRef.current.loop = true;
        audioRef.current.volume = musicVolume;
      } catch (error) {
        console.error('Failed to create audio:', error);
      }
    }
    
    if (!softAudioRef.current) {
      // Create a softer tone for meditation
      try {
        softAudioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        softAudioRef.current.loop = true;
        softAudioRef.current.volume = musicVolume * 0.5; // Softer volume for meditation track
      } catch (error) {
        console.error('Failed to create soft audio:', error);
      }
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (softAudioRef.current) {
        softAudioRef.current.pause();
        softAudioRef.current.currentTime = 0;
      }
      // Clean up Web Audio
      stopWebAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = musicVolume;
    }
    if (softAudioRef.current) {
      softAudioRef.current.volume = musicVolume * 0.5; // Softer volume for meditation track
    }
  }, [musicVolume]);

  // Auto-sync music with breathing timer
  useEffect(() => {
    if (!autoMusicEnabled || !hasUserInteracted) return;
    
    if (isBreathing) {
      // Start meditation tone when breathing starts
      const success = startWebAudio();
      if (success) {
        setIsMusicPlaying(true);
      }
    } else {
      // Stop music when breathing stops
      stopWebAudio();
      setIsMusicPlaying(false);
    }
  }, [isBreathing, autoMusicEnabled, hasUserInteracted]);

  const startWebAudio = () => {
    try {
      // Create audio context on first user interaction
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Stop any existing sound
      stopWebAudio();
      
      // Create oscillator and gain node
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      // Configure for a soft, calming tone
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(isBreathing ? 220 : 440, audioContextRef.current.currentTime); // Lower frequency for meditation
      gainNode.gain.setValueAtTime(musicVolume * 0.1, audioContextRef.current.currentTime); // Very quiet
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      // Start playing
      oscillator.start();
      
      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      
      console.log('Web Audio started successfully');
      return true;
    } catch (error) {
      console.error('Web Audio failed:', error);
      return false;
    }
  };

  const stopWebAudio = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect();
        gainNodeRef.current = null;
      }
      console.log('Web Audio stopped');
    } catch (error) {
      console.error('Error stopping Web Audio:', error);
    }
  };

  const handleToggleMusic = () => {
    // Mark that user has interacted (enables autoplay)
    setHasUserInteracted(true);
    // Disable auto-sync when manually toggling
    setAutoMusicEnabled(false);
    
    if (isMusicPlaying) {
      stopWebAudio();
      setIsMusicPlaying(false);
    } else {
      const success = startWebAudio();
      if (success) {
        setIsMusicPlaying(true);
      } else {
        setIsMusicPlaying(false);
      }
    }
  };

  // Update Web Audio volume when musicVolume changes
  useEffect(() => {
    if (gainNodeRef.current && audioContextRef.current) {
      gainNodeRef.current.gain.setValueAtTime(musicVolume * 0.1, audioContextRef.current.currentTime);
    }
  }, [musicVolume]);

  // Machine-controlled volume adjustment based on breathing time
  useEffect(() => {
    if (!isMusicPlaying || !isBreathing || !gainNodeRef.current || !audioContextRef.current) return;
    
    // Gradually decrease volume as breathing session progresses
    const targetVolume = Math.max(0.1, 0.5 - (breathingTime / 600)); // Decrease over 10 minutes
    setMusicVolume(targetVolume);
  }, [breathingTime, isMusicPlaying, isBreathing]);

  const handleStartBreathing = () => {
    setIsBreathing(true);
    // Mark user interaction (enables autoplay)
    setHasUserInteracted(true);
    // Re-enable auto-sync when starting breathing
    setAutoMusicEnabled(true);
  };

  const handleStopBreathing = () => {
    setIsBreathing(false);
    // Mark user interaction (enables autoplay)
    setHasUserInteracted(true);
    // Re-enable auto-sync when stopping breathing
    setAutoMusicEnabled(true);
  };

  const handleResetBreathing = () => {
    setIsBreathing(false);
    setBreathingTime(0);
    // Reset volume to default when resetting
    setMusicVolume(0.3);
    // Mark user interaction (enables autoplay)
    setHasUserInteracted(true);
    // Re-enable auto-sync
    setAutoMusicEnabled(true);
  };

  const handleSaveSession = () => {
    if (!sessionStartTime) return;

    const session: ReflectionSession = {
      id: uuidv4(),
      date: sessionStartTime,
      duration: Math.floor((new Date().getTime() - sessionStartTime.getTime()) / 1000),
      content: content.trim(),
      mood,
      breathingMinutes: Math.floor(breathingTime / 60)
    };

    saveReflectionSession(session);
    
    // Reset form
    setContent('');
    setBreathingTime(0);
    setIsBreathing(false);
    setSessionStartTime(null);
    setMood(5);
    
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative inline-block w-full max-w-2xl p-4 sm:p-6 lg:p-8 my-4 sm:my-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl sm:rounded-3xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6 lg:mb-8">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Reflection Mode</h3>
                <p className="text-sm sm:text-base text-gray-600">Take a moment for mindful gratitude</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Breathing Timer */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl">
            <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Mindful Breathing</h4>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center justify-between sm:justify-start space-x-3 sm:space-x-4">
                <div className="text-2xl sm:text-3xl font-mono text-blue-600">
                  {formatTime(breathingTime)}
                </div>
                <div className="flex space-x-2">
                  {!isBreathing ? (
                    <button
                      onClick={handleStartBreathing}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-sm sm:text-base"
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Start</span>
                      <span className="sm:hidden">▶</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopBreathing}
                      className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors text-sm sm:text-base"
                    >
                      <Pause className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Pause</span>
                      <span className="sm:hidden">⏸</span>
                    </button>
                  )}
                  <button
                    onClick={handleResetBreathing}
                    className="p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleToggleMusic}
                    className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-full transition-colors text-sm sm:text-base ${
                      isMusicPlaying 
                        ? 'bg-purple-500 text-white hover:bg-purple-600' 
                        : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                    }`}
                  >
                    {isMusicPlaying ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="hidden sm:inline">
                      {isBreathing && autoMusicEnabled ? 'Meditation Music' : 'Soft Music'}
                    </span>
                    <span className="sm:hidden">
                      {isBreathing && autoMusicEnabled ? '🧘' : '🎵'}
                    </span>
                  </button>
                  {autoMusicEnabled && isBreathing && (
                    <div className="flex items-center space-x-1 text-xs text-purple-600">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span className="hidden sm:inline">
                        {hasUserInteracted ? 'Auto-sync' : 'Click music to enable'}
                      </span>
                    </div>
                  )}
                </div>
                {isMusicPlaying && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVolume}
                      onChange={(e) => {
                        setMusicVolume(parseFloat(e.target.value));
                        setAutoMusicEnabled(false); // Disable auto-sync when manually adjusting
                      }}
                      className="w-16 sm:w-20 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs text-gray-500 hidden sm:inline">
                      {Math.round(musicVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {isBreathing && (
              <div className="mt-3 sm:mt-4 text-center">
                <div className="inline-block w-12 h-12 sm:w-16 sm:h-16 bg-blue-200 rounded-full animate-pulse"></div>
                <p className="mt-2 text-xs sm:text-sm text-gray-600">Breathe in... breathe out...</p>
              </div>
            )}
          </div>

          {/* Daily Prompt */}
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg sm:rounded-xl border-l-4 border-yellow-400">
            <h4 className="text-sm sm:text-base font-semibold text-gray-800 mb-1 sm:mb-2">Today's Reflection</h4>
            <p className="text-sm sm:text-base text-gray-700 italic">"{todaysPrompt.prompt}"</p>
          </div>

          {/* Writing Space */}
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Gratitude Reflection
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Take your time... what are you grateful for today?"
              rows={6}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200 bg-white/70 text-sm sm:text-base"
            />
          </div>

          {/* Mood Slider */}
          <div className="mb-6 sm:mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              How are you feeling? ({mood}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>😔 Low</span>
              <span>😊 Great</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSession}
            disabled={!content.trim()}
            className="w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg sm:rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base"
          >
            <Save className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Save Reflection</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReflectionMode;