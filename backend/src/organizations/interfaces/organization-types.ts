export enum OrganizationTypes {
  ASEGURADORA = 'aseguradora',
  TALLER = 'taller',
  CONCESIONARIA = 'concesionaria',
}

export const OrganizationTypeDescriptions = {
  [OrganizationTypes.ASEGURADORA]: 'Compañía Aseguradora',
  [OrganizationTypes.TALLER]: 'Taller Mecánico Autorizado',
  [OrganizationTypes.CONCESIONARIA]: 'Concesionaria de Vehículos',
};