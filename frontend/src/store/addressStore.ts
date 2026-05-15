import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { privateApi } from '../services/api';
import type { Address, AddressCreate } from '../types/checkout.types';

interface AddressState {
    addresses: Address[];
    loading: boolean;
    fetchAddresses: () => Promise<void>;
    addAddress: (data: AddressCreate) => Promise<Address>;
    deleteAddress: (id: number) => Promise<void>;
    setDefault: (id: number) => Promise<void>;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set) => ({
            addresses: [],
            loading: false,

            fetchAddresses: async () => {
                set({ loading: true });
                try {
                    // GET /api/v1/addresses
                    const res = await privateApi.get('/addresses');
                    set({ addresses: res.data, loading: false });
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
                set(s => ({ addresses: s.addresses.filter(a => a.id !== id) }));
            },

            setDefault: async (id) => {
                // PATCH /api/v1/addresses/:id/default
                await privateApi.patch(`/addresses/${id}/default`);
                set(s => ({
                    addresses: s.addresses.map(a => ({ ...a, is_default: a.id === id })),
                }));
            },
        }),
        {
            name: 'freshcart-addresses',
            partialize: (s) => ({ addresses: s.addresses }),
        }
    )
);

