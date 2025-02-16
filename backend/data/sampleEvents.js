const sampleEvents = [
  {
    title: "Tech Innovation Summit 2024",
    description: "Join the most innovative minds in technology for a three-day summit featuring keynote speakers, workshops, and networking opportunities. Learn about AI, blockchain, and the future of tech.",
    category: "conference",
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    time: "09:00",
    location: "Tech Convention Center, Silicon Valley",
    price: 299.99,
    totalTickets: 500,
    availableTickets: 500,
    images: ["frontend/src/assests/technology.jpg"],
    features: [
      {
        name: "Expert Speakers",
        description: "Industry leaders and innovators"
      },
      {
        name: "Interactive Workshops",
        description: "Hands-on learning experiences"
      }
    ],
    isPublished: true
  },
  {
    title: "Nature Photography Workshop",
    description: "Discover the art of nature photography in this immersive workshop. Learn composition techniques, lighting, and post-processing from professional photographers.",
    category: "workshop",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    time: "10:00",
    location: "National Botanical Gardens",
    price: 149.99,
    totalTickets: 30,
    availableTickets: 30,
    images: ["frontend/src/assests/nature.jpg"],
    features: [
      {
        name: "Professional Equipment",
        description: "Try out professional-grade cameras and lenses"
      },
      {
        name: "Field Sessions",
        description: "Practice in real outdoor settings"
      }
    ],
    isPublished: true
  },
  {
    title: "Culinary Masterclass Series",
    description: "Experience the art of fine cooking with our masterclass series. Learn from renowned chefs, discover new techniques, and create extraordinary dishes.",
    category: "workshop",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: "14:00",
    location: "Culinary Institute",
    price: 199.99,
    totalTickets: 40,
    availableTickets: 40,
    images: ["frontend/src/assests/food.jpg"],
    features: [
      {
        name: "Gourmet Ingredients",
        description: "Work with premium, fresh ingredients"
      },
      {
        name: "Wine Pairing",
        description: "Learn about wine and food pairing"
      }
    ],
    isPublished: true
  },
  {
    title: "Creative Arts Festival",
    description: "Immerse yourself in a world of creativity at our annual arts festival. Featuring exhibitions, live performances, workshops, and interactive installations.",
    category: "exhibition",
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    time: "11:00",
    location: "Metropolitan Arts Center",
    price: 79.99,
    totalTickets: 1000,
    availableTickets: 1000,
    images: ["frontend/src/assests/hobby.jpg"],
    features: [
      {
        name: "Artist Showcases",
        description: "Meet and learn from talented artists"
      },
      {
        name: "Art Market",
        description: "Purchase unique artworks and crafts"
      }
    ],
    isPublished: true
  },
  {
    title: "Business Leadership Conference",
    description: "Connect with industry leaders, learn about the latest business trends, and develop your leadership skills at this premier business conference.",
    category: "conference",
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    time: "08:30",
    location: "Grand Business Center",
    price: 399.99,
    totalTickets: 300,
    availableTickets: 300,
    images: ["frontend/src/assests/organizer.jpg"],
    features: [
      {
        name: "Networking Events",
        description: "Connect with industry professionals"
      },
      {
        name: "Leadership Workshops",
        description: "Develop essential leadership skills"
      }
    ],
    isPublished: true
  }
];

module.exports = sampleEvents; 