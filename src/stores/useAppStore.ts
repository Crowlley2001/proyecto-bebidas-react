import { create} from 'zustand'
import { devtools } from 'zustand/middleware'
import { createRecipesSlice, type RecipesSliceType } from './recipeSlice'
import { createFavoritesSlice, type FavoriteSliceType } from './favoriteSlice'
import { type NotificationSliceType , createNotificationSlice} from './notificationSlice'
import { createAISlice, type AISlice } from './aiSlice'

export const useAppStore = create<RecipesSliceType & FavoriteSliceType & NotificationSliceType & AISlice>()(devtools((...a) => ({
   ...createRecipesSlice(...a),
   ...createFavoritesSlice(...a),
   ...createNotificationSlice(...a),
   ...createAISlice(...a),
})))