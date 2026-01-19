import { create } from "zustand";

type RequestStore = {
  data: null | {
    from: string | null;
    to: string | null;
    time: string | null;
    number: number | null;
  };
  setData: (data: RequestStore["data"]) => void;
};

export const useRequestStore = create<RequestStore>((set) => ({
  data: {
    from: "عمان",
    to: null,
    time: null,
    number: null,
  },
  setData: (data) => set({ data }),
}));
