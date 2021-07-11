import { assertThrows, equal } from "./deps.dev.ts";
import { ITarget, topographicalSort } from "./mod.ts";

Deno.test(
  "Single dependency resolves",
  () => {
    const targets: ITarget[] = [
      { name: "A", dependencies: ["B"] },
      { name: "B" },
    ];

    const actual = topographicalSort(targets);
    equal(actual, targets);
  },
);

Deno.test(
  "Single dependency out of order resolves correctly",
  () => {
    const targets: ITarget[] = [
      { name: "B" },
      { name: "A", dependencies: ["B"] },
    ];

    const actual = topographicalSort(targets);
    equal(actual, [
      { name: "A", dependencies: ["B"] },
      { name: "B" },
    ]);
  },
);

Deno.test(
  "Diamond dependency resolves correctly",
  () => {
    const targets: ITarget[] = [
      { name: "B", dependencies: ["D"] },
      { name: "C", dependencies: ["D"] },
      { name: "A", dependencies: ["B", "C"] },
      { name: "D" },
    ];

    const actual = topographicalSort(targets);
    equal(actual, [
      { name: "A", dependencies: ["B", "C"] },
      { name: "B", dependencies: ["D"] },
      { name: "C", dependencies: ["D"] },
      { name: "D" },
    ]);
  },
);

Deno.test(
  "Circular dependency throws",
  () => {
    const targets: ITarget[] = [
      { name: "A", dependencies: ["B"] },
      { name: "B", dependencies: ["A"] },
    ];
    assertThrows(() => topographicalSort(targets));
  },
);
