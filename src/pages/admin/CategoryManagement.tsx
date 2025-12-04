import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCategoriesStore, type Category } from '@/store/categoriesStore';
import { EmojiPicker } from '@/components/ui/EmojiPicker';
import { motion } from 'framer-motion';

export default function AdminCategoriesManagement() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategoriesStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    icon: '📷',
    color: '#3B82F6',
    description: '',
  });

  const resetForm = () => {
    setForm({
      name: '',
      slug: '',
      icon: '📷',
      color: '#3B82F6',
      description: '',
    });
    setEditingCategory(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');
  };

  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      color: category.color,
      description: category.description || '',
    });
    setIsDialogOpen(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setForm({
      ...form,
      name,
      slug: generateSlug(name),
    });
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Please fill in name and slug');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      if (editingCategory) {
        updateCategory(editingCategory.id, {
          name: form.name,
          slug: form.slug,
          icon: form.icon,
          color: form.color,
          description: form.description,
        });
        toast.success('Category updated successfully');
      } else {
        addCategory({
          name: form.name,
          slug: form.slug,
          icon: form.icon,
          color: form.color,
          description: form.description,
        });
        toast.success('Category created successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Failed to save category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteCategory(id);
      toast.success('Category deleted');
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground mt-2">Manage your product categories with custom icons and colors</p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-all h-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className="text-4xl rounded-lg p-2"
                      style={{ backgroundColor: category.color + '20' }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">/{category.slug}</p>
                    </div>
                  </div>
                  <Badge variant="outline" style={{ borderColor: category.color, color: category.color }}>
                    {category.icon}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 gap-2"
                    onClick={() => openEditDialog(category)}
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(category.id, category.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Emoji Picker */}
            <div>
              <Label className="text-sm mb-2 block">Category Icon</Label>
              <EmojiPicker
                value={form.icon}
                onChange={(emoji) => setForm({ ...form, icon: emoji })}
              />
            </div>

            {/* Category Name */}
            <div>
              <Label htmlFor="name" className="text-sm mb-2 block">Category Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Professional Cameras"
                value={form.name}
                onChange={handleNameChange}
                disabled={isLoading}
              />
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="text-sm mb-2 block">URL Slug *</Label>
              <Input
                id="slug"
                placeholder="e.g., professional-cameras"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                disabled={isLoading}
              />
            </div>

            {/* Color Picker */}
            <div>
              <Label htmlFor="color" className="text-sm mb-2 block">Color Theme</Label>
              <div className="flex gap-2 items-end">
                <Input
                  id="color"
                  type="color"
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  disabled={isLoading}
                  className="h-10 w-20 cursor-pointer"
                />
                <span
                  className="text-xs font-mono px-3 py-2 rounded bg-muted flex-1"
                >
                  {form.color}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm mb-2 block">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this category..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                disabled={isLoading}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="gap-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
