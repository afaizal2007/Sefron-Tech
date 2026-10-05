import { Product, Review, OrderConfirmation } from '../types/store';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Apple AirPods Pro (2nd Gen, USB-C)',
    category: 'Audio',
    categoryLabel: 'Audio & Earbuds',
    price: 21990,
    regularPrice: 24900,
    discountPercentage: 12,
    rating: 4.9,
    reviewCount: 3420,
    stock: 48,
    badge: '12% OFF',
    tagline: 'Pro Acoustic Silence',
    description: 'Up to 2x more Active Noise Cancellation, Adaptive Audio, Transparency mode, and Personalized Spatial Audio with dynamic head tracking. MagSafe Case (USB-C) with precision finding.',
    specs: {
      'Noise Cancellation': 'Adaptive Audio & Pro Active Noise Cancellation (ANC)',
      'Audio Driver': 'Custom High-Excursion Apple Dynamic Driver with Custom Amplifier',
      'Battery Life': 'Up to 6 hours listening with ANC (up to 30 hours with case)',
      'Chipset': 'Apple H2 Headphone Chip & U1 Precision Tracking Chip in Case',
      'Water Resistance': 'IP54 Dust, Sweat, and Water Resistant',
      'Connectivity': 'Bluetooth 5.3 & Auto Device Switching across iCloud'
    },
    features: [
      'Next-generation H2 chip delivers smarter noise cancellation and 3D spatial sound',
      'Adaptive Audio seamlessly blends ANC and Transparency mode based on environment',
      'Conversation Awareness lowers media volume and enhances voices in front of you',
      'Touch control lets you adjust volume with a swipe on the stem'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Pure White', hex: '#ffffff', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop' },
      { name: 'Space Gray', hex: '#374151', inStock: true, imageUrl: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=1000&auto=format&fit=crop' }
    ],
    isFeatured: true,
    isFlashDeal: true
  },
  {
    id: 'prod-002',
    name: 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones',
    category: 'Audio',
    categoryLabel: 'Audio & Earbuds',
    price: 26990,
    regularPrice: 34990,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 2840,
    stock: 25,
    badge: 'Best Seller',
    tagline: 'Industry-Leading ANC',
    description: 'Industry-leading noise cancellation with two processors and 8 microphones. Hi-Res Audio wireless transmission with LDAC, up to 30-hour battery life, and crystal-clear hands-free calling.',
    specs: {
      'Processor': 'Integrated Processor V1 + HD Noise Cancelling Processor QN1',
      'Drivers': '30mm Carbon Fiber Composite Soft Edge Dome',
      'Battery Life': '30 Hours (ANC ON) / 40 Hours (ANC OFF) with 3-min quick charge = 3 hrs',
      'Frequency Response': '4Hz - 40,000Hz (Hi-Res Audio Certified)',
      'Weight': '250g Ultra-Comfortable Soft Fit Leather Design',
      'Connectivity': 'Bluetooth 5.2 Multipoint (Pairs to 2 devices simultaneously)'
    },
    features: [
      'Auto NC Optimizer automatically adjusts noise cancellation based on your wearing conditions',
      'Precise Voice Pickup technology with four beamforming microphones for pristine call clarity',
      'Speak-to-Chat automatically pauses playback when you start speaking',
      'Intuitive touch sensor controls for volume, track skip, and voice assistant'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Silver Platinum', hex: '#e2e8f0', inStock: true },
      { name: 'Midnight Black', hex: '#0f172a', inStock: true },
      { name: 'Midnight Blue', hex: '#1e3a8a', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: true
  },
  {
    id: 'prod-003',
    name: 'Apple iPhone 16 Pro (128GB, Natural Titanium)',
    category: 'Mobiles',
    categoryLabel: 'Flagship Mobiles',
    price: 119900,
    regularPrice: 129900,
    discountPercentage: 8,
    rating: 4.9,
    reviewCount: 4120,
    stock: 32,
    badge: 'Flagship',
    tagline: 'Aerospace Titanium Power',
    description: 'Featuring a strong and light titanium design with 6.3-inch Super Retina XDR display, Camera Control button, 48MP Fusion camera with 5x optical zoom, and the powerhouse A18 Pro chip.',
    specs: {
      'Chipset': 'Apple A18 Pro 6-Core CPU & 6-Core GPU with 16-Core Neural Engine',
      'Display': '6.3" Super Retina XDR OLED ProMotion 120Hz Always-On (2000 nits)',
      'Main Camera': '48MP Fusion + 48MP Ultra-Wide + 12MP 5x Telephoto with 4K 120fps Dolby Vision',
      'Battery': 'Up to 27 hours video playback, MagSafe 25W Fast Wireless Charging',
      'Material': 'Grade 5 Aerospace Titanium with Ceramic Shield front glass',
      'Port': 'USB-C supporting USB 3 transfers up to 10Gbps'
    },
    features: [
      'Camera Control gives you fast, tactile access to zoom, exposure, and depth of field',
      '4K 120 fps Dolby Vision lets you shoot cinematic slow-motion video with studio-grade audio',
      'A18 Pro powers Apple Intelligence with next-level on-device speed and privacy',
      'Action button customizable for camera, flashlight, focus modes, or voice memo'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Natural Titanium', hex: '#94a3b8', inStock: true },
      { name: 'Desert Titanium', hex: '#d4b996', inStock: true },
      { name: 'Black Titanium', hex: '#1e293b', inStock: true },
      { name: 'White Titanium', hex: '#f8fafc', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-004',
    name: 'Samsung Galaxy S24 Ultra 5G (256GB, Titanium Gray)',
    category: 'Mobiles',
    categoryLabel: 'Flagship Mobiles',
    price: 114999,
    regularPrice: 129999,
    discountPercentage: 11,
    rating: 4.8,
    reviewCount: 3180,
    stock: 28,
    badge: '11% OFF',
    tagline: 'Galaxy AI & 200MP Master',
    description: 'Titanium exterior, flat 6.8-inch Dynamic AMOLED 2X with Corning Gorilla Armor anti-reflective glass, built-in S Pen stylus, Galaxy AI tools, and 200MP Quad Telephoto camera system.',
    specs: {
      'Processor': 'Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)',
      'Display': '6.8" QHD+ Flat Dynamic AMOLED 2X 1-120Hz (2600 nits peak)',
      'Camera': '200MP Main + 50MP 5x Optical + 10MP 3x Optical + 12MP Ultra-Wide (100x Space Zoom)',
      'Battery': '5,000mAh with 45W Super Fast Charging 2.0 & Fast Wireless Charging 2.0',
      'Build': 'Titanium Frame + IP68 Water and Dust Resistance + Embedded S-Pen',
      'Storage/RAM': '12GB LPDDR5X RAM + 256GB UFS 4.0 Storage'
    },
    features: [
      'Circle to Search with Google lets you search any image, video, or text with a simple gesture',
      'Live Translate provides two-way, real-time voice and text translations on phone calls',
      'ProVisual Engine and 50MP 5x optical telephoto capture brilliant details even in low light',
      'Corning Gorilla Armor reduces ambient surface reflections by 75% for outdoor clarity'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Titanium Gray', hex: '#64748b', inStock: true },
      { name: 'Titanium Black', hex: '#0f172a', inStock: true },
      { name: 'Titanium Violet', hex: '#6b21a8', inStock: true },
      { name: 'Titanium Yellow', hex: '#eab308', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-005',
    name: 'Sony PlayStation 5 Slim Console (1TB SSD Disc Edition)',
    category: 'Gaming',
    categoryLabel: 'Gaming Consoles',
    price: 49990,
    regularPrice: 54990,
    discountPercentage: 9,
    rating: 4.9,
    reviewCount: 5210,
    stock: 19,
    badge: 'Top Pick',
    tagline: 'Play Has No Limits',
    description: 'Experience lightning-fast loading with an ultra-high-speed 1TB SSD, deeper immersion with haptic feedback, adaptive triggers, 3D Audio, and an all-new slim form factor with detachable disc drive.',
    specs: {
      'Storage': '1TB Custom Ultra-High Speed NVMe SSD (5.5 GB/s raw throughput)',
      'Graphics': 'AMD Radeon RDNA 2-based engine with Ray Tracing acceleration',
      'Audio': 'Tempest 3D AudioTech engine with HRTF calibration',
      'Resolution': 'Native 4K 120Hz HDR support, 8K output capability',
      'Dimensions': 'Slim form factor (30% smaller volume, 24% lighter than original PS5)',
      'Controller': 'DualSense Wireless Controller with Haptic Feedback & Adaptive Triggers'
    },
    features: [
      'Ultra-high speed SSD maximizes your play sessions with near-instant load times for installed PS5 games',
      'Ray Tracing delivers true-to-life reflections, shadows, and lighting in supported titles',
      'DualSense Adaptive Triggers simulate the physical tension of in-game actions like pulling a bowstring',
      'Play over 4,000 PS4 games with backwards compatibility and Game Boost frame rate boosts'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Alpine White', hex: '#f8fafc', inStock: true },
      { name: 'Midnight Black', hex: '#0f172a', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: true
  },
  {
    id: 'prod-006',
    name: 'Apple Watch Ultra 2 (49mm Titanium, Ocean Band)',
    category: 'Wearables',
    categoryLabel: 'Smart Watches',
    price: 84900,
    regularPrice: 89900,
    discountPercentage: 6,
    rating: 4.9,
    reviewCount: 1420,
    stock: 22,
    badge: 'Rugged Pro',
    tagline: 'Peak Endurance & GPS',
    description: 'The ultimate sports and adventure watch. Powered by S9 SiP with Double Tap gesture, a 3000-nit Always-On display, precision dual-frequency GPS, 100m water resistance, and up to 36-hour battery.',
    specs: {
      'Case': '49mm Aerospace Grade Titanium with Sapphire Crystal Front Glass',
      'Brightness': '3000 nits Always-On Retina Display (Night Mode auto-activates)',
      'Battery Life': 'Up to 36 hours normal use (up to 72 hours in Low Power Mode)',
      'Sensors': 'ECG, Blood Oxygen, Skin Temperature, Depth Gauge (40m), Water Temperature',
      'GPS': 'Precision Dual-Frequency GPS (L1 and L5) with Offline Compass Backtrack',
      'Water Resistance': '100m Water Resistant, EN13319 Recreational Dive Certified'
    },
    features: [
      'Double tap gesture lets you answer calls, pause music, and stop timers without touching the screen',
      'Modular Ultra watch face displays real-time elevation, depth, and second count on the outer bezel',
      'Customizable Action button gives instant control to begin workouts, mark waypoints, or sound 86dB siren',
      'Full suite of advanced running metrics, cycling power meters, and multisport transitions'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Natural Titanium / Orange', hex: '#ea580c', inStock: true },
      { name: 'Natural Titanium / Blue', hex: '#0284c7', inStock: true },
      { name: 'Natural Titanium / White', hex: '#e2e8f0', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-007',
    name: 'Anker Prime 65W GaN Dual USB-C Fast Charger',
    category: 'Power',
    categoryLabel: 'Power & Chargers',
    price: 3499,
    regularPrice: 4999,
    discountPercentage: 30,
    rating: 4.9,
    reviewCount: 3890,
    stock: 95,
    badge: '30% OFF',
    tagline: 'GaNPrime Ultra Power',
    description: 'Powered by GaN III technology with intelligent PowerIQ 4.0 dynamic power distribution. Fast charge two USB-C devices and one USB-A simultaneously with 65W max output in a micro form factor.',
    specs: {
      'Total Output': '65W Max (USB-C1: 65W / USB-C2: 65W / USB-A: 22.5W)',
      'Charging Protocol': 'Power Delivery 3.0 / PPS / Quick Charge 4.0+ / Super Fast Charge 2.0',
      'Safety': 'ActiveShield 2.0 Temperature Monitor (3 million checks/day)',
      'Dimensions': '38mm x 29mm x 43mm (53% smaller than Apple 67W charger)',
      'Weight': '112g Compact Foldable Plug Design'
    },
    features: [
      'Powers 14" MacBook Pro, iPad Pro, iPhone 16, and Galaxy S24 at maximum speed',
      'Dynamic Power Distribution automatically detects power needs and adjusts output in real time',
      'Next-generation GaN semiconductors reduce heat generation and maximize energy efficiency',
      'Universal compatibility across laptops, tablets, smartphones, and smart accessories'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Matte Black', hex: '#1e293b', inStock: true },
      { name: 'Arctic White', hex: '#f8fafc', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: true
  },
  {
    id: 'prod-008',
    name: 'Pitaka MagEZ 600D Aramid Fiber Magnetic Case',
    category: 'Protection',
    categoryLabel: 'Mobile Protection',
    price: 4999,
    regularPrice: 6499,
    discountPercentage: 23,
    rating: 4.9,
    reviewCount: 1650,
    stock: 74,
    badge: 'Ultra Thin',
    tagline: 'Aerospace Aramid Weave',
    description: 'Crafted from 100% rare 600D aerospace-grade aramid fiber. Incredibly slim at 0.75mm with built-in MagSafe magnetic ring, tactile 3D grip texture, and protective raised aluminum camera bezel.',
    specs: {
      'Material': '100% Genuine Aerospace 600D Aramid Fiber Weave',
      'Thickness': '0.75mm Ultra-Slim Profile (Bare phone feeling)',
      'Magnets': 'Strong N52 Quadrupole Neodymium MagSafe Array',
      'Weight': '18.5 grams Featherlight Engineering',
      'Camera Protection': 'CNC-machined Raised Aluminum Camera Ring (1.5mm)'
    },
    features: [
      'Vacuum-forming technology retains the natural, non-slip tactile texture of aramid weave',
      'MagSafe compatible with seamless alignment to chargers, car mounts, and wallets',
      '5x stronger than steel at equal weight with zero cellular or GPS signal interference',
      'Precision cutouts ensure tactile access to original titanium buttons and USB-C port'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Black / Grey Twill', hex: '#27272a', inStock: true },
      { name: 'Sunset Weave', hex: '#c2410c', inStock: true },
      { name: 'Over the Horizon Blue', hex: '#1e3a8a', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-009',
    name: 'Marshall Emberton II Portable Bluetooth Speaker',
    category: 'Speakers',
    categoryLabel: 'Audio Speakers',
    price: 14999,
    regularPrice: 17499,
    discountPercentage: 14,
    rating: 4.8,
    reviewCount: 2150,
    stock: 36,
    badge: '14% OFF',
    tagline: '30+ Hours Signature Sound',
    description: 'Iconic compact wireless speaker delivering Marshall True Stereophonic 360° sound, 30+ hours of portable playtime on a single charge, Stack Mode multi-speaker pairing, and rugged IP67 dust/water resistance.',
    specs: {
      'Audio Output': 'Two 2" 10W Full Range Drivers + Two Passive Radiators (87dB SPL)',
      'Battery Life': '30+ Hours Playtime (3-hour full charge / 20-min quick charge = 4 hours)',
      'Sound Architecture': 'True Stereophonic 360° Multi-Directional Sound',
      'Water Resistance': 'IP67 Rugged Water and Dust Resistant',
      'Weight': '700g Heavy-Duty Silicone Vinyl Wrap Enclosure',
      'Connectivity': 'Bluetooth 5.1 with Marshall Dedicated App EQ Presets'
    },
    features: [
      'True Stereophonic multi-directional sound fills every corner of the room equally',
      'Stack Mode connects multiple Emberton II speakers together for an amplified soundstage',
      'Vintage brass multi-directional control knob controls power, playback, volume, and tracks',
      'Eco-friendly design constructed using 50% post-consumer recycled plastic'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Black and Brass', hex: '#1c1917', inStock: true },
      { name: 'Cream White', hex: '#fef3c7', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-010',
    name: 'Anker Thunderbolt 4 Braided Cable (240W, 40Gbps, 8K)',
    category: 'Cables',
    categoryLabel: 'Cables & Docks',
    price: 2499,
    regularPrice: 3499,
    discountPercentage: 28,
    rating: 4.9,
    reviewCount: 1980,
    stock: 120,
    badge: '28% OFF',
    tagline: '240W Super Speed Link',
    description: 'Intel-certified Thunderbolt 4 braided cable supporting 240W Extended Power Range fast charging, ultra-fast 40Gbps data transfer, and vivid 8K single display or dual 4K external display output.',
    specs: {
      'Power Delivery': 'Up to 240W EPR (Extended Power Range 48V/5A)',
      'Data Transfer Rate': '40 Gbps Ultra-High Speed Bandwidth',
      'Video Support': 'Single 8K @ 60Hz or Dual 4K @ 60Hz Display Output',
      'Length': '1.0 Meter / 3.3 Feet Heavy-Duty Double Braided Nylon',
      'Certification': 'Intel Thunderbolt 4 & USB4 Official Certification with E-Marker Chip',
      'Durability': 'Tested for 20,000+ Bends and 100N Strain Relief Pull'
    },
    features: [
      'Transfer a 4K movie in less than 5 seconds with 40Gbps bidirectional transfer rates',
      'Powers the highest-draw workstations, gaming laptops, and high-wattage monitors',
      'Backwards compatible with Thunderbolt 3, USB4, USB 3.2, USB 2.0, and DisplayPort Alt Mode',
      'Anodized aluminum alloy housing prevents electromagnetic interference'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Space Gray Braided', hex: '#475569', inStock: true },
      { name: 'Carbon Black', hex: '#0f172a', inStock: true }
    ],
    isFeatured: false,
    isFlashDeal: true
  },
  {
    id: 'prod-011',
    name: 'Nintendo Switch OLED Model (64GB, White)',
    category: 'Gaming',
    categoryLabel: 'Gaming Consoles',
    price: 28499,
    regularPrice: 32999,
    discountPercentage: 14,
    rating: 4.9,
    reviewCount: 3950,
    stock: 24,
    badge: '14% OFF',
    tagline: 'Vivid 7-Inch OLED Screen',
    description: 'Features a vibrant 7-inch OLED screen with slim bezels, a wide adjustable tabletop stand, a dock with a wired LAN port, 64GB of internal storage, and enhanced onboard stereo audio.',
    specs: {
      'Display': '7.0-inch Multi-Touch Capacitive OLED (1280x720 Handheld / 1080p TV Mode)',
      'Storage': '64GB Internal Storage (Expandable up to 2TB via microSD)',
      'Battery Life': '4.5 to 9 Hours depending on software title',
      'Audio': 'Enhanced Onboard Stereo Speakers with dedicated DAC',
      'Dock': 'Includes 2x USB 2.0, HDMI out, AC adapter port, and Wired LAN Ethernet port',
      'Modes': 'TV Mode, Tabletop Mode, and Handheld Mode with Joy-Con controllers'
    },
    features: [
      'Vivid colors and crisp contrast make graphics pop whether gaming at home or on the go',
      'Wide adjustable stand locks firmly into multiple viewing angles for tabletop multiplayer',
      'Connect online with peace of mind using the dock wired LAN port in TV mode',
      'Includes Left and Right White Joy-Con controllers with HD Rumble and IR motion camera'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'OLED White', hex: '#f8fafc', inStock: true },
      { name: 'Neon Red/Blue', hex: '#ef4444', inStock: true }
    ],
    isFeatured: true,
    isFlashDeal: false
  },
  {
    id: 'prod-012',
    name: 'Baseus Blade 20,000mAh 100W Ultra-Slim Laptop Power Bank',
    category: 'Power',
    categoryLabel: 'Power & Chargers',
    price: 4999,
    regularPrice: 7499,
    discountPercentage: 33,
    rating: 4.8,
    reviewCount: 2430,
    stock: 58,
    badge: '33% OFF',
    tagline: '100W Ultra-Thin Backup',
    description: 'Only 18mm thin flat design that easily slips alongside your laptop in a backpack. Packs 20,000mAh capacity, dual 100W USB-C ports, dual USB-A ports, and real-time digital status display.',
    specs: {
      'Capacity': '20,000mAh / 74Wh (TSA Airline Approved for carry-on)',
      'Max Power': '100W USB-C PD 3.0 Bi-directional Fast Charging',
      'Ports': '2x USB-C (100W Max each) + 2x USB-A (30W Max each)',
      'Thickness': '18mm Ultra-Slim Flat Profile (Weighs only 490g)',
      'Display': 'Real-time Digital Screen (Wattage, Voltage, Battery %, Remaining Time)'
    },
    features: [
      'Charges a 16" MacBook Pro up to 50% in just 30 minutes with 100W high-speed output',
      'Recharges itself fully in just 90 minutes using a 65W+ USB-C wall charger',
      'Flat book-style silhouette stacks neatly beneath your laptop on airplane tray tables',
      'Supports Pass-Through charging and 4-device simultaneous power output'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1609592426868-6c84c17b738e?q=80&w=1000&auto=format&fit=crop',
    colors: [
      { name: 'Matte Graphite', hex: '#1e293b', inStock: true }
    ],
    isFeatured: false,
    isFlashDeal: true
  }
];

export const INITIAL_ORDERS: OrderConfirmation[] = [
  {
    orderId: 'ORD-SFN-8921',
    trackingNumber: 'SFN-IND-849201',
    createdAt: '04 Oct 2026',
    estimatedDelivery: 'within 48 Hours via Air Express',
    shippingAddress: {
      fullName: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98201 44552',
      addressLine: 'Apt 502, Prestige Tower, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        selectedColor: 'Pure White'
      },
      {
        product: INITIAL_PRODUCTS[7],
        quantity: 1,
        selectedColor: 'Black / Grey Twill'
      }
    ],
    subtotal: 26989,
    discount: 4048,
    shippingFee: 0,
    total: 22941,
    paymentMethod: 'UPI (GPAY)',
    paymentStatus: 'PAID',
    status: 'Processing'
  },
  {
    orderId: 'ORD-SFN-7734',
    trackingNumber: 'SFN-IND-650193',
    createdAt: '03 Oct 2026',
    estimatedDelivery: 'Delivered',
    shippingAddress: {
      fullName: 'Pooja Verma',
      email: 'pooja.verma@example.com',
      phone: '+91 99112 88471',
      addressLine: 'Flat 12B, Sea Green Apartments, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400018'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 1,
        selectedColor: 'Midnight Black'
      }
    ],
    subtotal: 26990,
    discount: 0,
    shippingFee: 0,
    total: 26990,
    paymentMethod: 'Credit Card (Visa)',
    paymentStatus: 'PAID',
    status: 'Delivered'
  },
  {
    orderId: 'ORD-SFN-6612',
    trackingNumber: 'SFN-IND-392018',
    createdAt: '02 Oct 2026',
    estimatedDelivery: 'within 24 Hours',
    shippingAddress: {
      fullName: 'Ananya Iyer',
      email: 'ananya.iyer@example.com',
      phone: '+91 97401 23984',
      addressLine: 'House 84, Jubilee Hills, Road No 36',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[4],
        quantity: 1,
        selectedColor: 'Alpine White'
      }
    ],
    subtotal: 49990,
    discount: 0,
    shippingFee: 0,
    total: 49990,
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'PAID',
    status: 'Shipped'
  },
  {
    orderId: 'ORD-SFN-5409',
    trackingNumber: 'SFN-IND-104928',
    createdAt: '01 Oct 2026',
    estimatedDelivery: 'Estimated 06 Oct 2026',
    shippingAddress: {
      fullName: 'Vikas Malhotra',
      email: 'vikas.m@example.com',
      phone: '+91 98110 57291',
      addressLine: 'Sector 45, DLF Phase 4',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002'
    },
    items: [
      {
        product: INITIAL_PRODUCTS[6],
        quantity: 2,
        selectedColor: 'Matte Black'
      }
    ],
    subtotal: 6998,
    discount: 1050,
    shippingFee: 0,
    total: 5948,
    paymentMethod: 'Cash on Delivery',
    paymentStatus: 'PENDING_COD',
    status: 'Pending'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Aditya Kulkarni',
    userCity: 'Mumbai',
    userRole: 'Verified Buyer',
    productName: 'Apple AirPods Pro (2nd Gen, USB-C)',
    rating: 5,
    date: 'October 2026',
    content: 'The active noise cancellation on Mumbai suburban local commutes is unbelievable. Voices and rail chatter completely vanish. USB-C charging makes travel so much simpler.',
    verified: true,
    avatarInitials: 'AK'
  },
  {
    id: 'rev-2',
    userName: 'Sneha Mukherjee',
    userCity: 'Bengaluru',
    userRole: 'Software Engineer',
    productName: 'Sony WH-1000XM5 Wireless Headphones',
    rating: 5,
    date: 'September 2026',
    content: 'Unmatched comfort during 8-hour coding sprints. The microphone audio isolation during Zoom and Google Meet calls cuts out all café background noise perfectly.',
    verified: true,
    avatarInitials: 'SM'
  },
  {
    id: 'rev-3',
    userName: 'Rohan Verma',
    userCity: 'New Delhi',
    userRole: 'Tech Enthusiast',
    productName: 'Anker Prime 65W GaN Fast Charger',
    rating: 5,
    date: 'October 2026',
    content: 'Charges both my MacBook Air and iPhone at full speeds without warming up. The compact footprint completely replaced three large adapters in my laptop bag.',
    verified: true,
    avatarInitials: 'RV'
  },
  {
    id: 'rev-4',
    userName: 'Priya Sundaram',
    userCity: 'Hyderabad',
    userRole: 'Product Designer',
    productName: 'Apple Watch Ultra 2 (49mm Titanium)',
    rating: 5,
    date: 'September 2026',
    content: 'The 3000-nit outdoor brightness makes it readable under blazing sunlight. Battery lasts easily 3 full days of heavy tracking and workouts.',
    verified: true,
    avatarInitials: 'PS'
  },
  {
    id: 'rev-5',
    userName: 'Karan Malhotra',
    userCity: 'Pune',
    userRole: 'Gamer',
    productName: 'Sony PlayStation 5 Slim Console (1TB SSD)',
    rating: 5,
    date: 'October 2026',
    content: 'Fast delivery from SEFRON Tech, arrived in pristine sealed condition within 36 hours. DualSense haptics are spectacular in Astro Bot and Spider-Man 2.',
    verified: true,
    avatarInitials: 'KM'
  }
];

export const CATEGORIES_LIST = [
  {
    id: 'Gaming',
    title: 'Gaming Consoles',
    subtitle: 'PS5 Slim, Xbox Series X, Switch OLED & Handhelds',
    count: '12 Models',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=1000&auto=format&fit=crop',
    number: '01'
  },
  {
    id: 'Mobiles',
    title: 'Flagship Mobiles',
    subtitle: 'Apple iPhone 16 Pro, Galaxy S24 Ultra & Google Pixel',
    count: '18 Models',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop',
    number: '02'
  },
  {
    id: 'Audio',
    title: 'AirPods & Earbuds',
    subtitle: 'High-Res LDAC, Adaptive ANC & Spatial Sound',
    count: '14 Models',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1000&auto=format&fit=crop',
    number: '03'
  },
  {
    id: 'Wearables',
    title: 'Smart Watches',
    subtitle: 'Aerospace Titanium, AMOLED & Biometric Sensors',
    count: '10 Models',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
    number: '04'
  },
  {
    id: 'Speakers',
    title: 'Hi-Fi Speakers',
    subtitle: 'Marshall 360° Stereophonic & JBL Portable Bass',
    count: '8 Models',
    imageUrl: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1000&auto=format&fit=crop',
    number: '05'
  },
  {
    id: 'Power',
    title: 'Fast Chargers & Banks',
    subtitle: '65W GaN III & 20,000mAh 100W Laptop Power',
    count: '16 Models',
    imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=1000&auto=format&fit=crop',
    number: '06'
  },
  {
    id: 'Protection',
    title: 'Cases & Protectors',
    subtitle: 'Pitaka 600D Aramid & Spigen MagSafe Armor',
    count: '24 Models',
    imageUrl: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?q=80&w=1000&auto=format&fit=crop',
    number: '07'
  },
  {
    id: 'Cables',
    title: 'Cables & Docks',
    subtitle: 'Braided 240W Thunderbolt 4 & Multiport Hubs',
    count: '12 Models',
    imageUrl: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=1000&auto=format&fit=crop',
    number: '08'
  }
];

export const COMMUNITY_GALLERY = [
  {
    id: 'post-1',
    caption: 'Minimalist clean white desk workstation with Apple ecosystem and audio monitors',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&auto=format&fit=crop',
    likes: 1840,
    author: '@workspace.daily'
  },
  {
    id: 'post-2',
    caption: 'Close-up look at Natural Titanium iPhone 16 Pro and braided USB-C cable on wooden desk',
    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    likes: 1280,
    author: '@minimal_gadgets'
  },
  {
    id: 'post-3',
    caption: 'Everyday tech essentials carry with AirPods Pro 2, smartwatch, and GaN fast charger',
    imageUrl: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?q=80&w=1000&auto=format&fit=crop',
    likes: 2790,
    author: '@everyday_tech_edc'
  },
  {
    id: 'post-4',
    caption: 'PlayStation 5 Slim and white controller setup on floating Scandinavian entertainment console',
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    likes: 3410,
    author: '@playstation_aesthetic'
  }
];
