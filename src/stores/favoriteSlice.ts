import type { StateCreator } from "zustand"
import type { Recipe } from "../types"
import { createRecipesSlice, type RecipesSliceType } from "./recipeSlice"
import { createNotificationSlice, type NotificationSliceType } from "./notificationSlice"


export type FavoriteSliceType = {
    favorites : Recipe[]
    handleClickFavorite : (recipe: Recipe) => void
    favoriteExists : (id : Recipe ['idDrink']) => boolean
    loadFromStorage : () => void
}
export const createFavoritesSlice : StateCreator<FavoriteSliceType & RecipesSliceType & NotificationSliceType, [],
[], FavoriteSliceType> = (set, get, api) => ({
    favorites: [],
    handleClickFavorite : (recipe) => {
            if(get().favorites.some(favorite =>favorite.idDrink === recipe.idDrink)){
                set((state) => ({
                    favorites:state.favorites.filter(favorite => favorite.idDrink !== recipe.idDrink)
                }))
                createNotificationSlice(set, get, api).showNotification({
                    text : 'Se elimino de Favoritos',
                    error : false
                })
            } else {
                set((state) => ({
                    favorites:[...state.favorites,recipe]
                }))
                 createNotificationSlice(set, get, api).showNotification({
                    text : 'Se agrego a Favoritos',
                    error : false
                })
            }
            createRecipesSlice(set, get, api).closeModal()
            localStorage.setItem('favorites',JSON.stringify(get().favorites))
    },
    favoriteExists : (id) => {
        return get().favorites.some(favorite =>favorite.idDrink === id)
    },
     loadFromStorage : () => {
        const StoredFavorites = localStorage.getItem('favorites')
        if(StoredFavorites) {
            set({
                favorites: JSON.parse(StoredFavorites)
            })
        }
    }
})