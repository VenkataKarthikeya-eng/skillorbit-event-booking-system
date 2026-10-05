import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Image,
  Upload,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Save,
  Tag,
} from 'lucide-react';
import eventService from '../../services/eventService';
import useToast from '../../hooks/useToast';

const CATEGORIES = [
  'Conference',
  'Workshop',
  'Concert',
  'College Fest',
  'Webinar',
  'Networking',
  'Tech Talk',
  'Cultural',
  'Sports',
  'Other',
];

const EventForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Workshop',
    date: '',
    time: '',
    venue: '',
    location: '',
    capacity: 100,
    ticketPrice: 0,
    bannerUrl: '',
    status: 'published',
  });

  const [bookedSeats, setBookedSeats] = useState(0);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Load existing event data if editing
  useEffect(() => {
    if (isEdit) {
      const loadEvent = async () => {
        try {
          const res = await eventService.getEventById(id);
          if (res.success && res.event) {
            const ev = res.event;
            const dateStr = ev.date ? new Date(ev.date).toISOString().split('T')[0] : '';
            setFormData({
              title: ev.title || '',
              description: ev.description || '',
              category: ev.category || 'Workshop',
              date: dateStr,
              time: ev.time || '',
              venue: ev.venue || '',
              location: ev.location || '',
              capacity: ev.capacity || 100,
              ticketPrice: ev.ticketPrice || 0,
              bannerUrl: ev.bannerUrl || '',
              status: ev.status || 'published',
            });
            setBookedSeats(ev.capacity - ev.availableSeats);
          } else {
            setServerError(res.message || 'Unable to load event for editing');
          }
        } catch (err) {
          setServerError(err.response?.data?.message || 'Failed to load event data');
        } finally {
          setLoading(false);
        }
      };
      loadEvent();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, banner: 'Image file size must be less than 5MB' }));
      return;
    }

    const uploadData = new FormData();
    uploadData.append('image', file);

    setUploading(true);
    setErrors((prev) => ({ ...prev, banner: '' }));

    try {
      const res = await eventService.uploadBanner(uploadData);
      if (res.success && res.imageUrl) {
        setFormData((prev) => ({ ...prev, bannerUrl: res.imageUrl }));
        toast.success('Event banner image uploaded successfully!', 'Upload Complete');
      } else {
        const msg = res.message || 'Image upload failed';
        setErrors((prev) => ({ ...prev, banner: msg }));
        toast.error(msg, 'Upload Failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload image. You can paste a direct URL.';
      setErrors((prev) => ({
        ...prev,
        banner: msg,
      }));
      toast.error(msg, 'Upload Error');
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Event title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Event date is required';
    if (!formData.time.trim()) newErrors.time = 'Event timing is required';
    if (!formData.venue.trim()) newErrors.venue = 'Venue name is required';
    if (!formData.location.trim()) newErrors.location = 'City/Location is required';

    const cap = Number(formData.capacity);
    if (!cap || cap <= 0) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (isEdit && cap < bookedSeats) {
      newErrors.capacity = `Capacity cannot be lower than existing booked seats (${bookedSeats})`;
    }

    if (Number(formData.ticketPrice) < 0) {
      newErrors.ticketPrice = 'Price cannot be negative';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setSuccessMsg('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        ticketPrice: Number(formData.ticketPrice),
        bannerUrl:
          formData.bannerUrl ||
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
      };

      if (isEdit) {
        const res = await eventService.updateEvent(id, payload);
        if (res.success) {
          toast.success('Event details updated successfully!', 'Event Updated');
          setSuccessMsg('Event updated successfully!');
          setTimeout(() => navigate('/admin/events'), 1000);
        } else {
          const msg = res.message || 'Failed to update event';
          setServerError(msg);
          toast.error(msg, 'Update Failed');
        }
      } else {
        const res = await eventService.createEvent(payload);
        if (res.success) {
          toast.success('Event created and published successfully!', 'Event Created');
          setSuccessMsg('Event created and published successfully!');
          setTimeout(() => navigate('/admin/events'), 1000);
        } else {
          const msg = res.message || 'Failed to create event';
          setServerError(msg);
          toast.error(msg, 'Creation Failed');
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Server error occurred while saving event';
      setServerError(msg);
      toast.error(msg, 'Save Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200">
        <div>
          <Link
            to="/admin/events"
            className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Event Table</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {isEdit ? 'Edit Scheduled Event' : 'Create New Event'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isEdit
              ? 'Update event timing, venue details, or adjust seat capacity'
              : 'Add an event to the public catalog with seating and pricing'}
          </p>
        </div>
      </div>

      {/* Success / Error Banners */}
      {successMsg && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {serverError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI & Full-Stack Developers Conference 2026"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                errors.title
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
            Event Description *
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a comprehensive summary of keynotes, topics, prerequisites, and schedules..."
            className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
            }`}
          ></textarea>
          {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
        </div>

        {/* Schedule & Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.date
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Timing * (e.g. 10:00 AM - 04:00 PM)
            </label>
            <input
              type="text"
              name="time"
              value={formData.time}
              onChange={handleChange}
              placeholder="10:00 AM - 04:00 PM"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.time
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Venue Name *
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Auditorium Hall B or Zoom Webinar"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.venue
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.venue && <p className="mt-1 text-xs text-red-600">{errors.venue}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              City / Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Bengaluru, Karnataka (or Online)"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.location
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.location && <p className="mt-1 text-xs text-red-600">{errors.location}</p>}
          </div>
        </div>

        {/* Capacity, Price & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Total Capacity (Seats) *
            </label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={handleChange}
              className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                errors.capacity
                  ? 'border-red-300 focus:ring-red-100 bg-red-50/20'
                  : 'border-slate-300 focus:border-indigo-600 focus:ring-indigo-100'
              }`}
            />
            {errors.capacity && <p className="mt-1 text-xs text-red-600">{errors.capacity}</p>}
            {isEdit && bookedSeats > 0 && (
              <p className="mt-1 text-[11px] text-amber-600">
                Note: {bookedSeats} seat(s) already booked.
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Ticket Price (₹)
            </label>
            <input
              type="number"
              name="ticketPrice"
              min="0"
              value={formData.ticketPrice}
              onChange={handleChange}
              placeholder="0 for free admission"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
            <p className="mt-1 text-[11px] text-slate-400">Set 0 for complimentary entry</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
              Publish Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 bg-white"
            >
              <option value="published">Published</option>
              <option value="draft">Draft (Hidden)</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Banner Image Upload & Direct URL */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
            Event Banner Image
          </label>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Direct URL input */}
            <div>
              <input
                type="url"
                name="bannerUrl"
                value={formData.bannerUrl}
                onChange={handleChange}
                placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 mb-2"
              />

              {/* Or upload local file */}
              <div className="flex items-center space-x-2">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors">
                  <Upload className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{uploading ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 5MB</span>
              </div>
              {errors.banner && <p className="mt-1 text-xs text-red-600">{errors.banner}</p>}
            </div>

            {/* Banner Preview */}
            <div className="aspect-video w-full rounded-lg bg-slate-100 border border-slate-200 overflow-hidden relative flex items-center justify-center">
              {formData.bannerUrl ? (
                <img
                  src={formData.bannerUrl}
                  alt="Banner preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600';
                  }}
                />
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <Image className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                  <span>No banner selected (Default fallback will apply)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
          <Link
            to="/admin/events"
            className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || uploading}
            className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{submitting ? 'Saving Event...' : isEdit ? 'Update Event' : 'Create Event'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
