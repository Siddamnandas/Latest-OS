'use client';

import React from 'react';

type Props = {
  onTranscript?: (text: string) => void;
  onTranscriptUpdate?: (text: string) => void;
  onVoiceCommand?: (command: string, action: string) => void;
  onSessionComplete?: (session: any) => void;
  disabled?: boolean;
};

export function VoiceInteraction({ onTranscript, onTranscriptUpdate, onVoiceCommand, onSessionComplete, disabled }: Props) {
  return (
    <div className="p-3 border rounded-md text-sm text-gray-600">
      <div>Voice interaction placeholder</div>
      <button
        type="button"
        disabled={disabled}
        className="mt-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        onClick={() => {
          const sample = 'Hello from voice!';
          onTranscript?.(sample);
          onTranscriptUpdate?.(sample);
          onVoiceCommand?.('greet', 'say_hello');
          onSessionComplete?.({ id: Date.now().toString(), transcript: sample });
        }}
      >
        Simulate Voice Input
      </button>
    </div>
  );
}
