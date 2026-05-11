import PaginationRoot, { Next, Pages, Prev } from "./Pagination";

const Pagination = Object.assign(PaginationRoot, { Prev, Next, Pages });

export default Pagination;
export { PAGE_PARAM, parsePage, buildPageHref } from "./params";
export type { PaginationSearchParams, PaginationState } from "./params";
