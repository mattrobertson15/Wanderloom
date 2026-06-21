export interface MockPost {
  tripSlug: string;
  title: string | null;
  body: string | null;
  photoUrl: string | null;
  placeName: string | null;
  postDate: string | null;
}

export const MOCK_POSTS: MockPost[] = [
  {
    tripSlug: "america-2026",
    title: "First morning in Manhattan",
    body: "Woke up early to catch the ferry out to Liberty Island.",
    photoUrl: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800",
    placeName: "Statue of Liberty",
    postDate: "2026-03-11",
  },
  {
    tripSlug: "america-2026",
    title: "Sunset at Griffith",
    body: "Best view of the city right before sunset.",
    photoUrl: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
    placeName: "Griffith Observatory",
    postDate: "2026-03-16",
  },
  {
    tripSlug: "spain-and-iceland",
    title: "Gaudi's masterpiece",
    body: "Still being built, still breathtaking.",
    photoUrl: "https://images.unsplash.com/photo-1583779457094-ab6798c2b711?w=800",
    placeName: "Sagrada Familia",
    postDate: "2026-05-03",
  },
];
