import { Sprint, SprintId, CommitId, EntityGroups } from './types';
import { DiagramData } from './stories';
import { getOutput, groupCommitsBySize } from './util';

export default function getDiagramData({
  entities,
  groupedCommits,
  selectedSprintId,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Set<CommitId>>;
  selectedSprintId: number;
}): DiagramData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  const previousCommits = groupedCommits.get(selectedSprintId - 1) as Set<CommitId>;
  const currentCommits = groupedCommits.get(selectedSprintId) as Set<CommitId>;
  const sizeGroupedCurrentCommits = groupCommitsBySize(entities, currentCommits);
  const sizeGroupedPreviousCommits = groupCommitsBySize(entities, previousCommits);
  const previousCommitsTotal = sizeGroupedCurrentCommits.map((commits) => commits.length);
  const currentCommitsTotal = sizeGroupedPreviousCommits.map((commits) => commits.length);
  const differences: number[] = [];

  for (let i = 0; i < 4; ++i) {
    const diff = previousCommitsTotal[i] - currentCommitsTotal[i];
    differences.push(diff);
  }

  const totalDifference = differences.reduce((accum, diff) => accum + diff);
  const categories = ['> 1001 строки', '501 — 1000 строк', '101 — 500 строк', '1 — 100 строк'].map((title, index) => ({
    title,
    valueText: getOutput(sizeGroupedCurrentCommits[index].length, ['коммит', 'коммита', 'коммитов']),
    differenceText: getOutput(differences[index], ['коммит', 'коммита', 'коммитов']),
  }));

  return {
    title: 'Размер коммитов',
    subtitle: currentSprint.name,
    totalText: getOutput(currentCommits.size, ['коммит', 'коммита', 'коммитов']),
    differenceText: `${totalDifference} с прошлого спринта`,
    categories,
  };
}
