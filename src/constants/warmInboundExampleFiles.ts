/** Webflow CDN assets from the "warm inbound example files" folder (Assembled Brands site). */
const WEBFLOW_CDN =
    'https://cdn.prod.website-files.com/66624bc26087f29222853df8'

export const WARM_INBOUND_EXAMPLE_URLS = {
    monthly_income_statement: `${WEBFLOW_CDN}/6a2a7d13e045c19cc0ee7b9e_Example%20Profit%20and%20Loss.xlsx`,
    monthly_balance_sheet: `${WEBFLOW_CDN}/6a2a7b12e3feedc7313060b3_Example%20Balance%20Sheet.xlsx`,
    income_statement_forecast: `${WEBFLOW_CDN}/6a2a7d4d009bb67f3ecfe95a_Example%20Income%20Statement%20Projection.xlsx`,
    balance_sheet_full_year_forecast: `${WEBFLOW_CDN}/6a2a7d13a62fe29dde505daf_Example%20Balance%20Sheet%20Projection.xlsx`,
    monthly_inventory_report: `${WEBFLOW_CDN}/6a2a7d4ee2d8f7e583cb07bc_Example%20Inventory%20Report.xlsx`,
    accounts_receivable_aging: `${WEBFLOW_CDN}/6a2a7d4e009bb67f3ecfeb03_Example%20AR%20Aging%20Summary.xlsx`,
    accounts_payable_aging: `${WEBFLOW_CDN}/6a2a7d4d587ea886e083d033_Example%20AP%20Aging%20Summary.xlsx`,
    shopify_sales_over_time: `${WEBFLOW_CDN}/6a2a7d5fe2d8f7e583cb10d0_Sales%20over%20Time%20Report%201-1-22%20thru%209-24-24.xlsx`,
    shopify_first_vs_returning_customers: `${WEBFLOW_CDN}/6a2a7d606cac9e5521dd94d9_Copy%20of%20First%20Time%20vs%20Returning%20Customers%20Report%201-1-22%20thru%209-24-24.xlsx`,
    cap_table: `${WEBFLOW_CDN}/6a2a7d6093217eae509c9616_Example%20Cap%20Table.xlsx`,
    instore_velocity_reports: `${WEBFLOW_CDN}/6a2a7d61a62fe29dde507ae2_Juniper_Grove_SPINS_Velocity_Report_Sample.xlsx`,
} as const

export type WarmInboundExampleDocumentType =
    keyof typeof WARM_INBOUND_EXAMPLE_URLS

export function warmInboundExampleUrl(
    documentType: string,
): string | undefined {
    return WARM_INBOUND_EXAMPLE_URLS[
        documentType as WarmInboundExampleDocumentType
    ]
}
