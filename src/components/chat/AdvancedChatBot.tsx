import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Mic, MicOff, Loader2, Lightbulb, RotateCcw, Heart, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProductsStore } from '@/store/productsStore';
import { useCartStore } from '@/store/cartStore';
import { generateTextContent } from '@/lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  suggestions?: string[];
}

export const AdvancedChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Welcome! I\'m your AI shopping assistant. I can help you with:\n\n🛍️ **Product Info** - Ask about cameras, lenses, or accessories\n🔍 **Recommendations** - "Best camera for beginners"\n📦 **Orders** - Track deliveries and order status\n💰 **Deals** - Find discounts and special offers\n🤔 **Comparisons** - Compare products side-by-side\n\nWhat can I help you with?',
      timestamp: new Date(),
      suggestions: [
        '📷 Best budget cameras',
        '🆚 Compare Canon vs Nikon',
        '💡 For beginner photographers',
        '🎁 Current deals'
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const products = useProductsStore((s) => s.products);
  const addToCart = useCartStore((s) => s.addToCart);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Voice recognition error');
      };
    }
  }, []);

  // Advanced AI chat handler
  const handleAIResponse = async (userMessage: string) => {
    setIsLoading(true);
    setShowSuggestions(false);

    try {
      // Detect query type and provide contextual responses
      const queryLower = userMessage.toLowerCase();
      let response = '';
      let suggestions: string[] = [];

      // Product recommendations
      if (queryLower.includes('best') || queryLower.includes('recommend') || queryLower.includes('suggest')) {
        const bestProducts = products.slice(0, 3);
        response = `Here are my top recommendations:\n\n${bestProducts.map(p => `📷 **${p.name}** - ₹${p.price.toLocaleString()}\n${p.description}`).join('\n\n')}`;
        suggestions = ['View all cameras', 'Compare these', 'Add to cart'];
      }
      // Price comparisons
      else if (queryLower.includes('compare') || queryLower.includes('vs')) {
        const brands = [...new Set(products.map(p => p.brand))];
        response = `I can help you compare!\n\nAvailable brands: ${brands.join(', ')}\n\nWhat would you like to compare?`;
        suggestions = brands.slice(0, 4);
      }
      // Budget queries
      else if (queryLower.includes('budget') || queryLower.includes('cheap') || queryLower.includes('affordable')) {
        const budgetProducts = products.sort((a, b) => a.price - b.price).slice(0, 3);
        response = `Great options within budget:\n\n${budgetProducts.map(p => `💰 **${p.name}** - ₹${p.price.toLocaleString()}`).join('\n')}`;
        suggestions = ['View all budget options', 'Read reviews', 'Add to cart'];
      }
      // Specifications/features
      else if (queryLower.includes('spec') || queryLower.includes('feature') || queryLower.includes('megapixel')) {
        response = `I can help you find products with specific features!\n\nTell me more about what you need (e.g., "4K video", "weather sealed", "fast autofocus")`;
        suggestions = ['4K video cameras', 'Professional lenses', 'Weather sealed', 'Macro lenses'];
      }
      // Order tracking
      else if (queryLower.includes('order') || queryLower.includes('track') || queryLower.includes('delivery')) {
        response = `To track your order, please go to your account page. I can help you navigate there!\n\n📍 You can also check:\n- Order status\n- Estimated delivery\n- Tracking number\n- Delivery partner details`;
        suggestions = ['Go to orders', 'Contact support', 'Return an item', 'Track with map'];
      }
      // Deals and promotions
      else if (queryLower.includes('deal') || queryLower.includes('discount') || queryLower.includes('sale') || queryLower.includes('promo')) {
        response = `🎉 Current promotions available!\n\n✨ Featured Deals:\n- Up to 30% off professional cameras\n- Free shipping on orders over ₹5000\n- Cashback on selected lenses\n\nWould you like to see today's best deals?`;
        suggestions = ['Show deals', 'My wishlist', 'Add to cart', 'View recommendations'];
      }
      // Wishlist
      else if (queryLower.includes('wishlist') || queryLower.includes('save') || queryLower.includes('favorite')) {
        response = `💖 Let me help you save items!\n\nYou can:\n- Add items to your wishlist by clicking the heart icon\n- View all saved items in your account\n- Get notified when prices drop\n- Share wishlists with friends`;
        suggestions = ['Go to wishlist', 'Add current product', 'Share list', 'Set price alerts'];
      }
      // General fallback with Gemini
      else {
        try {
          const prompt = `You are a helpful e-commerce assistant for a camera shop. Answer this customer query helpfully and concisely (max 3 sentences). Query: "${userMessage}"`;
          response = await generateTextContent(prompt);
          suggestions = ['Tell me more', 'Show products', 'Visit shop', 'Need help?'];
        } catch (error) {
          response = `I understand you're asking about "${userMessage}". Could you provide more details or try one of these:\n- Ask about specific products\n- Request recommendations\n- Check order status\n- Look for deals`;
          suggestions = ['Product search', 'Recommendations', 'Orders', 'Support'];
        }
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        suggestions
      }]);

    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to process your message');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }]);
    setInput('');

    await handleAIResponse(userMessage);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'user', content: suggestion, timestamp: new Date() }]);
      handleAIResponse(suggestion);
    }, 100);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
      toast.info('Listening...');
    }
  };

  const handleClearChat = () => {
    setMessages([{
      role: 'assistant',
      content: '👋 Welcome! I\'m your AI shopping assistant. I can help you with:\n\n🛍️ **Product Info** - Ask about cameras, lenses, or accessories\n🔍 **Recommendations** - "Best camera for beginners"\n📦 **Orders** - Track deliveries and order status\n💰 **Deals** - Find discounts and special offers\n🤔 **Comparisons** - Compare products side-by-side\n\nWhat can I help you with?',
      timestamp: new Date(),
      suggestions: [
        '📷 Best budget cameras',
        '🆚 Compare Canon vs Nikon',
        '💡 For beginner photographers',
        '🎁 Current deals'
      ]
    }]);
    setShowSuggestions(true);
    toast.success('Chat cleared!');
  };

  const formatMessageContent = (content: string) => {
    // Convert markdown-like formatting to better display
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <strong key={idx} className="font-semibold">{line.replace(/\*\*/g, '')}</strong>;
      }
      if (line.startsWith('- ')) {
        return <li key={idx} className="ml-4">• {line.substring(2)}</li>;
      }
      return <div key={idx}>{line}</div>;
    });
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-h-[600px]"
          >
            <Card className="flex flex-col h-full shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-lg">
                <div className="flex items-center gap-2">
                  <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                    <Lightbulb className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <h3 className="font-semibold text-sm">AI Shopping Assistant</h3>
                    <p className="text-xs opacity-90">Always here to help</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleClearChat}
                    className="h-8 w-8 hover:bg-primary-foreground/20"
                    title="Clear chat"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="h-8 w-8 hover:bg-primary-foreground/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.map((message, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground p-3'
                            : 'bg-muted/50 border border-border p-3'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">
                          {message.role === 'assistant' ? formatMessageContent(message.content) : message.content}
                        </p>

                        {/* Suggestions for assistant messages */}
                        {message.role === 'assistant' && message.suggestions && idx === messages.length - 1 && (
                          <div className="flex flex-wrap gap-2 mt-3 pt-2 border-t border-border/50">
                            {message.suggestions.map((suggestion, sidx) => (
                              <Button
                                key={sidx}
                                size="sm"
                                variant="outline"
                                className="text-xs h-auto py-1 px-2"
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Timestamp */}
                        <p className="text-xs opacity-60 mt-1">
                          {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-muted/50 border border-border p-3 rounded-lg">
                        <div className="flex gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
                          <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask me anything about products, deals, orders..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    variant={isListening ? 'destructive' : 'outline'}
                    onClick={toggleListening}
                    disabled={isLoading}
                    className="h-10 w-10"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" onClick={handleSend} disabled={isLoading} className="h-10 w-10">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">💡 Tip: Use voice input for hands-free shopping!</p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-primary to-primary/80"
          onClick={() => setIsOpen(!isOpen)}
          title="AI Shopping Assistant"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </motion.div>
    </>
  );
};
