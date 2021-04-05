import { Sprint, SprintId, Commit, EntityGroups } from './types';
import { ChartData, OutputSprint, OutputUser } from './stories';

export default function getChartData({
  entities,
  groupedCommits,
  selectedSprintId,
  outputUsers,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Commit[]>;
  selectedSprintId: SprintId;
  outputUsers: OutputUser[];
}): ChartData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  const sortedSprints = Array.from(entities.sprints.values()).sort(({ id: id1 }, { id: id2 }) => id1 - id2);
  const outputValues: OutputSprint[] = sortedSprints.map((sprint) => {
    const group = groupedCommits.get(sprint.id) as Commit[];
    const result: OutputSprint = {
      title: sprint.id.toString(),
      value: group.length,
    };

    if (sprint.name) {
      result.hint = sprint.name;
    }

    if (sprint.id === selectedSprintId) {
      result.active = true;
    }

    return result;
  });

  return {
    title: 'Коммиты',
    subtitle: currentSprint.name,
    values: outputValues,
    users: outputUsers,
  };
}
