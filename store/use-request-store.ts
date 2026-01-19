import { create } from "zustand";

type RequestStore = {
  data: null | { from: string; to: string; time: string; number: number };
  setData: (data: RequestStore["data"]) => void;
};

export const useRequestStore = create<RequestStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
