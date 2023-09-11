export interface Entity {
  tag: {
    movingEntity: {
      Occupants: Occupant[];
    };
  };
}

export interface Occupant {
  SaveData: {
    Actions: string;
    Trident?: Entity;
  };
}

export interface Action {
  button_name: string;
  data: ActionData[];
  mode: number;
  text: string;
  type: number;
}

export interface ActionData {
  cmd_line: string;
  cmd_ver: number;
}