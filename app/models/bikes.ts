export enum BikeFilterType {
    ENUM,
    RANGE,
    BOOLEAN,
}

export interface RangeType {
    type: BikeFilterType.RANGE,
    label: string,
    range: number[],
    defaultValue: number[],
}

export interface EnumOption {
    label: string,
    value: string,
}

export interface EnumType {
    type: BikeFilterType.ENUM,
    label: string,
    options: EnumOption[],
    defaultValue: string[],
}

export interface BooleanType {
    type: BikeFilterType.BOOLEAN,
    label: string,
    defaultValue: string[],
}

export interface BikeFilterDescriptionType {
    [fieldName: string]: RangeType | EnumType | BooleanType
}

export const BikeFilterDescription: BikeFilterDescriptionType = {
    battery_life: {
        type: BikeFilterType.RANGE,
        label: "Autonomie",
        range: [0, 200],
        defaultValue: [0, 200],
    },
    motor_kind: {
        type: BikeFilterType.ENUM,
        label: "Type de moteur",
        options: [{
            label: "Roue Arrière",
            value: "rear",
          },
          {
            label: "Pédalier",
            value: "center",
          },
          {
            label: "Roue Avant",
            value: "front",
          },
        ],
        defaultValue: ["rear", "center", "front"],
    },
    integrated_lights: {
        type: BikeFilterType.BOOLEAN,
        label: "Lumières intégrées",
        defaultValue: ["true", "false"],
    },
    removable_battery: {
        type: BikeFilterType.BOOLEAN,
        label: "Batterie amovible",
        defaultValue: ["true", "false"],
    },
    front_brakes: {
        type: BikeFilterType.ENUM,
        label: "Freins avant",
        options: [{
            label: "A disque hydraulique",
            value: "hydraulic_disc",
          },
          {
            label: "A disque mécanique",
            value: "mechanical_disc",
          },
          {
            label: "A patins",
            value: "rim",
          },
        ],
        defaultValue: ["hydraulic_disc", "mechanical_disc", "rim"],
    },
    rear_brakes: {
        type: BikeFilterType.ENUM,
        label: "Freins arrière",
        options: [{
            label: "A disque hydraulique",
            value: "hydraulic_disc",
          },
          {
            label: "A disque mécanique",
            value: "mechanical_disc",
          },
          {
            label: "A patins",
            value: "rim",
          },
        ],
        defaultValue: ["hydraulic_disc", "mechanical_disc", "rim"],
    }
}