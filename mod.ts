export interface ITarget {
  name: string;
  dependencies?: string[];
}

export class GraphError extends Error {
  constructor(
    message: string,
    public readonly targets: string[],
  ) {
    super(message);
  }
}

/**
 * Khan's algorithm for topographical sorting
 * https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm
 *
 * L ← Empty list that will contain the sorted elements
 * S ← Set of all nodes with no incoming edges
 * while S is non-empty do
 *   remove a node n from S
 *   add n to tail of L
 *   for each node m with an edge e from n to m do
 *     remove edge e from the graph
 *     if m has no other incoming edges then
 *       insert m into S
 * if graph has edges then
 *   return error (graph has at least one cycle)
 * else
 * return L (a topologically sorted order)
 *
 * note:
 * 'no incoming edges' means no dependencies on.
 * This means that edges is an index of what other targets depend on it.
 *
 * @param {ITarget[]} targets
 * @returns {ITarget[]} The targets sorted
 */
export function topographicalSort(targets: ITarget[]): ITarget[] {
  const index: Record<string, ITarget> = {};
  const edges: Record<string, string[]> = {};
  const L: ITarget[] = [];
  const S: ITarget[] = [];

  // Generate index and edges
  targets.forEach((target) => {
    const { name, dependencies = [] } = target;
    index[name] = target;
    if (!edges[name]) edges[name] = [];
    if (dependencies) {
      dependencies.forEach((d) => {
        if (!edges[d]) edges[d] = [];
        edges[d].push(name);
      });
    }
  });

  // Find targets with no incoming edges.
  for (const t of Object.keys(edges)) {
    if (!edges[t].length) {
      delete edges[t];
      S.push(index[t]);
    }
  }

  // Slowly remove edges starting with nodes in S, when a node has no incoming edges insert into L.
  while (S.length) {
    const n = S.shift()!;
    L.unshift(n);
    if (n.dependencies) {
      n.dependencies.forEach((m) => {
        const i = edges[m].indexOf(n.name);
        edges[m].splice(i, 1);
        if (!edges[m].length) {
          S.unshift(index[m]);
          delete edges[m];
        }
      });
    }
  }

  // If there are any remaining edges, there is a circular graph.
  const remainingEdges = Object.keys(edges);
  if (remainingEdges.length) {
    throw new GraphError(
      "No valid build target: Graph has at least one cycle.",
      remainingEdges,
    );
  }

  return L;
}
