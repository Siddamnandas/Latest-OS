'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Utensils, 
  ShoppingCart, 
  Star, 
  Clock, 
  MapPin, 
  TrendingDown, 
  ChefHat,
  Camera,
  Plus
} from 'lucide-react';
import { FridgeToTableUpdated } from '@/components/FridgeToTableUpdated';

interface WeekendSuggestion {
  id: string;
  name: string;
  restaurant: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  price: string;
  discount: string;
  platform: 'swiggy' | 'zomato';
  distance: string;
}

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
  originalPrice: number;
  discount: number;
  store: string;
  aov: number;
  image: string;
}

export function MealsPlanning() {
  const [weekendSuggestions, setWeekendSuggestions] = useState<WeekendSuggestion[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [showRecipes, setShowRecipes] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setWeekendSuggestions([
        {
          id: '1',
          name: 'Weekend Family Thali',
          restaurant: 'Bhojanam',
          cuisine: 'North Indian',
          rating: 4.5,
          deliveryTime: '30-40 min',
          price: '₹599',
          discount: '20% OFF',
          platform: 'swiggy',
          distance: '2.5 km'
        },
        {
          id: '2',
          name: 'Sunday Brunch Special',
          restaurant: 'Cafe Mocha',
          cuisine: 'Continental',
          rating: 4.3,
          deliveryTime: '25-35 min',
          price: '₹799',
          discount: '15% OFF',
          platform: 'zomato',
          distance: '1.8 km'
        },
        {
          id: '3',
          name: 'Family Pizza Feast',
          restaurant: 'Pizza Paradise',
          cuisine: 'Italian',
          rating: 4.7,
          deliveryTime: '20-30 min',
          price: '₹699',
          discount: '25% OFF',
          platform: 'swiggy',
          distance: '3.2 km'
        }
      ]);

      setGroceryItems([
        {
          id: '1',
          name: 'Organic Basmati Rice',
          category: 'Grains',
          currentPrice: 89,
          originalPrice: 120,
          discount: 26,
          store: 'BigBasket',
          aov: 150,
          image: '/api/placeholder/60/60'
        },
        {
          id: '2',
          name: 'Fresh Milk 1L',
          category: 'Dairy',
          currentPrice: 28,
          originalPrice: 35,
          discount: 20,
          store: 'Amazon Fresh',
          aov: 120,
          image: '/api/placeholder/60/60'
        },
        {
          id: '3',
          name: 'Organic Vegetables Pack',
          category: 'Vegetables',
          currentPrice: 99,
          originalPrice: 149,
          discount: 34,
          store: 'Blinkit',
          aov: 200,
          image: '/api/placeholder/60/60'
        },
        {
          id: '4',
          name: 'Whole Wheat Bread',
          category: 'Bakery',
          currentPrice: 45,
          originalPrice: 60,
          discount: 25,
          store: 'BigBasket',
          aov: 100,
          image: '/api/placeholder/60/60'
        }
      ]);

      setLoading(false);
    }, 1000);
  }, []);

  const handleOrderFood = (suggestion: WeekendSuggestion) => {
    // Redirect to respective platform
    const url = suggestion.platform === 'swiggy' 
      ? `https://www.swiggy.com/search?query=${encodeURIComponent(suggestion.name)}`
      : `https://www.zomato.com/search?q=${encodeURIComponent(suggestion.name)}`;
    
    window.open(url, '_blank');
  };

  const handleBuyGrocery = (item: GroceryItem) => {
    // Redirect to store
    const storeUrls = {
      'BigBasket': 'https://www.bigbasket.com',
      'Amazon Fresh': 'https://www.amazon.in/fresh',
      'Blinkit': 'https://www.blinkit.com'
    };
    
    window.open(storeUrls[item.store as keyof typeof storeUrls] || '#', '_blank');
  };

  const handleFridgeToTable = () => {
    // This would open camera for ingredient photo upload
    setShowRecipes(true);
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meals & Planning</h1>
          <p className="text-gray-600">Plan your meals and save on groceries</p>
        </div>
        <Button 
          onClick={handleFridgeToTable}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          <Camera className="w-4 h-4 mr-2" />
          Fridge to Table
        </Button>
      </div>

      <Tabs defaultValue="weekend" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weekend">Weekend Specials</TabsTrigger>
          <TabsTrigger value="grocery">Grocery Deals</TabsTrigger>
        </TabsList>

        <TabsContent value="weekend" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekend Food Suggestions</h2>
            <Badge variant="outline" className="text-xs">
              <MapPin className="w-3 h-3 mr-1" />
              Near You
            </Badge>
          </div>

          <div className="space-y-4">
            {weekendSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                      <p className="text-sm text-gray-600">{suggestion.restaurant} • {suggestion.cuisine}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{suggestion.rating}</span>
                      </div>
                      <Badge 
                        variant={suggestion.platform === 'swiggy' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {suggestion.platform === 'swiggy' ? 'Swiggy' : 'Zomato'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {suggestion.deliveryTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {suggestion.distance}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">{suggestion.price}</span>
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          {suggestion.discount}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={() => handleOrderFood(suggestion)}
                    className="w-full mt-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
                  >
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grocery" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Best Grocery Deals</h2>
            <Badge variant="outline" className="text-xs">
              <TrendingDown className="w-3 h-3 mr-1" />
              High AOV Items
            </Badge>
          </div>

          <div className="space-y-4">
            {groceryItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Utensils className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">{item.category} • {item.store}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-gray-900">₹{item.currentPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{item.originalPrice}</span>
                        <Badge className="bg-red-100 text-red-700 text-xs">
                          {item.discount}% OFF
                        </Badge>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-2">
                        AOV: ₹{item.aov}
                      </div>
                      <Button 
                        onClick={() => handleBuyGrocery(item)}
                        size="sm"
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Recipe Section - Only shows after Fridge to Table photo upload */}
      {showRecipes ? (
        <FridgeToTableUpdated coupleId="demo-couple-id" />
      ) : (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChefHat className="w-5 h-5" />
              Ready to Cook?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Upload a photo of your fridge ingredients to get personalized recipe suggestions based on what you have available.
            </p>
            <Button 
              onClick={handleFridgeToTable}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Camera className="w-4 h-4 mr-2" />
              Fridge to Table
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}