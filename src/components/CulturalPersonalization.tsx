'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  Music, 
  BookOpen,
  Users,
  Gift,
  Sparkles,
  TrendingUp,
  Award,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  Flag,
  Landmark as Temple,
  Utensils,
  Camera,
  Palette,
  Languages,
  Moon,
  Sun,
  Cloud,
  Flower,
  Lightbulb,
  Target,
  Home,
  Baby,
  DollarSign,
  HeartHandshake
} from 'lucide-react';

interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  significance: string;
  traditions: string[];
  region: string;
  category: 'religious' | 'cultural' | 'seasonal' | 'harvest';
  coupleActivities: string[];
  familyActivities: string[];
  upcoming: boolean;
  daysUntil: number;
}

interface CulturalRegion {
  id: string;
  name: string;
  language: string;
  customs: string[];
  festivals: string[];
  values: string[];
  relationshipNorms: string[];
  familyStructure: string[];
  cuisine: string[];
  arts: string[];
}

interface PersonalizedContent {
  id: string;
  type: 'festival' | 'custom' | 'recipe' | 'story' | 'activity' | 'wisdom';
  title: string;
  description: string;
  region: string;
  category: string;
  relevance: number;
  engagement: number;
  lastAccessed: Date;
}

interface CulturalPreference {
  region: string;
  language: string;
  interests: string[];
  festivalNotifications: boolean;
  culturalTips: boolean;
  regionalContent: boolean;
}

export function CulturalPersonalization() {
  const [selectedRegion, setSelectedRegion] = useState<string>('north-india');
  const [activeTab, setActiveTab] = useState('festivals');
  const [preferences, setPreferences] = useState<CulturalPreference>({
    region: 'north-india',
    language: 'hindi',
    interests: ['festivals', 'food', 'music', 'family'],
    festivalNotifications: true,
    culturalTips: true,
    regionalContent: true
  });
  
  const [festivals, setFestivals] = useState<Festival[]>([
    {
      id: '1',
      name: 'Diwali',
      date: '2024-11-01',
      description: 'Festival of Lights celebrating the victory of light over darkness',
      significance: 'Symbolizes the triumph of good over evil, light over darkness, and knowledge over ignorance',
      traditions: ['Lighting diyas', 'Exchanging gifts', 'Family gatherings', 'Fireworks', 'Rangoli'],
      region: 'pan-india',
      category: 'religious',
      coupleActivities: ['Create rangoli together', 'Exchange thoughtful gifts', 'Cook traditional sweets', 'Visit temple together'],
      familyActivities: ['Family prayer ceremony', 'Light diyas together', 'Share stories of Diwali', 'Make traditional sweets'],
      upcoming: true,
      daysUntil: 45
    },
    {
      id: '2',
      name: 'Holi',
      date: '2024-03-25',
      description: 'Festival of Colors celebrating love and spring',
      significance: 'Celebrates the arrival of spring, the end of winter, and the victory of good over evil',
      traditions: ['Playing with colors', 'Dancing', 'Singing folk songs', 'Sharing sweets', 'Bonfire'],
      region: 'north-india',
      category: 'cultural',
      coupleActivities: ['Play colors together', 'Dance to Holi songs', 'Prepare special snacks', 'Visit friends and family'],
      familyActivities: ['Community color play', 'Traditional Holi bonfire', 'Share festive meals', 'Family gatherings'],
      upcoming: false,
      daysUntil: -120
    },
    {
      id: '3',
      name: 'Pongal',
      date: '2024-01-15',
      description: 'Harvest festival thanking the Sun God',
      significance: 'Expresses gratitude to nature for a bountiful harvest and marks the beginning of the Tamil month',
      traditions: ['Cooking Pongal dish', 'Decorating homes', 'Flying kites', 'Family prayers', 'Giving gifts'],
      region: 'south-india',
      category: 'harvest',
      coupleActivities: ['Cook Pongal together', 'Decorate home with kolam', 'Fly kites together', 'Visit relatives'],
      familyActivities: ['Harvest prayers', 'Traditional games', 'Community feasts', 'Cultural performances'],
      upcoming: false,
      daysUntil: -200
    },
    {
      id: '4',
      name: 'Navratri',
      date: '2024-10-03',
      description: 'Nine-night festival celebrating the divine feminine',
      significance: 'Worship of the Goddess Durga and celebration of feminine power',
      traditions: ['Garba dance', 'Dandiya raas', 'Fasting', 'Prayer ceremonies', 'Dressing in traditional attire'],
      region: 'west-india',
      category: 'religious',
      coupleActivities: ['Participate in Garba together', 'Wear traditional outfits', 'Prepare fasting food', 'Attend cultural events'],
      familyActivities: ['Family Garba nights', 'Prayer gatherings', 'Cultural programs', 'Community celebrations'],
      upcoming: true,
      daysUntil: 17
    },
    {
      id: '5',
      name: 'Durga Puja',
      date: '2024-10-15',
      description: 'Festival celebrating Goddess Durga',
      significance: 'Celebrates the victory of Goddess Durga over the buffalo demon Mahishasura',
      traditions: ['Building pandals', 'Cultural programs', 'Feasting', 'Immersion of idols', 'New clothes'],
      region: 'east-india',
      category: 'religious',
      coupleActivities: ['Visit pandals together', 'Dress in traditional attire', 'Enjoy cultural programs', 'Participate in rituals'],
      familyActivities: ['Family pandal visits', 'Community feasts', 'Cultural performances', 'Religious ceremonies'],
      upcoming: true,
      daysUntil: 29
    },
    {
      id: '6',
      name: 'Onam',
      date: '2024-09-15',
      description: 'Harvest festival of Kerala',
      significance: 'Celebrates the homecoming of the legendary King Mahabali and the harvest season',
      traditions: ['Onam Sadhya feast', 'Pookalam (flower rangoli)', 'Snake boat races', 'Traditional dances', 'New clothes'],
      region: 'south-india',
      category: 'harvest',
      coupleActivities: ['Prepare Onam Sadhya together', 'Create pookalam', 'Watch snake boat races', 'Wear traditional attire'],
      familyActivities: ['Family feast', 'Flower carpet competitions', 'Cultural programs', 'Community celebrations'],
      upcoming: false,
      daysUntil: -59
    }
  ]);

  const [regions, setRegions] = useState<CulturalRegion[]>([
    {
      id: 'north-india',
      name: 'North India',
      language: 'Hindi',
      customs: ['Joint family system', 'Respect for elders', 'Festival celebrations', 'Traditional weddings'],
      festivals: ['Diwali', 'Holi', 'Raksha Bandhan', 'Karva Chauth', 'Baisakhi'],
      values: ['Family unity', 'Respect for traditions', 'Hospitality', 'Education'],
      relationshipNorms: ['Arranged marriages common', 'Family involvement in relationships', 'Respect for elders', 'Traditional gender roles'],
      familyStructure: ['Joint families', 'Strong family bonds', 'Elder respect', 'Family decision-making'],
      cuisine: ['Roti', 'Sabzi', 'Dal', 'Paneer', 'Sweets', 'Spices'],
      arts: ['Classical music', 'Bollywood', 'Folk dances', 'Miniature paintings']
    },
    {
      id: 'south-india',
      name: 'South India',
      language: 'Tamil, Telugu, Kannada, Malayalam',
      customs: ['Temple visits', 'Classical arts', 'Arranged marriages', 'Respect for teachers'],
      festivals: ['Pongal', 'Onam', 'Ugadi', 'Varalakshmi Vratam', 'Ayudha Puja'],
      values: ['Education', 'Spirituality', 'Family values', 'Cultural preservation'],
      relationshipNorms: ['Love marriages accepted', 'Family approval important', 'Education focus', 'Career orientation'],
      familyStructure: ['Nuclear families', 'Strong parent-child bonds', 'Emphasis on education', 'Cultural preservation'],
      cuisine: ['Rice', 'Sambar', 'Rasam', 'Coconut', 'Spices', 'Seafood'],
      arts: ['Classical dance', 'Carnatic music', 'Temple architecture', 'Classical arts']
    },
    {
      id: 'east-india',
      name: 'East India',
      language: 'Bengali, Oriya, Assamese',
      customs: ['Durga Puja', 'Rasgulla making', 'Traditional crafts', 'Literary traditions'],
      festivals: ['Durga Puja', 'Kali Puja', 'Rath Yatra', 'Bihu', 'Chhath Puja'],
      values: ['Artistic expression', 'Intellectual pursuits', 'Cultural pride', 'Spiritual growth'],
      relationshipNorms: ['Progressive attitudes', 'Education important', 'Cultural activities', 'Family involvement'],
      familyStructure: ['Nuclear families', 'Cultural activities', 'Educational focus', 'Artistic expression'],
      cuisine: ['Fish curry', 'Rasgulla', 'Sweets', 'Rice', 'Mustard oil', 'Vegetables'],
      arts: ['Classical music', 'Folk arts', 'Literature', 'Theater', 'Painting']
    },
    {
      id: 'west-india',
      name: 'West India',
      language: 'Gujarati, Marathi, Rajasthani',
      customs: ['Garba', 'Folk dances', 'Traditional crafts', 'Business orientation'],
      festivals: ['Navratri', 'Ganesh Chaturthi', 'Janmashtami', 'Makar Sankranti', 'Uttarayan'],
      values: ['Entrepreneurship', 'Family business', 'Cultural preservation', 'Religious devotion'],
      relationshipNorms: ['Business families', 'Arranged marriages', 'Family business involvement', 'Cultural activities'],
      familyStructure: ['Joint families', 'Business orientation', 'Cultural activities', 'Religious practices'],
      cuisine: ['Dhokla', 'Thepla', 'Vada Pav', 'Seafood', 'Sweets', 'Snacks'],
      arts: ['Folk dances', 'Traditional music', 'Handicrafts', 'Textiles', 'Architecture']
    }
  ]);

  const [personalizedContent, setPersonalizedContent] = useState<PersonalizedContent[]>([
    {
      id: '1',
      type: 'festival',
      title: 'Diwali Couple Rituals',
      description: 'Special rituals for couples during Diwali to strengthen their bond',
      region: 'pan-india',
      category: 'festival',
      relevance: 95,
      engagement: 87,
      lastAccessed: new Date()
    },
    {
      id: '2',
      type: 'recipe',
      title: 'Traditional Sweets for Couples',
      description: 'Make traditional Indian sweets together as a couple bonding activity',
      region: 'north-india',
      category: 'food',
      relevance: 88,
      engagement: 92,
      lastAccessed: new Date()
    },
    {
      id: '3',
      type: 'activity',
      title: 'Rangoli Making Together',
      description: 'Create beautiful rangoli designs as a couple this Diwali season',
      region: 'pan-india',
      category: 'art',
      relevance: 92,
      engagement: 85,
      lastAccessed: new Date()
    },
    {
      id: '4',
      type: 'wisdom',
      title: 'Ancient Relationship Wisdom',
      description: 'Learn from ancient Indian texts about building lasting relationships',
      region: 'pan-india',
      category: 'wisdom',
      relevance: 85,
      engagement: 78,
      lastAccessed: new Date()
    }
  ]);

  const getRegionData = (regionId: string) => {
    return regions.find(r => r.id === regionId) || regions[0];
  };

  const getUpcomingFestivals = () => {
    return festivals.filter(f => f.upcoming).sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const getRegionFestivals = () => {
    if (selectedRegion === 'pan-india') {
      return festivals;
    }
    return festivals.filter(f => f.region === selectedRegion || f.region === 'pan-india');
  };

  const getFestivalIcon = (category: string) => {
    switch (category) {
      case 'religious': return <Temple className="w-5 h-5" />;
      case 'cultural': return <Music className="w-5 h-5" />;
      case 'seasonal': return <Cloud className="w-5 h-5" />;
      case 'harvest': return <Flower className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'festival': return <Calendar className="w-5 h-5" />;
      case 'custom': return <Users className="w-5 h-5" />;
      case 'recipe': return <Utensils className="w-5 h-5" />;
      case 'story': return <BookOpen className="w-5 h-5" />;
      case 'activity': return <Target className="w-5 h-5" />;
      case 'wisdom': return <Lightbulb className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const getFestivalColor = (category: string) => {
    switch (category) {
      case 'religious': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'cultural': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'seasonal': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'harvest': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const calculateCulturalEngagement = () => {
    const totalEngagement = personalizedContent.reduce((sum, content) => sum + content.engagement, 0);
    return Math.round(totalEngagement / personalizedContent.length);
  };

  const handleRegionChange = (regionId: string) => {
    setSelectedRegion(regionId);
    setPreferences(prev => ({ ...prev, region: regionId }));
  };

  const handleContentEngagement = (contentId: string) => {
    setPersonalizedContent(prev => 
      prev.map(content => 
        content.id === contentId 
          ? { ...content, engagement: Math.min(100, content.engagement + 5), lastAccessed: new Date() }
          : content
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6" />
              <div>
                <CardTitle className="text-lg">Cultural Personalization</CardTitle>
                <p className="text-sm opacity-90">Region-specific content and traditions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              <span className="text-sm">
                Current Region: {getRegionData(selectedRegion).name}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-75">Cultural Engagement</p>
              <p className="text-sm font-medium">{calculateCulturalEngagement()}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Region Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Select Your Region
            </h3>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Preferences
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => handleRegionChange(region.id)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  selectedRegion === region.id
                    ? 'bg-orange-100 border-orange-300 text-orange-800'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="font-medium text-sm">{region.name}</div>
                <div className="text-xs opacity-75">{region.language}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="festivals">Festivals</TabsTrigger>
          <TabsTrigger value="customs">Customs</TabsTrigger>
          <TabsTrigger value="content">For You</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="festivals" className="space-y-4">
          {/* Upcoming Festivals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Upcoming Festivals
                </div>
                <Badge variant="outline" className="text-xs">
                  {getUpcomingFestivals().length} upcoming
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getUpcomingFestivals().map((festival) => (
                  <div key={festival.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getFestivalColor(festival.category)}`}>
                          {getFestivalIcon(festival.category)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{festival.name}</h4>
                          <p className="text-sm text-gray-600">{festival.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {festival.daysUntil} days
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {festival.region}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{festival.date}</p>
                        <p className="text-xs text-gray-500">{festival.category}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Couple Activities</h5>
                        <div className="space-y-1">
                          {festival.coupleActivities.slice(0, 3).map((activity, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                              <Heart className="w-3 h-3 text-pink-500" />
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-2">Family Activities</h5>
                        <div className="space-y-1">
                          {festival.familyActivities.slice(0, 3).map((activity, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                              <Users className="w-3 h-3 text-blue-500" />
                              {activity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm font-medium text-orange-900 mb-1">Significance:</p>
                      <p className="text-sm text-orange-700">{festival.significance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Festivals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                {getRegionData(selectedRegion).name} Festivals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getRegionFestivals().map((festival) => (
                  <div key={festival.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{festival.name}</h4>
                      <Badge className={`text-xs ${getFestivalColor(festival.category)}`}>
                        {festival.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{festival.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{festival.date}</span>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customs" className="space-y-4">
          {/* Regional Customs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                {getRegionData(selectedRegion).name} Customs & Traditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Customs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {getRegionData(selectedRegion).customs.map((custom, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">{custom}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Core Values</h4>
                  <div className="flex flex-wrap gap-2">
                    {getRegionData(selectedRegion).values.map((value, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {value}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Relationship Norms</h4>
                  <div className="space-y-2">
                    {getRegionData(selectedRegion).relationshipNorms.map((norm, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <HeartHandshake className="w-4 h-4 text-pink-500" />
                        {norm}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Family Structure</h4>
                  <div className="space-y-2">
                    {getRegionData(selectedRegion).familyStructure.map((structure, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        <Home className="w-4 h-4 text-blue-500" />
                        {structure}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Cuisine</h4>
                    <div className="flex flex-wrap gap-2">
                      {getRegionData(selectedRegion).cuisine.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Utensils className="w-3 h-3 mr-1" />
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Arts & Culture</h4>
                    <div className="flex flex-wrap gap-2">
                      {getRegionData(selectedRegion).arts.map((art, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Palette className="w-3 h-3 mr-1" />
                          {art}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          {/* Personalized Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Personalized For You
                </div>
                <Badge variant="outline" className="text-xs">
                  {personalizedContent.length} items
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personalizedContent.map((content) => (
                  <div key={content.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                          {getContentIcon(content.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <MapPin className="w-3 h-3 mr-1" />
                              {content.region}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {content.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{content.relevance}% match</div>
                        <div className="text-xs text-gray-500">Engagement: {content.engagement}%</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Progress value={content.engagement} className="w-20 h-2" />
                        <span className="text-xs text-gray-500">Engaged</span>
                      </div>
                      <Button 
                        onClick={() => handleContentEngagement(content.id)}
                        variant="outline" 
                        size="sm"
                      >
                        Explore
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Content Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Festival Notifications</h4>
                    <p className="text-sm text-gray-600">Get reminders for upcoming festivals</p>
                  </div>
                  <Button
                    onClick={() => setPreferences(prev => ({ ...prev, festivalNotifications: !prev.festivalNotifications }))}
                    variant={preferences.festivalNotifications ? "default" : "outline"}
                    size="sm"
                  >
                    {preferences.festivalNotifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Cultural Tips</h4>
                    <p className="text-sm text-gray-600">Receive cultural insights and tips</p>
                  </div>
                  <Button
                    onClick={() => setPreferences(prev => ({ ...prev, culturalTips: !prev.culturalTips }))}
                    variant={preferences.culturalTips ? "default" : "outline"}
                    size="sm"
                  >
                    {preferences.culturalTips ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Regional Content</h4>
                    <p className="text-sm text-gray-600">See content specific to your region</p>
                  </div>
                  <Button
                    onClick={() => setPreferences(prev => ({ ...prev, regionalContent: !prev.regionalContent }))}
                    variant={preferences.regionalContent ? "default" : "outline"}
                    size="sm"
                  >
                    {preferences.regionalContent ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          {/* Cultural Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Cultural Engagement Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{calculateCulturalEngagement()}%</div>
                  <div className="text-sm text-orange-600">Engagement Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{personalizedContent.length}</div>
                  <div className="text-sm text-purple-600">Personalized Items</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{getUpcomingFestivals().length}</div>
                  <div className="text-sm text-blue-600">Upcoming Festivals</div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Cultural Connection Strength</h4>
                <Progress value={calculateCulturalEngagement()} className="h-3 mb-2" />
                <p className="text-sm text-gray-600">
                  Your cultural engagement is {calculateCulturalEngagement()}%. {calculateCulturalEngagement() > 80 ? 'Excellent! You\'re deeply connected to your cultural roots.' : 'Great! Keep exploring your cultural heritage.'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Cultural Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Upcoming Festival Preparation</h4>
                      <p className="text-sm text-gray-600">Get ready for the next festival in your region</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-700">
                      <Utensils className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Regional Cuisine Exploration</h4>
                      <p className="text-sm text-gray-600">Discover traditional recipes from your region</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Explore Recipes
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
                      <Music className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Cultural Music & Arts</h4>
                      <p className="text-sm text-gray-600">Explore traditional music and art forms</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Discover Arts
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
