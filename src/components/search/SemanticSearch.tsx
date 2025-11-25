import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function SemanticSearch() {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('search-semantic', {
        body: { query, limit: 20 },
      });

      if (error) throw error;

      // Navigate to search results page with results
      navigate('/search', { 
        state: { 
          results: data.results, 
          query,
          searchType: 'semantic' 
        } 
      });
    } catch (error) {
      toast.error('Search failed');
      console.error(error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
      <Input
        placeholder="Search for cameras, lenses, or describe what you need..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        disabled={searching}
        className="flex-1"
      />
      <Button type="submit" disabled={searching || !query.trim()}>
        {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
    </form>
  );
}
