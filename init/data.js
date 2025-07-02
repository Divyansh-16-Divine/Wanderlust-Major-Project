const sampleListings = [
  // Rooms Category
  {
    title: "Elegant Victorian Room",
    description:
      "A beautifully appointed Victorian-style room with antique furnishings and modern amenities. Perfect for couples seeking a romantic getaway.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 150,
    location: "San Francisco",
    country: "United States",
    category: "Rooms",
  },
  {
    title: "Minimalist Studio Room",
    description:
      "Clean, modern studio room with floor-to-ceiling windows and city views. Ideal for solo travelers or business trips.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 95,
    location: "Berlin",
    country: "Germany",
    category: "Rooms",
  },
  {
    title: "Cozy Attic Room",
    description:
      "Charming attic room with exposed wooden beams and skylight views. A peaceful retreat in the heart of the old town.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 85,
    location: "Prague",
    country: "Czech Republic",
    category: "Rooms",
  },

  // Iconic Cities Category
  {
    title: "Times Square Penthouse",
    description:
      "Luxurious penthouse overlooking Times Square with panoramic city views. Experience the energy of NYC from above.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1496568816309-51d7c20e3b21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 450,
    location: "New York City",
    country: "United States",
    category: "Iconic Cities",
  },
  {
    title: "Parisian Loft near Eiffel Tower",
    description:
      "Sophisticated loft apartment with direct views of the Eiffel Tower. Walk to cafes, museums, and iconic landmarks.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 350,
    location: "Paris",
    country: "France",
    category: "Iconic Cities",
  },
  {
    title: "London Bridge Apartment",
    description:
      "Modern apartment with views of Tower Bridge and the Thames. Walking distance to Borough Market and London Eye.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 280,
    location: "London",
    country: "United Kingdom",
    category: "Iconic Cities",
  },
  {
    title: "Shibuya Crossing Studio",
    description:
      "Ultra-modern studio overlooking the famous Shibuya crossing. Experience Tokyo's neon-lit nights from your window.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 320,
    location: "Tokyo",
    country: "Japan",
    category: "Iconic Cities",
  },

  // Hill Stations Category
  {
    title: "Himalayan Tea Estate Cottage",
    description:
      "Colonial-era cottage surrounded by tea gardens with breathtaking mountain views. Perfect for nature lovers and peace seekers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 120,
    location: "Darjeeling",
    country: "India",
    category: "Hill Stations",
  },
  {
    title: "Alpine Chalet Retreat",
    description:
      "Traditional wooden chalet with panoramic views of snow-capped peaks. Perfect for hiking and mountain adventures.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 200,
    location: "Interlaken",
    country: "Switzerland",
    category: "Hill Stations",
  },
  {
    title: "Misty Mountain Lodge",
    description:
      "Rustic lodge perched on a hilltop with cloud-kissed views. Wake up to sunrise over rolling hills and valleys.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 180,
    location: "Munnar",
    country: "India",
    category: "Hill Stations",
  },
  {
    title: "Blue Ridge Mountain Cabin",
    description:
      "Cozy cabin with wraparound porch and stunning valley views. Perfect for stargazing and peaceful retreats.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 160,
    location: "Asheville",
    country: "United States",
    category: "Hill Stations",
  },

  // Luxury Castles Category
  {
    title: "Medieval Castle Suite",
    description:
      "Stay in a restored 12th-century castle with tapestries, four-poster beds, and views of the Scottish Highlands.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520637836862-4d197d17c53a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 800,
    location: "Scottish Highlands",
    country: "United Kingdom",
    category: "Luxury Castles",
  },
  {
    title: "Loire Valley Chateau",
    description:
      "Renaissance castle with formal gardens, wine cellars, and opulent interiors. Experience French aristocratic luxury.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 1200,
    location: "Loire Valley",
    country: "France",
    category: "Luxury Castles",
  },
  {
    title: "Bavarian Castle Tower",
    description:
      "Fairy-tale castle tower with spiral staircases and panoramic views of the Bavarian countryside.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1549180030-48bf079fb38a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 950,
    location: "Bavaria",
    country: "Germany",
    category: "Luxury Castles",
  },

  // Amazing Pools Category
  {
    title: "Infinity Pool Villa Santorini",
    description:
      "Whitewashed villa with infinity pool overlooking the Aegean Sea. Watch spectacular sunsets from your private pool.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 600,
    location: "Santorini",
    country: "Greece",
    category: "Amazing Pools",
  },
  {
    title: "Rooftop Pool Penthouse",
    description:
      "Modern penthouse with rooftop infinity pool and 360-degree city views. The ultimate luxury urban experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Miami",
    country: "United States",
    category: "Amazing Pools",
  },
  {
    title: "Jungle Pool Resort",
    description:
      "Eco-luxury resort with natural swimming pool carved into volcanic rock, surrounded by tropical rainforest.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 450,
    location: "Ubud",
    country: "Indonesia",
    category: "Amazing Pools",
  },

  // Farms Category
  {
    title: "Organic Lavender Farm Stay",
    description:
      "Peaceful farmhouse surrounded by purple lavender fields. Participate in farm activities and enjoy fresh organic meals.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1464207687429-7505649dae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 140,
    location: "Provence",
    country: "France",
    category: "Farms",
  },
  {
    title: "Tuscan Vineyard Estate",
    description:
      "Historic farmhouse in the heart of Chianti wine region. Learn winemaking and enjoy wine tastings among the vines.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 320,
    location: "Tuscany",
    country: "Italy",
    category: "Farms",
  },
  {
    title: "Vermont Maple Farm",
    description:
      "Traditional New England farm with maple syrup production. Experience authentic farm life and seasonal activities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 180,
    location: "Vermont",
    country: "United States",
    category: "Farms",
  },

  // Campsites Category
  {
    title: "Desert Glamping Experience",
    description:
      "Luxury camping under the stars in the Sahara Desert. Traditional Berber tents with modern amenities and camel treks.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 280,
    location: "Merzouga",
    country: "Morocco",
    category: "Campsites",
  },
  {
    title: "Mountain Base Camp",
    description:
      "Adventure base camp at the foot of the Himalayas. Perfect for trekkers and mountain enthusiasts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 95,
    location: "Kathmandu Valley",
    country: "Nepal",
    category: "Campsites",
  },
  {
    title: "Forest Treehouse Camp",
    description:
      "Elevated treehouse camping experience in old-growth forest. Fall asleep to nature sounds and bird songs.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 120,
    location: "Olympic Peninsula",
    country: "United States",
    category: "Campsites",
  },

  // Arctic Category
  {
    title: "Northern Lights Glass Igloo",
    description:
      "Heated glass igloo for optimal Northern Lights viewing. Luxury arctic experience with traditional Lapland activities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 650,
    location: "Rovaniemi",
    country: "Finland",
    category: "Arctic",
  },
  {
    title: "Icelandic Aurora Lodge",
    description:
      "Remote lodge in Iceland's wilderness with geothermal hot springs and guaranteed aurora viewing opportunities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 580,
    location: "Thingvellir",
    country: "Iceland",
    category: "Arctic",
  },
  {
    title: "Polar Bear Watching Cabin",
    description:
      "Cozy cabin on the tundra designed for polar bear and wildlife observation. Expert guides and arctic cuisine included.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 750,
    location: "Churchill",
    country: "Canada",
    category: "Arctic",
  },

  // Beaches Category
  {
    title: "Maldivian Overwater Bungalow",
    description:
      "Luxury overwater bungalow with direct ocean access and private infinity pool. Ultimate tropical paradise experience.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 900,
    location: "Malé Atoll",
    country: "Maldives",
    category: "Beaches",
  },
  {
    title: "Bohemian Beach Shack",
    description:
      "Rustic beach shack with direct beach access and surfboard rentals. Perfect for surfers and beach lovers.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 85,
    location: "Tulum",
    country: "Mexico",
    category: "Beaches",
  },
  {
    title: "Cliffside Beach House",
    description:
      "Dramatic cliffside location with panoramic ocean views and private beach access via winding path.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602088113235-229c19758e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 400,
    location: "Big Sur",
    country: "United States",
    category: "Beaches",
  },
  {
    title: "Tropical Beach Villa",
    description:
      "Spacious villa steps from pristine white sand beach with snorkeling, diving, and water sports available.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 520,
    location: "Barbados",
    country: "Barbados",
    category: "Beaches",
  },

  // Others Category
  {
    title: "Converted Lighthouse Keeper's House",
    description:
      "Unique lighthouse conversion with 360-degree ocean views and maritime history. Watch ships pass by day and night.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1533619239233-6280475a633a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 300,
    location: "Maine Coast",
    country: "United States",
    category: "Others",
  },
  {
    title: "Underground Cave Hotel",
    description:
      "Extraordinary hotel carved into ancient caves with unique architecture and cool temperatures year-round.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1618140052121-39fc6db33972?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 380,
    location: "Cappadocia",
    country: "Turkey",
    category: "Others",
  },
  {
    title: "Floating Houseboat",
    description:
      "Traditional Kerala houseboat floating through backwater canals. Experience authentic Indian culture and cuisine.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1587381420270-3e1a5b9e6904?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 220,
    location: "Alleppey",
    country: "India",
    category: "Others",
  },
  {
    title: "Converted Train Car",
    description:
      "Vintage train car converted into unique accommodation with original fixtures and railway memorabilia.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 150,
    location: "Oregon",
    country: "United States",
    category: "Others",
  },
  {
    title: "Monastery Guest House",
    description:
      "Peaceful monastery accommodation with meditation sessions, organic gardens, and spiritual retreat opportunities.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 80,
    location: "Bhutan",
    country: "Bhutan",
    category: "Others",
  },
  {
    title: "Safari Tent Lodge",
    description:
      "Luxury safari tent with panoramic savanna views. Wake up to lions roaring and elephants grazing nearby.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 550,
    location: "Serengeti National Park",
    country: "Tanzania",
    category: "Others",
  },
  {
    title: "Windmill House",
    description:
      "Historic Dutch windmill converted into unique circular accommodation with traditional architecture and modern comforts.",
    image: {
      filename: "listingimage",
      url: "https://images.unsplash.com/photo-1480796927426-f609979314bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
    },
    price: 280,
    location: "Kinderdijk",
    country: "Netherlands",
    category: "Others",
  },
];

module.exports = { data: sampleListings };
