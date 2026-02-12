import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MoreVertical,
  Mail,
  Phone,
  Clock,
  CheckCircle,
  MessageSquare,
  Loader2,
  Trash2,
  RefreshCw,
  MapPin,
  Package,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Primitives';
import { Input } from '@/components/ui/Primitives';
import { Badge } from '@/components/ui/Primitives';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Interactive';
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
} from '@/components/ui/Layout';
import {
  fetchAllInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '@/services/inquiryService';

const statusColors = {
  New: 'bg-primary/15 text-primary',
  Contacted: 'bg-warning/15 text-warning',
  Resolved: 'bg-success/15 text-success',
};

const statusIcons = {
  New: MessageSquare,
  Contacted: Clock,
  Resolved: CheckCircle,
};

const ITEMS_PER_PAGE = 10;

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [actionLoading, setActionLoading] = useState(null); // tracks id of item being acted on

  // ─── Pagination state ────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ─── Fetch inquiries from backend ────────────────────────────
  const loadInquiries = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllInquiries({
        status: statusFilter,
        page,
        limit: ITEMS_PER_PAGE,
      });
      setInquiries(data.inquiries);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
      setCurrentPage(data.currentPage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
    loadInquiries(1);
  }, [loadInquiries]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    loadInquiries(page);
  };

  // ─── Status update handler ──────────────────────────────────
  const handleStatusUpdate = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      setActionLoading(id);
      const updated = await updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? updated : inq))
      );
      // If the detail dialog is open for this inquiry, update it too
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(updated);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Delete handler ─────────────────────────────────────────
  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) return;
    try {
      setActionLoading(id);
      await deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq._id !== id));
      setTotalCount((prev) => prev - 1);
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(null);
      }
      // If we deleted the last item on this page, go back one page
      if (inquiries.length <= 1 && currentPage > 1) {
        goToPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // ─── Client-side search filtering (status is handled server-side) ──
  const filteredInquiries = inquiries.filter((inquiry) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(q) ||
      inquiry.email.toLowerCase().includes(q) ||
      (inquiry.message || '').toLowerCase().includes(q) ||
      (inquiry.package || '').toLowerCase().includes(q)
    );
  });

  // ─── Time ago helper ────────────────────────────────────────
  const getTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const newCount = statusFilter === 'New' ? totalCount : inquiries.filter((i) => i.status === 'New').length;

  // ─── Pagination page numbers helper ─────────────────────────
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  // ─── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading inquiries...</span>
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
          <h1 className="text-3xl font-bold font-display text-foreground">Inquiries</h1>
          <p className="text-muted-foreground mt-1">Manage contact form submissions</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadInquiries(currentPage)}
            className="gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          {newCount > 0 && (
            <Badge className="bg-primary/15 text-primary px-3 py-1">
              {newCount} New
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Error Banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between"
        >
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            Dismiss
          </Button>
        </motion.div>
      )}

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Contacted">Contacted</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Inquiries List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredInquiries.map((inquiry, index) => {
          const StatusIcon = statusIcons[inquiry.status] || MessageSquare;
          const isActing = actionLoading === inquiry._id;

          return (
            <motion.div
              key={inquiry._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className={`bg-card rounded-xl border border-border/50 p-5 hover:shadow-md transition-all duration-300 cursor-pointer ${
                isActing ? 'opacity-60 pointer-events-none' : ''
              }`}
              onClick={() => setSelectedInquiry(inquiry)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${statusColors[inquiry.status] || 'bg-muted'}`}>
                      <StatusIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{inquiry.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {inquiry.package && inquiry.package !== 'General Inquiry'
                          ? `${inquiry.package} Package`
                          : 'General Inquiry'}
                        {inquiry.destination ? ` • ${inquiry.destination}` : ''}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 ml-11">
                    {inquiry.message}
                  </p>

                  <div className="flex items-center gap-4 mt-3 ml-11">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {inquiry.phone}
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(inquiry.createdAt)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={statusColors[inquiry.status] || 'bg-muted'}>
                    {inquiry.status}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {inquiry.status !== 'New' && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => handleStatusUpdate(inquiry._id, 'New', e)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Mark as New
                        </DropdownMenuItem>
                      )}
                      {inquiry.status !== 'Contacted' && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => handleStatusUpdate(inquiry._id, 'Contacted', e)}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Mark as Contacted
                        </DropdownMenuItem>
                      )}
                      {inquiry.status !== 'Resolved' && (
                        <DropdownMenuItem
                          className="cursor-pointer"
                          onClick={(e) => handleStatusUpdate(inquiry._id, 'Resolved', e)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Resolved
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${inquiry.email}`} onClick={(e) => e.stopPropagation()}>
                          Send Email
                        </a>
                      </DropdownMenuItem>
                      {inquiry.phone && (
                        <DropdownMenuItem className="cursor-pointer">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${inquiry.phone}`} onClick={(e) => e.stopPropagation()}>
                            Call Customer
                          </a>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={(e) => handleDelete(inquiry._id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Inquiry
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredInquiries.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground">
            {totalCount === 0
              ? 'No inquiries yet. They will appear here when users submit the contact form.'
              : 'No inquiries match your search.'}
          </p>
        </motion.div>
      )}

      {/* ─── Pagination ─────────────────────────────────────────── */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2"
        >
          <p className="text-sm text-muted-foreground">
            Showing{' '}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>
            –
            <span className="font-medium text-foreground">
              {Math.min(currentPage * ITEMS_PER_PAGE, totalCount)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-foreground">{totalCount}</span> inquiries
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={currentPage <= 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {getPageNumbers()[0] > 1 && (
              <>
                <Button
                  variant={currentPage === 1 ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => goToPage(1)}
                >
                  1
                </Button>
                {getPageNumbers()[0] > 2 && (
                  <span className="px-1 text-muted-foreground">…</span>
                )}
              </>
            )}

            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? 'default' : 'outline'}
                size="icon"
                className={`h-9 w-9 ${
                  page === currentPage
                    ? 'bg-gradient-primary text-white hover:opacity-90'
                    : ''
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}

            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <span className="px-1 text-muted-foreground">…</span>
                )}
                <Button
                  variant={currentPage === totalPages ? 'default' : 'outline'}
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => goToPage(totalPages)}
                >
                  {totalPages}
                </Button>
              </>
            )}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              disabled={currentPage >= totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Inquiry Details</DialogTitle>
            <DialogDescription>View and respond to inquiry</DialogDescription>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedInquiry.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedInquiry.package && selectedInquiry.package !== 'General Inquiry'
                      ? `${selectedInquiry.package} Package`
                      : 'General Inquiry'}
                  </p>
                </div>
                <Badge className={statusColors[selectedInquiry.status] || 'bg-muted'}>
                  {selectedInquiry.status}
                </Badge>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-foreground whitespace-pre-wrap">{selectedInquiry.message}</p>
              </div>

              {/* Package & Destination info */}
              {(selectedInquiry.package || selectedInquiry.destination) && (
                <div className="flex flex-wrap gap-3 text-sm">
                  {selectedInquiry.package && selectedInquiry.package !== 'General Inquiry' && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                      <Package className="h-3.5 w-3.5" />
                      {selectedInquiry.package}
                    </div>
                  )}
                  {selectedInquiry.destination && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-full">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedInquiry.destination}
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedInquiry.email}`} className="text-primary hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedInquiry.phone}`} className="text-primary hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {new Date(selectedInquiry.createdAt).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  className="flex-1"
                  variant="outline"
                  onClick={() => window.open(`mailto:${selectedInquiry.email}`, '_blank')}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                {selectedInquiry.status !== 'Resolved' ? (
                  <Button
                    className="flex-1 bg-gradient-primary hover:opacity-90 text-white"
                    disabled={actionLoading === selectedInquiry._id}
                    onClick={() => handleStatusUpdate(selectedInquiry._id, 'Resolved')}
                  >
                    {actionLoading === selectedInquiry._id ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    Mark as Resolved
                  </Button>
                ) : (
                  <Button
                    className="flex-1"
                    variant="outline"
                    disabled={actionLoading === selectedInquiry._id}
                    onClick={() => handleStatusUpdate(selectedInquiry._id, 'New')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Reopen
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
