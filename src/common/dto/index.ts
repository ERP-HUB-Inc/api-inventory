import { In, Like, Between } from 'typeorm';

export interface FilterDto {
  limit?: any;
  offset?: any;
  sortField?: string;
  sortOrder?: string;
  condition?: object;
  userId?: string;
  isFullAccess?: boolean;
  advanceFilter?: AdvanceFilterDto[];
  languageId?: string;
  locationId?: string;
  date?: string;
  rangFilter?: string;
  similar?: string;
  select?: string[];
  relations?: string[];
}

export interface AdvanceFilterDto {
  column: string;
  value: any[];
  operator?: string;
  conjunction?: string;
}

export interface RangFilter {
  column: string;
  value: [any, any];
}

export interface QueryBuilderRelationship {
  entityName: string;
  aliasName?: string;
  relation: string;
  subRelation?: object;
  subRelationCondition?: [string, object];
  relationType?: 'INNER' | 'LEFT';
  condition?: [string, object];
  select?: any[];
}

export function toAdvanceSearch(
  existingCondition = [],
  columns: string[],
  search: string,
) {
  if (existingCondition == null) {
    existingCondition.push({});
  }

  for (let i = 0; i < columns.length; i++) {
    if (i == 0) {
      existingCondition[0][columns[i]] = Like(`%${search}%`);
    } else {
      existingCondition.push({ [columns[i]]: Like(`%${search}%`) });
    }
  }

  return existingCondition;
}

export function toAdvanceFilterArr<T>(data: any): T[] {
  if (data == null || !isJsonString(data)) return [];

  data = JSON.parse(data); // {"status": [0,1], "type": [0, 1]}

  let filter: T[] = [];
  for (var property in data) {
    if (data.hasOwnProperty(property)) {
      filter.push(
        toAdvanceFilter<T>({ column: property, value: data[property] }),
      );
    }
  }
  return filter;
}

export function toRangFilter(existingFilter: any, data: any) {
  if (data == null || !isJsonString(data)) {
    return existingFilter;
  }

  data = JSON.parse(data);

  const column = data['column'];

  const value = data['value'];

  existingFilter[column] = Between(value[0], value[1]);

  return existingFilter;
}

export function toAdvanceFilter<T>(data: any): T {
  return data;
}

/**
 * 
 * @param existingFilter 
 * @param filter [{ "status": [0,1]}
]
 */
export function generateFilter(
  existingFilter: any,
  filter: AdvanceFilterDto[] = [],
) {
  var length = filter.length;
  for (var i = 0; i < length; i++) {
    existingFilter[filter[i].column] = In(filter[i].value);
  }
  return existingFilter;
}

export function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export interface PaginationOptionsDto {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: 'ASC' | 'DESC';
  withDeleted?: boolean;
}
