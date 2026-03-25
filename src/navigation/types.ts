import type { NavigatorScreenParams } from "@react-navigation/native";
import type { NoosModuleId } from "../types/noos";

export type ModulesStackParamList = {
  ModulesList: undefined;
  ModuleDetail: { moduleId: NoosModuleId };
};

export type RootTabParamList = {
  Home: undefined;
  Modules: NavigatorScreenParams<ModulesStackParamList>;
  Flows: undefined;
  Profile: undefined;
};
