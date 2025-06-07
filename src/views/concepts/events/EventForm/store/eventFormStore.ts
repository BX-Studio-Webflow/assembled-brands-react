import { create } from 'zustand'
import type { ProductOption, Products, SelectedProduct } from '../types'

export type EventFormState = {
    productList: Products
    productOption: ProductOption[]
    selectedProduct: SelectedProduct[]
}

type EventFormAction = {
    setProductList: (payload: Products) => void
    setProductOption: (payload: ProductOption[]) => void
    setSelectedProduct: (payload: SelectedProduct[]) => void
}

const initialState: EventFormState = {
    productList: [],
    productOption: [],
    selectedProduct: [],
}

export const useEventFormStore = create<EventFormState & EventFormAction>(
    (set) => ({
        ...initialState,
        setProductOption: (payload) => set(() => ({ productOption: payload })),
        setProductList: (payload) => set(() => ({ productList: payload })),
        setSelectedProduct: (payload) =>
            set(() => ({ selectedProduct: payload })),
    }),
)
