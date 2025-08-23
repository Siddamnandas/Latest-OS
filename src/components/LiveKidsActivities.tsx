'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Star,
  Heart,
  BookOpen,
  Palette,
  MapPin,
  Users,
  Trophy,
  Camera
} from 'lucide-react';

interface KidsActivity {
  id: string;
  title: string;
  description: string;
  type: 'educational' | 'creative' | 'outdoor' | 'family_bonding' | 'reading';
  duration: number; // in minutes
  ageGroup: string;
  scheduledFor?: string;
  status: 'planned' | 'in_progress' | 'completed';
  engagementScore?: number;
  materials?: string[];
  notes?: string;
}

export function LiveKidsActivities() {
  const [activities, setActivities] = useState<KidsActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const sampleActivities: KidsActivity[] = [
        {
          id: '1',
          title: 'Bedtime Story Adventure',
          description: 'Read magical stories together before sleep',
          type: 'reading',
          duration: 30,
          ageGroup: '3-8 years',
          scheduledFor: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
          status: 'planned',
          materials: ['Storybooks', 'Comfortable pillows', 'Soft lighting'],
          notes: 'Let kids choose their favorite stories'
        },
        {
          id: '2',
          title: 'Nature Scavenger Hunt',
          description: 'Explore the park and find treasures in nature',
          type: 'outdoor',
          duration: 90,
          ageGroup: '5-12 years',
          scheduledFor: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          status: 'planned',
          materials: ['Collection bags', 'Nature checklist', 'Camera'],
          notes: 'Perfect for weekend morning'
        },
        {
          id: '3',
          title: 'Family Art Gallery',
          description: 'Create beautiful artwork and display it proudly',
          type: 'creative',
          duration: 60,
          ageGroup: '4-10 years',
          scheduledFor: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          status: 'planned',
          materials: ['Colored paper', 'Crayons', 'Glue', 'Stickers'],
          notes: 'Display finished artwork on family wall'
        },
        {
          id: '4',
          title: 'Math Magic Show',
          description: 'Make learning numbers fun with magic tricks',
          type: 'educational',
          duration: 45,
          ageGroup: '6-12 years',
          status: 'completed',
          engagementScore: 95,
          materials: ['Number cards', 'Simple props', 'Magic wand'],
          notes: 'Kids loved the disappearing numbers trick!'
        },
        {
          id: '5',
          title: 'Family Cooking Time',
          description: 'Prepare healthy snacks together',
          type: 'family_bonding',
          duration: 75,
          ageGroup: '5-15 years',
          status: 'completed',
          engagementScore: 88,
          materials: ['Fresh fruits', 'Yogurt', 'Granola', 'Fun plates'],
          notes: 'Everyone enjoyed making fruit parfaits'
        },
        {
          id: '6',
          title: 'Science Experiment Lab',
          description: 'Discover the wonders of science through fun experiments',
          type: 'educational',
          duration: 50,
          ageGroup: '7-14 years',
          status: 'in_progress',
          materials: ['Baking soda', 'Vinegar', 'Food coloring', 'Safety goggles']
        }
      ];
      
      setActivities(sampleActivities);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'educational':
        return <BookOpen className="w-5 h-5" />;
      case 'creative':
        return <Palette className="w-5 h-5" />;
      case 'outdoor':
        return <MapPin className="w-5 h-5" />;
      case 'family_bonding':
        return <Heart className="w-5 h-5" />;
      case 'reading':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'educational':
        return 'from-blue-500 to-indigo-500';
      case 'creative':
        return 'from-purple-500 to-pink-500';
      case 'outdoor':
        return 'from-green-500 to-emerald-500';
      case 'family_bonding':
        return 'from-red-500 to-rose-500';
      case 'reading':
        return 'from-orange-500 to-amber-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'planned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const types = [
    { id: 'all', name: 'All Activities', count: activities.length },
    { id: 'educational', name: 'Educational', count: activities.filter(a => a.type === 'educational').length },
    { id: 'creative', name: 'Creative', count: activities.filter(a => a.type === 'creative').length },
    { id: 'outdoor', name: 'Outdoor', count: activities.filter(a => a.type === 'outdoor').length },
    { id: 'family_bonding', name: 'Family', count: activities.filter(a => a.type === 'family_bonding').length },
    { id: 'reading', name: 'Reading', count: activities.filter(a => a.type === 'reading').length }
  ];

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedType);

  const completedActivities = activities.filter(a => a.status === 'completed').length;
  const averageEngagement = Math.round(
    activities
      .filter(a => a.engagementScore)
      .reduce((sum, a) => sum + (a.engagementScore || 0), 0) / 
    activities.filter(a => a.engagementScore).length
  ) || 0;

  if (loading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading activities...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Kids Activities 👶</h2>
            <p className="text-white/80">Fun learning experiences together</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completedActivities}</div>
            <div className="text-sm text-white/80">Completed</div>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{activities.length}</div>
            <div className="text-xs text-white/80">Total Activities</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{averageEngagement}%</div>
            <div className="text-xs text-white/80">Engagement</div>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <div className="text-xl font-bold">{activities.filter(a => a.status === 'planned').length}</div>
            <div className="text-xs text-white/80">Planned</div>
          </div>
        </div>
      </div>

      {/* Activity Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {types.map((type) => (
          <Button
            key={type.id}
            variant={selectedType === type.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedType(type.id)}
            className="whitespace-nowrap"
          >
            {type.name} ({type.count})
          </Button>
        ))}
      </div>

      {/* Add Activity Button */}
      <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
        <Plus className="w-4 h-4 mr-2" />
        Plan New Activity
      </Button>

      {/* Activities List */}
      <div className="space-y-4">
        {filteredActivities.map((activity) => (
          <div
            key={activity.id}
            className="bg-white/90 backdrop-blur-lg rounded-xl p-6 border border-white/50 shadow-lg"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${getTypeColor(activity.type)} flex items-center justify-center text-white shadow-lg`}>
                  {getTypeIcon(activity.type)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{activity.title}</h3>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                </div>
              </div>
              
              <Badge className={`text-xs ${getStatusBadge(activity.status)}`}>
                {activity.status.replace('_', ' ')}
              </Badge>
            </div>

            {/* Activity Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{activity.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>{activity.ageGroup}</span>
              </div>
            </div>

            {/* Scheduled Time */}
            {activity.scheduledFor && (
              <div className="flex items-center gap-2 text-sm text-purple-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>Scheduled: {new Date(activity.scheduledFor).toLocaleString()}</span>
              </div>
            )}

            {/* Engagement Score */}
            {activity.engagementScore && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Engagement Score</span>
                  <span className="text-sm text-gray-600">{activity.engagementScore}%</span>
                </div>
                <Progress value={activity.engagementScore} className="h-2" />
              </div>
            )}

            {/* Materials */}
            {activity.materials && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Materials Needed:</h4>
                <div className="flex flex-wrap gap-2">
                  {activity.materials.map((material, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {activity.notes && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">💡 {activity.notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {activity.status === 'planned' && (
                <Button 
                  size="sm"
                  className={`bg-gradient-to-r ${getTypeColor(activity.type)} hover:opacity-90 text-white`}
                >
                  Start Activity
                </Button>
              )}
              {activity.status === 'in_progress' && (
                <Button 
                  size="sm"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90 text-white"
                >
                  Complete Activity
                </Button>
              )}
              {activity.status === 'completed' && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="text-purple-600 border-purple-600"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photos
                </Button>
              )}
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-center">
        <Trophy className="w-8 h-8 text-blue-600 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-blue-900 mb-2">This Week's Adventure! 🌟</h3>
        <p className="text-blue-700">
          {completedActivities} activities completed with an average engagement of {averageEngagement}%. 
          Keep creating magical moments together!
        </p>
      </div>
    </div>
  );
}