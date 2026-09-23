import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const u = (id, w = 800) => `https://images.unsplash.com/${id}?w=${w}&q=80&auto=format&fit=crop`;

async function main() {
  console.log('🌱 Seeding database...');

  // Wipe everything
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.coupon.deleteMany();

  // Reset sequences
  for (const seq of [
    'products_id_seq',
    'users_id_seq',
    'orders_id_seq',
    'reviews_id_seq',
    'wishlist_items_id_seq',
    'coupons_id_seq',
  ]) {
    await prisma.$executeRawUnsafe(`ALTER SEQUENCE ${seq} RESTART WITH 1`).catch(() => {});
  }

  // ---------- Users ----------
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@shop.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'admin',
      phone: '+8801700000000',
      address: 'Dhaka, Bangladesh',
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: 'Md. Shahid Hossain',
      email: 'shahid@example.com',
      password: await bcrypt.hash('customer123', 10),
      phone: '+8801712345678',
      address: 'Satkhira, Bangladesh',
    },
  });

  const customer2 = await prisma.user.create({
    data: {
      name: 'Ayesha Rahman',
      email: 'ayesha@example.com',
      password: await bcrypt.hash('customer123', 10),
    },
  });

  const customer3 = await prisma.user.create({
    data: {
      name: 'Rakib Hasan',
      email: 'rakib@example.com',
      password: await bcrypt.hash('customer123', 10),
    },
  });

  // ---------- Products ----------
  const P = [
    // ============ ELECTRONICS ============
    {
      name: 'Wireless Noise-Cancelling Headphones',
      description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cups. Perfect for travel, work, and focus sessions.',
      price: 89.99, category: 'Electronics', stock: 25, featured: true,
      images: [
        u('photo-1505740420928-5e560c06d30e'),
        u('photo-1484704849700-f032a568e944'),
        u('photo-1546435770-a3e426bf472b'),
        u('photo-1583394838336-acd977736f90'),
      ],
    },
    {
      name: 'RGB Mechanical Keyboard',
      description: 'Tactile blue switches, per-key RGB lighting, and aircraft-grade aluminum frame. Built for typists and gamers who want that satisfying click.',
      price: 129.5, category: 'Electronics', stock: 15, featured: true,
      images: [
        u('photo-1587829741301-dc798b83add3'),
        u('photo-1618384887929-16ec33fab9ef'),
        u('photo-1595044426077-d36d9236d54a'),
      ],
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof IPX7 speaker with 20-hour playtime, deep bass, and a built-in mic. Take your music anywhere.',
      price: 59.99, category: 'Electronics', stock: 40, featured: false,
      images: [
        u('photo-1608043152269-423dbba4e7e1'),
        u('photo-1589003077984-894e133dabab'),
        u('photo-1545454675-3531b543be5d'),
      ],
    },
    {
      name: 'Fitness Smart Watch',
      description: 'Heart-rate monitoring, SpO2, GPS, 7-day battery, and 100+ workout modes. Stay on top of your health.',
      price: 199.99, category: 'Electronics', stock: 10, featured: true,
      images: [
        u('photo-1523275335684-37898b6baf30'),
        u('photo-1546868871-7041f2a55e12'),
        u('photo-1508685096489-7aacd43bd3b1'),
        u('photo-1434493789847-2f02dc6ca35d'),
      ],
    },
    {
      name: 'Wireless Charging Pad',
      description: '15W fast wireless charger with anti-slip surface. Compatible with all Qi-enabled phones.',
      price: 29.99, category: 'Electronics', stock: 60, featured: false,
      images: [
        u('photo-1591290619762-c5d9d5f5f5f5'),
        u('photo-1586816879360-004f5b0c51e3'),
        u('photo-1615526675159-e248c3021d3f'),
      ],
    },
    {
      name: '4K Action Camera',
      description: 'Waterproof 4K action camera with image stabilization, touch screen, and Wi-Fi. Includes mounts for helmets and bikes.',
      price: 179.0, category: 'Electronics', stock: 12, featured: true,
      images: [
        u('photo-1526170375885-4d8ecf77b99f'),
        u('photo-1519638831568-d9897f54ed69'),
        u('photo-1502920917128-1aa500764cbd'),
      ],
    },
    {
      name: 'USB-C Hub (7-in-1)',
      description: '7 ports: 4K HDMI, 3× USB 3.0, SD/microSD reader, USB-C PD 100W. Compact aluminum body.',
      price: 49.99, category: 'Electronics', stock: 45, featured: false,
      images: [
        u('photo-1625961332600-f6d5d0f2d5a5'),
        u('photo-1618415857300-eaf22eb67c23'),
        u('photo-1587829741301-dc798b83add3'),
      ],
    },
    {
      name: 'True Wireless Earbuds',
      description: 'Bluetooth 5.3 earbuds with active noise cancellation, 24h total battery (with case), and IPX5 sweat resistance.',
      price: 74.5, category: 'Electronics', stock: 38, featured: false,
      images: [
        u('photo-1590658268037-6bf12165a8df'),
        u('photo-1606220588913-b3aacb4d2f46'),
        u('photo-1572569511254-d8f925fe2cbb'),
      ],
    },
    {
      name: 'Gaming Mouse (RGB)',
      description: '16000 DPI optical sensor, 8 programmable buttons, RGB lighting, and braided cable. Ergonomic for long sessions.',
      price: 39.99, category: 'Electronics', stock: 55, featured: false,
      images: [
        u('photo-1527864550417-7fd91fc51a46'),
        u('photo-1615663245857-ac93bb7c39e7'),
        u('photo-1563297007-0686b7003af7'),
      ],
    },
    {
      name: 'Mechanical Pencil Set',
      description: 'Professional drawing pencil set with 0.5mm and 0.7mm leads, 12 graphite refills, and case. For artists and designers.',
      price: 18.0, category: 'Electronics', stock: 70, featured: false,
      images: [
        u('photo-1512418490979-92798cec1380'),
        u('photo-1583485088034-697b5bc54ccd'),
        u('photo-1517842645767-c639042777db'),
      ],
    },

    // ============ FASHION ============
    {
      name: 'Ultralight Running Shoes',
      description: 'Breathable mesh upper, responsive foam midsole, and grippy outsole. Designed for daily runs up to 10K.',
      price: 79.0, category: 'Fashion', stock: 40, featured: true,
      images: [
        u('photo-1542291026-7eec264c27ff'),
        u('photo-1600185365483-26d7a4cc7519'),
        u('photo-1608231387042-66d1773070a5'),
      ],
    },
    {
      name: 'Water-Resistant Laptop Backpack',
      description: '25L capacity, USB charging port, padded 16" laptop sleeve, and anti-theft back pocket. Commute-ready.',
      price: 45.0, category: 'Fashion', stock: 30, featured: true,
      images: [
        u('photo-1553062407-98eeb64c6a62'),
        u('photo-1622560480605-d83c853bc5c3'),
        u('photo-1581605405669-fcdf81165afa'),
      ],
    },
    {
      name: 'Full-Grain Leather Wallet',
      description: 'RFID-blocking bifold wallet, 8 card slots, slim design. Hand-stitched from full-grain leather.',
      price: 39.99, category: 'Fashion', stock: 35, featured: false,
      images: [
        u('photo-1627123424574-724758594e93'),
        u('photo-1553062407-98eeb64c6a62'),
        u('photo-1601592996763-f05c9c80a7f3'),
      ],
    },
    {
      name: 'Oversized Cotton Hoodie',
      description: '400 GSM heavyweight cotton hoodie with kangaroo pocket and brushed fleece interior. Unisex fit.',
      price: 54.99, category: 'Fashion', stock: 60, featured: false,
      images: [
        u('photo-1556821840-3a63f95609a7'),
        u('photo-1620799140408-edc6dcb6d633'),
        u('photo-1618354691373-d851c5c3a990'),
      ],
    },
    {
      name: 'Classic Aviator Sunglasses',
      description: 'Polarized UV400 lenses, metal frame, and spring hinges. Timeless silhouette for any face shape.',
      price: 34.5, category: 'Fashion', stock: 50, featured: false,
      images: [
        u('photo-1572635196237-14b3f281503f'),
        u('photo-1511499767150-a48a237f0083'),
        u('photo-1577803645773-f96470509666'),
      ],
    },
    {
      name: 'Minimalist Analog Watch',
      description: 'Japanese quartz movement, stainless steel case, and genuine leather strap. Water-resistant to 30m.',
      price: 89.0, category: 'Fashion', stock: 20, featured: true,
      images: [
        u('photo-1524805444758-089113d48a6d'),
        u('photo-1522312346375-d1a52e2b99b3'),
        u('photo-1547996160-81dfa63595aa'),
      ],
    },
    {
      name: 'Everyday Denim Jacket',
      description: 'Classic trucker fit with button front and chest pockets. Washed for a lived-in feel.',
      price: 69.99, category: 'Fashion', stock: 25, featured: false,
      images: [
        u('photo-1544022613-e87ca75a784a'),
        u('photo-1601333144130-8cbb312386b6'),
        u('photo-1551537482-f2075a1d41f2'),
      ],
    },
    {
      name: 'Canvas Slip-On Sneakers',
      description: 'Lightweight canvas upper, cushioned insole, and flexible rubber outsole. Effortless everyday style.',
      price: 42.0, category: 'Fashion', stock: 45, featured: false,
      images: [
        u('photo-1595950653106-6c9ebd614d3a'),
        u('photo-1600269452121-4f2416e55c28'),
        u('photo-1560769629-975ec94e6a86'),
      ],
    },

    // ============ HOME ============
    {
      name: 'Ceramic Coffee Mug',
      description: '350ml matte ceramic mug. Microwave and dishwasher safe. The perfect size for your morning pour-over.',
      price: 12.99, category: 'Home', stock: 100, featured: false,
      images: [
        u('photo-1514228742587-6b1558fcca3d'),
        u('photo-1517256064527-09c73fc73e38'),
        u('photo-1481671703460-040cb8a2d909'),
      ],
    },
    {
      name: 'Minimalist Desk Lamp',
      description: 'Dimmable LED desk lamp with 3 color temperatures and USB-C charging port. Modern matte finish.',
      price: 34.99, category: 'Home', stock: 50, featured: false,
      images: [
        u('photo-1507473885765-e6ed057f782c'),
        u('photo-1543198126-a8ad8e47fb22'),
        u('photo-1534073828943-f801091bb18c'),
      ],
    },
    {
      name: 'Stainless Steel Water Bottle',
      description: '750ml double-wall vacuum insulated. Keeps drinks cold 24h / hot 12h. Leak-proof cap.',
      price: 24.0, category: 'Home', stock: 80, featured: false,
      images: [
        u('photo-1602143407151-7111542de6e8'),
        u('photo-1523362628745-0c100150b504'),
        u('photo-1610824352934-c10d87b700cc'),
      ],
    },
    {
      name: 'Aromatherapy Diffuser',
      description: 'Ultrasonic essential oil diffuser with 7-color LED, 300ml tank, and auto shut-off. Includes 5 oils.',
      price: 39.99, category: 'Home', stock: 40, featured: true,
      images: [
        u('photo-1544947950-fa07a98d237f'),
        u('photo-1608571423902-eed4a5ad8108'),
        u('photo-1603006905003-be475563bc59'),
      ],
    },
    {
      name: 'Indoor Plant Pot Set',
      description: 'Set of 3 ceramic planters with drainage holes and bamboo saucers. Perfect for succulents and herbs.',
      price: 28.0, category: 'Home', stock: 55, featured: false,
      images: [
        u('photo-1485955900006-10f4d324d411'),
        u('photo-1509423350716-97f2360af2e4'),
        u('photo-1416879595882-3373a0480b5b'),
      ],
    },
    {
      name: 'Weighted Blanket (5kg)',
      description: 'Cotton weighted blanket with glass beads for better sleep. Breathable, machine-washable cover.',
      price: 79.99, category: 'Home', stock: 22, featured: false,
      images: [
        u('photo-1584100936595-c0654b55a2e2'),
        u('photo-1631049307264-da0ec9d70304'),
        u('photo-1580301762395-83a6a5e3a7d0'),
      ],
    },
    {
      name: 'Ceramic Dinner Plate Set',
      description: 'Set of 4 stoneware plates in matte glaze. Dishwasher and microwave safe. 10.5-inch diameter.',
      price: 42.0, category: 'Home', stock: 35, featured: false,
      images: [
        u('photo-1603199506016-b9a594b593c0'),
        u('photo-1578500494198-246f612d3b3d'),
        u('photo-1584990347449-a8a4a8b3c5fc'),
      ],
    },

    // ============ SPORTS ============
    {
      name: 'Non-Slip Yoga Mat',
      description: '6mm TPE yoga mat with alignment lines and carrying strap. Extra cushioning for joints.',
      price: 34.99, category: 'Sports', stock: 60, featured: false,
      images: [
        u('photo-1544367567-0f2fcb009e0b'),
        u('photo-1601925260368-ae2f83cf8b7f'),
        u('photo-1592432678016-e910b452f9a2'),
      ],
    },
    {
      name: 'Adjustable Dumbbell Set',
      description: 'Pair of adjustable dumbbells, 5–25 lbs each, with quick-change dial system. Replaces 15 sets of weights.',
      price: 189.0, category: 'Sports', stock: 8, featured: true,
      images: [
        u('photo-1638536532686-d610adfc8e5c'),
        u('photo-1517836357463-d25dfeac3438'),
        u('photo-1534438327276-14e5300c3a48'),
      ],
    },
    {
      name: 'Resistance Band Set',
      description: '5 latex resistance bands (10–50 lbs), door anchor, handles, and ankle straps. Full-body workout anywhere.',
      price: 26.99, category: 'Sports', stock: 70, featured: false,
      images: [
        u('photo-1598289431512-b97b0917affc'),
        u('photo-1571019613454-1cb2f99b2d8b'),
        u('photo-1518611012118-696072aa579a'),
      ],
    },
    {
      name: 'Stainless Steel Jump Rope',
      description: 'Ball-bearing speed rope with adjustable cable and anti-slip handles. Great for HIIT and boxing.',
      price: 14.99, category: 'Sports', stock: 90, featured: false,
      images: [
        u('photo-1599058917765-a780eda07a3e'),
        u('photo-1434596922112-19c563067271'),
        u('photo-1571019614242-c5c5dee9f50b'),
      ],
    },
    {
      name: 'Match Football (Size 5)',
      description: 'FIFA-approved size 5 football with machine-stitched panels and butyl bladder for shape retention.',
      price: 32.0, category: 'Sports', stock: 45, featured: false,
      images: [
        u('photo-1614632537190-23e4146777db'),
        u('photo-1553778263-73a83bab9b0c'),
        u('photo-1579952363873-27f3bade9f55'),
      ],
    },
    {
      name: 'Insulated Gym Duffel Bag',
      description: '40L duffel with wet/dry separation, shoe compartment, and padded shoulder strap. Water-resistant.',
      price: 54.99, category: 'Sports', stock: 25, featured: false,
      images: [
        u('photo-1553062407-98eeb64c6a62'),
        u('photo-1547949003-9792a18a2601'),
        u('photo-1591561954557-26941169b49e'),
      ],
    },

    // ============ BOOKS ============
    {
      name: 'Atomic Habits (Hardcover)',
      description: "James Clear's #1 bestseller on building good habits and breaking bad ones. A must-read.",
      price: 24.99, category: 'Books', stock: 60, featured: true,
      images: [
        u('photo-1544716278-ca5e3f4abd8c'),
        u('photo-1512820790803-83ca734da794'),
        u('photo-1543002588-bfa74002ed7e'),
      ],
    },
    {
      name: 'Clean Code (Paperback)',
      description: "Robert C. Martin's guide to writing software that humans can read. Essential for developers.",
      price: 39.99, category: 'Books', stock: 40, featured: false,
      images: [
        u('photo-1532012197267-da84d127e765'),
        u('photo-1495446815901-a7297e633e8d'),
        u('photo-1512045482940-f37f5216f639'),
      ],
    },
    {
      name: 'The Psychology of Money',
      description: 'Morgan Housel on how our relationship with money shapes our decisions. Timeless financial wisdom.',
      price: 19.99, category: 'Books', stock: 50, featured: false,
      images: [
        u('photo-1554224155-6726b3ff858f'),
        u('photo-1543002588-bfa74002ed7e'),
        u('photo-1550399105-c4db5fb85c18'),
      ],
    },
    {
      name: 'Deep Work (Hardcover)',
      description: 'Cal Newport on focused success in a distracted world. Learn to do more meaningful work in less time.',
      price: 27.5, category: 'Books', stock: 35, featured: false,
      images: [
        u('photo-1512820790803-83ca734da794'),
        u('photo-1497633762265-9d179a990aa6'),
        u('photo-1476275466078-4007374efbbe'),
      ],
    },
    {
      name: 'Design Systems Handbook',
      description: 'Practical guide to building and maintaining design systems for modern web products.',
      price: 42.0, category: 'Books', stock: 30, featured: false,
      images: [
        u('photo-1544716278-ca5e3f4abd8c'),
        u('photo-1507842217343-583bb7270b66'),
        u('photo-1535905557558-afc4877a26fc'),
      ],
    },

    // ============ BEAUTY ============
    {
      name: 'Vitamin C Face Serum',
      description: '20% Vitamin C + Hyaluronic Acid serum for brightening and hydration. Dermatologist tested.',
      price: 29.99, category: 'Beauty', stock: 55, featured: false,
      images: [
        u('photo-1620916566398-39f1143ab7be'),
        u('photo-1611930022073-b7a4ba5fcccd'),
        u('photo-1556228720-195a672e8a03'),
      ],
    },
    {
      name: 'Natural Lip Balm Set',
      description: 'Set of 4 beeswax lip balms (vanilla, mint, berry, unscented). Long-lasting moisture.',
      price: 14.99, category: 'Beauty', stock: 90, featured: false,
      images: [
        u('photo-1596462502278-27bfdc403348'),
        u('photo-1631730359585-38a4935cbec4'),
        u('photo-1615397349754-cfa2066a298e'),
      ],
    },
    {
      name: 'Bamboo Hair Brush',
      description: 'Eco-friendly bamboo hair brush with natural boar bristles. Detangles without static.',
      price: 18.5, category: 'Beauty', stock: 65, featured: false,
      images: [
        u('photo-1522338242992-e1a54906a8da'),
        u('photo-1522337360788-8b13dee7a37e'),
        u('photo-1596462502278-27bfdc403348'),
      ],
    },

    // ============ TOYS ============
    {
      name: 'Wooden Puzzle Set',
      description: '3-piece wooden puzzle set for toddlers. Non-toxic paints, sanded edges. Ages 2+.',
      price: 24.0, category: 'Toys', stock: 50, featured: false,
      images: [
        u('photo-1610701596007-11502861dcfa'),
        u('photo-1596461404969-9ae70f2830c1'),
        u('photo-1519689680058-324335c77eba'),
      ],
    },
    {
      name: 'Building Blocks (500 pcs)',
      description: '500-piece building block set compatible with major brands. Includes storage box and idea booklet.',
      price: 49.99, category: 'Toys', stock: 30, featured: true,
      images: [
        u('photo-1587654780291-39c9404d746b'),
        u('photo-1596461404969-9ae70f2830c1'),
        u('photo-1558060370-d644479cb6f7'),
      ],
    },
    {
      name: 'Remote Control Car',
      description: '2.4GHz RC car with rechargeable battery, 30-minute runtime, and 4WD off-road tires. Ages 6+.',
      price: 44.99, category: 'Toys', stock: 40, featured: false,
      images: [
        u('photo-1594787318286-3d835c1d207f'),
        u('photo-1511919884226-fd3cad34687c'),
        u('photo-1583121274602-3e2820c69888'),
      ],
    },
  ];

  const products = [];
  for (const p of P) products.push(await prisma.product.create({ data: p }));

  // ---------- Reviews ----------
  const reviewPool = [
    { rating: 5, comment: 'Absolutely love it! Exceeded my expectations.' },
    { rating: 5, comment: 'Great quality for the price. Highly recommend.' },
    { rating: 4, comment: 'Works well, but shipping took a while.' },
    { rating: 4, comment: 'Solid product. Would buy again.' },
    { rating: 5, comment: 'Exactly as described. Very happy with my purchase.' },
    { rating: 3, comment: 'Decent, but not quite what I expected.' },
    { rating: 5, comment: 'Excellent build quality and fast delivery.' },
    { rating: 4, comment: 'Good value. Minor issues but nothing serious.' },
  ];

  const customers = [customer, customer2, customer3];
  let reviewCount = 0;
  for (let i = 0; i < products.length; i++) {
    const reviewers = [...customers].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1);
    for (const u2 of reviewers) {
      const r = reviewPool[Math.floor(Math.random() * reviewPool.length)];
      await prisma.review.create({
        data: { productId: products[i].id, userId: u2.id, rating: r.rating, comment: r.comment },
      });
      reviewCount++;
    }
  }

  // ---------- Wishlist samples ----------
  for (let i = 0; i < 6; i++) {
    await prisma.wishlistItem.create({
      data: { userId: customer.id, productId: products[i * 3 + 1].id },
    }).catch(() => {});
  }

  // ---------- Coupons ----------
  const coupons = await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        description: '10% off your first order',
        type: 'percent',
        value: 10,
        minOrder: 0,
        maxUses: 1000,
        active: true,
      },
      {
        code: 'SAVE20',
        description: '20% off orders over $100',
        type: 'percent',
        value: 20,
        minOrder: 100,
        maxUses: 500,
        active: true,
      },
      {
        code: 'FLAT5',
        description: '$5 off orders over $25',
        type: 'fixed',
        value: 5,
        minOrder: 25,
        maxUses: 1000,
        active: true,
      },
      {
        code: 'SUMMER30',
        description: '30% off summer sale',
        type: 'percent',
        value: 30,
        minOrder: 50,
        maxUses: 200,
        active: true,
      },
    ],
  });

  // ---------- Summary ----------
  const totalImages = products.reduce((s, p) => s + p.images.length, 0);
  console.log('✅ Seeded', products.length, 'products with', totalImages, 'images');
  console.log('✅ Seeded', reviewCount, 'reviews');
  console.log('✅ Seeded', coupons.count, 'coupons');
  console.log('✅ Users:');
  console.log('   Admin    → admin@shop.com / admin123');
  console.log('   Customer → shahid@example.com / customer123');
  console.log('   Customer → ayesha@example.com / customer123');
  console.log('   Customer → rakib@example.com / customer123');
  console.log('✅ Coupons:');
  console.log('   WELCOME10  — 10% off, no minimum');
  console.log('   SAVE20     — 20% off orders over $100');
  console.log('   FLAT5      — $5 off orders over $25');
  console.log('   SUMMER30   — 30% off orders over $50');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });