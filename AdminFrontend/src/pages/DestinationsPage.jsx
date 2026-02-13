import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button, Input, Badge, Separator } from '@/components/ui/Primitives';
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
  DialogTrigger,
} from '@/components/ui/Layout';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/Layout';
import { DestinationForm } from '@/components/admin/forms/DestinationForm';
import { fetchAllDestinations, deleteDestination } from '@/services/destinationService';

export default function DestinationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Data fetching states
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for View and Edit dialogs
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch destinations from API
  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchAllDestinations();
      setDestinations(data);
    } catch (err) {
      console.error('Error loading destinations:', err);
      setError(err.message || 'Failed to load destinations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const filteredDestinations = destinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleView = (dest) => {
    setSelectedDestination(dest);
    setIsViewOpen(true);
  };

  const handleEdit = (dest) => {
    setSelectedDestination(dest);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (dest) => {
    setDeleteTarget(dest);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    
    try {
      setIsDeleting(true);
      await deleteDestination(deleteTarget._id, true); // Hard delete
      setDestinations(destinations.filter(d => d._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error('Error deleting destination:', err);
      setError(err.message || 'Failed to delete destination');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormSuccess = () => {
    loadDestinations(); // Refresh after create/update
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading destinations...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && destinations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={loadDestinations} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">Destinations</h1>
          <p className="text-muted-foreground mt-1">Manage travel destinations</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary hover:opacity-90 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Destination
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Add New Destination</DialogTitle>
              <DialogDescription>Create a new travel destination</DialogDescription>
            </DialogHeader>
            <DestinationForm onClose={() => setIsFormOpen(false)} onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Error banner (for non-critical errors) */}
      {error && destinations.length > 0 && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 flex items-center justify-between">
          <span>{error}</span>
          <Button size="sm" variant="ghost" onClick={() => setError(null)}>Dismiss</Button>
        </div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      {/* Destinations Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredDestinations.map((dest, index) => (
          <motion.div
            key={dest._id || dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-card rounded-xl border border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 group"
          >
            {/* Image */}
            <div className="relative h-48 bg-muted overflow-hidden">
              <img
                src={dest.image || '/placeholder.svg'}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-semibold text-white font-display text-xl">{dest.name}</h3>
                {dest.bestTime && (
                  <p className="text-white/80 text-sm mt-1">Best: {dest.bestTime}</p>
                )}
              </div>
              <div className="absolute top-3 right-3 flex gap-2">
                <Badge className={dest.isActive ? 'bg-primary/90 text-white' : 'bg-muted text-muted-foreground'}>
                  {dest.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="absolute top-3 left-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="secondary" className="h-8 w-8 bg-white shadow-md hover:bg-gray-100">
                      <MoreVertical className="h-4 w-4 text-gray-700" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleView(dest)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => handleEdit(dest)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => handleDeleteClick(dest)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{dest.description}</p>
              
              {dest.mustVisit && dest.mustVisit.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {dest.mustVisit.slice(0, 3).map((place) => (
                    <Badge key={place} variant="outline" className="text-xs">
                      <MapPin className="h-3 w-3 mr-1" />
                      {place}
                    </Badge>
                  ))}
                  {dest.mustVisit.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{dest.mustVisit.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredDestinations.length === 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">No destinations found.</p>
        </motion.div>
      )}

      {/* View Destination Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedDestination && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <Badge className={selectedDestination.isActive ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}>
                    {selectedDestination.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <DialogTitle className="font-display text-2xl mt-2">{selectedDestination.name}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedDestination.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Hero Image */}
                {selectedDestination.image && (
                  <div className="rounded-xl overflow-hidden h-48">
                    <img
                      src={selectedDestination.image}
                      alt={selectedDestination.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/50 rounded-lg p-4">
                    <Calendar className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm font-medium">{selectedDestination.bestTime || 'Year Round'}</p>
                    <p className="text-xs text-muted-foreground">Best Time to Visit</p>
                  </div>
                </div>

                <Separator />

                {/* Must Visit Places */}
                {selectedDestination.mustVisit && selectedDestination.mustVisit.length > 0 && (
                  <>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Must Visit Places</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedDestination.mustVisit.map((place, idx) => (
                          <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary">
                            <MapPin className="h-3 w-3 mr-1" />
                            {place}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Traveller Tips */}
                {selectedDestination.travelTips && selectedDestination.travelTips.length > 0 && (
                  <>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Traveller Tips</h4>
                      <ul className="space-y-2">
                        {selectedDestination.travelTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="text-primary mt-0.5">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsViewOpen(false)}>
                    Close
                  </Button>
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white"
                    onClick={() => {
                      setIsViewOpen(false);
                      handleEdit(selectedDestination);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Destination
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Destination Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit Destination</DialogTitle>
            <DialogDescription>Update the destination details below</DialogDescription>
          </DialogHeader>
          {selectedDestination && (
            <DestinationForm 
              onClose={() => {
                setIsEditOpen(false);
                setSelectedDestination(null);
              }} 
              initialData={selectedDestination}
              onSuccess={handleFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Destination</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteTarget?.name}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
