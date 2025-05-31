import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
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
    employmentType: 'CHAIR_RENTAL',
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
      employmentType: member.details?.employmentType || 'CHAIR_RENTAL',
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
        employmentType: formData.employmentType,
        notes: formData.notes
      };

      // Only include rates if they have values
      if (formData.monthlyRate) {
        dataToSave.monthlyRate = parseFloat(formData.monthlyRate);
      }
      if (formData.chairRentalRate) {
        dataToSave.chairRentalRate = parseFloat(formData.chairRentalRate);
      }

      await updateTeamMemberDetail(memberId, dataToSave);
      setEditingMember(null);
      setFormData({
        employmentType: 'CHAIR_RENTAL',
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

    const newOrderedMembers = Array.from(orderedTeamMembers);
    const [reorderedItem] = newOrderedMembers.splice(result.source.index, 1);
    newOrderedMembers.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setOrderedTeamMembers(newOrderedMembers);

    // Update display order for each member
    try {
      const updatePromises = newOrderedMembers.map((member, index) => {
        const updateData = {
          ...member.details,
          displayOrder: index + 1
        };
        return updateTeamMemberDetail(member.squareId, updateData);
      });
      
      await Promise.all(updatePromises);
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

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="border rounded-lg">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 bg-muted/50 border-b font-medium text-sm">
            <div className="col-span-1 flex items-center">
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Contact</div>
            <div className="col-span-2">Employment</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          <Droppable droppableId="team-members" direction="vertical">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {orderedTeamMembers.map((member, index) => (
                  <Draggable key={member.squareId} draggableId={member.squareId} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`border-b transition-all ${
                          snapshot.isDragging ? 'shadow-lg bg-background z-10' : 'hover:bg-muted/25'
                        }`}
                      >
                        {editingMember === member.squareId ? (
                          /* Editing Row */
                          <div className="p-4">
                            <div className="grid grid-cols-12 gap-4 items-start">
                              <div className="col-span-1 flex items-center pt-2">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                              
                              <div className="col-span-3">
                                <div className="font-medium">{member.givenName} {member.familyName}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {member.emailAddress && (
                                    <div className="truncate">{member.emailAddress}</div>
                                  )}
                                  {member.phoneNumber && (
                                    <div>{member.phoneNumber}</div>
                                  )}
                                </div>
                              </div>
                              
                              <div className="col-span-2">
                                <label className="text-xs font-medium mb-1 block">
                                  Employment Type *
                                </label>
                                <Select
                                  value={formData.employmentType}
                                  onChange={(e) =>
                                    setFormData({ ...formData, employmentType: e.target.value })
                                  }
                                  className="h-8"
                                >
                                  <option value="CHAIR_RENTAL">Chair Rental</option>
                                  <option value="EMPLOYEE">Employee</option>
                                </Select>
                              </div>
                              
                              <div className="col-span-2">
                                {formData.employmentType === 'EMPLOYEE' && (
                                  <div>
                                    <label className="text-xs font-medium mb-1 block">
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
                                      className="h-8"
                                    />
                                  </div>
                                )}
                                
                                {formData.employmentType === 'CHAIR_RENTAL' && (
                                  <div>
                                    <label className="text-xs font-medium mb-1 block">
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
                                      className="h-8"
                                    />
                                  </div>
                                )}
                              </div>
                              
                              <div className="col-span-2">
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSave(member.squareId)}
                                    className="h-8 px-3"
                                  >
                                    <Save className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="h-8 px-3"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-12 gap-4 mt-3">
                              <div className="col-span-1"></div>
                              <div className="col-span-11">
                                <label className="text-xs font-medium mb-1 block">
                                  Notes
                                </label>
                                <Input
                                  placeholder="Additional notes..."
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                  }
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Display Row */
                          <div className="p-4">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-1 flex items-center">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                              </div>
                              
                              <div className="col-span-3">
                                <div className="font-medium">{member.givenName} {member.familyName}</div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Order: {(member.details?.displayOrder || index + 1)}
                                </div>
                              </div>
                              
                              <div className="col-span-2 text-sm">
                                {member.emailAddress && (
                                  <div className="truncate">{member.emailAddress}</div>
                                )}
                                {member.phoneNumber && (
                                  <div className="text-xs text-muted-foreground">{member.phoneNumber}</div>
                                )}
                              </div>
                              
                              <div className="col-span-2">
                                {member.details?.employmentType ? (
                                  getEmploymentBadge(member.details.employmentType)
                                ) : (
                                  <span className="text-xs text-muted-foreground">Not set</span>
                                )}
                              </div>
                              
                              <div className="col-span-2 text-sm">
                                {member.details?.monthlyRate && (
                                  <div>${member.details.monthlyRate}/month</div>
                                )}
                                {member.details?.chairRentalRate && (
                                  <div>${member.details.chairRentalRate}/rental</div>
                                )}
                                {!member.details?.monthlyRate && !member.details?.chairRentalRate && (
                                  <span className="text-xs text-muted-foreground">Not set</span>
                                )}
                              </div>
                              
                              <div className="col-span-2">
                                <div className="flex gap-1">
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
                              </div>
                            </div>
                            
                            {member.details?.notes && (
                              <div className="grid grid-cols-12 gap-4 mt-2">
                                <div className="col-span-1"></div>
                                <div className="col-span-11">
                                  <div className="text-xs text-muted-foreground">
                                    <span className="font-medium">Notes:</span> {member.details.notes}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>

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