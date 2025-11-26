import v2Client from "@/api/clients/apiClient";

class TeamService {
    // EXISTING METHODS - Employment Details Management
    async getTeamMembersWithDetails() {
        const response = await v2Client.get("/teams/members");
        return response.data;
    }

    async getTeamMemberDetail(teamMemberId) {
        const response = await v2Client.get(`/teams/members/${teamMemberId}/details`);
        return response.data;
    }

    async createOrUpdateTeamMemberDetail(teamMemberId, detailData) {
        const response = await v2Client.put(`/teams/members/${teamMemberId}/details`, detailData);
        return response.data;
    }

    async deleteTeamMemberDetail(teamMemberId) {
        const response = await v2Client.delete(`/teams/members/${teamMemberId}/details`);
        return response.data;
    }

    // JOBS METHODS

    /**
     * Get all available jobs from Square
     * @returns {Promise<Object>} Available jobs
     */
    async getJobs() {
        const response = await v2Client.get("/teams/jobs");
        return response.data;
    }

    // NEW METHODS - Team Member CRUD

    /**
     * Create a new team member (barber) with Square integration
     * @param {Object} barberData - Barber data including basic info and employment details
     * @returns {Promise<Object>} Created barber data from both Square and local DB
     */
    async createBarber(barberData) {
        const response = await v2Client.post("/teams/members", barberData);
        return response.data;
    }

    /**
     * Get a specific team member by ID
     * @param {string} teamMemberId - Square team member ID
     * @returns {Promise<Object>} Team member data
     */
    async getTeamMember(teamMemberId) {
        const response = await v2Client.get(`/teams/members/${teamMemberId}`);
        return response.data;
    }

    /**
     * Update a team member with Square sync
     * @param {string} teamMemberId - Square team member ID
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated team member data
     */
    async updateTeamMember(teamMemberId, updateData) {
        const response = await v2Client.put(`/teams/members/${teamMemberId}`, updateData);
        return response.data;
    }

    /**
     * Deactivate a team member in Square (soft delete)
     * @param {string} teamMemberId - Square team member ID
     * @returns {Promise<Object>} Deactivated team member data
     */
    async deactivateTeamMember(teamMemberId) {
        const response = await v2Client.delete(`/teams/members/${teamMemberId}`);
        return response.data;
    }

    // SERVICE MANAGEMENT METHODS

    /**
     * Get all services for a specific team member
     * @param {string} teamMemberId - Square team member ID
     * @returns {Promise<Object>} Array of services assigned to the team member
     */
    async getTeamMemberServices(teamMemberId) {
        const response = await v2Client.get(`/teams/members/${teamMemberId}/services`);
        return response.data;
    }

    /**
     * Create services for a team member
     * @param {string} teamMemberId - Square team member ID
     * @param {Object} serviceData - Service data including barber name, category, and services array
     * @returns {Promise<Object>} Created services data
     */
    async createTeamMemberServices(teamMemberId, serviceData) {
        const response = await v2Client.post(`/teams/members/${teamMemberId}/services`, serviceData);
        return response.data;
    }

    /**
     * Update a specific service
     * @param {string} serviceId - Square service variation ID
     * @param {Object} updateData - Service update data
     * @returns {Promise<Object>} Updated service data
     */
    async updateService(serviceId, updateData) {
        // Note: This assumes we pass the teamMemberId in the updateData or handle it differently
        // For now, we'll need to modify this when we know the team member ID
        const response = await v2Client.put(`/teams/members/services/${serviceId}`, updateData);
        return response.data;
    }

    /**
     * Delete a specific service
     * @param {string} teamMemberId - Square team member ID
     * @param {string} serviceId - Square service variation ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    async deleteService(teamMemberId, serviceId) {
        const response = await v2Client.delete(`/teams/members/${teamMemberId}/services/${serviceId}`);
        return response.data;
    }

    // CATEGORY MANAGEMENT METHODS

    /**
     * Create a category for a barber
     * @param {string} teamMemberId - Square team member ID
     * @param {string} barberName - Barber's first name
     * @param {string} instagramHandle - Instagram handle (without @)
     * @returns {Promise<Object>} Created category data
     */
    async createBarberCategory(teamMemberId, barberName, instagramHandle) {
        const response = await v2Client.post(`/teams/members/${teamMemberId}/category`, {
            barberName,
            instagramHandle,
        });
        return response.data;
    }

    // BOOKING PROFILE METHODS

    /**
     * Get team member booking profile
     * @param {string} teamMemberId - Square team member ID
     * @returns {Promise<Object>} Booking profile data
     */
    async getTeamMemberBookingProfile(teamMemberId) {
        const response = await v2Client.get(`/teams/members/${teamMemberId}/booking-profile`);
        return response.data;
    }

    /**
     * Enable barber booking profile with created services
     * @param {string} teamMemberId - Square team member ID
     * @param {Object} servicesData - Created services data
     * @returns {Promise<Object>} Booking profile configuration result
     */
    async enableBarberBookingProfile(teamMemberId, servicesData) {
        const response = await v2Client.post(`/teams/members/${teamMemberId}/booking-profile`, {
            servicesData,
        });
        return response.data;
    }

    // IMAGE UPLOAD METHODS

    /**
     * Upload profile image for a barber
     * @param {string} teamMemberId - Square team member ID
     * @param {File} imageFile - Image file to upload
     * @returns {Promise<Object>} Upload result with image URL
     */
    async uploadProfileImage(teamMemberId, imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await v2Client.post(`/teams/members/${teamMemberId}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    /**
     * Update profile image for a barber
     * @param {string} teamMemberId - Square team member ID
     * @param {File} imageFile - New image file to upload
     * @returns {Promise<Object>} Upload result with image URL
     */
    async updateProfileImage(teamMemberId, imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await v2Client.put(`/teams/members/${teamMemberId}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    }

    /**
     * Delete profile image for a barber
     * @param {string} teamMemberId - Square team member ID
     * @returns {Promise<Object>} Deletion confirmation
     */
    async deleteProfileImage(teamMemberId) {
        const response = await v2Client.delete(`/teams/members/${teamMemberId}/image`);
        return response.data;
    }
}

export default new TeamService();
