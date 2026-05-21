import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { privateApi } from '../services/api';
import type { Address, AddressCreate } from '../types/checkout.types';

interface AddressState {
    addresses: Address[];
    selectedAddressId: number | null;
    loading: boolean;
    fetchAddresses: () => Promise<void>;
    addAddress: (data: AddressCreate) => Promise<Address>;
    deleteAddress: (id: number) => Promise<void>;
    setDefault: (id: number) => Promise<void>;
    setSelectedAddress: (id: number) => void;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set) => ({
            addresses: [],
            selectedAddressId: null,
            loading: false,

            fetchAddresses: async () => {
                set({ loading: true });
                try {
                    // GET /api/v1/addresses
                    const res = await privateApi.get('/addresses');
                    const addresses = res.data;
                    set({ addresses, loading: false });
                    // Auto-select default or first address
                    const defaultAddr = addresses.find((a: Address) => a.is_default);
                    if (defaultAddr && !defaultAddr.id) {
                        set({ selectedAddressId: defaultAddr.id });
                    }
                } catch {
                    set({ loading: false });
                }
            },

            addAddress: async (data) => {
                const res = await privateApi.post('/addresses', data);
                set(s => ({ addresses: [...s.addresses, res.data] }));
                return res.data;
            },

            deleteAddress: async (id) => {
                // DELETE /api/v1/addresses/:id
                await privateApi.delete(`/addresses/${id}`);
                set(s => {
                    const filtered = s.addresses.filter(a => a.id !== id);
                    // If deleted address was selected, select another
                    const newSelectedId = s.selectedAddressId === id 
                        ? (filtered.find(a => a.is_default) || filtered[0])?.id || null
                        : s.selectedAddressId;
                    return { addresses: filtered, selectedAddressId: newSelectedId };
                });
            },

            setDefault: async (id) => {
                // PATCH /api/v1/addresses/:id/default
                await privateApi.patch(`/addresses/${id}/default`);
                set(s => ({
                    addresses: s.addresses.map(a => ({ ...a, is_default: a.id === id })),
                    selectedAddressId: id,
                }));
            },

            setSelectedAddress: (id) => {
                set({ selectedAddressId: id });
            },
        }),
        {
            name: 'freshcart-addresses',
            partialize: (s) => ({ addresses: s.addresses, selectedAddressId: s.selectedAddressId }),
        }
    )
);

