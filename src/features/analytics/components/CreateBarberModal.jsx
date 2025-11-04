import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  User, 
  Briefcase, 
  Scissors, 
  Check, 
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const CreateBarberModal = ({ isOpen, onClose, onSuccess, teamService, existingMembers = [] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    givenName: '',
    familyName: '',
    emailAddress: '',
    phoneNumber: '',
    instagramHandle: ''
  });
  
  // Form data state
  const [formData, setFormData] = useState({
    // Basic info (Step 1)
    givenName: '',
    familyName: '',
    emailAddress: '',
    phoneNumber: '',
    instagramHandle: '',
    profileImage: null, // File object for upload
    profileImagePreview: null, // URL for preview
    jobAssignments: [], // Array of {job_id, pay_type, rate, weeklyHours}

    // Employment details (Step 2)
    employmentType: 'EMPLOYEE',
    monthlyRate: '',
    chairRentalRate: '',
    notes: '',

    // Services (Step 3)
    services: [
      {
        name: '',
        duration: 60,
        price: 50,
        type: 'O',
        variations: []
      }
    ]
  });

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Employment Details', icon: Briefcase },
    { id: 3, title: 'Services Setup', icon: Scissors }
  ];

  // Validation function for checking duplicates
  const validateField = (field, value) => {
    let errorMessage = '';

    // Only validate string fields that need duplicate checking
    const validatableFields = ['givenName', 'familyName', 'emailAddress', 'phoneNumber', 'instagramHandle'];
    if (!validatableFields.includes(field)) {
      return errorMessage; // Skip validation for non-string fields
    }

    if (!value || typeof value !== 'string' || !value.trim()) {
      return errorMessage; // Don't validate empty fields here
    }

    switch (field) {
      case 'givenName':
      case 'familyName':
        // Check if name combination already exists
        const fullName = field === 'givenName'
          ? `${value} ${formData.familyName}`.trim()
          : `${formData.givenName} ${value}`.trim();

        const nameExists = existingMembers.some(member => {
          const existingFullName = `${member.givenName} ${member.familyName}`.trim();
          return existingFullName.toLowerCase() === fullName.toLowerCase();
        });

        if (nameExists && fullName) {
          errorMessage = `A barber named "${fullName}" already exists`;
        }
        break;

      case 'emailAddress':
        if (value.trim()) {
          // Basic email format validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = 'Please enter a valid email address';
          } else {
            // Check for duplicate email
            const emailExists = existingMembers.some(member =>
              member.emailAddress && member.emailAddress.toLowerCase() === value.toLowerCase()
            );
            if (emailExists) {
              errorMessage = 'This email address is already in use';
            }
          }
        }
        break;

      case 'phoneNumber':
        if (value.trim()) {
          // Check for duplicate phone number
          const phoneExists = existingMembers.some(member =>
            member.phoneNumber && member.phoneNumber === value
          );
          if (phoneExists) {
            errorMessage = 'This phone number is already in use';
          }
        }
        break;

      case 'instagramHandle':
        if (value.trim()) {
          // Check for duplicate Instagram handle
          const instagramExists = existingMembers.some(member => {
            const existingHandle = member.details?.instagramHandle;
            return existingHandle && existingHandle.toLowerCase() === value.toLowerCase();
          });
          if (instagramExists) {
            errorMessage = 'This Instagram handle is already in use';
          }
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Only validate fields that need duplicate checking
    const validatableFields = ['givenName', 'familyName', 'emailAddress', 'phoneNumber', 'instagramHandle'];

    if (validatableFields.includes(field)) {
      // Validate the field
      const errorMessage = validateField(field, value);
      setValidationErrors(prev => ({
        ...prev,
        [field]: errorMessage
      }));

      // Also re-validate full name if first or last name changes
      if (field === 'givenName') {
        const familyNameError = validateField('familyName', formData.familyName);
        setValidationErrors(prev => ({
          ...prev,
          familyName: familyNameError
        }));
      } else if (field === 'familyName') {
        const givenNameError = validateField('givenName', formData.givenName);
        setValidationErrors(prev => ({
          ...prev,
          givenName: givenNameError
        }));
      }
    }
  };

  const handleServiceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addService = () => {
    setFormData(prev => ({
      ...prev,
      services: [...prev.services, { 
        name: '', 
        duration: 60, 
        price: 50, 
        type: 'O',
        variations: []
      }]
    }));
  };

  const removeService = (index) => {
    if (formData.services.length > 1) {
      setFormData(prev => ({
        ...prev,
        services: prev.services.filter((_, i) => i !== index)
      }));
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        // Check required fields
        if (!formData.givenName.trim() || !formData.familyName.trim()) {
          return false;
        }
        // Check for validation errors
        if (validationErrors.givenName || validationErrors.familyName ||
            validationErrors.emailAddress || validationErrors.phoneNumber ||
            validationErrors.instagramHandle) {
          return false;
        }
        return true;
      case 2:
        if (formData.employmentType === 'EMPLOYEE') {
          return formData.monthlyRate && parseFloat(formData.monthlyRate) > 0;
        } else if (formData.employmentType === 'CHAIR_RENTAL') {
          return formData.chairRentalRate && parseFloat(formData.chairRentalRate) > 0;
        }
        return true;
      case 3:
        // Services step is optional - if user has services, they should be valid
        const servicesWithContent = formData.services.filter(s => s.name.trim());
        return servicesWithContent.length === 0 || servicesWithContent.every(service => 
          service.name.trim() && 
          service.duration && !isNaN(parseInt(service.duration)) && parseInt(service.duration) > 0 &&
          service.price && !isNaN(parseFloat(service.price)) && parseFloat(service.price) > 0
        );
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setError(null);
    } else {
      setError('Please fill in all required fields before continuing.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  // Fetch jobs when modal opens
  useEffect(() => {
    const fetchJobs = async () => {
      if (isOpen && teamService && !isLoadingJobs) {
        setIsLoadingJobs(true);
        try {
          const jobsResponse = await teamService.getJobs();
          setAvailableJobs(jobsResponse.data || []);
        } catch (error) {
          console.error('Error fetching jobs:', error);
          setAvailableJobs([]);
        } finally {
          setIsLoadingJobs(false);
        }
      }
    };

    fetchJobs();
  }, [isOpen, teamService]);

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create barber
      // Prepare wage_setting with job_assignments if any are selected
      let wageSetting = null;
      if (formData.jobAssignments.length > 0) {
        const validAssignments = formData.jobAssignments.filter(a => a.rate && parseFloat(a.rate) > 0);

        if (validAssignments.length > 0) {
          wageSetting = {
            job_assignments: validAssignments.map(assignment => {
              const baseAssignment = {
                job_id: assignment.job_id,
                pay_type: assignment.pay_type
              };

              if (assignment.pay_type === 'SALARY') {
                // Annual salary requires annual_rate and weekly_hours
                baseAssignment.annual_rate = {
                  amount: Math.round(parseFloat(assignment.rate) * 100), // Convert to cents
                  currency: 'AUD' // Australian Dollars
                };
                baseAssignment.weekly_hours = parseInt(assignment.weeklyHours) || 40;
              } else if (assignment.pay_type === 'HOURLY') {
                // Hourly requires hourly_rate (no weekly_hours or annual_rate)
                baseAssignment.hourly_rate = {
                  amount: Math.round(parseFloat(assignment.rate) * 100), // Convert to cents
                  currency: 'AUD' // Australian Dollars
                };
              }

              return baseAssignment;
            })
          };
        }
      }

      const barberData = {
        givenName: formData.givenName,
        familyName: formData.familyName,
        emailAddress: formData.emailAddress || null,
        phoneNumber: formData.phoneNumber || null,
        wageSetting: wageSetting,
        employmentDetails: {
          employmentType: formData.employmentType,
          monthlyRate: formData.employmentType === 'EMPLOYEE' ? parseFloat(formData.monthlyRate) : null,
          chairRentalRate: formData.employmentType === 'CHAIR_RENTAL' ? parseFloat(formData.chairRentalRate) : null,
          notes: formData.notes || null,
          instagramHandle: formData.instagramHandle || null
        }
      };

      const createdBarber = await teamService.createBarber(barberData);
      
      // Extract the team member ID from the response
      const teamMemberId = createdBarber.data.square.id;
      
      // Step 2: Upload profile image (if provided)
      if (formData.profileImage) {
        try {
          await teamService.uploadProfileImage(teamMemberId, formData.profileImage);
          console.log('✅ Profile image uploaded successfully');
        } catch (imageError) {
          console.error('Failed to upload profile image:', imageError);
          // Don't fail the whole operation if image upload fails
          setError('Barber created but image upload failed. You can update the image later.');
        }
      }

      // Step 3: Create category (if Instagram handle provided)
      let categoryId = null;
      if (formData.instagramHandle) {
        const createdCategory = await teamService.createBarberCategory(
          teamMemberId,
          formData.givenName,
          formData.instagramHandle
        );
        console.log('Created category response:', createdCategory);
        console.log('Category data:', createdCategory.data);
        categoryId = createdCategory.data.id; // Capture the category ID
        console.log('Extracted categoryId:', categoryId);

        // Add a small delay to ensure category is fully created in Square
        console.log('Waiting for category to be fully processed...');
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      }

      // Step 4: Create services (if any provided)
      const validServices = formData.services.filter(service =>
        service.name.trim() &&
        service.duration &&
        service.price &&
        !isNaN(parseFloat(service.price)) &&
        !isNaN(parseInt(service.duration))
      );

      if (validServices.length > 0) {
        const serviceData = {
          barberName: formData.givenName,
          categoryId: categoryId, // Use the actual created category ID
          services: validServices.map(service => {
            // Automatically add "By [BarberName]" to service name if not already present
            let serviceName = service.name.trim();
            const byPattern = /\bby\b/i; // Case-insensitive "by" word

            if (!byPattern.test(serviceName)) {
              // Add "By [BarberName]" to the service name
              serviceName = `${serviceName} By ${formData.givenName}`;
            }

            return {
              name: serviceName,
              duration: parseInt(service.duration) || 60,
              price: parseFloat(service.price) || 50,
              type: service.type
            };
          })
        };
        
        const createdServices = await teamService.createTeamMemberServices(teamMemberId, serviceData);
        
        // Step 4: Enable barber booking profile with the created services
        if (createdServices?.data) {
          await teamService.enableBarberBookingProfile(teamMemberId, createdServices.data);
        }
      }

      onSuccess?.(createdBarber);
      handleClose();
    } catch (err) {
      console.error('Error creating barber:', err);
      setError(err.message || 'Failed to create barber. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle profile image selection
   */
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file format. Please upload PNG, JPG, or JPEG only.');
      return;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Image size must be less than 5MB.');
      return;
    }

    // Revoke previous preview URL to avoid memory leaks
    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);

    setFormData(prev => ({
      ...prev,
      profileImage: file,
      profileImagePreview: previewUrl
    }));
    setError(null);
  };

  /**
   * Remove selected image
   */
  const handleRemoveImage = () => {
    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImagePreview: null
    }));
  };

  const handleClose = () => {
    // Clean up image preview URL
    if (formData.profileImagePreview) {
      URL.revokeObjectURL(formData.profileImagePreview);
    }

    setCurrentStep(1);
    setFormData({
      givenName: '',
      familyName: '',
      emailAddress: '',
      phoneNumber: '',
      instagramHandle: '',
      profileImage: null,
      profileImagePreview: null,
      jobAssignments: [],
      employmentType: 'EMPLOYEE',
      monthlyRate: '',
      chairRentalRate: '',
      notes: '',
      services: [{ name: '', duration: 60, price: 50, type: 'O', variations: [] }]
    });
    setValidationErrors({
      givenName: '',
      familyName: '',
      emailAddress: '',
      phoneNumber: '',
      instagramHandle: ''
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl">Create New Barber</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center space-y-2">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    ${currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {currentStep > step.id ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-4 ${
                    currentStep > step.id ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <ErrorMessage message={error} className="mb-4" />
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.givenName}
                    onChange={(e) => handleInputChange('givenName', e.target.value)}
                    placeholder="e.g., Anthony"
                    className={`w-full ${validationErrors.givenName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.givenName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.givenName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.familyName}
                    onChange={(e) => handleInputChange('familyName', e.target.value)}
                    placeholder="e.g., Smith"
                    className={`w-full ${validationErrors.familyName ? 'border-red-500' : ''}`}
                  />
                  {validationErrors.familyName && (
                    <p className="text-xs text-red-500 mt-1">{validationErrors.familyName}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  value={formData.emailAddress}
                  onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                  placeholder="anthony@fadedlines.com"
                  className={`w-full ${validationErrors.emailAddress ? 'border-red-500' : ''}`}
                />
                {validationErrors.emailAddress && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.emailAddress}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="+61412345678"
                  className={`w-full ${validationErrors.phoneNumber ? 'border-red-500' : ''}`}
                />
                {validationErrors.phoneNumber && (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.phoneNumber}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Instagram Handle</label>
                <Input
                  value={formData.instagramHandle}
                  onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                  placeholder="anth.cuts (without @)"
                  className={`w-full ${validationErrors.instagramHandle ? 'border-red-500' : ''}`}
                />
                {validationErrors.instagramHandle ? (
                  <p className="text-xs text-red-500 mt-1">{validationErrors.instagramHandle}</p>
                ) : (
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be used for the category name: "{formData.givenName} [IG@{formData.instagramHandle || 'handle'}]"
                  </p>
                )}
              </div>

              {/* Profile Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Profile Image</label>
                <div className="space-y-2">
                  {formData.profileImagePreview ? (
                    <div className="relative inline-block">
                      <img
                        src={formData.profileImagePreview}
                        alt="Profile preview"
                        className="w-32 h-32 object-cover rounded-lg border-2 border-muted"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                        id="profile-image-upload"
                      />
                      <label
                        htmlFor="profile-image-upload"
                        className="cursor-pointer flex flex-col items-center space-y-2"
                      >
                        <User className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Click to upload profile image
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG up to 5MB (min 300x300px)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Assignments */}
              <div>
                <label className="text-sm font-medium mb-2 block">Job Assignments</label>
                {isLoadingJobs ? (
                  <div className="text-sm text-muted-foreground">Loading available jobs...</div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto border rounded-md p-3">
                    {availableJobs.length > 0 ? (
                      availableJobs.map((job) => {
                        const assignment = formData.jobAssignments.find(a => a.job_id === job.id);
                        const isChecked = !!assignment;

                        return (
                          <div key={job.id} className="space-y-2 p-3 border rounded-md bg-muted/30">
                            <label className="flex items-center space-x-2 cursor-pointer">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4"
                                checked={isChecked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    handleInputChange('jobAssignments', [
                                      ...formData.jobAssignments,
                                      {
                                        job_id: job.id,
                                        pay_type: 'HOURLY',
                                        rate: '',
                                        weeklyHours: 40
                                      }
                                    ]);
                                  } else {
                                    handleInputChange('jobAssignments',
                                      formData.jobAssignments.filter(a => a.job_id !== job.id)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm font-medium">{job.title}</span>
                            </label>

                            {isChecked && (
                              <div className="ml-6 space-y-2 pt-2">
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <label className="text-xs font-medium mb-1 block">Pay Type</label>
                                    <Select
                                      value={assignment.pay_type}
                                      onChange={(e) => {
                                        const updated = formData.jobAssignments.map(a =>
                                          a.job_id === job.id
                                            ? { ...a, pay_type: e.target.value }
                                            : a
                                        );
                                        handleInputChange('jobAssignments', updated);
                                      }}
                                      className="h-8 text-xs"
                                    >
                                      <option value="HOURLY">Hourly</option>
                                      <option value="SALARY">Salary</option>
                                    </Select>
                                  </div>

                                  <div>
                                    <label className="text-xs font-medium mb-1 block">
                                      {assignment.pay_type === 'SALARY' ? 'Annual ($)' : 'Hourly ($)'}
                                    </label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      value={assignment.rate}
                                      onChange={(e) => {
                                        const updated = formData.jobAssignments.map(a =>
                                          a.job_id === job.id
                                            ? { ...a, rate: e.target.value }
                                            : a
                                        );
                                        handleInputChange('jobAssignments', updated);
                                      }}
                                      className="h-8 text-xs"
                                      min="0"
                                    />
                                  </div>

                                  {assignment.pay_type === 'SALARY' && (
                                    <div>
                                      <label className="text-xs font-medium mb-1 block">Weekly Hrs</label>
                                      <Input
                                        type="number"
                                        placeholder="40"
                                        value={assignment.weeklyHours}
                                        onChange={(e) => {
                                          const updated = formData.jobAssignments.map(a =>
                                            a.job_id === job.id
                                              ? { ...a, weeklyHours: e.target.value }
                                              : a
                                          );
                                          handleInputChange('jobAssignments', updated);
                                        }}
                                        className="h-8 text-xs"
                                        min="1"
                                        max="168"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-sm text-muted-foreground">No jobs available</div>
                    )}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Assign jobs/roles with wage information. This is optional and can be configured later.
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Employment Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Employment Type <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.employmentType}
                  onChange={(e) => handleInputChange('employmentType', e.target.value)}
                  className="w-full"
                >
                  <option value="EMPLOYEE">Employee</option>
                  <option value="CHAIR_RENTAL">Chair Rental</option>
                </Select>
              </div>

              {formData.employmentType === 'EMPLOYEE' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Monthly Rate ($) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.monthlyRate}
                    onChange={(e) => handleInputChange('monthlyRate', e.target.value)}
                    placeholder="4000.00"
                    className="w-full"
                    min="0"
                  />
                </div>
              )}

              {formData.employmentType === 'CHAIR_RENTAL' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Chair Rental Rate ($) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.chairRentalRate}
                    onChange={(e) => handleInputChange('chairRentalRate', e.target.value)}
                    placeholder="200.00"
                    className="w-full"
                    min="0"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Input
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Additional notes about this barber..."
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Step 3: Services Setup */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Services Configuration</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addService}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Service
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Configure the services this barber will provide. You can add more services later.
              </p>

              <div className="space-y-4">
                {formData.services.map((service, index) => (
                  <Card key={index} className="border-2 border-dashed border-muted">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium">Service {index + 1}</h4>
                        {formData.services.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Service Name <span className="text-red-500">*</span>
                          </label>
                          <Input
                            value={service.name}
                            onChange={(e) => handleServiceChange(index, 'name', e.target.value)}
                            placeholder={`Haircut & Beard (will become "Haircut & Beard By ${formData.givenName}")`}
                            className="w-full"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            "By {formData.givenName}" will be automatically added to the service name
                          </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Duration (minutes) <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={service.duration}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = value === '' ? '' : parseInt(value);
                                handleServiceChange(index, 'duration', isNaN(parsed) ? '' : parsed);
                              }}
                              min="5"
                              max="480"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Price ($) <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              step="0.01"
                              value={service.price}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = value === '' ? '' : parseFloat(value);
                                handleServiceChange(index, 'price', isNaN(parsed) ? '' : parsed);
                              }}
                              min="0"
                              className="w-full"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                              value={service.type}
                              onChange={(e) => handleServiceChange(index, 'type', e.target.value)}
                              className="w-full"
                            >
                              <option value="O">Online (O)</option>
                              <option value="M">Manual (M)</option>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={handleNext}
                disabled={!validateStep(currentStep)}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !validateStep(3)}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {loading ? 'Creating...' : 'Create Barber'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateBarberModal;