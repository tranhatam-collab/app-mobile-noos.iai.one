export type NoosModuleId =
  | "identity"
  | "companion"
  | "search"
  | "flow"
  | "twin"
  | "map"
  | "governance"
  | "economy"
  | "learning";

export type NoosModule = {
  id: NoosModuleId;
  title: string;
  subtitle: string;
  icon: string;
};
