import featureJson from "../../../../config/features.json";

// #region License Helpers
export enum FeatureAvailabilityStatus {
  Available,
  InsufficientLicense,
}

export function getFeatureAvailabilityStatus(
  licenseStatus: LicenseStatus,
  feature: FeatureName
): FeatureAvailabilityStatus {
  switch (licenseStatus) {
    case LicenseStatus.Inactive:
    case LicenseStatus.Free:
      return FreeFeatures.has(feature)
        ? FeatureAvailabilityStatus.Available
        : FeatureAvailabilityStatus.InsufficientLicense;
    case LicenseStatus.Pro:
      return ProFeatures.has(feature)
        ? FeatureAvailabilityStatus.Available
        : FeatureAvailabilityStatus.InsufficientLicense;
    case LicenseStatus.Team:
      return TeamFeatures.has(feature)
        ? FeatureAvailabilityStatus.Available
        : FeatureAvailabilityStatus.InsufficientLicense;
    case LicenseStatus.Enterprise:
      return EnterpriseFeatures.has(feature)
        ? FeatureAvailabilityStatus.Available
        : FeatureAvailabilityStatus.InsufficientLicense;
    default:
      return FeatureAvailabilityStatus.InsufficientLicense;
  }
}

export function getLicensesForFeature(feature: FeatureName) {
  const hasAccess = (license: LicenseStatus) =>
    getFeatureAvailabilityStatus(license, feature) === FeatureAvailabilityStatus.Available;
  const licenses = [
    LicenseStatus.Free,
    LicenseStatus.Pro,
    LicenseStatus.Team,
    LicenseStatus.Enterprise,
  ];
  return licenses.filter(hasAccess);
}

// #endregion License Helpers

// #region License State

export type LicenseState = {
  status: LicenseStatus;
};

export enum LicenseStatus {
  Inactive = "inactive",
  Free = "free",
  Pro = "pro",
  Team = "team",
  Enterprise = "enterprise",
}

export function getLicenseStatusFromString(str: string): LicenseStatus {
  const normalizedStr = str.toLowerCase() as LicenseStatus;

  if (Object.values(LicenseStatus).includes(normalizedStr)) {
    return normalizedStr;
  }

  return LicenseStatus.Inactive;
}

// #endregion License State

// #region Features

type FeatureList = {
  free: string[];
  pro: string[];
  team: string[];
  enterprise: string[];
};

const allFeatureNames = Object.values(featureJson as FeatureList).flat();

export const Feature = Object.freeze(
  allFeatureNames.reduce(
    (accumulator, feature) => {
      accumulator[feature] = feature;
      return accumulator;
    },
    {} as Record<string, string>
  )
) as { readonly [K in (typeof allFeatureNames)[number]]: K };

export type FeatureName = (typeof Feature)[keyof typeof Feature];

// #endregion Features

// #region Feature By License

export const FreeFeatures: Set<FeatureName> = new Set(
  (featureJson.free as string[]).map((feature) => feature as FeatureName)
);

export const ProFeatures: Set<FeatureName> = new Set([
  ...FreeFeatures,
  ...(featureJson.pro as string[]).map((feature) => feature as FeatureName),
]);

export const TeamFeatures: Set<FeatureName> = new Set([
  ...ProFeatures,
  ...(featureJson.team as string[]).map((feature) => feature as FeatureName),
]);

export const EnterpriseFeatures: Set<FeatureName> = new Set([
  ...TeamFeatures,
  ...(featureJson.enterprise as string[]).map((feature) => feature as FeatureName),
]);

// #endregion Feature By License
