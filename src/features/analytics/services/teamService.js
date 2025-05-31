import v2Client from '@/api/clients/apiClient';

class TeamService {
  async getTeamMembersWithDetails() {
    const response = await v2Client.get('/teams/members');
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
}

export default new TeamService();