'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Home, 
  Target, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Utensils,
  ShoppingCart,
  Heart,
  Plus,
  Star,
  Clock,
  CheckCircle,
  Plane,
  Car,
  Building,
  Sparkles,
  Gift,
  Trophy,
  Zap
} from 'lucide-react';
import { InteractiveConfetti } from '@/components/InteractiveConfetti';
import { MagicButton } from '@/components/MagicButton';
import { FloatingEmoji } from '@/components/FloatingEmoji';

interface Goal {
  id: string;
  title: string;
  category: 'home' | 'travel' | 'financial' | 'lifestyle';
  targetDate: string;
  targetAmount: number;
  currentAmount: number;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
  milestones: string[];
  description: string;
}

interface WeekendMealSuggestion {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  minOrder: number;
  discount: number;
  priceForTwo: number;
  familyFriendly: boolean;
  weekendSpecial: boolean;
}

interface GrocerySuggestion {
  id: string;
  name: string;
  category: string;
  bestPrice: number;
  originalPrice: number;
  discount: number;
  store: string;
  urgency: 'high' | 'medium' | 'low';
  quantity: string;
  healthRating: number;
}

export function FamilyPlanning() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [weekendMealSuggestions, setWeekendMealSuggestions] = useState<WeekendMealSuggestion[]>([]);
  const [grocerySuggestions, setGrocerySuggestions] = useState<GrocerySuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFloatingEmoji, setShowFloatingEmoji] = useState(false);
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setGoals([
        {
          id: '1',
          title: 'Buy Our First Home',
          category: 'home',
          targetDate: '2025-12-31',
          targetAmount: 5000000,
          currentAmount: 1200000,
          priority: 'high',
          status: 'active',
          milestones: ['Save ₹20L down payment', 'Get loan pre-approved', 'Find perfect location'],
          description: 'Dream home in a family-friendly neighborhood with good schools'
        },
        {
          id: '2',
          title: 'Europe Family Vacation',
          category: 'travel',
          targetDate: '2024-08-15',
          targetAmount: 500000,
          currentAmount: 350000,
          priority: 'medium',
          status: 'active',
          milestones: ['Book flights', 'Plan itinerary', 'Get visas'],
          description: '2-week trip to Paris, Rome, and Barcelona with kids'
        },
        {
          id: '3',
          title: 'Emergency Fund',
          category: 'financial',
          targetDate: '2024-06-30',
          targetAmount: 1000000,
          currentAmount: 850000,
          priority: 'high',
          status: 'active',
          milestones: ['Reach ₹5L', 'Reach ₹8L', 'Reach ₹10L'],
          description: '6 months of expenses as financial safety net'
        },
        {
          id: '4',
          title: 'New Family Car',
          category: 'lifestyle',
          targetDate: '2024-10-31',
          targetAmount: 1200000,
          currentAmount: 300000,
          priority: 'medium',
          status: 'active',
          milestones: ['Research models', 'Test drive', 'Final decision'],
          description: '7-seater SUV for family trips and daily commute'
        }
      ]);

      setWeekendMealSuggestions([
        {
          id: '1',
          name: 'Family Weekend Thali',
          restaurant: 'Biryani House',
          cuisine: 'North Indian',
          rating: 4.6,
          deliveryTime: '30-40 min',
          minOrder: 299,
          discount: 20,
          priceForTwo: 599,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '2',
          name: 'Weekend Pizza Feast',
          restaurant: 'Pizza Paradise',
          cuisine: 'Italian',
          rating: 4.4,
          deliveryTime: '25-35 min',
          minOrder: 399,
          discount: 15,
          priceForTwo: 799,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '3',
          name: 'Chinese Family Combo',
          restaurant: 'Dragon Palace',
          cuisine: 'Chinese',
          rating: 4.3,
          deliveryTime: '35-45 min',
          minOrder: 349,
          discount: 25,
          priceForTwo: 699,
          familyFriendly: true,
          weekendSpecial: true
        },
        {
          id: '4',
          name: 'Weekend Brunch Special',
          restaurant: 'Cafe Coffee Day',
          cuisine: 'Continental',
          rating: 4.2,
          deliveryTime: '20-30 min',
          minOrder: 249,
          discount: 10,
          priceForTwo: 449,
          familyFriendly: true,
          weekendSpecial: true
        }
      ]);

      setGrocerySuggestions([
        {
          id: '1',
          name: 'Premium Basmati Rice 5kg',
          category: 'Grains',
          bestPrice: 450,
          originalPrice: 650,
          discount: 31,
          store: 'BigBasket',
          urgency: 'medium',
          quantity: '5kg',
          healthRating: 4.5
        },
        {
          id: '2',
          name: 'Extra Virgin Olive Oil 1L',
          category: 'Cooking Oil',
          bestPrice: 680,
          originalPrice: 950,
          discount: 28,
          store: 'Amazon Fresh',
          urgency: 'medium',
          quantity: '1L',
          healthRating: 5.0
        },
        {
          id: '3',
          name: 'Organic Honey 500g',
          category: 'Sweeteners',
          bestPrice: 320,
          originalPrice: 450,
          discount: 29,
          store: 'Blinkit',
          urgency: 'low',
          quantity: '500g',
          healthRating: 4.8
        },
        {
          id: '4',
          name: 'Premium Dry Fruits Mix 1kg',
          category: 'Dry Fruits',
          bestPrice: 890,
          originalPrice: 1200,
          discount: 26,
          store: 'FreshToHome',
          urgency: 'low',
          quantity: '1kg',
          healthRating: 4.9
        },
        {
          id: '5',
          name: 'Imported Cheese Pack',
          category: 'Dairy',
          bestPrice: 750,
          originalPrice: 950,
          discount: 21,
          store: 'BigBasket',
          urgency: 'medium',
          quantity: '500g',
          healthRating: 4.2
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'home': return <Home className="w-5 h-5" />;
      case 'travel': return <Plane className="w-5 h-5" />;
      case 'financial': return <DollarSign className="w-5 h-5" />;
      case 'lifestyle': return <Car className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'home': return 'bg-blue-100 text-blue-700';
      case 'travel': return 'bg-purple-100 text-purple-700';
      case 'financial': return 'bg-green-100 text-green-700';
      case 'lifestyle': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, status: 'completed' as const } : goal
    ));
    setShowConfetti(true);
    setCelebrationEmoji('🏆');
    setShowFloatingEmoji(true);
    setTimeout(() => setShowConfetti(false), 3000);
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const handleMealOrder = (mealId: string) => {
    setCelebrationEmoji('🍽️');
    setShowFloatingEmoji(true);
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const handleGroceryAdd = (itemId: string) => {
    setCelebrationEmoji('🛒');
    setShowFloatingEmoji(true);
    setTimeout(() => setShowFloatingEmoji(false), 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Interactive Elements */}
      <InteractiveConfetti trigger={showConfetti} />
      <FloatingEmoji emoji={celebrationEmoji} trigger={showFloatingEmoji} />

      {/* Animated Header */}
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <Target className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Family Planning</h1>
            <p className="text-gray-600 text-sm">Dream together, achieve together</p>
          </div>
        </div>
        <MagicButton className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </MagicButton>
      </div>

      {/* Animated Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 card-hover-lift interactive-card relative overflow-hidden">
          <CardContent className="p-4 text-center relative overflow-hidden">
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-repeat" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'10\' cy=\'10\' r=\'2\' fill=\'%233b82f6\'/%3E%3C/svg%3E")',
                backgroundSize: '20px 20px',
                animation: 'float 20s linear infinite'
              }}></div>
            </div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-blue-200 rounded-full -mr-4 -mt-4 opacity-50 animate-ping"></div>
            <div className="text-2xl font-bold text-blue-700 animate-bounce">
              {goals.filter(g => g.status === 'active').length}
            </div>
            <div className="text-sm text-blue-600 font-medium">Active Goals</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-300 animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 card-hover-lift interactive-card relative overflow-hidden">
          <CardContent className="p-4 text-center relative overflow-hidden">
            {/* Animated food emojis */}
            <div className="absolute top-1 left-1 text-lg animate-bounce">🍕</div>
            <div className="absolute top-1 right-1 text-lg animate-bounce delay-100">🍔</div>
            <div className="absolute bottom-1 left-1 text-lg animate-bounce delay-200">🍜</div>
            <div className="absolute bottom-1 right-1 text-lg animate-bounce delay-300">🍛</div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-orange-200 rounded-full -mr-4 -mt-4 opacity-50 animate-ping"></div>
            <div className="text-2xl font-bold text-orange-700 animate-pulse">
              {weekendMealSuggestions.filter(m => m.weekendSpecial).length}
            </div>
            <div className="text-sm text-orange-600 font-medium">Weekend Specials</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-300 animate-pulse"></div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 card-hover-lift interactive-card relative overflow-hidden">
          <CardContent className="p-4 text-center relative overflow-hidden">
            {/* Animated sparkle effect */}
            <div className="absolute top-2 left-2 text-yellow-400 animate-spin">✨</div>
            <div className="absolute top-2 right-2 text-yellow-400 animate-spin delay-200">⭐</div>
            <div className="absolute bottom-2 left-2 text-yellow-400 animate-spin delay-400">💫</div>
            <div className="absolute top-0 right-0 w-8 h-8 bg-purple-200 rounded-full -mr-4 -mt-4 opacity-50 animate-ping"></div>
            <div className="text-2xl font-bold text-purple-700 animate-bounce">
              {grocerySuggestions.filter(g => g.discount > 25).length}
            </div>
            <div className="text-sm text-purple-600 font-medium">Hot Deals</div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-300 animate-pulse"></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="goals" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="goals" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <Target className="w-4 h-4 mr-2" />
            Couple Goals
          </TabsTrigger>
          <TabsTrigger value="meals" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <Utensils className="w-4 h-4 mr-2" />
            Weekend Meals
          </TabsTrigger>
          <TabsTrigger value="grocery" className="data-[state=active]:bg-white data-[state=active]:shadow-md rounded-md transition-all duration-200">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Grocery Deals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4">
          <div className="space-y-4">
            {goals.map((goal) => (
              <Card key={goal.id} className={`overflow-hidden card-hover-lift interactive-card ${
                goal.status === 'completed' ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-white'
              }`}>
                <CardContent className="p-4 relative">
                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-bl-full opacity-30"></div>
                  
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{goal.title}</h3>
                        {goal.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-700 text-xs animate-bounce">
                            ✓ Completed
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge className={`${getCategoryColor(goal.category)} hover:scale-105 transition-transform`}>
                          {getCategoryIcon(goal.category)}
                          <span className="ml-1">{goal.category}</span>
                        </Badge>
                        <Badge className={`${getPriorityColor(goal.priority)} hover:scale-105 transition-transform`}>
                          {goal.priority} priority
                        </Badge>
                        <Badge variant="outline" className="text-xs hover:bg-gray-50 transition-colors">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(goal.targetDate).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 italic">{goal.description}</p>
                      
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span className="font-medium">Progress</span>
                          <span className="font-bold">₹{goal.currentAmount.toLocaleString()} / ₹{goal.targetAmount.toLocaleString()}</span>
                        </div>
                        <div className="relative">
                          <Progress 
                            value={(goal.currentAmount / goal.targetAmount) * 100} 
                            className="h-3 bg-gray-200 overflow-hidden"
                          />
                          <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">
                          {Math.round((goal.currentAmount / goal.targetAmount) * 100)}% complete
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-gray-50 to-white rounded-lg p-3 border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Target className="w-4 h-4 text-blue-500" />
                          Milestones:
                        </h4>
                        <div className="space-y-1">
                          {goal.milestones.map((milestone, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition-colors">
                              <CheckCircle className={`w-4 h-4 ${index < 2 ? 'text-green-500 animate-pulse' : 'text-gray-300'}`} />
                              <span className={index < 2 ? 'font-medium' : ''}>{milestone}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {goal.status !== 'completed' && (
                      <div className="ml-4">
                        <MagicButton 
                          size="sm"
                          onClick={() => handleGoalComplete(goal.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md"
                        >
                          <Trophy className="w-4 h-4 mr-1" />
                          Complete
                        </MagicButton>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="meals" className="space-y-4">
          <div className="space-y-4">
            {weekendMealSuggestions.map((meal) => (
              <Card key={meal.id} className="overflow-hidden card-hover-lift interactive-card bg-white">
                <CardContent className="p-4 relative">
                  {/* Decorative food pattern */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                    <div className="text-4xl">🍽️</div>
                  </div>
                  
                  <div className="flex items-start justify-between mb-3 relative z-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{meal.name}</h3>
                        {meal.weekendSpecial && (
                          <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs animate-pulse shadow-md">
                            🎉 Weekend Special
                          </Badge>
                        )}
                        {meal.familyFriendly && (
                          <Badge className="bg-gradient-to-r from-green-400 to-emerald-400 text-white text-xs shadow-md">
                            👨‍👩‍👧‍👦 Family Friendly
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="outline" className="text-xs hover:bg-orange-50 transition-colors border-orange-200">
                          🍽️ {meal.cuisine}
                        </Badge>
                        <Badge variant="outline" className="text-xs hover:bg-yellow-50 transition-colors border-yellow-200">
                          ⭐ {meal.rating}
                        </Badge>
                        <Badge variant="outline" className="text-xs hover:bg-blue-50 transition-colors border-blue-200">
                          🚚 {meal.deliveryTime}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 font-medium">
                        {meal.restaurant} • Min order: ₹{meal.minOrder}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <div className="text-center bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 min-w-[80px] transform hover:scale-105 transition-all duration-200">
                          <div className="text-xl font-bold text-green-700">₹{meal.priceForTwo}</div>
                          <div className="text-xs text-green-600 font-medium">for two</div>
                        </div>
                        <div className="text-center bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 min-w-[80px] transform hover:scale-105 transition-all duration-200">
                          <div className="text-xl font-bold text-orange-700">{meal.discount}%</div>
                          <div className="text-xs text-orange-600 font-medium">OFF</div>
                        </div>
                        <div className="flex-1 text-right">
                          <MagicButton 
                            onClick={() => handleMealOrder(meal.id)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md"
                          >
                            Order Now
                          </MagicButton>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Menu
                    </Button>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      Order Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grocery" className="space-y-4">
          <div className="space-y-4">
            {grocerySuggestions.map((item) => (
              <Card key={item.id} className="overflow-hidden card-hover-lift interactive-card bg-white">
                <CardContent className="p-4 relative">
                  {/* Decorative shopping pattern */}
                  <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                    <div className="text-3xl">🛒</div>
                  </div>
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center transform hover:scale-110 transition-all duration-200">
                      <ShoppingCart className="w-8 h-8 text-purple-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        {item.bestPrice > 500 && (
                          <Badge className="bg-gradient-to-r from-purple-400 to-pink-400 text-white text-xs shadow-md animate-pulse">
                            💎 High Value
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 font-medium">{item.category} • {item.quantity}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xl font-bold text-green-600">₹{item.bestPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        <Badge className="bg-gradient-to-r from-red-400 to-pink-400 text-white text-xs shadow-md">
                          {item.discount}% OFF
                        </Badge>
                        {item.discount > 25 && (
                          <Badge className="bg-gradient-to-r from-orange-400 to-red-400 text-white text-xs animate-pulse shadow-md">
                            🔥 Hot Deal
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-gray-600 font-medium">
                          Health Rating: 
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i} className={`text-lg ${i < Math.floor(item.healthRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
                          <span className="text-sm text-gray-600 ml-1">{item.healthRating}/5</span>
                        </div>
                        <Badge variant="outline" className="text-xs hover:bg-gray-50 transition-colors">
                          🏪 {item.store}
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <MagicButton 
                        size="sm"
                        onClick={() => handleGroceryAdd(item.id)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </MagicButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}