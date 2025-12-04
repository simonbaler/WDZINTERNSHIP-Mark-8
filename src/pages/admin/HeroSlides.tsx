import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useHeroSlidesStore, type HeroSlide } from '@/store/heroSlidesStore';
import { toast } from 'sonner';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminHeroSlides() {
  const { slides, addSlide, updateSlide, deleteSlide } = useHeroSlidesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    accent: 'accent' as HeroSlide['accent'],
  });

  const openAdd = () => {
    setEditing(null);
    setForm({ title: '', description: '', image: '', accent: 'accent' });
    setIsDialogOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({ title: slide.title, description: slide.description, image: slide.image, accent: slide.accent });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.image) {
      toast.error('Title and image are required');
      return;
    }
    if (editing) {
      updateSlide(editing.id, { ...form });
      toast.success('Slide updated');
    } else {
      const created = addSlide({ ...form });
      toast.success('Slide added');
      setEditing(created);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSlide(id);
    toast.success('Slide deleted');
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Hero Slides</h1>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Slide
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Slides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {slides.map((slide) => (
              <div key={slide.id} className="border rounded-lg overflow-hidden">
                <div className="aspect-video bg-muted">
                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{slide.title}</p>
                      <p className="text-xs text-muted-foreground">{slide.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(slide)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(slide.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {slides.length === 0 && (
              <p className="text-sm text-muted-foreground">No slides configured</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Slide' : 'Add Slide'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </div>
            <div>
              <Label>Accent</Label>
              <Select value={form.accent || 'accent'} onValueChange={(v) => setForm({ ...form, accent: v as HeroSlide['accent'] })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pick accent" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accent">accent</SelectItem>
                  <SelectItem value="primary">primary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

