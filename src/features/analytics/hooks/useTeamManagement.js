import { useState, useCallback } from "react";
import teamService from "../services/teamService";

export const useTeamManagement = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTeamMembers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await teamService.getTeamMembersWithDetails();
            if (response.success) {
                setTeamMembers(response.data);
            } else {
                throw new Error(response.error || "Failed to fetch team members");
            }
        } catch (err) {
            setError(err);
            console.error("Error fetching team members:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateTeamMemberDetail = useCallback(async (teamMemberId, detailData) => {
        try {
            const response = await teamService.createOrUpdateTeamMemberDetail(teamMemberId, detailData);
            if (response.success) {
                // Update the local state
                setTeamMembers((prev) =>
                    prev.map((member) =>
                        member.squareId === teamMemberId ? { ...member, details: response.data.details } : member,
                    ),
                );
                return response.data;
            } else {
                throw new Error(response.error || "Failed to update team member detail");
            }
        } catch (err) {
            console.error("Error updating team member detail:", err);
            throw err;
        }
    }, []);

    const deleteTeamMemberDetail = useCallback(async (teamMemberId) => {
        try {
            const response = await teamService.deleteTeamMemberDetail(teamMemberId);
            if (response.success) {
                // Update the local state
                setTeamMembers((prev) =>
                    prev.map((member) => (member.squareId === teamMemberId ? { ...member, details: null } : member)),
                );
                return true;
            } else {
                throw new Error(response.error || "Failed to delete team member detail");
            }
        } catch (err) {
            console.error("Error deleting team member detail:", err);
            throw err;
        }
    }, []);

    return {
        teamMembers,
        loading,
        error,
        fetchTeamMembers,
        updateTeamMemberDetail,
        deleteTeamMemberDetail,
    };
};
