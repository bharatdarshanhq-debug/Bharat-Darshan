import { useState, useRef } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Input } from '@/components/ui/Primitives';
import { Label } from '@/components/ui/Primitives';
import { Textarea } from '@/components/ui/Primitives';
import { Switch } from '@/components/ui/Primitives';
import { Separator } from '@/components/ui/Primitives';
import { createDestination, updateDestination } from '@/services/destinationService';

export function DestinationForm({ onClose, initialData, onSuccess }) {
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [heroImage, setHeroImage] = useState(null);
  const [heroImagePreview, setHeroImagePreview] = useState(initialData?.image || null);
  const [tags, setTags] = useState(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setHeroImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setHeroImage(null);
    setHeroImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Create FormData for multer upload
      const formData = new FormData();
      formData.append('name', e.target.name.value);
      formData.append('description', e.target.shortDescription.value);
      formData.append('bestTime', e.target.bestTime.value || '');
      formData.append('mustVisit', e.target.mustVisit.value || '');
      formData.append('travelTips', e.target.travelTips.value || '');
      formData.append('tags', JSON.stringify(tags));
      formData.append('isActive', isActive);
      
      // Add image
      if (heroImage) {
        formData.append('heroImage', heroImage);
      } else if (initialData?.image && !heroImage) {
        formData.append('image', initialData.image);
      }

      let result;
      if (initialData?._id || initialData?.id) {
        // Update existing destination
        result = await updateDestination(initialData._id || initialData.id, formData);
      } else {
        // Create new destination
        result = await createDestination(formData);
      }

      // Call success callback to refresh parent data
      if (onSuccess) {
        onSuccess(result);
      }
      onClose();
    } catch (err) {
      console.error('Error saving destination:', err);
      setError(err.message || 'Failed to save destination');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="form-section">
        <h4 className="font-semibold text-foreground mb-4">Basic Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Destination Name *</Label>
            <Input id="name" name="name" placeholder="e.g., Rajasthan" defaultValue={initialData?.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input 
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="e.g., East Odisha (press Enter)"
            />
          </div>
        </div>
        
        {/* Tags Display */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full border border-primary/20"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        
        <div className="space-y-2 mt-4">
          <Label htmlFor="shortDescription">Short Description *</Label>
          <Textarea 
            id="shortDescription" 
            name="shortDescription"
            rows={3} 
            placeholder="A brief description for listings"
            defaultValue={initialData?.description || initialData?.shortDescription}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2 mt-4">
          <Label>Hero Image {!initialData && '*'}</Label>
          <div className="mt-2">
            {heroImagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={heroImagePreview}
                  alt="Hero preview"
                  className="w-full h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-white rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all"
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 bg-primary/10 rounded-full">
                    <Upload className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="form-section">
        <h4 className="font-semibold text-foreground mb-4">Details</h4>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bestTime">Best Time to Visit</Label>
            <Input id="bestTime" name="bestTime" placeholder="e.g., October to March" defaultValue={initialData?.bestTime} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mustVisit">Must Visit Places (comma separated)</Label>
            <Textarea 
              id="mustVisit" 
              name="mustVisit"
              rows={2} 
              placeholder="Jaipur, Udaipur, Jodhpur, Jaisalmer"
              defaultValue={initialData?.mustVisit?.join(', ')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="travelTips">Traveler Tip</Label>
            <Textarea 
              id="travelTips" 
              name="travelTips"
              rows={3} 
              placeholder="Carry sunscreen, Dress modestly at temples, Bargain at local markets"
              defaultValue={initialData?.travelTips?.join(', ')}
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="form-section">
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <Label htmlFor="isActive" className="cursor-pointer">Active (visible on website)</Label>
          <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-primary hover:opacity-90 text-white" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {initialData ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            initialData ? 'Update Destination' : 'Add Destination'
          )}
        </Button>
      </div>
    </form>
  );
}
