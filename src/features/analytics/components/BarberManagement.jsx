import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Edit2,
  Save,
  X,
  Trash2,
  Plus,
  GripVertical,
  RotateCcw,
  UserPlus,
  Settings,
  Eye,
  Image as ImageIcon,
  Info
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTeamManagement } from '../hooks/useTeamManagement';
import { useBarberAnalytics } from '../hooks/useBarberAnalytics';
import teamService from '../services/teamService';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Toast from '@/components/common/Toast';
import CreateBarberModal from './CreateBarberModal';
import ServiceManagement from './ServiceManagement';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ServiceAssignmentInfoModal from './ServiceAssignmentInfoModal';
import DeletedBarberInfoModal from './DeletedBarberInfoModal';
import EditImageModal from './EditImageModal';
import EditTeamMemberModal from './EditTeamMemberModal';

const BarberManagement = () => {
  const {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    updateTeamMemberDetail,
    deleteTeamMemberDetail
  } = useTeamManagement();

  // Hook for analytics data
  const { fetchBarberAnalytics } = useBarberAnalytics();

  const [orderedTeamMembers, setOrderedTeamMembers] = useState([]);
  const [isAutoSorting, setIsAutoSorting] = useState(false);
  const [autoSortDateRange, setAutoSortDateRange] = useState('30d');

  // Calculate date range parameters for auto-sort
  const getAutoSortDateRangeParams = () => {
    const now = dayjs();
    let startDate = null;
    let endDate = now.format('YYYY-MM-DD');

    switch (autoSortDateRange) {
      case '7d':
        startDate = now.subtract(7, 'day').format('YYYY-MM-DD');
        break;
      case '30d':
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
        break;
      case '90d':
        startDate = now.subtract(90, 'day').format('YYYY-MM-DD');
        break;
      case 'all':
        // No start date for all time
        break;
      default:
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
    }

    return { startDate, endDate };
  };

  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    employmentType: '',
    monthlyRate: '',
    chairRentalRate: '',
    notes: ''
  });

  // New modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMemberForServices, setSelectedMemberForServices] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Delete confirmation modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Edit image modal states
  const [showEditImageModal, setShowEditImageModal] = useState(false);
  const [selectedMemberForImage, setSelectedMemberForImage] = useState(null);

  // Toast notification states
  const [toast, setToast] = useState({
    isVisible: false,
    message: '',
    type: 'success'
  });

  // Service assignment info modal states
  const [showServiceAssignmentInfo, setShowServiceAssignmentInfo] = useState(false);
  const [createdBarberInfo, setCreatedBarberInfo] = useState(null);

  // Deleted barber info modal states
  const [showDeletedBarberInfo, setShowDeletedBarberInfo] = useState(false);
  const [deletedBarberInfo, setDeletedBarberInfo] = useState(null);

  // Edit team member modal states
  const [showEditTeamMemberModal, setShowEditTeamMemberModal] = useState(false);
  const [selectedMemberForEdit, setSelectedMemberForEdit] = useState(null);

  useEffect(() => {
    fetchTeamMembers();
  }, [fetchTeamMembers]);

  useEffect(() => {
    if (teamMembers.length > 0) {
      // Sort by display order if available, otherwise maintain current order
      const sorted = [...teamMembers].sort((a, b) => {
        const orderA = a.details?.displayOrder ?? 999;
        const orderB = b.details?.displayOrder ?? 999;
        return orderA - orderB;
      });
      setOrderedTeamMembers(sorted);
    }
  }, [teamMembers]);

  const handleEdit = (member) => {
    setEditingMember(member.squareId);
    setFormData({
      employmentType: member.details?.employmentType || '',
      monthlyRate: member.details?.monthlyRate || '',
      chairRentalRate: member.details?.chairRentalRate || '',
      notes: member.details?.notes || ''
    });
  };

  const handleCancel = () => {
    setEditingMember(null);
    setFormData({
      employmentType: 'CHAIR_RENTAL',
      monthlyRate: '',
      chairRentalRate: '',
      notes: ''
    });
  };

  const handleSave = async (memberId) => {
    try {
      const dataToSave = {
        notes: formData.notes || ''
      };

      // Only include employment type if selected
      if (formData.employmentType) {
        dataToSave.employmentType = formData.employmentType;
      }

      // Include rates even if they are 0 or empty (will be saved as 0)
      if (formData.employmentType === 'EMPLOYEE') {
        dataToSave.monthlyRate = formData.monthlyRate ? parseFloat(formData.monthlyRate) : 0;
        // Clear chair rental rate for employees
        dataToSave.chairRentalRate = null;
      } else if (formData.employmentType === 'CHAIR_RENTAL') {
        dataToSave.chairRentalRate = formData.chairRentalRate ? parseFloat(formData.chairRentalRate) : 0;
        // Clear monthly rate for chair rental
        dataToSave.monthlyRate = null;
      }

      await updateTeamMemberDetail(memberId, dataToSave);
      
      // Refetch to get the latest data
      await fetchTeamMembers();
      
      setEditingMember(null);
      setFormData({
        employmentType: '',
        monthlyRate: '',
        chairRentalRate: '',
        notes: ''
      });
    } catch (err) {
      console.error('Error saving team member detail:', err);
    }
  };

  // Toast helper functions
  const showToast = (message, type = 'success') => {
    setToast({
      isVisible: true,
      message,
      type
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Open delete confirmation modal
  const handleDeleteTeamMember = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  // Confirm delete action
  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    setIsDeleting(true);
    try {
      // Delete services, category, deactivate in Square, and delete from local DB
      const response = await teamService.deactivateTeamMember(memberToDelete.squareId);

      await fetchTeamMembers(); // Refresh the list

      // Close delete confirmation modal
      setShowDeleteModal(false);

      // Show deleted barber info modal with manual removal instructions
      setDeletedBarberInfo({
        name: `${memberToDelete.givenName} ${memberToDelete.familyName}`,
        squareId: memberToDelete.squareId
      });
      setShowDeletedBarberInfo(true);

      // Clear memberToDelete state
      setMemberToDelete(null);
    } catch (err) {
      console.error('Error deleting team member:', err);
      showToast(
        `Failed to delete team member: ${err.response?.data?.error || err.message}`,
        'error'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete action
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  // Auto-sort handler based on Employment → Conversions → Order logic
  // Uses last 30 days conversion data to match Analytics Summary behavior
  const handleAutoSort = async () => {
    if (isAutoSorting) return;
    
    setIsAutoSorting(true);
    try {
      // First, fetch analytics data to get conversion counts
      // Use the selected date range for auto-sort
      const { startDate, endDate } = getAutoSortDateRangeParams();
      
      console.log('🔄 Auto-sort: Fetching analytics data with date range:', { 
        range: autoSortDateRange, 
        startDate, 
        endDate 
      });
      const analyticsData = await fetchBarberAnalytics({
        sortBy: 'default',
        sortDir: 'desc',
        size: 100,
        startDate,
        endDate,
        page: 1
      });
      
      console.log('📊 Auto-sort: Received analytics data:', analyticsData);
      
      if (!analyticsData || !analyticsData.data) {
        console.error('❌ Auto-sort: Analytics data is invalid:', analyticsData);
        throw new Error('Failed to fetch analytics data for sorting');
      }
      
      console.log('✅ Auto-sort: Analytics data valid, proceeding with sort...');

      // Create a map of barber names to their analytics data for conversion lookup
      const analyticsMap = new Map();
      analyticsData.data.forEach(barber => {
        analyticsMap.set(barber.barberName, {
          totalConversions: barber.totalConversions || 0
        });
      });

      // Sort team members using the same logic as analytics default sort
      const sortedMembers = [...orderedTeamMembers].sort((a, b) => {
        const aName = `${a.givenName} ${a.familyName}`;
        const bName = `${b.givenName} ${b.familyName}`;
        const aAnalytics = analyticsMap.get(aName) || { totalConversions: 0 };
        const bAnalytics = analyticsMap.get(bName) || { totalConversions: 0 };

        // First by employment type (EMPLOYEE > CHAIR_RENTAL > null)
        const aEmployment = a.details?.employmentType;
        const bEmployment = b.details?.employmentType;
        
        let comparison = 0;
        if (!aEmployment && !bEmployment) {
          comparison = 0;
        } else if (!aEmployment) {
          comparison = 1;
        } else if (!bEmployment) {
          comparison = -1;
        } else if (aEmployment === 'EMPLOYEE' && bEmployment === 'CHAIR_RENTAL') {
          comparison = -1;
        } else if (aEmployment === 'CHAIR_RENTAL' && bEmployment === 'EMPLOYEE') {
          comparison = 1;
        } else {
          comparison = 0;
        }

        // If employment types are the same, sort by total conversions (descending)
        if (comparison === 0) {
          comparison = bAnalytics.totalConversions - aAnalytics.totalConversions;
        }

        // If still the same, sort by current display order
        if (comparison === 0) {
          const aOrder = a.details?.displayOrder ?? 999;
          const bOrder = b.details?.displayOrder ?? 999;
          comparison = aOrder - bOrder;
        }

        return comparison;
      });

      // Update local state first for immediate feedback
      setOrderedTeamMembers(sortedMembers);

      // Update display orders in the database
      const updatePromises = sortedMembers.map((member, index) => {
        const newDisplayOrder = index + 1;
        return updateTeamMemberDetail(member.squareId, { displayOrder: newDisplayOrder });
      });

      await Promise.all(updatePromises);
      
      // Refresh team members to get updated data
      await fetchTeamMembers();
      
    } catch (err) {
      console.error('Error auto-sorting team members:', err);
      console.error('Error details:', err.response || err.message || err);
      
      // Provide specific error messages based on the error type
      let errorMessage = 'Auto-sort failed';
      if (err.response && err.response.status === 401) {
        errorMessage = 'Auto-sort failed: Please refresh the page and log in again. Your session may have expired.';
      } else if (err.message && err.message.includes('fetch analytics')) {
        errorMessage = 'Auto-sort failed: Unable to load analytics data. Please ensure you\'re logged in and try again.';
      } else {
        errorMessage = `Auto-sort failed: ${err.message || 'Unknown error'}. Please try again.`;
      }

      showToast(errorMessage, 'error');
      
      // Revert local state on error
      await fetchTeamMembers();
    } finally {
      setIsAutoSorting(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;
    
    if (sourceIndex === destinationIndex) return;

    const newOrderedMembers = Array.from(orderedTeamMembers);
    const [reorderedItem] = newOrderedMembers.splice(sourceIndex, 1);
    newOrderedMembers.splice(destinationIndex, 0, reorderedItem);

    // Update local state immediately for better UX
    setOrderedTeamMembers(newOrderedMembers);

    // Calculate affected range - only update items that actually changed position
    const minIndex = Math.min(sourceIndex, destinationIndex);
    const maxIndex = Math.max(sourceIndex, destinationIndex);
    
    try {
      // Only update members in the affected range
      const updatePromises = [];
      for (let i = minIndex; i <= maxIndex; i++) {
        const member = newOrderedMembers[i];
        const updateData = {
          displayOrder: i + 1
        };
        updatePromises.push(updateTeamMemberDetail(member.squareId, updateData));
      }
      
      await Promise.all(updatePromises);
      
      // Refetch to ensure we have the latest data
      await fetchTeamMembers();
    } catch (err) {
      console.error('Error updating member order:', err);
      // Revert on error
      setOrderedTeamMembers(teamMembers);
    }
  };

  // New CRUD handlers
  const handleCreateBarberSuccess = (createdBarber) => {
    console.log('Barber created successfully:', createdBarber);
    // Refresh the team members list
    fetchTeamMembers();

    // Store barber info and show service assignment modal
    if (createdBarber?.data?.square) {
      const barberName = `${createdBarber.data.square.given_name} ${createdBarber.data.square.family_name}`;
      const barberSquareId = createdBarber.data.square.id;

      setCreatedBarberInfo({
        name: barberName,
        squareId: barberSquareId
      });
      setShowServiceAssignmentInfo(true);
    } else {
      // Fallback to toast if data structure is unexpected
      showToast('Barber created successfully!', 'success');
    }
  };

  const handleShowServices = (member) => {
    setSelectedMemberForServices(member);
    setShowServiceModal(true);
  };

  const handleShowEditImage = (member) => {
    setSelectedMemberForImage(member);
    setShowEditImageModal(true);
  };

  const handleCloseEditImageModal = () => {
    setShowEditImageModal(false);
    setSelectedMemberForImage(null);
  };

  const handleEditImageSuccess = async () => {
    await fetchTeamMembers(); // Refresh list to show updated image
    showToast('Profile image updated successfully', 'success');
  };

  const handleCloseServiceModal = () => {
    setSelectedMemberForServices(null);
    setShowServiceModal(false);
  };

  const handleOpenServiceAssignmentInfo = (member) => {
    setCreatedBarberInfo({
      name: `${member.givenName} ${member.familyName}`,
      squareId: member.squareId
    });
    setShowServiceAssignmentInfo(true);
  };

  const handleCloseServiceAssignmentInfo = () => {
    setShowServiceAssignmentInfo(false);
    setCreatedBarberInfo(null);
  };

  const handleCloseDeletedBarberInfo = () => {
    setShowDeletedBarberInfo(false);
    setDeletedBarberInfo(null);
  };

  const handleEditTeamMember = (member) => {
    setSelectedMemberForEdit(member);
    setShowEditTeamMemberModal(true);
  };

  const handleCloseEditTeamMemberModal = () => {
    setShowEditTeamMemberModal(false);
    setSelectedMemberForEdit(null);
  };

  const handleEditTeamMemberSuccess = async () => {
    await fetchTeamMembers(); // Refresh list to show updated data
    showToast('Team member updated successfully', 'success');
  };

  const getEmploymentBadge = (employmentType) => {
    const variants = {
      CHAIR_RENTAL: 'outline',
      EMPLOYEE: 'default'
    };
    
    const labels = {
      CHAIR_RENTAL: 'Chair Rental',
      EMPLOYEE: 'Employee'
    };

    return (
      <Badge variant={variants[employmentType]}>
        {labels[employmentType]}
      </Badge>
    );
  };

  if (loading && teamMembers.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message || 'Failed to load team members'}
        onRetry={fetchTeamMembers}
        className="mb-6"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag and drop to reorder barbers • Auto-sort by employment & conversions (with date range) • Manage employment details
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create Barber
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAutoSort} 
            disabled={loading || isAutoSorting}
            className="flex items-center gap-2"
          >
            <RotateCcw className={`h-4 w-4 ${isAutoSorting ? 'animate-spin' : ''}`} />
            {isAutoSorting ? 'Auto Sorting...' : 'Auto Sort'}
          </Button>
          <Select
            value={autoSortDateRange}
            onChange={(e) => setAutoSortDateRange(e.target.value)}
            className="w-[160px]"
            disabled={isAutoSorting}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </Select>
          <Button variant="outline" onClick={fetchTeamMembers} disabled={loading}>
            {loading ? <LoadingSpinner size="small" /> : 'Refresh'}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className='p-0'>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className='overflow-x-auto'>
              <div className='inline-block min-w-full align-middle'>
                <div className='overflow-hidden rounded-md'>
                  <table className='w-full min-w-[768px] caption-bottom text-sm'>
                    <thead className='[&_tr]:border-b'>
                      <tr className='border-b transition-colors bg-muted/50'>
                        <th className='h-10 w-12 px-4 text-center align-middle font-medium'>
                          <GripVertical className="h-4 w-4 text-muted-foreground mx-auto" />
                        </th>
                        <th className='h-10 px-4 text-left align-middle font-medium'>Name</th>
                        <th className='h-10 px-4 text-left align-middle font-medium'>Contact</th>
                        <th className='h-10 px-4 text-left align-middle font-medium'>Employment</th>
                        <th className='h-10 px-4 text-left align-middle font-medium'>Rate</th>
                        <th className='h-10 px-4 text-center align-middle font-medium'>Actions</th>
                      </tr>
                    </thead>
                    <Droppable droppableId="team-members" direction="vertical">
                      {(provided) => (
                        <tbody
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='[&_tr:last-child]:border-0'
                        >
                        {orderedTeamMembers.map((member, index) => (
                          <Draggable key={member.squareId} draggableId={member.squareId} index={index}>
                            {(provided, snapshot) => (
                              <>
                                <tr
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`border-b transition-colors ${
                                    snapshot.isDragging ? 'shadow-lg bg-background relative z-10' : 'hover:bg-muted/50'
                                  }`}
                                >
                                  {editingMember === member.squareId ? (
                                  /* Editing Row */
                                  <>
                                    <td colSpan={6} className="p-4 bg-muted/20">
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-12 gap-4 items-end">
                                          <div className="col-span-1 flex items-center pb-2">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="cursor-grab active:cursor-grabbing"
                                            >
                                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                          </div>
                                          
                                          <div className="col-span-3">
                                            <div className="font-medium text-sm mb-2">{member.givenName} {member.familyName}</div>
                                            <div className="text-xs text-muted-foreground space-y-1">
                                              {member.emailAddress && (
                                                <div className="truncate">{member.emailAddress}</div>
                                              )}
                                              {member.phoneNumber && (
                                                <div>{member.phoneNumber}</div>
                                              )}
                                            </div>
                                          </div>
                                          
                                          <div className="col-span-2">
                                            <label className="text-xs font-medium mb-2 block">
                                              Employment Type
                                            </label>
                                            <Select
                                              value={formData.employmentType}
                                              onChange={(e) =>
                                                setFormData({ ...formData, employmentType: e.target.value })
                                              }
                                              className="h-9"
                                            >
                                              <option value="">Not set</option>
                                              <option value="CHAIR_RENTAL">Chair Rental</option>
                                              <option value="EMPLOYEE">Employee</option>
                                            </Select>
                                          </div>
                                          
                                          <div className="col-span-2">
                                            {formData.employmentType === 'EMPLOYEE' && (
                                              <div>
                                                <label className="text-xs font-medium mb-2 block">
                                                  Monthly Rate ($)
                                                </label>
                                                <Input
                                                  type="number"
                                                  step="0.01"
                                                  placeholder="0.00"
                                                  value={formData.monthlyRate}
                                                  onChange={(e) =>
                                                    setFormData({ ...formData, monthlyRate: e.target.value })
                                                  }
                                                  className="h-9"
                                                  min="0"
                                                />
                                              </div>
                                            )}
                                            
                                            {formData.employmentType === 'CHAIR_RENTAL' && (
                                              <div>
                                                <label className="text-xs font-medium mb-2 block">
                                                  Chair Rental ($)
                                                </label>
                                                <Input
                                                  type="number"
                                                  step="0.01"
                                                  placeholder="0.00"
                                                  value={formData.chairRentalRate}
                                                  onChange={(e) =>
                                                    setFormData({ ...formData, chairRentalRate: e.target.value })
                                                  }
                                                  className="h-9"
                                                  min="0"
                                                />
                                              </div>
                                            )}
                                            
                                            {!formData.employmentType && (
                                              <div className="h-9"></div>
                                            )}
                                          </div>
                                          
                                          <div className="col-span-2">
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                onClick={() => handleSave(member.squareId)}
                                                className="h-9 px-4 flex-1"
                                              >
                                                <Save className="h-3 w-3 mr-1" />
                                                Save
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancel}
                                                className="h-9 w-9 p-0"
                                              >
                                                <X className="h-3 w-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-12 gap-4">
                                          <div className="col-span-1"></div>
                                          <div className="col-span-11">
                                            <label className="text-xs font-medium mb-2 block">
                                              Notes
                                            </label>
                                            <Input
                                              placeholder="Additional notes..."
                                              value={formData.notes}
                                              onChange={(e) =>
                                                setFormData({ ...formData, notes: e.target.value })
                                              }
                                              className="h-9"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  /* Display Row */
                                  <>
                                    <td className="p-4 text-center w-12">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="cursor-grab active:cursor-grabbing inline-flex"
                                      >
                                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                      <div className="font-medium">{member.givenName} {member.familyName}</div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        Order: {index + 1}
                                      </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                      {member.emailAddress && (
                                        <div className="truncate text-sm">{member.emailAddress}</div>
                                      )}
                                      {member.phoneNumber && (
                                        <div className="text-xs text-muted-foreground">{member.phoneNumber}</div>
                                      )}
                                    </td>
                                    <td className="p-4 align-middle">
                                      {member.details?.employmentType ? (
                                        getEmploymentBadge(member.details.employmentType)
                                      ) : (
                                        <span className="text-xs text-muted-foreground">Not set</span>
                                      )}
                                    </td>
                                    <td className="p-4 align-middle">
                                      {member.details?.employmentType === 'EMPLOYEE' && member.details?.monthlyRate !== null && member.details?.monthlyRate !== undefined && (
                                        <div className="text-sm">${member.details.monthlyRate}/month</div>
                                      )}
                                      {member.details?.employmentType === 'CHAIR_RENTAL' && member.details?.chairRentalRate !== null && member.details?.chairRentalRate !== undefined && (
                                        <div className="text-sm">${member.details.chairRentalRate}/rental</div>
                                      )}
                                      {(!member.details || 
                                        (member.details.employmentType === 'EMPLOYEE' && (member.details.monthlyRate === null || member.details.monthlyRate === undefined)) ||
                                        (member.details.employmentType === 'CHAIR_RENTAL' && (member.details.chairRentalRate === null || member.details.chairRentalRate === undefined)) ||
                                        (!member.details.employmentType)) && (
                                        <span className="text-xs text-muted-foreground">Not set</span>
                                      )}
                                    </td>
                                    <td className="p-4 align-middle text-center">
                                      <div className="flex gap-1 justify-center flex-wrap">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleShowServices(member)}
                                          className="h-8 px-3"
                                          title="Manage Services"
                                        >
                                          <Settings className="h-3 w-3 mr-1" />
                                          Services
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleShowEditImage(member)}
                                          className="h-8 px-3"
                                          title="Edit Profile Image"
                                        >
                                          <ImageIcon className="h-3 w-3 mr-1" />
                                          Image
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleOpenServiceAssignmentInfo(member)}
                                          className="h-8 px-3"
                                          title="View Square Setup Instructions"
                                        >
                                          <Info className="h-3 w-3 mr-1" />
                                          Setup
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEditTeamMember(member)}
                                          className="h-8 px-3"
                                          title="Edit Team Member Information"
                                        >
                                          <Edit2 className="h-3 w-3 mr-1" />
                                          Edit Info
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEdit(member)}
                                          className="h-8 px-3"
                                          title="Edit Employment Details"
                                        >
                                          {member.details ? (
                                            <><Edit2 className="h-3 w-3 mr-1" />Edit</>
                                          ) : (
                                            <><Plus className="h-3 w-3 mr-1" />Add</>
                                          )}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => handleDeleteTeamMember(member)}
                                          className="h-8 w-8 p-0"
                                          title="Delete Team Member (Services, Category, Square & Local DB)"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </td>
                                  </>
                                )}
                              </tr>
                              {!editingMember && member.details?.notes && (
                                <tr className="border-b">
                                  <td colSpan={6} className="px-4 pb-4 pt-0">
                                    <div className="text-xs text-muted-foreground pl-12">
                                      <span className="font-medium">Notes:</span> {member.details.notes}
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          )}
                        </Draggable>
                      ))}
                        {provided.placeholder}
                      </tbody>
                    )}
                  </Droppable>
                </table>
              </div>
            </div>
          </div>
        </DragDropContext>
      </CardContent>
    </Card>

      {orderedTeamMembers.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No team members found.</p>
          </CardContent>
        </Card>
      )}

      {/* Create Barber Modal */}
      <CreateBarberModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateBarberSuccess}
        teamService={teamService}
        existingMembers={teamMembers}
      />

      {/* Service Management Modal */}
      {selectedMemberForServices && (
        <ServiceManagement
          isOpen={showServiceModal}
          onClose={handleCloseServiceModal}
          teamMember={selectedMemberForServices}
          teamService={teamService}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        memberName={memberToDelete ? `${memberToDelete.givenName} ${memberToDelete.familyName}` : ''}
        isDeleting={isDeleting}
      />

      {/* Service Assignment Info Modal */}
      {createdBarberInfo && (
        <ServiceAssignmentInfoModal
          isOpen={showServiceAssignmentInfo}
          onClose={handleCloseServiceAssignmentInfo}
          barberName={createdBarberInfo.name}
          barberSquareId={createdBarberInfo.squareId}
        />
      )}

      {/* Deleted Barber Info Modal */}
      {deletedBarberInfo && (
        <DeletedBarberInfoModal
          isOpen={showDeletedBarberInfo}
          onClose={handleCloseDeletedBarberInfo}
          barberName={deletedBarberInfo.name}
          barberSquareId={deletedBarberInfo.squareId}
        />
      )}

      {/* Edit Image Modal */}
      <EditImageModal
        isOpen={showEditImageModal}
        onClose={handleCloseEditImageModal}
        onSuccess={handleEditImageSuccess}
        teamService={teamService}
        barber={selectedMemberForImage}
      />

      {/* Edit Team Member Modal */}
      <EditTeamMemberModal
        isOpen={showEditTeamMemberModal}
        onClose={handleCloseEditTeamMemberModal}
        onSuccess={handleEditTeamMemberSuccess}
        teamService={teamService}
        teamMember={selectedMemberForEdit}
        existingMembers={teamMembers}
      />

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
    </div>
  );
};

export default BarberManagement;