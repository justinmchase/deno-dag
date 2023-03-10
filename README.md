# Deno DAG 🦕

A Directed Asyclic Graph (DAG) resolver for Deno

Based on
[Kahn's algorithm](https://en.wikipedia.org/wiki/Topological_sorting#Kahn's_algorithm)
for topographical sorting.

# Setup

```ts
import { topographicalSort } from "https://deno.land/x/dag/mod.ts";

//         A
//        / \
//       B   C
//        \ /
//         D
const targets = [
  { name: "D" },
  { name: "A", dependencies: ["B", "C"] },
  { name: "C", dependencies: ["D"] },
  { name: "B", dependencies: ["D"] },
];

const sorted = topographicalSort(targets);
console.log(sorted.map(({ name }) => name)); // A,B,C,D
```
