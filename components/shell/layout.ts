/**
 * The page skeleton shared by Home, Billing and Usage, kept in one place so
 * the three cannot drift apart.
 *
 * Two columns start at 1280px, not 1024px. The sidebar opens from a 64px
 * rail to 220px at 1024px, and starting the side column at the same width
 * left the main column only 356px wide. From 1024 to 1279px a page is one
 * column, capped at 720px so rows stay readable instead of stretching.
 */

/** A page's major blocks, stacked: 48px apart, 64px on desktop. */
export const pageBlocks = "flex max-w-180 flex-col gap-12 lg:gap-16 xl:max-w-none";

/** The main column with an 18rem side column from 1280px; one column below. */
export const pageColumns = "grid max-w-180 gap-12 lg:gap-16 xl:max-w-none xl:grid-cols-[minmax(0,1fr)_18rem]";

/** The main column's own stack, when it holds more than one block. */
export const mainColumn = "flex min-w-0 flex-col gap-12 lg:gap-16";
