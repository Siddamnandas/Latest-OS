'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Heart, Star, Book, Users, Target } from 'lucide-react';

interface MythologicalWisdomProps {
  context?: 'krishna' | 'ram' | 'shiva' | 'general';
  compact?: boolean;
  onWisdomShared?: (wisdom: any) => void;
}

interface WisdomStory {
  id: string;
  archetype: 'krishna' | 'ram' | 'shiva';
  title: string;
  story: string;
  lesson: string;
  emoji: string;
  colourTheme: string;
  characters: string[];
  moral: string;
}

export function MythologicalWisdom({
  context = 'general',
  compact = false,
  onWisdomShared
}: MythologicalWisdomProps) {
  const [currentStory, setCurrentStory] = useState<WisdomStory | null>(null);
  const [showStory, setShowStory] = useState(false);

  const archetypalStories: WisdomStory[] = [
    {
      id: 'krishna-flute',
      archetype: 'krishna',
      title: 'Krishna and the Divine Flute',
      story: 'In the ancient forests of Vrindavan, young Krishna discovered a magical flute. The flute had the power to bring joy to all who heard its melody. But Krishna learned that true joy comes not from the flute itself, but from the love and connection it creates between hearts.',
      lesson: 'Some gifts bring us joy, but the greatest joy comes from sharing those gifts with others.',
      emoji: '🪈',
      colourTheme: 'from-blue-500 to-cyan-500',
      characters: ['Krishna', 'The People of Vrindavan'],
      moral: 'Joy multiplied is joy amplified'
    },
    {
      id: 'krishna-love',
      archetype: 'krishna',
      title: 'The Eternal Love Dance',
      story: 'Krishna and Radha danced through the night, their love creating a perfect circle of joy. Each step they took was filled with laughter and delight, showing that love is the most beautiful dance we can share.',
      lesson: 'Love is not just a feeling - it\'s a dance we do together.',
      emoji: '💃',
      colourTheme: 'from-blue-500 to-cyan-500',
      characters: ['Krishna', 'Radha'],
      moral: 'Love\'s truest form is danced together'
    },
    {
      id: 'ram-promise',
      archetype: 'ram',
      title: 'Ram\'s Sacred Promise',
      story: 'When Ram made a promise to his father, he kept it even when it was difficult. Through the long years in the forest and the trials he faced, Ram\'s commitment never wavered. He showed that a true promise is kept not just when it\'s easy, but especially when it\'s hard.',
      lesson: 'Your word is your bond - keep it even when the path is challenging.',
      emoji: '🤝',
      colourTheme: 'from-yellow-500 to-orange-500',
      characters: ['Ram', 'His Family'],
      moral: 'A promise kept is character built'
    },
    {
      id: 'ram-protection',
      archetype: 'ram',
      title: 'The Protector\'s Heart',
      story: 'Ram protected Sita not with force, but with unwavering love and respect. He faced great dangers not for glory, but for the safety and honor of those he cherished most. True strength comes from protecting others with kindness.',
      lesson: 'The strongest protection comes from love, not force.',
      emoji: '🛡️',
      colourTheme: 'from-yellow-500 to-orange-500',
      characters: ['Ram', 'Sita', 'Lakshman'],
      moral: 'Strength that protects with kindness endures'
    },
    {
      id: 'shiva-dance',
      archetype: 'shiva',
      title: 'Shiva\'s Sacred Dance',
      story: 'Lord Shiva performed the Tandav - a dance of creation and dissolution. Through his dance, he showed that everything has a natural rhythm - birth, growth, change, and renewal. Shiva teaches us to embrace both joy and challenges as part of life\'s beautiful dance.',
      lesson: 'Life has its own rhythm - embrace both the joyful steps and the challenging ones.',
      emoji: '💫',
      colourTheme: 'from-purple-500 to-violet-500',
      characters: ['Shiva', 'Parvati'],
      moral: 'The soul knows the steps to life\'s dance'
    },
    {
      id: 'shiva-inner-peace',
      archetype: 'shiva',
      title: 'The Mountain of Peace',
      story: 'Shiva sat peacefully on Mount Kailash, undisturbed by the storms around him. He showed that true inner peace comes not from changing the world around us, but from finding stillness within our own hearts, even amid life\'s greatest challenges.',
      lesson: 'Inner peace is a mountain you build within yourself.',
      emoji: '⛰️',
      colourTheme: 'from-purple-500 to-violet-500',
      characters: ['Shiva', 'The Mountain'],
      moral: 'Peace is not found outside, but built within'
    }
  ];

  const getContextualStory = () => {
    if (context === 'general') {
      return archetypalStories[Math.floor(Math.random() * archetypalStories.length)];
    }
    return archetypalStories
      .filter(story => story.archetype === context)
      [Math.floor(Math.random() * archetypalStories.filter(s => s.archetype === context).length)];
  };

  const shareWisdom = (story: WisdomStory) => {
    setCurrentStory(story);
    setShowStory(true);

    if (onWisdomShared) {
      onWisdomShared(story);
    }
  };

  useEffect(() => {
    if (!currentStory && !compact) {
      setCurrentStory(getContextualStory());
    }
  }, [context, currentStory, compact]);

  if (compact) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-purple-300 text-purple-700 hover:bg-purple-50"
        onClick={() => shareWisdom(getContextualStory())}
      >
        📚 Sacred Wisdom
      </Button>
    );
  }

  return (
    <div className="space-y-4">
      {/* Story Display */}
      {showStory && currentStory && (
        <Card className="border-purple-200 shadow-lg overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${currentStory.colourTheme} text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currentStory.emoji}</span>
                <CardTitle className="text-lg">{currentStory.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowStory(false)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-4">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 leading-relaxed">{currentStory.story}</p>
            </div>

            <div className={`p-4 rounded-lg bg-gradient-to-r ${currentStory.colourTheme} text-white`}>
              <h4 className="font-semibold mb-2">The Sacred Lesson 💫</h4>
              <p className="text-sm leading-relaxed">{currentStory.lesson}</p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{currentStory.characters.join(', ')}</span>
              </div>
              <Badge variant="outline" className="text-xs capitalize">
                {currentStory.archetype}
              </Badge>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-700">
                <Sparkles className="w-4 h-4" />
                <span>Ancient Wisdom: {currentStory.moral}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wisdom Selector */}
      <Card className="border-purple-200 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5 text-purple-600" />
            Sacred Archetypal Wisdom 🕉️
          </CardTitle>
          <p className="text-sm text-gray-600">
            Discover timeless lessons from India's greatest love stories
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {['krishna', 'ram', 'shiva'].map((archetype) => (
              <Button
                key={archetype}
                variant="outline"
                className={`h-auto p-4 text-left border-2 ${
                  archetype === 'krishna' ? 'border-blue-300 hover:bg-blue-50' :
                  archetype === 'ram' ? 'border-yellow-300 hover:bg-yellow-50' :
                  'border-purple-300 hover:bg-purple-50'
                }`}
                onClick={() => shareWisdom(archetypalStories
                  .filter(s => s.archetype === archetype)
                  [Math.floor(Math.random() * archetypalStories.filter(s => s.archetype === archetype).length)]
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${
                    archetype === 'krishna' ? 'from-blue-500 to-cyan-500' :
                    archetype === 'ram' ? 'from-yellow-500 to-orange-500' :
                    'from-purple-500 to-violet-500'
                  } flex items-center justify-center text-white shadow-lg`}>
                    <span className="text-lg">
                      {archetype === 'krishna' ? '💙' :
                       archetype === 'ram' ? '🤝' : '🧘'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold capitalize text-gray-900">
                      {archetype}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {archetype === 'krishna' ? 'Love & Joy' :
                       archetype === 'ram' ? 'Commitment' : 'Inner Peace'}
                    </p>
                  </div>
                </div>
              </Button>
            ))}
          </div>

          <div className="flex items-center justify-center pt-4 border-t">
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
              onClick={() => shareWisdom(getContextualStory())}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Share Random Wisdom
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Wisdom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {archetypalStories.slice(0, 6).map((story) => (
          <Card
            key={story.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-gray-200"
            onClick={() => shareWisdom(story)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${
                  story.archetype === 'krishna' ? 'from-blue-500 to-cyan-500' :
                  story.archetype === 'ram' ? 'from-yellow-500 to-orange-500' :
                  'from-purple-500 to-violet-500'
                } flex items-center justify-center text-white shadow-md`}>
                  <span className="text-sm">{story.emoji}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-gray-900 leading-tight">
                    {story.title}
                  </h4>
                  <Badge variant="outline" className="text-xs mt-1 capitalize">
                    {story.archetype}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">
                {story.lesson}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MythologicalWisdom;
