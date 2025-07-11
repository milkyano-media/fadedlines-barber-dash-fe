import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Edit2, Save, X, Trash2, Plus, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTeamManagement } from '../hooks/useTeamManagement';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const BarberManagement = () => {
  const {
    teamMembers,
    loading,
    error,
    fetchTeamMembers,
    updateTeamMemberDetail,
    deleteTeamMemberDetail
  } = useTeamManagement();

  const [orderedTeamMembers, setOrderedTeamMembers] = useState([]);

  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    employmentType: '',
    monthlyRate: '',
    chairRentalRate: '',
    notes: ''
  });

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

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this employment detail?')) {
      try {
        await deleteTeamMemberDetail(memberId);
      } catch (err) {
        console.error('Error deleting team member detail:', err);
      }
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
            Drag and drop to reorder barbers • Manage employment details
          </p>
        </div>
        <Button variant="outline" onClick={fetchTeamMembers} disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : 'Refresh'}
        </Button>
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
                                      <div className="flex gap-1 justify-center">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleEdit(member)}
                                          className="h-8 px-3"
                                        >
                                          {member.details ? (
                                            <><Edit2 className="h-3 w-3 mr-1" />Edit</>
                                          ) : (
                                            <><Plus className="h-3 w-3 mr-1" />Add</>
                                          )}
                                        </Button>
                                        {member.details && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(member.squareId)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        )}
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
    </div>
  );
};

export default BarberManagement;