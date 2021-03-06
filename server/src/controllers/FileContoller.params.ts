import { Length, Max, Min, MinLength, minLength } from "class-validator";

export class DefaultPaginationQueryParams {
  @Min(1)
  @Max(50)
  limit: number;
}
export class CursorPaginationQueryParams extends DefaultPaginationQueryParams {
  "cursor-realName"?: string;
  "cursor-fileName"?: string;
}

export class OffsetPaginationQueryParams extends DefaultPaginationQueryParams {
  offset?: number;
}

export class CursorPaginatedByDateQueryParams extends DefaultPaginationQueryParams {
  "cursor-updatedAt"?: string;
  "cursor-fileName"?: string;
}

export class GetThumbnailParams {
  fileName: string;
}

export class SearchParams {
  @MinLength(5)
  searchString: string;

  limit?: number | null;
  page?: number;
}
