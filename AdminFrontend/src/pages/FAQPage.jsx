import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  HelpCircle,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Input } from '@/components/ui/Primitives';
import { Badge } from '@/components/ui/Primitives';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/Interactive';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/Layout';
import { toast } from 'sonner';
import {
  fetchAllFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  reorderFaqs,
} from '@/services/faqService';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);

  // Fetch FAQs on mount
  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      setLoading(true);
      const data = await fetchAllFaqs();
      setFaqs(data);
    } catch (error) {
      toast.error('Failed to load FAQs: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Open form for new FAQ
  const handleAddNew = () => {
    setSelectedFaq(null);
    setFormData({
      question: '',
      answer: '',
      isActive: true,
    });
    setIsFormOpen(true);
  };

  // Open form for editing
  const handleEdit = (faq) => {
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      isActive: faq.isActive,
    });
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Please fill in both question and answer');
      return;
    }

    setSubmitting(true);
    try {
      if (selectedFaq) {
        // Update existing FAQ
        const updated = await updateFaq(selectedFaq._id, formData);
        setFaqs(faqs.map((f) => (f._id === updated._id ? updated : f)));
        toast.success('FAQ updated successfully');
      } else {
        // Create new FAQ
        const created = await createFaq(formData);
        setFaqs([...faqs, created]);
        toast.success('FAQ created successfully');
      }
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle FAQ active status
  const handleToggleActive = async (faq) => {
    try {
      const updated = await updateFaq(faq._id, { isActive: !faq.isActive });
      setFaqs(faqs.map((f) => (f._id === updated._id ? updated : f)));
      toast.success(updated.isActive ? 'FAQ activated' : 'FAQ deactivated');
    } catch (error) {
      toast.error('Failed to update FAQ: ' + error.message);
    }
  };

  // Delete FAQ
  const handleDelete = async () => {
    if (!selectedFaq) return;

    try {
      await deleteFaq(selectedFaq._id);
      setFaqs(faqs.filter((f) => f._id !== selectedFaq._id));
      toast.success('FAQ deleted successfully');
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
    } catch (error) {
      toast.error('Failed to delete FAQ: ' + error.message);
    }
  };

  // Move FAQ up in order
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    
    const newFaqs = [...faqs];
    [newFaqs[index - 1], newFaqs[index]] = [newFaqs[index], newFaqs[index - 1]];
    setFaqs(newFaqs);
    
    try {
      await reorderFaqs(newFaqs.map((f) => f._id));
    } catch (error) {
      toast.error('Failed to reorder FAQs');
      loadFaqs(); // Reload to restore original order
    }
  };

  // Move FAQ down in order
  const handleMoveDown = async (index) => {
    if (index === faqs.length - 1) return;
    
    const newFaqs = [...faqs];
    [newFaqs[index], newFaqs[index + 1]] = [newFaqs[index + 1], newFaqs[index]];
    setFaqs(newFaqs);
    
    try {
      await reorderFaqs(newFaqs.map((f) => f._id));
    } catch (error) {
      toast.error('Failed to reorder FAQs');
      loadFaqs(); // Reload to restore original order
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">FAQs</h1>
          <p className="text-muted-foreground mt-1">Manage frequently asked questions</p>
        </div>
        
        <Button 
          onClick={handleAddNew}
          className="bg-gradient-primary hover:opacity-90 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Badge className="bg-primary/15 text-primary px-3 py-2 self-start">
          {faqs.length} Total FAQs
        </Badge>
      </motion.div>

      {/* FAQ List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchQuery ? 'No FAQs match your search' : 'No FAQs yet. Add your first FAQ!'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-all duration-300 ${
                !faq.isActive ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/15">
                      <HelpCircle className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{faq.question}</h3>
                    </div>
                    {!faq.isActive && (
                      <Badge className="bg-muted text-muted-foreground">Inactive</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 ml-11">
                    {faq.answer}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {/* Reorder buttons */}
                  <div className="flex flex-col">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleMoveUp(faqs.indexOf(faq))}
                      disabled={faqs.indexOf(faq) === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleMoveDown(faqs.indexOf(faq))}
                      disabled={faqs.indexOf(faq) === faqs.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleEdit(faq)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="cursor-pointer"
                        onClick={() => handleToggleActive(faq)}
                      >
                        {faq.isActive ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="cursor-pointer text-destructive focus:text-destructive"
                        onClick={() => {
                          setSelectedFaq(faq);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add/Edit FAQ Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {selectedFaq ? 'Edit FAQ' : 'Add New FAQ'}
            </DialogTitle>
            <DialogDescription>
              {selectedFaq ? 'Update the FAQ details below' : 'Fill in the details for the new FAQ'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Question *
              </label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter the question..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Answer *
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Enter the answer..."
                className="w-full px-3 py-2 rounded-lg bg-background border border-input focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                rows={4}
                required
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded border-border"
              />
              <label htmlFor="isActive" className="text-sm text-foreground">
                Active (visible to users)
              </label>
            </div>
            
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-primary hover:opacity-90 text-white"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : selectedFaq ? 'Update FAQ' : 'Create FAQ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-destructive">
              Delete FAQ
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFaq && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-medium text-foreground">{selectedFaq.question}</p>
            </div>
          )}
          
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
