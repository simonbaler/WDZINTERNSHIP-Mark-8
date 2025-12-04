import { Language } from '@/store/languageStore';

export const translations: Record<Language, Record<string, any>> = {
  en: {
    // Navigation
    nav: {
      home: 'Home',
      cameras: 'Cameras',
      lenses: 'Lenses',
      accessories: 'Accessories',
      cart: 'Cart',
      search: 'Search',
      account: 'Account',
      logout: 'Logout',
      login: 'Login',
    },
    // Hero Section
    hero: {
      morningGreeting: '🌅 Good Morning',
      afternoonGreeting: '☀️ Good Afternoon',
      eveningGreeting: '🌙 Good Evening',
      morningHeadline: 'Start Your Day Right',
      afternoonHeadline: 'Perfect Light Awaits',
      eveningHeadline: 'Capture Night Magic',
      morningSubheading: 'Capture the golden hours with perfect equipment',
      afternoonSubheading: 'Afternoon is prime time for photography',
      eveningSubheading: 'Master night photography with our collection',
      morningCta: 'Shop Morning Deals',
      afternoonCta: 'Explore Now',
      eveningCta: 'Night Mode Essentials',
      browseAll: 'Browse All',
      premiumEquipment: 'Premium Equipment',
    },
    // Features
    features: {
      freeShipping: 'Free Shipping',
      freeShippingDesc: 'On orders over ₹4,999',
      thirtyDayReturns: '30-Day Returns',
      thirtyDayReturnsDesc: 'Hassle-free returns',
      securePackaging: 'Secure Packaging',
      securePackagingDesc: 'Safe delivery guaranteed',
      expertSupport: 'Expert Support',
      expertSupportDesc: '24/7 photography advice',
    },
    // Categories
    categories: {
      shopByCategory: 'Shop by Category',
      findPerfect: 'Find the perfect gear for your photography journey',
      cameras: 'Cameras',
      lenses: 'Lenses',
      bundles: 'Bundles',
      exploreCollection: 'Explore Collection',
    },
    // Products
    products: {
      editorsPicks: "Editor's Picks",
      handpicked: 'Handpicked products recommended by our photography experts',
      viewAll: 'View All Products',
    },
    // CTA Section
    cta: {
      readyToStart: 'Ready to Start Your Journey?',
      joinThousands: 'Join thousands of photographers who trust us for their gear. Get exclusive deals and expert advice.',
      shopNow: 'Shop Now',
    },
    // Trust Indicators
    trust: {
      authentic: 'Authentic',
      verified: '100% Verified',
      fastShipping: 'Fast Shipping',
      shipping24: '24-48 Hours',
      easyReturns: 'Easy Returns',
      returnsFree: '30 Days Free',
      customerLove: 'CUSTOMER LOVE',
      reviews: '12,000+ Reviews',
      outOf5: 'out of 5',
    },
    // Featured Deal
    featured: {
      todayFeatured: "🎯 TODAY'S FEATURED",
      discount: 'Up to 40% OFF',
      professionalCameras: 'Professional Cameras',
    },
    // Auth
    auth: {
      welcome: 'Welcome to LENS',
      login: 'Login',
      signup: 'Sign Up',
      email: 'Email',
      password: 'Password',
      fullName: 'Full Name',
      phoneNumber: 'Phone Number',
      address: 'Address',
      city: 'City',
      state: 'State',
      pincode: 'Pincode',
      loggingIn: 'Logging in...',
      creatingAccount: 'Creating account...',
      selectLanguage: 'Select Your Preferred Language',
      selectLanguageDesc: 'Choose your preferred language to continue',
      continue: 'Continue',
      loggedInSuccessfully: 'Logged in successfully!',
      accountCreatedSuccessfully: 'Account created successfully! You can now login.',
    },
    // Orders
    orders: {
      myOrders: 'My Orders',
      loading: 'Loading...',
      noOrders: 'No orders yet.',
      pleaseLogin: 'Please login to view your orders.',
      orderNumber: 'Order Number',
      orderConfirmed: 'Order Confirmed',
      packagePicked: 'Package Picked',
      outForDelivery: 'Out for Delivery',
      almost: 'Almost There!',
      placedOn: 'Placed on',
      viewDetails: 'View Details',
      trackOrder: 'Track Order',
      requestReturn: 'Request Return',
      delivered: 'Delivered',
      processing: 'Processing',
      shipped: 'Shipped',
    },
    // Order Tracking
    orderTracking: {
      trackYourDelivery: 'Track Your Delivery',
      deliveryPartner: 'Delivery Partner',
      deliveryDetails: 'Delivery Details',
      distanceRemaining: 'Distance Remaining',
      estimatedDelivery: 'Estimated Delivery',
      lastUpdated: 'Last Updated',
      deliveryProgress: 'Delivery Progress',
      callDeliveryPartner: 'Call Delivery Partner',
      close: 'Close',
      awayLabel: 'away',
      free: 'Free',
      rating: 'Rating',
    },
    // Chatbot
    chatbot: {
      typeMessage: 'Type your message...',
      send: 'Send',
      voiceInput: 'Voice Input',
      clearChat: 'Clear Chat',
      advancedAssistant: 'Advanced Shopping Assistant',
      suggestions: [
        'Recommend best cameras for beginners',
        'Compare Canon vs Nikon',
        'Budget-friendly lenses under ₹10k',
        'How to track my order?'
      ],
      responses: {
        productRecommendation: 'I recommend checking out our premium cameras section. Based on customer ratings, our top picks are:',
        comparison: 'Let me compare these for you. Here are the key differences:',
        budget: 'I found some great budget options that offer excellent value:',
        specs: 'Here are the specifications you might be interested in:',
        orderTracking: 'You can track your order using the Track Order button on your Orders page.',
        deals: 'Check out our latest deals and promotions:',
      },
    },
    // Account
    account: {
      myAccount: 'My Account',
      profile: 'Profile',
      orders: 'Orders',
      wishlist: 'Wishlist',
      addresses: 'Addresses',
      paymentMethods: 'Payment Methods',
      settings: 'Settings',
      manageAddresses: 'Manage your addresses',
      managePayment: 'Manage your payment methods',
    },
    // Cart
    cart: {
      myCart: 'My Cart',
      emptyCart: 'Your cart is empty',
      continueShopping: 'Continue Shopping',
      proceedToCheckout: 'Proceed to Checkout',
      subtotal: 'Subtotal',
      shipping: 'Shipping',
      tax: 'Tax',
      total: 'Total',
      quantity: 'Quantity',
      price: 'Price',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      remove: 'Remove',
      yes: 'Yes',
      no: 'No',
      close: 'Close',
      back: 'Back',
      next: 'Next',
      search: 'Search',
      noResults: 'No results found',
    },
  },

  hi: {
    // Navigation
    nav: {
      home: 'होम',
      cameras: 'कैमरे',
      lenses: 'लेंस',
      accessories: 'एक्सेसरीज़',
      cart: 'कार्ट',
      search: 'खोज',
      account: 'खाता',
      logout: 'लॉगआउट',
      login: 'लॉगिन',
    },
    // Hero Section
    hero: {
      morningGreeting: '🌅 सुप्रभात',
      afternoonGreeting: '☀️ नमस्कार',
      eveningGreeting: '🌙 शुभ संध्या',
      morningHeadline: 'अपने दिन की सही शुरुआत करें',
      afternoonHeadline: 'सही प्रकाश आपका इंतजार कर रहा है',
      eveningHeadline: 'रात की जादू को पकड़ें',
      morningSubheading: 'सोने के घंटों को सही उपकरण से पकड़ें',
      afternoonSubheading: 'दोपहर फोटोग्राफी के लिए प्रमुख समय है',
      eveningSubheading: 'हमारे संग्रह के साथ रात की फोटोग्राफी में महारत हासिल करें',
      morningCta: 'सुबह की डील खरीदें',
      afternoonCta: 'अभी खोजें',
      eveningCta: 'रात की मोड की आवश्यकताएं',
      browseAll: 'सभी देखें',
      premiumEquipment: 'प्रीमियम उपकरण',
    },
    // Features
    features: {
      freeShipping: 'मुफ्त शिपिंग',
      freeShippingDesc: '₹4,999 से ऊपर के ऑर्डर पर',
      thirtyDayReturns: '30 दिन रिटर्न',
      thirtyDayReturnsDesc: 'परेशानी मुक्त रिटर्न',
      securePackaging: 'सुरक्षित पैकेजिंग',
      securePackagingDesc: 'सुरक्षित डिलीवरी की गारंटी',
      expertSupport: 'विशेषज्ञ समर्थन',
      expertSupportDesc: '24/7 फोटोग्राफी सलाह',
    },
    // Categories
    categories: {
      shopByCategory: 'श्रेणी के अनुसार खरीदारी करें',
      findPerfect: 'अपनी फोटोग्राफी यात्रा के लिए सही गियर खोजें',
      cameras: 'कैमरे',
      lenses: 'लेंस',
      bundles: 'बंडल',
      exploreCollection: 'संग्रह खोजें',
    },
    // Products
    products: {
      editorsPicks: 'संपादक की पसंद',
      handpicked: 'हमारे फोटोग्राफी विशेषज्ञों द्वारा अनुशंसित उत्पाद',
      viewAll: 'सभी उत्पाद देखें',
    },
    // CTA Section
    cta: {
      readyToStart: 'अपनी यात्रा शुरू करने के लिए तैयार हैं?',
      joinThousands: 'हजारों फोटोग्राफर हमारे ऊपर भरोसा करते हैं। विशेष डील और विशेषज्ञ सलाह प्राप्त करें।',
      shopNow: 'अभी खरीदें',
    },
    // Trust Indicators
    trust: {
      authentic: 'प्रामाणिक',
      verified: '100% सत्यापित',
      fastShipping: 'तेज़ शिपिंग',
      shipping24: '24-48 घंटे',
      easyReturns: 'आसान रिटर्न',
      returnsFree: '30 दिन मुफ्त',
      customerLove: 'ग्राहक प्रेम',
      reviews: '12,000+ समीक्षाएं',
      outOf5: 'में से 5',
    },
    // Featured Deal
    featured: {
      todayFeatured: "🎯 आज की विशेषता",
      discount: '40% तक छूट',
      professionalCameras: 'व्यावसायिक कैमरे',
    },
    // Auth
    auth: {
      welcome: 'LENS में स्वागत है',
      login: 'लॉगिन',
      signup: 'साइन अप',
      email: 'ईमेल',
      password: 'पासवर्ड',
      fullName: 'पूरा नाम',
      phoneNumber: 'फोन नंबर',
      address: 'पता',
      city: 'शहर',
      state: 'राज्य',
      pincode: 'पिन कोड',
      loggingIn: 'लॉगिन जारी है...',
      creatingAccount: 'खाता बना रहे हैं...',
      selectLanguage: 'अपनी पसंदीदा भाषा चुनें',
      selectLanguageDesc: 'जारी रखने के लिए अपनी पसंदीदा भाषा चुनें',
      continue: 'जारी रखें',
      loggedInSuccessfully: 'सफलतापूर्वक लॉगिन हो गए!',
      accountCreatedSuccessfully: 'खाता सफलतापूर्वक बनाया गया! अब आप लॉगिन कर सकते हैं।',
    },
    // Orders
    orders: {
      myOrders: 'मेरे ऑर्डर',
      loading: 'लोड हो रहा है...',
      noOrders: 'अभी कोई ऑर्डर नहीं।',
      pleaseLogin: 'अपने ऑर्डर देखने के लिए लॉगिन करें।',
      orderNumber: 'ऑर्डर नंबर',
      orderConfirmed: 'ऑर्डर की पुष्टि',
      packagePicked: 'पैकेज उठाया गया',
      outForDelivery: 'डिलीवरी के लिए बाहर',
      almost: 'लगभग वहां!',
      placedOn: 'पर रखा गया',
      viewDetails: 'विवरण देखें',
      trackOrder: 'ऑर्डर ट्रैक करें',
      requestReturn: 'रिटर्न का अनुरोध करें',
      delivered: 'डिलीवर हुआ',
      processing: 'प्रसंस्करण',
      shipped: 'भेज दिया गया',
    },
    // Order Tracking
    orderTracking: {
      trackYourDelivery: 'अपनी डिलीवरी ट्रैक करें',
      deliveryPartner: 'डिलीवरी पार्टनर',
      deliveryDetails: 'डिलीवरी विवरण',
      distanceRemaining: 'बाकी दूरी',
      estimatedDelivery: 'अनुमानित डिलीवरी',
      lastUpdated: 'आखिरी बार अपडेट किया गया',
      deliveryProgress: 'डिलीवरी प्रगति',
      callDeliveryPartner: 'डिलीवरी पार्टनर को कॉल करें',
      close: 'बंद करें',
      awayLabel: 'दूर',
      free: 'मुफ्त',
      rating: 'रेटिंग',
    },
    // Chatbot
    chatbot: {
      typeMessage: 'अपना संदेश टाइप करें...',
      send: 'भेजें',
      voiceInput: 'वॉयस इनपुट',
      clearChat: 'चैट साफ करें',
      advancedAssistant: 'उन्नत शॉपिंग सहायक',
      suggestions: [
        'शुरुआती लोगों के लिए सर्वश्रेष्ठ कैमरे',
        'कैनन बनाम निकॉन की तुलना',
        '₹10k के तहत बजट के अनुकूल लेंस',
        'मैं अपने ऑर्डर को कैसे ट्रैक करूं?'
      ],
      responses: {
        productRecommendation: 'मैं हमारे प्रीमियम कैमरा सेक्शन को देखने की सिफारिश करता हूं। ग्राहक रेटिंग के आधार पर, हमारे शीर्ष विकल्प हैं:',
        comparison: 'मुझे इसकी तुलना करने दें। यहां प्रमुख अंतर हैं:',
        budget: 'मुझे कुछ शानदार बजट विकल्प मिले जो उत्कृष्ट मूल्य प्रदान करते हैं:',
        specs: 'यहां विनिर्देश हैं जिनमें आप रुचि रख सकते हैं:',
        orderTracking: 'आप अपने ऑर्डर पृष्ठ पर ट्रैक ऑर्डर बटन का उपयोग करके अपने ऑर्डर को ट्रैक कर सकते हैं।',
        deals: 'हमारे नवीनतम डील और प्रचार देखें:',
      },
    },
    // Account
    account: {
      myAccount: 'मेरा खाता',
      profile: 'प्रोफाइल',
      orders: 'ऑर्डर',
      wishlist: 'विशलिस्ट',
      addresses: 'पते',
      paymentMethods: 'भुगतान विधियां',
      settings: 'सेटिंग्स',
      manageAddresses: 'अपने पते प्रबंधित करें',
      managePayment: 'अपनी भुगतान विधि प्रबंधित करें',
    },
    // Cart
    cart: {
      myCart: 'मेरी कार्ट',
      emptyCart: 'आपकी कार्ट खाली है',
      continueShopping: 'खरीदारी जारी रखें',
      proceedToCheckout: 'चेकआउट के लिए आगे बढ़ें',
      subtotal: 'उप कुल',
      shipping: 'शिपिंग',
      tax: 'कर',
      total: 'कुल',
      quantity: 'मात्रा',
      price: 'कीमत',
    },
    // Common
    common: {
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि',
      success: 'सफलता',
      cancel: 'रद्द करें',
      save: 'सहेजें',
      delete: 'हटाएं',
      edit: 'संपादित करें',
      add: 'जोड़ें',
      remove: 'हटाएं',
      yes: 'हां',
      no: 'नहीं',
      close: 'बंद करें',
      back: 'वापस',
      next: 'अगला',
      search: 'खोज',
      noResults: 'कोई परिणाम नहीं मिला',
    },
  },

  es: {
    nav: { home: 'Inicio', cameras: 'Cámaras', lenses: 'Lentes', accessories: 'Accesorios', cart: 'Carrito', search: 'Buscar', account: 'Cuenta', logout: 'Cerrar sesión', login: 'Iniciar sesión' },
    hero: { morningGreeting: '🌅 Buenos días', afternoonGreeting: '☀️ Buenas tardes', eveningGreeting: '🌙 Buenas noches', morningHeadline: 'Comienza tu día bien', afternoonHeadline: 'Luz perfecta te espera', eveningHeadline: 'Captura la magia nocturna', morningSubheading: 'Captura las horas doradas con equipo perfecto', afternoonSubheading: 'La tarde es el mejor momento para fotografía', eveningSubheading: 'Domina la fotografía nocturna con nuestra colección', morningCta: 'Comprar ofertas matutinas', afternoonCta: 'Explorar ahora', eveningCta: 'Esenciales del modo nocturno', browseAll: 'Ver todo', premiumEquipment: 'Equipo Premium' },
    features: { freeShipping: 'Envío gratuito', freeShippingDesc: 'En pedidos superiores a ₹4,999', thirtyDayReturns: 'Devoluciones de 30 días', thirtyDayReturnsDesc: 'Devoluciones sin complicaciones', securePackaging: 'Embalaje seguro', securePackagingDesc: 'Entrega garantizada segura', expertSupport: 'Soporte experto', expertSupportDesc: 'Asesoramiento fotográfico 24/7' },
    categories: { shopByCategory: 'Comprar por categoría', findPerfect: 'Encuentra el equipo perfecto para tu viaje fotográfico', cameras: 'Cámaras', lenses: 'Lentes', bundles: 'Paquetes', exploreCollection: 'Explorar colección' },
    products: { editorsPicks: 'Selección del editor', handpicked: 'Productos recomendados por nuestros expertos en fotografía', viewAll: 'Ver todos los productos' },
    cta: { readyToStart: '¿Listo para comenzar tu viaje?', joinThousands: 'Únete a miles de fotógrafos que confían en nosotros. Obtén ofertas exclusivas y asesoramiento experto.', shopNow: 'Comprar ahora' },
    trust: { authentic: 'Auténtico', verified: '100% Verificado', fastShipping: 'Envío rápido', shipping24: '24-48 horas', easyReturns: 'Devoluciones fáciles', returnsFree: '30 días gratis', customerLove: 'AMOR DEL CLIENTE', reviews: '12,000+ reseñas', outOf5: 'de 5' },
    featured: { todayFeatured: '🎯 DESTACADO DE HOY', discount: 'Hasta 40% DESCUENTO', professionalCameras: 'Cámaras profesionales' },
    auth: { welcome: 'Bienvenido a LENS', login: 'Iniciar sesión', signup: 'Registrarse', email: 'Correo electrónico', password: 'Contraseña', fullName: 'Nombre completo', phoneNumber: 'Número de teléfono', address: 'Dirección', city: 'Ciudad', state: 'Estado', pincode: 'Código postal', loggingIn: 'Iniciando sesión...', creatingAccount: 'Creando cuenta...', selectLanguage: 'Selecciona tu idioma preferido', selectLanguageDesc: 'Elige tu idioma preferido para continuar', continue: 'Continuar', loggedInSuccessfully: '¡Iniciaste sesión correctamente!', accountCreatedSuccessfully: '¡Cuenta creada correctamente! Ahora puedes iniciar sesión.' },
    orders: { myOrders: 'Mis pedidos', loading: 'Cargando...', noOrders: 'Sin pedidos aún.', pleaseLogin: 'Inicia sesión para ver tus pedidos.', orderNumber: 'Número de pedido', orderConfirmed: 'Pedido confirmado', packagePicked: 'Paquete recogido', outForDelivery: 'Fuera para entrega', almost: '¡Casi ahí!', placedOn: 'Realizado en', viewDetails: 'Ver detalles', trackOrder: 'Rastrear pedido', requestReturn: 'Solicitar devolución', delivered: 'Entregado', processing: 'Procesando', shipped: 'Enviado' },
    orderTracking: { trackYourDelivery: 'Rastrear tu entrega', deliveryPartner: 'Socio de entrega', deliveryDetails: 'Detalles de entrega', distanceRemaining: 'Distancia restante', estimatedDelivery: 'Entrega estimada', lastUpdated: 'Última actualización', deliveryProgress: 'Progreso de entrega', callDeliveryPartner: 'Llamar al socio de entrega', close: 'Cerrar', awayLabel: 'lejos', free: 'Gratis', rating: 'Calificación' },
    chatbot: { typeMessage: 'Escribe tu mensaje...', send: 'Enviar', voiceInput: 'Entrada de voz', clearChat: 'Limpiar chat', advancedAssistant: 'Asistente de compra avanzado', suggestions: ['Recomienda las mejores cámaras para principiantes', 'Comparar Canon vs Nikon', 'Lentes asequibles menos de ₹10k', '¿Cómo rastreo mi pedido?'], responses: { productRecommendation: 'Te recomiendo que consultes nuestra sección de cámaras premium. Según las calificaciones de los clientes, nuestros mejores son:', comparison: 'Déjame compararlos para ti. Aquí están las diferencias clave:', budget: 'Encontré algunas excelentes opciones económicas que ofrecen un valor excelente:', specs: 'Aquí están las especificaciones que te pueden interesar:', orderTracking: 'Puedes rastrear tu pedido usando el botón Rastrear pedido en tu página de Pedidos.', deals: 'Consulta nuestras ofertas y promociones más recientes:' } },
    account: { myAccount: 'Mi cuenta', profile: 'Perfil', orders: 'Pedidos', wishlist: 'Lista de deseos', addresses: 'Direcciones', paymentMethods: 'Métodos de pago', settings: 'Configuración', manageAddresses: 'Gestiona tus direcciones', managePayment: 'Gestiona tus métodos de pago' },
    cart: { myCart: 'Mi carrito', emptyCart: 'Tu carrito está vacío', continueShopping: 'Continuar comprando', proceedToCheckout: 'Proceder al pago', subtotal: 'Subtotal', shipping: 'Envío', tax: 'Impuesto', total: 'Total', quantity: 'Cantidad', price: 'Precio' },
    common: { loading: 'Cargando...', error: 'Error', success: 'Éxito', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar', add: 'Añadir', remove: 'Eliminar', yes: 'Sí', no: 'No', close: 'Cerrar', back: 'Atrás', next: 'Siguiente', search: 'Buscar', noResults: 'Sin resultados' },
  },

  fr: {
    nav: { home: 'Accueil', cameras: 'Caméras', lenses: 'Objectifs', accessories: 'Accessoires', cart: 'Panier', search: 'Rechercher', account: 'Compte', logout: 'Déconnexion', login: 'Connexion' },
    hero: { morningGreeting: '🌅 Bonjour', afternoonGreeting: '☀️ Bon après-midi', eveningGreeting: '🌙 Bonsoir', morningHeadline: 'Commencez votre journée', afternoonHeadline: 'La lumière parfaite vous attend', eveningHeadline: 'Capturez la magie nocturne', morningSubheading: 'Capturez les heures dorées avec l\'équipement parfait', afternoonSubheading: 'L\'après-midi est le meilleur moment pour la photographie', eveningSubheading: 'Maîtrisez la photographie nocturne avec notre collection', morningCta: 'Acheter les offres du matin', afternoonCta: 'Explorer maintenant', eveningCta: 'Essentiels du mode nuit', browseAll: 'Parcourir tout', premiumEquipment: 'Équipement Premium' },
    features: { freeShipping: 'Livraison gratuite', freeShippingDesc: 'Sur les commandes supérieures à ₹4 999', thirtyDayReturns: 'Retours de 30 jours', thirtyDayReturnsDesc: 'Retours sans problème', securePackaging: 'Emballage sécurisé', securePackagingDesc: 'Livraison garantie sûre', expertSupport: 'Support expert', expertSupportDesc: 'Conseils photographiques 24/7' },
    categories: { shopByCategory: 'Magasiner par catégorie', findPerfect: 'Trouvez l\'équipement parfait pour votre parcours photographique', cameras: 'Caméras', lenses: 'Objectifs', bundles: 'Forfaits', exploreCollection: 'Explorer la collection' },
    products: { editorsPicks: 'Sélection de l\'éditeur', handpicked: 'Produits recommandés par nos experts en photographie', viewAll: 'Voir tous les produits' },
    cta: { readyToStart: 'Prêt à commencer votre voyage?', joinThousands: 'Rejoignez des milliers de photographes qui nous font confiance. Obtenez des offres exclusives et des conseils d\'experts.', shopNow: 'Acheter maintenant' },
    trust: { authentic: 'Authentique', verified: '100% Vérifié', fastShipping: 'Livraison rapide', shipping24: '24-48 heures', easyReturns: 'Retours faciles', returnsFree: '30 jours gratuits', customerLove: 'AMOUR DES CLIENTS', reviews: '12 000+ avis', outOf5: 'sur 5' },
    featured: { todayFeatured: '🎯 VEDETTE DU JOUR', discount: 'Jusqu\'à 40% DE RÉDUCTION', professionalCameras: 'Caméras professionnelles' },
    auth: { welcome: 'Bienvenue chez LENS', login: 'Connexion', signup: 'S\'inscrire', email: 'Email', password: 'Mot de passe', fullName: 'Nom complet', phoneNumber: 'Numéro de téléphone', address: 'Adresse', city: 'Ville', state: 'État', pincode: 'Code postal', loggingIn: 'Connexion en cours...', creatingAccount: 'Création de compte...', selectLanguage: 'Sélectionnez votre langue préférée', selectLanguageDesc: 'Choisissez votre langue préférée pour continuer', continue: 'Continuer', loggedInSuccessfully: 'Connecté avec succès!', accountCreatedSuccessfully: 'Compte créé avec succès! Vous pouvez maintenant vous connecter.' },
    orders: { myOrders: 'Mes commandes', loading: 'Chargement...', noOrders: 'Pas encore de commandes.', pleaseLogin: 'Connectez-vous pour voir vos commandes.', orderNumber: 'Numéro de commande', orderConfirmed: 'Commande confirmée', packagePicked: 'Colis récupéré', outForDelivery: 'Sorti pour la livraison', almost: 'Presque là!', placedOn: 'Placé sur', viewDetails: 'Voir les détails', trackOrder: 'Suivi de la commande', requestReturn: 'Demander un retour', delivered: 'Livré', processing: 'Traitement', shipped: 'Expédié' },
    orderTracking: { trackYourDelivery: 'Suivre votre livraison', deliveryPartner: 'Partenaire de livraison', deliveryDetails: 'Détails de la livraison', distanceRemaining: 'Distance restante', estimatedDelivery: 'Livraison estimée', lastUpdated: 'Dernière mise à jour', deliveryProgress: 'Progrès de livraison', callDeliveryPartner: 'Appeler le partenaire de livraison', close: 'Fermer', awayLabel: 'loin', free: 'Gratuit', rating: 'Évaluation' },
    chatbot: { typeMessage: 'Tapez votre message...', send: 'Envoyer', voiceInput: 'Entrée vocale', clearChat: 'Effacer le chat', advancedAssistant: 'Assistant d\'achat avancé', suggestions: ['Recommander les meilleures caméras pour les débutants', 'Comparer Canon vs Nikon', 'Objectifs abordables moins de ₹10 000', 'Comment puis-je suivre ma commande?'], responses: { productRecommendation: 'Je vous recommande de consulter notre section de caméras premium. Selon les évaluations des clients, nos meilleurs choix sont:', comparison: 'Laissez-moi les comparer pour vous. Voici les différences clés:', budget: 'J\'ai trouvé d\'excellentes options abordables qui offrent un excellent rapport qualité-prix:', specs: 'Voici les spécifications qui pourraient vous intéresser:', orderTracking: 'Vous pouvez suivre votre commande en utilisant le bouton Suivre la commande sur votre page Commandes.', deals: 'Consultez nos dernières offres et promotions:' } },
    account: { myAccount: 'Mon compte', profile: 'Profil', orders: 'Commandes', wishlist: 'Liste de souhaits', addresses: 'Adresses', paymentMethods: 'Modes de paiement', settings: 'Paramètres', manageAddresses: 'Gérez vos adresses', managePayment: 'Gérez vos modes de paiement' },
    cart: { myCart: 'Mon panier', emptyCart: 'Votre panier est vide', continueShopping: 'Continuer les achats', proceedToCheckout: 'Procéder au paiement', subtotal: 'Sous-total', shipping: 'Livraison', tax: 'Impôt', total: 'Total', quantity: 'Quantité', price: 'Prix' },
    common: { loading: 'Chargement...', error: 'Erreur', success: 'Succès', cancel: 'Annuler', save: 'Enregistrer', delete: 'Supprimer', edit: 'Modifier', add: 'Ajouter', remove: 'Supprimer', yes: 'Oui', no: 'Non', close: 'Fermer', back: 'Retour', next: 'Suivant', search: 'Rechercher', noResults: 'Aucun résultat trouvé' },
  },

  de: {
    nav: { home: 'Startseite', cameras: 'Kameras', lenses: 'Objektive', accessories: 'Zubehör', cart: 'Warenkorb', search: 'Suchen', account: 'Konto', logout: 'Abmelden', login: 'Anmelden' },
    hero: { morningGreeting: '🌅 Guten Morgen', afternoonGreeting: '☀️ Guten Nachmittag', eveningGreeting: '🌙 Guten Abend', morningHeadline: 'Starten Sie richtig in den Tag', afternoonHeadline: 'Perfektes Licht wartet', eveningHeadline: 'Fangen Sie die Nachtmagie ein', morningSubheading: 'Erfassen Sie die goldenen Stunden mit perfekter Ausrüstung', afternoonSubheading: 'Der Nachmittag ist die beste Zeit für Fotografie', eveningSubheading: 'Beherrschen Sie die Nachfotografie mit unserer Kollektion', morningCta: 'Morgentliche Angebote kaufen', afternoonCta: 'Jetzt erkunden', eveningCta: 'Nachtmodus-Essentials', browseAll: 'Alles durchsuchen', premiumEquipment: 'Premium-Ausrüstung' },
    features: { freeShipping: 'Versandkostenfrei', freeShippingDesc: 'Bei Bestellungen über ₹4.999', thirtyDayReturns: '30-Tage Rückgabe', thirtyDayReturnsDesc: 'Problemlose Rückgabe', securePackaging: 'Sichere Verpackung', securePackagingDesc: 'Sichere Lieferung garantiert', expertSupport: 'Expertensupport', expertSupportDesc: '24/7 Fotografie-Beratung' },
    categories: { shopByCategory: 'Nach Kategorie kaufen', findPerfect: 'Finden Sie die perfekte Ausrüstung für Ihre Fotografie-Reise', cameras: 'Kameras', lenses: 'Objektive', bundles: 'Pakete', exploreCollection: 'Kollektion erkunden' },
    products: { editorsPicks: 'Redaktionsauswahl', handpicked: 'Von unseren Fotografieexperten empfohlene Produkte', viewAll: 'Alle Produkte anzeigen' },
    cta: { readyToStart: 'Bereit zu starten?', joinThousands: 'Treten Sie tausenden Fotografen bei, die uns vertrauen. Erhalten Sie exklusive Angebote und Expertenrat.', shopNow: 'Jetzt kaufen' },
    trust: { authentic: 'Authentisch', verified: '100% Verifiziert', fastShipping: 'Schneller Versand', shipping24: '24-48 Stunden', easyReturns: 'Einfache Rückgabe', returnsFree: '30 Tage kostenlos', customerLove: 'KUNDENLIEBE', reviews: '12.000+ Bewertungen', outOf5: 'von 5' },
    featured: { todayFeatured: '🎯 HEUTE BESONDERS', discount: 'Bis zu 40% RABATT', professionalCameras: 'Berufskameras' },
    auth: { welcome: 'Willkommen bei LENS', login: 'Anmelden', signup: 'Registrieren', email: 'E-Mail', password: 'Passwort', fullName: 'Vollständiger Name', phoneNumber: 'Telefonnummer', address: 'Adresse', city: 'Stadt', state: 'Bundesland', pincode: 'Postleitzahl', loggingIn: 'Wird angemeldet...', creatingAccount: 'Konto wird erstellt...', selectLanguage: 'Wählen Sie Ihre bevorzugte Sprache', selectLanguageDesc: 'Wählen Sie Ihre bevorzugte Sprache zum Fortfahren', continue: 'Fortfahren', loggedInSuccessfully: 'Erfolgreich angemeldet!', accountCreatedSuccessfully: 'Konto erfolgreich erstellt! Sie können sich jetzt anmelden.' },
    orders: { myOrders: 'Meine Bestellungen', loading: 'Wird geladen...', noOrders: 'Noch keine Bestellungen.', pleaseLogin: 'Melden Sie sich an, um Ihre Bestellungen anzuzeigen.', orderNumber: 'Bestellnummer', orderConfirmed: 'Bestellung bestätigt', packagePicked: 'Paket abgeholt', outForDelivery: 'Zur Zustellung unterwegs', almost: 'Fast da!', placedOn: 'Platziert am', viewDetails: 'Details anzeigen', trackOrder: 'Bestellung verfolgen', requestReturn: 'Rückgabe anfordern', delivered: 'Geliefert', processing: 'Wird verarbeitet', shipped: 'Versendet' },
    orderTracking: { trackYourDelivery: 'Verfolgung Ihrer Lieferung', deliveryPartner: 'Lieferpartner', deliveryDetails: 'Lieferdetails', distanceRemaining: 'Verbleibende Entfernung', estimatedDelivery: 'Geschätzte Lieferung', lastUpdated: 'Zuletzt aktualisiert', deliveryProgress: 'Lieferfortschritt', callDeliveryPartner: 'Lieferpartner anrufen', close: 'Schließen', awayLabel: 'entfernt', free: 'Kostenlos', rating: 'Bewertung' },
    chatbot: { typeMessage: 'Geben Sie Ihre Nachricht ein...', send: 'Senden', voiceInput: 'Spracheingabe', clearChat: 'Chat löschen', advancedAssistant: 'Erweiterter Einkaufsassistent', suggestions: ['Empfehlen Sie die besten Kameras für Anfänger', 'Canon vs Nikon vergleichen', 'Erschwingliche Objektive unter ₹10.000', 'Wie verfolge ich meine Bestellung?'], responses: { productRecommendation: 'Ich empfehle Ihnen, unseren Premium-Kamerabereich zu erkunden. Nach Kundenbewertungen sind unsere Top-Picks:', comparison: 'Lassen Sie mich diese für Sie vergleichen. Hier sind die wichtigsten Unterschiede:', budget: 'Ich habe einige großartige Budgetoptionen gefunden, die hervorragendes Preis-Leistungs-Verhältnis bieten:', specs: 'Hier sind die Spezifikationen, die Sie interessieren könnten:', orderTracking: 'Sie können Ihre Bestellung mit der Schaltfläche "Bestellung verfolgen" auf Ihrer Bestellungsseite verfolgen.', deals: 'Sehen Sie sich unsere neuesten Angebote und Promotionen an:' } },
    account: { myAccount: 'Mein Konto', profile: 'Profil', orders: 'Bestellungen', wishlist: 'Wunschliste', addresses: 'Adressen', paymentMethods: 'Zahlungsmethoden', settings: 'Einstellungen', manageAddresses: 'Verwalten Sie Ihre Adressen', managePayment: 'Verwalten Sie Ihre Zahlungsmethoden' },
    cart: { myCart: 'Mein Warenkorb', emptyCart: 'Ihr Warenkorb ist leer', continueShopping: 'Mit Einkaufen fortfahren', proceedToCheckout: 'Zur Kasse gehen', subtotal: 'Zwischensumme', shipping: 'Versand', tax: 'Steuern', total: 'Gesamt', quantity: 'Menge', price: 'Preis' },
    common: { loading: 'Wird geladen...', error: 'Fehler', success: 'Erfolg', cancel: 'Abbrechen', save: 'Speichern', delete: 'Löschen', edit: 'Bearbeiten', add: 'Hinzufügen', remove: 'Entfernen', yes: 'Ja', no: 'Nein', close: 'Schließen', back: 'Zurück', next: 'Weiter', search: 'Suchen', noResults: 'Keine Ergebnisse gefunden' },
  },

  zh: {
    nav: { home: '首页', cameras: '相机', lenses: '镜头', accessories: '配件', cart: '购物车', search: '搜索', account: '账户', logout: '退出', login: '登录' },
    hero: { morningGreeting: '🌅 早上好', afternoonGreeting: '☀️ 下午好', eveningGreeting: '🌙 晚上好', morningHeadline: '开启美好一天', afternoonHeadline: '完美光线等待', eveningHeadline: '捕捉夜晚魔法', morningSubheading: '用完美的设备捕捉黄金时段', afternoonSubheading: '下午是摄影的最佳时间', eveningSubheading: '用我们的系列掌握夜间摄影', morningCta: '购买早间优惠', afternoonCta: '立即探索', eveningCta: '夜间模式必备', browseAll: '浏览全部', premiumEquipment: '高级设备' },
    features: { freeShipping: '免费送货', freeShippingDesc: '订单满₹4,999', thirtyDayReturns: '30天退货', thirtyDayReturnsDesc: '轻松退货', securePackaging: '安全包装', securePackagingDesc: '安全送达保障', expertSupport: '专家支持', expertSupportDesc: '24/7摄影建议' },
    categories: { shopByCategory: '按类别购物', findPerfect: '为您的摄影之旅找到完美的设备', cameras: '相机', lenses: '镜头', bundles: '套装', exploreCollection: '浏览系列' },
    products: { editorsPicks: '编辑推荐', handpicked: '由我们的摄影专家精心推荐的产品', viewAll: '查看所有产品' },
    cta: { readyToStart: '准备开始您的旅程?', joinThousands: '加入数千名信任我们的摄影师。获取独家交易和专家建议。', shopNow: '立即购物' },
    trust: { authentic: '真品', verified: '100%验证', fastShipping: '快速送货', shipping24: '24-48小时', easyReturns: '轻松退货', returnsFree: '免费30天', customerLove: '客户热爱', reviews: '12000+评论', outOf5: '满分5分' },
    featured: { todayFeatured: '🎯今日特色', discount: '优惠至40%', professionalCameras: '专业相机' },
    auth: { welcome: '欢迎使用LENS', login: '登录', signup: '注册', email: '电子邮件', password: '密码', fullName: '全名', phoneNumber: '电话号码', address: '地址', city: '城市', state: '州', pincode: '邮编', loggingIn: '正在登录...', creatingAccount: '正在创建账户...', selectLanguage: '选择您的首选语言', selectLanguageDesc: '选择您的首选语言以继续', continue: '继续', loggedInSuccessfully: '登录成功!', accountCreatedSuccessfully: '账户创建成功!您现在可以登录。' },
    orders: { myOrders: '我的订单', loading: '加载中...', noOrders: '还没有订单。', pleaseLogin: '请登录以查看您的订单。', orderNumber: '订单号', orderConfirmed: '订单已确认', packagePicked: '已取货', outForDelivery: '配送中', almost: '即将到达!', placedOn: '下单时间', viewDetails: '查看详情', trackOrder: '追踪订单', requestReturn: '申请退货', delivered: '已送达', processing: '处理中', shipped: '已发货' },
    orderTracking: { trackYourDelivery: '追踪您的送货', deliveryPartner: '配送员', deliveryDetails: '送货详情', distanceRemaining: '剩余距离', estimatedDelivery: '预计送达', lastUpdated: '最后更新', deliveryProgress: '送货进度', callDeliveryPartner: '拨打配送员', close: '关闭', awayLabel: '远', free: '免费', rating: '评分' },
    chatbot: { typeMessage: '输入您的信息...', send: '发送', voiceInput: '语音输入', clearChat: '清除聊天', advancedAssistant: '高级购物助手', suggestions: ['推荐初学者最佳相机', '佳能vs尼康对比', '₹10000以下的经济型镜头', '如何追踪我的订单?'], responses: { productRecommendation: '我建议查看我们的高级相机部分。根据客户评分,我们的精选是:', comparison: '让我为您对比。这是主要差异:', budget: '我找到了一些出色的预算选项,提供极佳的价值:', specs: '以下是您可能感兴趣的规格:', orderTracking: '您可以使用订单页面上的追踪订单按钮来追踪您的订单。', deals: '查看我们的最新优惠和促销:' } },
    account: { myAccount: '我的账户', profile: '个人资料', orders: '订单', wishlist: '心愿单', addresses: '地址', paymentMethods: '支付方式', settings: '设置', manageAddresses: '管理您的地址', managePayment: '管理您的支付方式' },
    cart: { myCart: '我的购物车', emptyCart: '您的购物车为空', continueShopping: '继续购物', proceedToCheckout: '继续结账', subtotal: '小计', shipping: '运费', tax: '税费', total: '总计', quantity: '数量', price: '价格' },
    common: { loading: '加载中...', error: '错误', success: '成功', cancel: '取消', save: '保存', delete: '删除', edit: '编辑', add: '添加', remove: '移除', yes: '是', no: '否', close: '关闭', back: '返回', next: '下一步', search: '搜索', noResults: '未找到结果' },
  },
};

export function getTranslation(language: Language): Record<string, any> {
  return translations[language] || translations.en;
}

export function t(language: Language, path: string, defaultValue?: string): string {
  const trans = translations[language] || translations.en;
  const keys = path.split('.');
  let value: any = trans;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue || path;
    }
  }

  return typeof value === 'string' ? value : defaultValue || path;
}
