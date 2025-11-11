import type { Inputs, RoleScope } from "@/lib/farient/types";
import type { ROLE_BANDS } from "@/lib/roles";

export type RoleBandKey = (typeof ROLE_BANDS)[number]["key"];

export type RoleBandSelection = {
  bandKey: RoleBandKey;
  roleLabel: string;
};

export type BuilderState = Omit<Inputs, "role"> & {
  role?: Partial<RoleScope>;
  roleBand?: RoleBandSelection;
};

export const initialBuilderState: BuilderState = {};
