'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { BadgeAlert, Lightbulb, Heart, Shield, Users, Brain } from 'lucide-react';

interface ConflictSummary {
  resolution: 'compromise' | 'understanding' | 'boundaries' | 'communication';
  lessonsLearned: string;
  relationshipStrength: string;
  preventionTips: string;
  followUp: string;
}

interface Conflict {
  id: string;
  title: string;
  description: string;
  emotionalState: string;
  partnerPerspective?: string;
  resolutionType?: 'compromise' | 'understanding' | 'boundaries' | 'communication';
  status: 'active' | 'resolved';
  createdAt: string;
  summary?: ConflictSummary;
}

export function ConflictSolver() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [showLogConflict, setShowLogConflict] = useState(false);
  const [activeConflict, setActiveConflict] = useState<Conflict | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);

  const [newConflict, setNewConflict] = useState({
    title: '',
    description: '',
    emotionalState: 'frustrated'
  });

  const emotionalStates = [
    { value: 'frustrated', label: 'Frustrated 😠', emoji: '😠' },
    { value: 'hurt', label: 'Hurt 💔', emoji: '💔' },
    { value: 'angry', label: 'Angry 😡', emoji: '😡' },
    { value: 'disappointed', label: 'Disappointed 😞', emoji: '😞' },
    { value: 'betrayed', label: 'Betrayed 😢', emoji: '😢' },
    { value: 'sad', label: 'Sad 😭', emoji: '😭' }
  ];

  const resolutionTypes = [
    { value: 'compromise', label: 'Compromise', icon: Users, color: 'bg-blue-100 text-blue-700' },
    { value: 'understanding', label: 'Understanding', icon: Heart, color: 'bg-pink-100 text-pink-700' },
    { value: 'boundaries', label: 'Boundaries', icon: Shield, color: 'bg-purple-100 text-purple-700' },
    { value: 'communication', label: 'Communication', icon: BadgeAlert, color: 'bg-yellow-100 text-yellow-700' }
  ];

  // Simulate AI conflict analysis
  const analyzeConflict = (conflict: Conflict) => {
    // This would be replaced with actual AI analysis
    return {
      primaryTrigger: 'communication',
      emotionalPatterns: ['building_frustration', 'unmet_expectations'],
      relationshipImpact: 'medium',
      suggestedApproach: 'compromise',
      keyInsights: [
        'Pattern shows unmet expectations around workload balance',
        'Communication gap about emotional needs',
        'Similar conflicts occurred 3XE7IS times before'
      ],
      actionSteps: [
        'Schedule dedicated time to discuss expectations',
        'Each partner writes 3 specific needs or concerns',
        'Use "I feel..." statements instead of blame',
        'Agree on one small change this week'
      ],
      estimatedResolution: '2-3 days with consistent communication'
    };
  };

  // Generate post-conflict summary
  const generateSummary = (conflict: Conflict): ConflictSummary => {
    return {
      resolution: conflict.resolutionType!, // We know this is defined when generating summary
      lessonsLearned: 'Clear communication was key to resolving this quickly',
      relationshipStrength: 'Meeting in middle helped both feel heard',
      preventionTips: 'Weekly check-ins to discuss workload concerns',
      followUp: 'No unresolved issues remaining'
    };
  };

  const logNewConflict = () => {
    if (!newConflict.title.trim() || !newConflict.description.trim()) return;

    const conflict: Conflict = {
      id: Date.now().toString(),
      title: newConflict.title,
      description: newConflict.description,
      emotionalState: newConflict.emotionalState,
      status: 'active',
      createdAt: new Date().toISOString()
    };

    setConflicts(prev => [conflict, ...prev]);

    // Auto-analyze conflict
    const analysisResult = analyzeConflict(conflict);
    setAnalysis(analysisResult);
    setActiveConflict(conflict);

    setNewConflict({
      title: '',
      description: '',
      emotionalState: 'frustrated'
    });
    setShowLogConflict(false);
  };

  const resolveConflict = (conflictId: string, resolutionType: Conflict['resolutionType']) => {
    if (!resolutionType) return;
    const currentConflict = conflicts.find(c => c.id === conflictId);
    if (!currentConflict) return;

    const conflictWithResolution = { ...currentConflict, resolutionType };
    const summary = generateSummary(conflictWithResolution);

    setConflicts(prev => prev.map(c =>
      c.id === conflictId
        ? { ...c, status: 'resolved', resolutionType, summary }
        : c
    ));
    setActiveConflict(null);
    setAnalysis(null);
  };

  const getEmotionalEmoji = (state: string) => {
    return emotionalStates.find(e => e.value === state)?.emoji || '😢';
  };

  const getStatusColor = (status: string) => {
    return status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  const resolvedCount = conflicts.filter(c => c.status === 'resolved').length;

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-6 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Conflict Solver</h1>
              <p className="text-white/80 text-sm">AI-guided resolution and post-conflict analysis</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center bg-white/20 backdrop-blur-lg rounded-xl p-3 min-w-[80px]">
                <div className="flex items-center gap-1">
                  <Heart className="w-5 h-5 text-white" />
                  <span className="text-xl font-bold text-white">{conflicts.length}</span>
                </div>
                <span className="text-xs text-white/80">Total</span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="bg-white/20 backdrop-blur-lg rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/90 font-medium">
                Resolution Rate: {conflicts.length > 0 ? Math.round((resolvedCount / conflicts.length) * 100) : 0}%
              </span>
            </div>
            <Progress value={conflicts.length > 0 ? (resolvedCount / conflicts.length) * 100 : 0} className="h-2 bg-white/30" />
          </div>
        </div>
      </div>

      {/* AI Conflict Analysis Sidebar */}
      {analysis && activeConflict && (
        <div className="fixed top-4 right-4 w-96 space-y-4 bg-white/95 backdrop-blur-lg border border-white/50 shadow-lg rounded-2xl p-6 z-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Analysis
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setAnalysis(null); setActiveConflict(null); }}
            >
              ✕
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Conflict Insights 💡</h4>
              <div className="space-y-2 text-sm">
                {analysis.keyInsights.map((insight: string, index: number) => (
                  <div key={index} className="text-gray-700">• {insight}</div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Action Steps 🚀</h4>
              <div className="space-y-2 text-sm">
                {analysis.actionSteps.map((step: string, index: number) => (
                  <div key={index} className="text-gray-700">{index + 1}. {step}</div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Recommended Approach</h4>
              <Badge className="bg-purple-100 text-purple-700 capitalize">
                {analysis.suggestedApproach}
              </Badge>
              <div className="text-sm text-gray-600 mt-2">
                Estimated resolution: {analysis.estimatedResolution}
              </div>
            </div>

            <div className="flex gap-2">
              {resolutionTypes.map((type) => (
                <Button
                  key={type.value}
                  onClick={() => resolveConflict(activeConflict.id, type.value as Conflict['resolutionType'])}
                  className={`${type.color} border-0 text-sm flex items-center gap-1`}
                >
                  <type.icon className="w-4 h-4" />
                  {type.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conflicts List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Recent Conflicts</h2>
          <Button
            onClick={() => setShowLogConflict(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Log New Conflict
          </Button>
        </div>

        {conflicts.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conflicts recorded yet</h3>
              <p className="text-gray-600 mb-4">That's great! It means you and your partner are communicating well.</p>
              <Button onClick={() => setShowLogConflict(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Log Your First Conflict
              </Button>
            </div>
          </div>
        )}

        {conflicts.map((conflict) => (
          <Card key={conflict.id} className={`border-l-4 ${
            conflict.status === 'resolved' ? 'border-l-green-500 bg-green-50/50' : 'border-l-red-500'
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-gray-900">{conflict.title}</h4>
                    <Badge className={getStatusColor(conflict.status)}>
                      {conflict.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">{conflict.description}</p>

                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      {getEmotionalEmoji(conflict.emotionalState)} {conflict.emotionalState}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(conflict.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => {
                    setActiveConflict(conflict);
                    if (!analysis) {
                      setAnalysis(analyzeConflict(conflict));
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                >
                  <Brain className="w-4 h-4 mr-1" />
                  Analyze
                </Button>
              </div>

              {conflict.summary && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                  <h5 className="font-semibold text-green-800 mb-2">Post-Conflict Summary ✅</h5>
                  <div className="text-sm text-green-700 space-y-1">
                    <p><strong>Resolution:</strong> {conflict.summary.resolution}</p>
                    <p><strong>Lessons:</strong> {conflict.summary.lessonsLearned}</p>
                    <p><strong>Follow-up:</strong> {conflict.summary.followUp}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Log New Conflict Modal */}
      {showLogConflict && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Log New Conflict</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowLogConflict(false)}>
                ✕
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Conflict Title</label>
                <input
                  type="text"
                  value={newConflict.title}
                  onChange={(e) => setNewConflict(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 'Disagreed about weekend plans'"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Description</label>
                <Textarea
                  value={newConflict.description}
                  onChange={(e) => setNewConflict(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what happened, how you felt, and your perspective..."
                  rows={4}
                  className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Your Emotional State</label>
                <div className="grid grid-cols-2 gap-2">
                  {emotionalStates.map((emotion) => (
                    <button
                      key={emotion.value}
                      onClick={() => setNewConflict(prev => ({ ...prev, emotionalState: emotion.value }))}
                      className={`p-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                        newConflict.emotionalState === emotion.value
                          ? 'bg-blue-100 border-blue-400 shadow-md'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{emotion.emoji}</span>
                      <span className="text-sm font-medium">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowLogConflict(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={logNewConflict}
              >
                Log Conflict & Analyze
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
