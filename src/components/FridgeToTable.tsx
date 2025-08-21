'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  ChefHat,
  ShoppingCart,
  Calendar,
  Utensils,
  Clock,
  Users,
  DollarSign,
  Plus,
  Search,
  Filter,
  Heart,
  Star,
  CheckCircle,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Recipe {
  id: string;
  name: string;
  description?: string;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  isFavorite: boolean;
}

interface MealPlan {
  id: string;
  name: string;
  date: Date;
  meals: {
    breakfast: Recipe[];
    lunch: Recipe[];
    dinner: Recipe[];
    snacks: Recipe[];
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
  budget: number;
  actualCost?: number;
  notes?: string;
}

interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
  price?: number;
  purchased: boolean;
  essential: boolean;
}

interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  totalBudget: number;
  actualCost?: number;
  assignedTo: string;
  status: 'pending' | 'shopping' | 'completed';
  dueDate?: Date;
}

interface FridgeToTableProps {
  coupleId: string;
}

export function FridgeToTable({ coupleId }: FridgeToTableProps) {
  const [activeTab, setActiveTab] = useState('meal-planner');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [groceryLists, setGroceryLists] = useState<GroceryList[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('all');
  const [isAddRecipeOpen, setIsAddRecipeOpen] = useState(false);
  const [isAddMealPlanOpen, setIsAddMealPlanOpen] = useState(false);
  const [isAddGroceryListOpen, setIsAddGroceryListOpen] = useState(false);
  const [ingredientsUploaded, setIngredientsUploaded] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setUploadedImage(imageData);
        
        // Simulate AI analysis
        setTimeout(() => {
          setIsAnalyzing(false);
          setIngredientsUploaded(true);
          
          // Now load recipes after image analysis
          const mockRecipes: Recipe[] = [
            {
              id: '1',
              name: 'Butter Chicken',
              description: 'Creamy and delicious North Indian curry',
              ingredients: [
                { name: 'Chicken', amount: '500', unit: 'g' },
                { name: 'Butter', amount: '100', unit: 'g' },
                { name: 'Tomato', amount: '4', unit: 'pieces' },
                { name: 'Cream', amount: '200', unit: 'ml' },
                { name: 'Onion', amount: '2', unit: 'pieces' }
              ],
              instructions: 'Marinate chicken in yogurt and spices. Cook onions until golden, add tomatoes and spices. Add chicken and cook until tender. Finish with cream and butter.',
              prepTime: 15,
              cookTime: 30,
              servings: 4,
              difficulty: 'medium',
              cuisine: 'indian',
              tags: ['curry', 'chicken', 'north-indian', 'creamy'],
              nutrition: { calories: 350, protein: 25, carbs: 12, fats: 22 },
              isFavorite: true
            },
            {
              id: '2',
              name: 'Vegetable Biryani',
              description: 'Fragrant rice dish with mixed vegetables',
              ingredients: [
                { name: 'Basmati Rice', amount: '2', unit: 'cups' },
                { name: 'Mixed Vegetables', amount: '3', unit: 'cups' },
                { name: 'Biryani Masala', amount: '2', unit: 'tbsp' },
                { name: 'Yogurt', amount: '1', unit: 'cup' },
                { name: 'Ghee', amount: '3', unit: 'tbsp' }
              ],
              instructions: 'Soak rice for 30 minutes. Parboil rice with whole spices. Cook vegetables with masala. Layer rice and vegetables, cook on dum for 20 minutes.',
              prepTime: 20,
              cookTime: 45,
              servings: 6,
              difficulty: 'hard',
              cuisine: 'indian',
              tags: ['rice', 'vegetarian', 'fragrant', 'special'],
              nutrition: { calories: 280, protein: 8, carbs: 45, fats: 8 },
              isFavorite: false
            }
          ];
          
          setRecipes(mockRecipes);
          toast({
            title: "Ingredients Analyzed! 🎉",
            description: "Found recipes based on your ingredients",
            duration: 3000,
          });
        }, 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  // Mock data for other sections (meal plans and grocery lists)
  useEffect(() => {
    const mockMealPlans: MealPlan[] = [
      {
        id: '1',
        name: 'Weekly Plan - Week 1',
        date: new Date(),
        meals: {
          breakfast: [],
          lunch: [],
          dinner: [],
          snacks: []
        },
        nutrition: { calories: 1800, protein: 65, carbs: 220, fats: 45 },
        budget: 2500,
        actualCost: 2350,
        notes: 'Reduced cost by buying vegetables in bulk'
      }
    ];

    const mockGroceryLists: GroceryList[] = [
      {
        id: '1',
        name: 'Weekly Groceries',
        items: [
          { id: '1', name: 'Chicken', amount: '1', unit: 'kg', category: 'meat', price: 300, purchased: false, essential: true },
          { id: '2', name: 'Tomatoes', amount: '2', unit: 'kg', category: 'vegetables', price: 80, purchased: true, essential: true },
          { id: '3', name: 'Basmati Rice', amount: '5', unit: 'kg', category: 'grains', price: 450, purchased: false, essential: true },
          { id: '4', name: 'Milk', amount: '2', unit: 'liters', category: 'dairy', price: 100, purchased: false, essential: false }
        ],
        totalBudget: 1000,
        actualCost: 930,
        assignedTo: 'partner_a',
        status: 'shopping',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
      }
    ];

    setMealPlans(mockMealPlans);
    setGroceryLists(mockGroceryLists);
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'shopping': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = !searchTerm || 
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCuisine = selectedCuisine === 'all' || recipe.cuisine === selectedCuisine;
    
    return matchesSearch && matchesCuisine;
  });

  const totalGroceryBudget = groceryLists.reduce((sum, list) => sum + list.totalBudget, 0);
  const totalActualCost = groceryLists.reduce((sum, list) => sum + (list.actualCost || 0), 0);
  const savings = totalGroceryBudget - totalActualCost;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fridge to Table</h2>
          <p className="text-gray-600">Plan meals, save money, eat healthier together</p>
        </div>
        
        {/* Budget Overview */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Budget</p>
                <p className="text-lg font-bold text-green-700">₹{totalGroceryBudget}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Spent</p>
                <p className="text-lg font-bold text-blue-700">₹{totalActualCost}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Saved</p>
                <p className={`text-lg font-bold ${savings >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  ₹{Math.abs(savings)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="meal-planner" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Meal Planner
          </TabsTrigger>
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="grocery" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Grocery Lists
          </TabsTrigger>
        </TabsList>

        {/* Meal Planner Tab */}
        <TabsContent value="meal-planner" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Weekly Meal Plans</h3>
            <Dialog open={isAddMealPlanOpen} onOpenChange={setIsAddMealPlanOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Meal Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Meal Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="Meal plan name (e.g., Weekly Plan - Week 1)" />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Budget</label>
                      <Input type="number" placeholder="2000" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Start Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <Textarea placeholder="Notes (optional)" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddMealPlanOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create Plan</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {mealPlans.map(plan => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                      <p className="text-sm text-gray-500">
                        {plan.date.toLocaleDateString()} • {plan.meals.breakfast.length + plan.meals.lunch.length + plan.meals.dinner.length} meals
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Budget: ₹{plan.budget}
                      </Badge>
                      {plan.actualCost && (
                        <Badge variant={plan.actualCost <= plan.budget ? 'default' : 'destructive'}>
                          Spent: ₹{plan.actualCost}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Meal Overview */}
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Utensils className="w-6 h-6 text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Breakfast</p>
                      <p className="font-semibold">{plan.meals.breakfast.length}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Utensils className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Lunch</p>
                      <p className="font-semibold">{plan.meals.lunch.length}</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <Utensils className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Dinner</p>
                      <p className="font-semibold">{plan.meals.dinner.length}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <Users className="w-6 h-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-gray-600">Servings</p>
                      <p className="font-semibold">{plan.meals.breakfast.reduce((sum, meal) => sum + meal.servings, 0)}</p>
                    </div>
                  </div>

                  {/* Nutrition Overview */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Daily Nutrition Average</h5>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-600">Calories</p>
                        <p className="font-semibold">{plan.nutrition.calories}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Protein</p>
                        <p className="font-semibold">{plan.nutrition.protein}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Carbs</p>
                        <p className="font-semibold">{plan.nutrition.carbs}g</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Fats</p>
                        <p className="font-semibold">{plan.nutrition.fats}g</p>
                      </div>
                    </div>
                  </div>

                  {plan.notes && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">{plan.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recipes Tab */}
        <TabsContent value="recipes" className="space-y-6">
          {!ingredientsUploaded ? (
            <Card className="text-center">
              <CardContent className="p-8">
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Upload Your Ingredients
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Take a photo of your ingredients and we'll suggest recipes based on what you have!
                    </p>
                  </div>
                  
                  {isAnalyzing ? (
                    <div className="space-y-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                      <p className="text-sm text-gray-600">Analyzing your ingredients...</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="ingredient-upload"
                        />
                        <label
                          htmlFor="ingredient-upload"
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all"
                        >
                          <Plus className="w-5 h-5 mr-2" />
                          Upload Ingredient Photo
                        </label>
                      </div>
                      
                      {uploadedImage && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">Uploaded image:</p>
                          <img 
                            src={uploadedImage} 
                            alt="Uploaded ingredients" 
                            className="max-w-xs mx-auto rounded-lg shadow-md"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Recipe Collection</h3>
                  <Badge className="bg-green-100 text-green-700">
                    ✓ Ingredients Analyzed
                  </Badge>
                </div>
                <Dialog open={isAddRecipeOpen} onOpenChange={setIsAddRecipeOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Recipe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Recipe</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Recipe name" />
                      <Textarea placeholder="Description (optional)" />
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Prep Time (min)</label>
                          <Input type="number" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Cook Time (min)</label>
                          <Input type="number" />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Servings</label>
                          <Input type="number" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Difficulty</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">Cuisine</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cuisine" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="italian">Italian</SelectItem>
                              <SelectItem value="chinese">Chinese</SelectItem>
                              <SelectItem value="mexican">Mexican</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsAddRecipeOpen(false)}>
                          Cancel
                        </Button>
                        <Button>Add Recipe</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Search and Filters */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Cuisines</SelectItem>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="italian">Italian</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="mexican">Mexican</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Recipe Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredRecipes.map(recipe => (
                  <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{recipe.name}</h4>
                          {recipe.description && (
                            <p className="text-sm text-gray-600 mb-2">{recipe.description}</p>
                          )}
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getDifficultyColor(recipe.difficulty)}>
                              {recipe.difficulty}
                            </Badge>
                            <Badge variant="outline">{recipe.cuisine}</Badge>
                            {recipe.isFavorite && (
                              <Heart className="w-4 h-4 text-red-500 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Time and Servings */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{recipe.prepTime + recipe.cookTime} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>

                      {/* Nutrition Info */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div>
                            <p className="text-xs text-gray-600">Calories</p>
                            <p className="text-sm font-semibold">{recipe.nutrition.calories}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Protein</p>
                            <p className="text-sm font-semibold">{recipe.nutrition.protein}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Carbs</p>
                            <p className="text-sm font-semibold">{recipe.nutrition.carbs}g</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600">Fats</p>
                            <p className="text-sm font-semibold">{recipe.nutrition.fats}g</p>
                          </div>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {recipe.tags.slice(0, 3).map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {recipe.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{recipe.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          View Recipe
                        </Button>
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Add to Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* Grocery Lists Tab */}
        <TabsContent value="grocery" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Grocery Lists</h3>
            <Dialog open={isAddGroceryListOpen} onOpenChange={setIsAddGroceryListOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New List
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create Grocery List</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input placeholder="List name (e.g., Weekly Groceries)" />
                  <div>
                    <label className="text-sm font-medium mb-2 block">Budget</label>
                    <Input type="number" placeholder="1000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Due Date</label>
                    <Input type="date" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsAddGroceryListOpen(false)}>
                      Cancel
                    </Button>
                    <Button>Create List</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-4">
            {groceryLists.map(list => (
              <Card key={list.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{list.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Badge className={getStatusColor(list.status)}>
                          {list.status}
                        </Badge>
                        {list.dueDate && (
                          <span>Due: {list.dueDate.toLocaleDateString()}</span>
                        )}
                        <span>Assigned to: {list.assignedTo}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Budget: ₹{list.totalBudget}</p>
                      {list.actualCost && (
                        <p className={`text-sm font-medium ${list.actualCost <= list.totalBudget ? 'text-green-600' : 'text-red-600'}`}>
                          Spent: ₹{list.actualCost}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm text-gray-600">
                        {list.items.filter(item => item.purchased).length} / {list.items.length} items
                      </span>
                    </div>
                    <Progress 
                      value={(list.items.filter(item => item.purchased).length / list.items.length) * 100} 
                      className="h-2"
                    />
                  </div>

                  {/* Items List */}
                  <div className="space-y-2">
                    {list.items.slice(0, 5).map(item => (
                      <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={item.purchased}
                            onChange={() => {}}
                            className="rounded"
                          />
                          <span className={`text-sm ${item.purchased ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {item.name} ({item.amount} {item.unit})
                          </span>
                          {item.essential && (
                            <Badge variant="destructive" className="text-xs">Essential</Badge>
                          )}
                        </div>
                        {item.price && (
                          <span className="text-sm text-gray-600">₹{item.price}</span>
                        )}
                      </div>
                    ))}
                    {list.items.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{list.items.length - 5} more items
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      View All Items
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit List
                    </Button>
                    <Button variant="outline" size="sm">
                      Share
                    </Button>
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