'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus,
  Minus,
  Clock,
  Users,
  ChefHat,
  X,
  Save,
  Image as ImageIcon,
  Star,
  Scale
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  category: string;
}

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

interface Recipe {
  id?: string;
  name: string;
  description?: string;
  ingredients: Ingredient[];
  instructions: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  tags: string[];
  nutrition: NutritionInfo;
  isFavorite: boolean;
  imageUrl?: string;
}

interface RecipeBuilderProps {
  recipe?: Recipe;
  onSave: (recipe: Omit<Recipe, 'id'>) => void;
  onCancel: () => void;
}

const CUISINE_OPTIONS = [
  'indian', 'italian', 'chinese', 'mexican', 'thai', 
  'japanese', 'korean', 'french', 'mediterranean', 'american'
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy', color: 'bg-green-100 text-green-700' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'hard', label: 'Hard', color: 'bg-red-100 text-red-700' }
];

const UNIT_OPTIONS = [
  'g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'bunch', 'clove'
];

const CATEGORY_OPTIONS = [
  'vegetables', 'fruits', 'meat', 'seafood', 'dairy', 'grains', 
  'spices', 'oils', 'condiments', 'other'
];

export function RecipeBuilder({ recipe, onSave, onCancel }: RecipeBuilderProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<Omit<Recipe, 'id'>>({
    name: recipe?.name || '',
    description: recipe?.description || '',
    ingredients: recipe?.ingredients || [],
    instructions: recipe?.instructions || '',
    prepTime: recipe?.prepTime || 0,
    cookTime: recipe?.cookTime || 0,
    servings: recipe?.servings || 4,
    difficulty: recipe?.difficulty || 'medium',
    cuisine: recipe?.cuisine || 'indian',
    tags: recipe?.tags || [],
    nutrition: recipe?.nutrition || {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0
    },
    isFavorite: recipe?.isFavorite || false,
    imageUrl: recipe?.imageUrl || ''
  });

  const [newIngredient, setNewIngredient] = useState<Omit<Ingredient, 'id'>>({
    name: '',
    amount: '',
    unit: 'g',
    category: 'vegetables'
  });

  const [newTag, setNewTag] = useState('');
  const { toast } = useToast();

  const addIngredient = () => {
    if (!newIngredient.name.trim() || !newIngredient.amount.trim()) {
      toast({
        title: "Ingredient Required",
        description: "Please fill in both name and amount",
        variant: "destructive",
      });
      return;
    }

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      ...newIngredient
    };

    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, ingredient]
    }));

    setNewIngredient({
      name: '',
      amount: '',
      unit: 'g',
      category: 'vegetables'
    });
  };

  const removeIngredient = (id: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(ing => ing.id !== id)
    }));
  };

  const addTag = () => {
    if (!newTag.trim() || formData.tags.includes(newTag.trim())) {
      return;
    }

    setFormData(prev => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()]
    }));
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateNutrition = () => {
    // Simple nutrition calculation based on ingredients
    // In a real app, this would use a nutrition API
    const baseCalories = formData.ingredients.reduce((sum, ing) => {
      const calorieMap: Record<string, number> = {
        'vegetables': 25,
        'fruits': 50,
        'meat': 200,
        'seafood': 150,
        'dairy': 100,
        'grains': 150,
        'spices': 5,
        'oils': 120,
        'condiments': 30,
        'other': 80
      };
      return sum + (calorieMap[ing.category] || 50);
    }, 0);

    const nutrition: NutritionInfo = {
      calories: Math.round(baseCalories / formData.servings),
      protein: Math.round(baseCalories * 0.15 / formData.servings),
      carbs: Math.round(baseCalories * 0.5 / formData.servings),
      fats: Math.round(baseCalories * 0.35 / formData.servings),
      fiber: Math.round(baseCalories * 0.05 / formData.servings),
      sugar: Math.round(baseCalories * 0.1 / formData.servings),
      sodium: Math.round(baseCalories * 0.002 / formData.servings)
    };

    setFormData(prev => ({
      ...prev,
      nutrition
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Recipe Name Required",
        description: "Please enter a recipe name",
        variant: "destructive",
      });
      return;
    }

    if (formData.ingredients.length === 0) {
      toast({
        title: "Ingredients Required",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    if (!formData.instructions.trim()) {
      toast({
        title: "Instructions Required",
        description: "Please add cooking instructions",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {recipe ? 'Edit Recipe' : 'Create New Recipe'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Recipe
          </Button>
        </div>
      </div>

      {/* Main Form */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChefHat className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Recipe Name *</label>
                <Input
                  placeholder="Enter recipe name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Describe your recipe..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Prep Time (minutes) *</label>
                  <Input
                    type="number"
                    placeholder="15"
                    value={formData.prepTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, prepTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cook Time (minutes) *</label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={formData.cookTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, cookTime: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Servings *</label>
                  <Input
                    type="number"
                    placeholder="4"
                    value={formData.servings}
                    onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty *</label>
                  <Select value={formData.difficulty} onValueChange={(value: any) => setFormData(prev => ({ ...prev, difficulty: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_OPTIONS.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={option.color}>
                              {option.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Cuisine *</label>
                  <Select value={formData.cuisine} onValueChange={(value) => setFormData(prev => ({ ...prev, cuisine: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CUISINE_OPTIONS.map(cuisine => (
                        <SelectItem key={cuisine} value={cuisine}>
                          {cuisine.charAt(0).toUpperCase() + cuisine.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Recipe Image URL</label>
                <Input
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ingredients Tab */}
        <TabsContent value="ingredients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ingredients</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Ingredient Form */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Add Ingredient</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Name</label>
                    <Input
                      placeholder="e.g., Tomato"
                      value={newIngredient.name}
                      onChange={(e) => setNewIngredient(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Amount</label>
                    <Input
                      placeholder="e.g., 2"
                      value={newIngredient.amount}
                      onChange={(e) => setNewIngredient(prev => ({ ...prev, amount: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Unit</label>
                    <Select value={newIngredient.unit} onValueChange={(value) => setNewIngredient(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {UNIT_OPTIONS.map(unit => (
                          <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 mb-1 block">Category</label>
                    <Select value={newIngredient.category} onValueChange={(value) => setNewIngredient(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addIngredient} className="mt-3" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Ingredient
                </Button>
              </div>

              {/* Ingredients List */}
              <div>
                <h4 className="font-medium mb-3">Ingredients List</h4>
                <div className="space-y-2">
                  {formData.ingredients.map((ingredient, index) => (
                    <motion.div
                      key={ingredient.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-white border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">{index + 1}.</span>
                        <div>
                          <span className="font-medium">{ingredient.name}</span>
                          <span className="text-gray-600 ml-2">
                            {ingredient.amount} {ingredient.unit}
                          </span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {ingredient.category}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(ingredient.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
                
                {formData.ingredients.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Scale className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No ingredients added yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructions Tab */}
        <TabsContent value="instructions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cooking Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Instructions *</label>
                <Textarea
                  placeholder="Enter step-by-step cooking instructions..."
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  rows={10}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use numbered steps (1., 2., 3.) for better readability
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    placeholder="Add tag..."
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      #{tag}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="favorite"
                  checked={formData.isFavorite}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFavorite: e.target.checked }))}
                />
                <label htmlFor="favorite" className="text-sm font-medium">
                  Mark as favorite recipe
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Nutrition Information
                </span>
                <Button variant="outline" size="sm" onClick={calculateNutrition}>
                  Auto-Calculate
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-700">{formData.nutrition.calories}</p>
                  <p className="text-sm text-blue-600">Calories</p>
                  <p className="text-xs text-blue-500">per serving</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-700">{formData.nutrition.protein}g</p>
                  <p className="text-sm text-green-600">Protein</p>
                  <p className="text-xs text-green-500">per serving</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <p className="text-2xl font-bold text-yellow-700">{formData.nutrition.carbs}g</p>
                  <p className="text-sm text-yellow-600">Carbs</p>
                  <p className="text-xs text-yellow-500">per serving</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <p className="text-2xl font-bold text-red-700">{formData.nutrition.fats}g</p>
                  <p className="text-sm text-red-600">Fats</p>
                  <p className="text-xs text-red-500">per serving</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Fiber (g)</label>
                  <Input
                    type="number"
                    value={formData.nutrition.fiber}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition, fiber: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sugar (g)</label>
                  <Input
                    type="number"
                    value={formData.nutrition.sugar}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition, sugar: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Sodium (mg)</label>
                  <Input
                    type="number"
                    value={formData.nutrition.sodium}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      nutrition: { ...prev.nutrition, sodium: parseInt(e.target.value) || 0 }
                    }))}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Nutrition Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Cooking Time:</span>
                    <span className="font-medium">{formData.prepTime + formData.cookTime} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Calories per serving:</span>
                    <span className="font-medium">{formData.nutrition.calories}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <Badge className={DIFFICULTY_OPTIONS.find(d => d.value === formData.difficulty)?.color}>
                      {formData.difficulty}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}