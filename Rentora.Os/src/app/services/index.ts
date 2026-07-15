// Typed data-access layer. UI never queries Supabase directly — it goes through
// these domain services so auth, error handling, and query shapes stay in one place.
export * as authService from "./auth";
export * as sessionService from "./session";
export * as applicationsService from "./applications";
export * as invitationsService from "./invitations";
export * as propertiesService from "./properties";
export * as unitsService from "./units";
export * as tenanciesService from "./tenancies";
export * as agenciesService from "./agencies";
export * as adminService from "./admin";
export * as metricsService from "./metrics";
