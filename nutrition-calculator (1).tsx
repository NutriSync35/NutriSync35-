import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus, Calculator, Search, Filter, Save, Clock, Heart } from 'lucide-react';

const foodItems = [
  { 
    name: 'Hamburger', 
    calories: 250, 
    protein: 12, 
    carbs: 31, 
    fat: 9,
    category: 'Burgers',
    sodium: 480,
    sugar: 4,
    fiber: 2
  },
  { 
    name: 'Cheeseburger', 
    calories: 300, 
    protein: 15, 
    carbs: 33, 
    fat: 12,
    category: 'Burgers',
    sodium: 750,
    sugar: 6,
    fiber: 2
  },
  { 
    name: 'French Fries', 
    calories: 220, 
    protein: 3, 
    carbs: 29, 
    fat: 11,
    category: 'Sides',
    sodium: 190,
    sugar: 0,
    fiber: 3
  },
  { 
    name: 'Chicken Nuggets (6pc)', 
    calories: 280, 
    protein: 13, 
    carbs: 18, 
    fat: 17,
    category: 'Chicken',
    sodium: 540,
    sugar: 0,
    fiber: 1
  },
  { 
    name: 'Soda (16oz)', 
    calories: 180, 
    protein: 0, 
    carbs: 45, 
    fat: 0,
    category: 'Beverages',
    sodium: 30,
    sugar: 45,
    fiber: 0
  },
  { 
    name: 'Garden Salad', 
    calories: 120, 
    protein: 8, 
    carbs: 10, 
    fat: 7,
    category: 'Salads',
    sodium: 380,
    sugar: 4,
    fiber: 4
  },
  { 
    name: 'Grilled Chicken Sandwich', 
    calories: 380, 
    protein: 28, 
    carbs: 39, 
    fat: 12,
    category: 'Chicken',
    sodium: 680,
    sugar: 6,
    fiber: 3
  },
  { 
    name: 'Apple Pie', 
    calories: 250, 
    protein: 2, 
    carbs: 32, 
    fat: 13,
    category: 'Desserts',
    sodium: 170,
    sugar: 15,
    fiber: 1
  }
];

const mealPresets = {
  'Classic Combo': ['Hamburger', 'French Fries', 'Soda (16oz)'],
  'Healthy Choice': ['Grilled Chicken Sandwich', 'Garden Salad'],
  'Chicken Lover': ['Chicken Nuggets (6pc)', 'French Fries', 'Soda (16oz)'],
};

// Daily recommended values
const dailyValues = {
  calories: 2000,
  protein: 50,
  carbs: 275,
  fat: 78,
  sodium: 2300,
  sugar: 50,
  fiber: 28
};

const NutritionCalculator = () => {
  const [selectedItems, setSelectedItems] = useState({});
  const [totals, setTotals] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sodium: 0,
    sugar: 0,
    fiber: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [recentSelections, setRecentSelections] = useState([]);

  const categories = ['All', ...new Set(foodItems.map(item => item.category))];

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const updateQuantity = (itemName, delta) => {
    const newQuantity = Math.max(0, (selectedItems[itemName] || 0) + delta);
    const newSelectedItems = {
      ...selectedItems,
      [itemName]: newQuantity
    };
    setSelectedItems(newSelectedItems);

    // Update recent selections
    if (delta > 0 && !recentSelections.includes(itemName)) {
      setRecentSelections(prev => [itemName, ...prev].slice(0, 5));
    }

    // Calculate new totals
    const newTotals = foodItems.reduce((acc, item) => {
      const quantity = newSelectedItems[item.name] || 0;
      return {
        calories: acc.calories + (item.calories * quantity),
        protein: acc.protein + (item.protein * quantity),
        carbs: acc.carbs + (item.carbs * quantity),
        fat: acc.fat + (item.fat * quantity),
        sodium: acc.sodium + (item.sodium * quantity),
        sugar: acc.sugar + (item.sugar * quantity),
        fiber: acc.fiber + (item.fiber * quantity)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0, sodium: 0, sugar: 0, fiber: 0 });

    setTotals(newTotals);
  };

  const toggleFavorite = (itemName) => {
    const newFavorites = favorites.includes(itemName)
      ? favorites.filter(name => name !== itemName)
      : [...favorites, itemName];
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const applyPreset = (presetName) => {
    const newSelectedItems = { ...selectedItems };
    // Reset quantities for all items
    foodItems.forEach(item => {
      newSelectedItems[item.name] = 0;
    });
    // Apply preset quantities
    mealPresets[presetName].forEach(itemName => {
      newSelectedItems[itemName] = 1;
    });
    setSelectedItems(newSelectedItems);
  };

  const filteredItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const calculateDailyValuePercentage = (nutrient, value) => {
    return ((value / dailyValues[nutrient]) * 100).toFixed(1);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="bg-emerald-50">
        <CardHeader className="bg-emerald-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            NutriKnow
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6">
            {/* Search and Filter */}
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-600 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <select
                className="rounded-lg border-emerald-200 focus:border-emerald-500 focus:ring-emerald-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Meal Presets */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.keys(mealPresets).map(presetName => (
                <button
                  key={presetName}
                  onClick={() => applyPreset(presetName)}
                  className="px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full whitespace-nowrap"
                >
                  {presetName}
                </button>
              ))}
            </div>

            {/* Recent Selections */}
            {recentSelections.length > 0 && (
              <div className="bg-white p-4 rounded-lg">
                <h3 className="text-emerald-800 font-medium flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4" />
                  Recent Selections
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {recentSelections.map(itemName => (
                    <button
                      key={itemName}
                      onClick={() => updateQuantity(itemName, 1)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-full text-sm"
                    >
                      {itemName}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Food Items */}
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-emerald-800">{item.name}</h3>
                      <button
                        onClick={() => toggleFavorite(item.name)}
                        className={`p-1 rounded-full ${
                          favorites.includes(item.name) ? 'text-red-500' : 'text-gray-300'
                        }`}
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-emerald-600">
                      {item.calories} cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fat}g
                    </p>
                    <p className="text-xs text-emerald-500">
                      Sodium: {item.sodium}mg | Sugar: {item.sugar}g | Fiber: {item.fiber}g
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.name, -1)}
                      className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {selectedItems[item.name] || 0}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.name, 1)}
                      className="p-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Nutrition Totals */}
            <div className="mt-6 p-4 bg-emerald-100 rounded-lg">
              <h2 className="text-lg font-semibold text-emerald-800 mb-3">Nutrition Totals</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(totals).map(([nutrient, value]) => (
                  <div key={nutrient} className="p-3 bg-white rounded-lg">
                    <p className="text-sm text-emerald-600 capitalize">{nutrient}</p>
                    <p className="text-2xl font-bold text-emerald-800">
                      {nutrient === 'sodium' ? `${value}mg` : `${value}g`}
                    </p>
                    <p className="text-xs text-emerald-500">
                      {calculateDailyValuePercentage(nutrient, value)}% Daily Value
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionCalculator;