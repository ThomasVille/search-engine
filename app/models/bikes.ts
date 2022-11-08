export enum BikeFilterType {
    ENUM, // Enumeration of strings.
    RANGE, // Number that will be filtered by a range.
    BOOLEAN, // Boolean.
    STRING, // Arbitrary string that's not part of an enumeration.
    NUMBER, // Arbitrary number that can't be part of a range.
}

export interface RangeFilter {
    type: BikeFilterType.RANGE,
    label: string,
    unit: string,
    range: number[],
}

export interface EnumOption {
    label: string,
    value: string,
}

export interface EnumFilter {
    type: BikeFilterType.ENUM,
    label: string,
    options: EnumOption[],
}

export interface BooleanFilter {
    type: BikeFilterType.BOOLEAN,
    label: string,
}

export interface StringFilter {
  type: BikeFilterType.STRING,
  label: string,
}

export interface NumberFilter {
  type: BikeFilterType.NUMBER,
  label: string,
}

export type AnyFilter = RangeFilter | EnumFilter | BooleanFilter | StringFilter | NumberFilter

export interface BikeFilterCollection {
    [fieldName: string]: AnyFilter
}

export const BikeFilters: BikeFilterCollection = {
    kind: {
        type: BikeFilterType.ENUM,
        label: "Type de vélo",
        options: [{
            label: "VTT",
            value: "vtt",
          },
          {
            label: "VTC",
            value: "vtc",
          },
          {
            label: "Ville",
            value: "city",
          },
          {
            label: "Pliant",
            value: "folding",
          },
          {
            label: "Cargo",
            value: "cargo",
          },
        ],
    },
    battery_life: {
        type: BikeFilterType.RANGE,
        label: "Autonomie",
        unit: "km",
        range: [0, 200],
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
    },
    integrated_lights: {
        type: BikeFilterType.BOOLEAN,
        label: "Lumières intégrées",
    },
    removable_battery: {
        type: BikeFilterType.BOOLEAN,
        label: "Batterie amovible",
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
    },

    product_name: {
      type: BikeFilterType.STRING,
      label: "Nom",
    },
    price: {
      type: BikeFilterType.NUMBER,
      label: "Prix",
    }
}

export function getDefaultRangeValue(filter: RangeFilter) {
    return filter.range;
}
export function getDefaultEnumValue(filter: EnumFilter) {
    return filter.options.map(o => o.value);
}
export function getDefaultBooleanValue() {
    return ["true", "false"];
}
export function getDefaultValue(filter: AnyFilter) : string[] | number[] {
  switch (filter.type) {
    case BikeFilterType.ENUM:
      return getDefaultEnumValue(filter);
    case BikeFilterType.RANGE:
      return getDefaultRangeValue(filter);
    case BikeFilterType.BOOLEAN:
      return getDefaultBooleanValue();
    case BikeFilterType.STRING:
      return [""];
    case BikeFilterType.NUMBER:
      return [0];
  }
}

export const NB_ELEMENTS_PER_PAGE = 12;

export interface SortDetails {
  field: string
  ascending: boolean
}

export function getSortDetails(sortField: string): SortDetails {
  const parts = sortField.split('.');

  if (parts.length !== 2) {
    console.error(`Invalid sortField ${sortField}`);
    return {
      field: 'price',
      ascending: true
    }
  }

  return {
    field: parts[0],
    ascending: parts[1] === "asc",
  };
}

export function canSort(filter: AnyFilter) {
  return filter.type === BikeFilterType.RANGE || filter.type === BikeFilterType.NUMBER;
}