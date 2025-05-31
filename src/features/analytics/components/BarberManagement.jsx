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
import { Edit2, Save, X, Trash2, Plus } from 'lucide-react';
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
            Manage barber employment types and compensation details
          </p>
        </div>
        <Button variant="outline" onClick={fetchTeamMembers} disabled={loading}>
          {loading ? <LoadingSpinner size="small" /> : 'Refresh'}
        </Button>
      </div>

      <div className="grid gap-4">
        {teamMembers.map((member) => (
          <Card key={member.squareId}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {member.givenName} {member.familyName}
                  </CardTitle>
                  <CardDescription>
                    {member.emailAddress && (
                      <span className="block">{member.emailAddress}</span>
                    )}
                    {member.phoneNumber && (
                      <span className="block">{member.phoneNumber}</span>
                    )}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {member.details?.employmentType && 
                    getEmploymentBadge(member.details.employmentType)
                  }
                  {editingMember === member.squareId ? (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        onClick={() => handleSave(member.squareId)}
                        className="h-8 w-8 p-0"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(member)}
                        className="h-8 w-8 p-0"
                      >
                        {member.details ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </Button>
                      {member.details && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(member.squareId)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingMember === member.squareId ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Employment Type *
                      </label>
                      <Select
                        value={formData.employmentType}
                        onChange={(e) =>
                          setFormData({ ...formData, employmentType: e.target.value })
                        }
                      >
                        <option value="CHAIR_RENTAL">Chair Rental</option>
                        <option value="EMPLOYEE">Employee</option>
                      </Select>
                    </div>
                    
                    {formData.employmentType === 'EMPLOYEE' && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
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
                        />
                      </div>
                    )}
                    
                    {formData.employmentType === 'CHAIR_RENTAL' && (
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Chair Rental Rate ($)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={formData.chairRentalRate}
                          onChange={(e) =>
                            setFormData({ ...formData, chairRentalRate: e.target.value })
                          }
                        />
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">
                      Notes
                    </label>
                    <Input
                      placeholder="Additional notes..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {member.details ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {member.details.monthlyRate && (
                          <div>
                            <span className="font-medium">Monthly Rate:</span> ${member.details.monthlyRate}
                          </div>
                        )}
                        {member.details.chairRentalRate && (
                          <div>
                            <span className="font-medium">Chair Rental Rate:</span> ${member.details.chairRentalRate}
                          </div>
                        )}
                      </div>
                      {member.details.notes && (
                        <div className="text-sm">
                          <span className="font-medium">Notes:</span> {member.details.notes}
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No employment details configured. Click the + button to add details.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {teamMembers.length === 0 && !loading && (
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