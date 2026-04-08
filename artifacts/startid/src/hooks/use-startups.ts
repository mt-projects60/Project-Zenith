import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mockStartups, mockNovaPayProfile, Startup, StartupProfileData } from "../data/mock-startups";

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useStartups() {
  return useQuery({
    queryKey: ["startups", "list"],
    queryFn: async (): Promise<Startup[]> => {
      await delay(200); // Simulate network
      return mockStartups;
    },
  });
}

export function useStartupProfile(slug: string) {
  return useQuery({
    queryKey: ["startups", "profile", slug],
    queryFn: async (): Promise<StartupProfileData | null> => {
      await delay(300); // Simulate network
      
      if (slug === "novapay") {
        return mockNovaPayProfile;
      }
      
      // Fallback for others just creating a dummy profile from the base data
      const base = mockStartups.find(s => s.slug === slug);
      if (!base) return null;
      
      return {
        ...base,
        location: "San Francisco, CA",
        founded: "2023",
        website: `${base.slug}.com`,
        overview: mockNovaPayProfile.overview, // reusing dummy text
        traction: mockNovaPayProfile.traction,
        team: [{ name: "Founder Name", title: "CEO", bio: "Serial entrepreneur.", initials: "FN" }],
        funding: mockNovaPayProfile.funding
      };
    },
  });
}

export function useUpvoteStartup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(300);
      return id;
    },
    onMutate: async (id) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["startups", "list"] });
      const previous = queryClient.getQueryData(["startups", "list"]);
      
      queryClient.setQueryData(["startups", "list"], (old: Startup[] | undefined) => {
        if (!old) return old;
        return old.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s);
      });
      
      return { previous };
    },
    onError: (_err, _newTodo, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["startups", "list"], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["startups", "list"] });
    },
  });
}
