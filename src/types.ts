export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
  dailyCalorieGoal: number;
  dailyWaterGoal: number; // ml
  joinDate: string;
}

export interface MealLog {
  id: string;
  name: string;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';
  quantity: string;
  calories: number;
  timestamp: string;
}

export interface WaterLog {
  id: string;
  amount: number; // ml
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  activity: string;
  duration: number; // minutes
  caloriesBurned: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  username: string;
  content: string;
  timestamp: string;
}

export interface ForumPost {
  id: string;
  username: string;
  time: string;
  content: string;
  likes: number;
  likedByMe?: boolean;
  comments: Comment[];
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string;
  instructions: string;
  calories: number;
  likes: number;
  likedByMe?: boolean;
  creator: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface MealPlanDay {
  dayName: string;
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fats: number; // grams
}
