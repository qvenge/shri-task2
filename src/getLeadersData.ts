import { Sprint, SprintId, CommitId, EntityGroups, User } from './types';
import { LeadersData } from './stories';
import { groupCommitsByUsers } from './util';

export default function getLeadersData({
  entities,
  groupedCommits,
  selectedSprintId,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Set<CommitId>>;
  selectedSprintId: number;
}): LeadersData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  const currentCommits = groupedCommits.get(selectedSprintId) as Set<CommitId>;
  const commitsGroupedByUsers = groupCommitsByUsers(entities, currentCommits);

  const outputUsers = Array.from(commitsGroupedByUsers, ([userId, commits]) => {
    const userEntity = entities.users.get(userId) as User;
    return {
      id: userId,
      name: userEntity.name,
      avatar: userEntity.avatar,
      valueText: String(commits.size),
    };
  });
  outputUsers.sort((user1, user2) => {
    let val1 = Number(user1.valueText);
    let val2 = Number(user2.valueText);

    if (val1 === val2) {
      val1 = user2.id;
      val2 = user1.id;
    }

    return val2 - val1;
  });

  return {
    title: 'Больше всего коммитов',
    subtitle: currentSprint.name,
    emoji: '👑',
    users: outputUsers,
  };
}
