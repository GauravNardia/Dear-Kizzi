import { getCurrentUser } from "@/lib/actions/user.actions";


export const sidebarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/search.svg",
    route: "/search",
    label: "Search",
  },
  {
    imgURL: "/assets/write.svg",
    route: "/write",
    label: "Write",
  },
  {
    imgURL: "/assets/heart.svg",
    route: "/activity",
    label: "Activity",
  },
  {
    imgURL: "/assets/letters.svg",
    route: "/my-letters",
    label: "My letters",
  },
  {
    imgURL: "/assets/user.svg",
    route: "/profile",
    label: "Profile",
  },
];




// Challenges 

export const tasks = [
  {
    id: '1',
    name: 'Coffee Date',
    description: 'Enjoy a coffee date with your match.',
    duration: 7200, // 2 hours in seconds
  },
  {
    id: '2',
    name: 'Movie Night',
    description: 'Go watch a movie with your match.',
    duration: 14400, // 4 hours in seconds
  },
  {
    id: '3',
    name: 'Long Drive',
    description: 'Take a scenic long drive together.',
    duration: 21600, // 6 hours in seconds
  },
];