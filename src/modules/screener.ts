import type {
  ModuleOptions,
  ModuleOptionsWithValidateFalse,
  ModuleOptionsWithValidateTrue,
  ModuleThis,
} from "../lib/moduleCommon.ts";

import { getTypedDefinitions } from "../lib/validate/index.ts";

// @yf-schema: see the docs on how this file is automatically updated.
import schema from "./screener.schema.json" with { type: "json" };
const definitions = getTypedDefinitions(schema);

export interface ScreenerResultBase {
  id: string;
  title: string;
  description: string;
  canonicalName: string;
  criteriaMeta: ScreenerCriteriaMeta;
  rawCriteria: string;
  start: number;
  count: number;
  total: number;
  quotes: ScreenerQuote[];
  useRecords: boolean;
  predefinedScr: boolean;
  versionId: number;
  creationDate: number;
  lastUpdated: number;
  isPremium: boolean;
  iconUrl: string;
}

export interface ScreenerResultAggressiveSmallCaps extends ScreenerResultBase {
  canonicalName: "AGGRESSIVE_SMALL_CAPS";
}

export interface ScreenerResultConservativeForeignFunds
  extends ScreenerResultBase {
  canonicalName: "CONSERVATIVE_FOREIGN_FUNDS";
  criteriaMeta: ScreenerCriteriaMeta & {
    includeFields: (
      | "fundnetassets"
      | "sold_proportion"
      | "annualreportnetexpenseratio"
      | "performanceratingoverall"
      | "intradaypricechange"
      | "bought_proportion"
      | "fiftytwowkhigh"
      | "fiftydaymovingavg"
      | "ticker"
      | "longname_us_en-us"
      | "percentchange"
      | "companyshortname"
      | "intradayprice"
      | "annualreturnnavy5"
      | "day_open_price"
      | "annualreturnnavy3"
      | "annualreturnnavy1"
      | "annualreportgrossexpenseratio"
      | "twohundreddaymovingavg"
      | "pe_ttm"
      | "yield_ttm"
      | "exchange"
      | "fiftytwowklow"
      | "riskratingoverall"
      | "trailing_ytd_return"
      | "trailing_3m_return"
      | "annualreturnnavy1categoryrank"
      | "categoryname"
      | "performanceratingoverall"
      | "exchange"
      | "riskratingoverall"
      | "initialinvestment"
    )[];
  };
}

type ScreenerCriteriaFieldDaily =
  | "change_in_number_of_institutional_holders"
  | "trading_central_last_close_price_to_fair_value"
  | "intradaypricechange"
  | "estimated_revenue_growth"
  | "intradaymarketcap"
  | "morningstar_previous_rating"
  | "fiftytwowkhigh"
  | "pctheldinst"
  | "morningstar_last_close_price_to_fair_value"
  | "shares_bought_by_funds"
  | "ror_percent"
  | "morningstar_rating"
  | "sector"
  | "peratio.lasttwelvemonths"
  | "bullish_proportion"
  | "percent_change_in_number_of_institutional_holders"
  | "number_of_institutional_sellers"
  | "morningstar_stewardship"
  | "lastclosetevebit.lasttwelvemonths"
  | "percentchange"
  | "morningstar_economic_moat"
  | "percent_of_shares_outstanding_bought_by_institutions"
  | "day_open_price"
  | "morningstar_rating_change"
  | "number_of_institutional_holders"
  | "percent_in_funds_holding"
  | "exchange"
  | "percent_of_shares_outstanding_sold_by_institutions"
  | "dayvolume"
  | "bearish_proportion"
  | "morningstar_fair_value"
  | "sold_proportion"
  | "industry"
  | "morningstar_uncertainty"
  | "shares_sold_by_funds"
  | "fair_value"
  | "bought_proportion"
  | "percent_in_top_ten_holdings"
  | "avgdailyvol3m"
  | "last_close_price_to_nnwc_per_share"
  | "estimated_earnings_growth"
  | "ticker"
  | "longname_us_en-us"
  | "percent_change_in_shares_held_by_funds"
  | "number_of_institutional_buyers"
  | "companyshortname"
  | "intradayprice"
  | "change_in_shares_held_by_funds"
  | "indices"
  | "neutral_proportion"
  | "latest_holdings_report_date"
  | "fiftytwowklow"
  | "value_description"
  | "average_analyst_rating"
  | "intradaymarketcap"
  | "percentchange"
  | "intradayprice"
  | "region"
  | "dayvolume";

export interface ScreenerResultDayGainers extends ScreenerResultBase {
  canonicalName: "DAY_GAINERS";
  criteriaMeta: ScreenerCriteriaMeta & {
    includeFields: ScreenerCriteriaFieldDaily[];
  };
}

export interface ScreenerResultDayLosers extends ScreenerResultBase {
  canonicalName: "DAY_LOSERS";
  criteriaMeta: ScreenerCriteriaMeta & {
    includeFields: ScreenerCriteriaFieldDaily[];
  };
}

/**
 * @discriminator canonicalName
 */
export type ScreenerResult =
  | ScreenerResultAggressiveSmallCaps
  | ScreenerResultConservativeForeignFunds
  | ScreenerResultDayGainers
  | ScreenerResultDayLosers;

export interface ScreenerCriteriaMeta {
  size: number;
  offset: number;
  sortField: string;
  sortType: string;
  quoteType: string;
  criteria: ScreenerCriterum[];
  topOperator: string;
}

export interface ScreenerCriterum {
  field: string;
  operators: string[];
  values: number[];
  labelsSelected: number[];
  dependentValues: unknown[];
  subField?: null;
}

export interface ScreenerQuote {
  language: string;
  region: string;
  quoteType: string;
  typeDisp: string;
  quoteSourceName?: string;
  triggerable: boolean;
  customPriceAlertConfidence: string;
  lastCloseTevEbitLtm?: number;
  lastClosePriceToNNWCPerShare?: number;
  firstTradeDateMilliseconds: number;
  priceHint: number;
  postMarketChangePercent?: number;
  postMarketTime?: number;
  postMarketPrice?: number;
  postMarketChange?: number;
  regularMarketChange: number;
  regularMarketTime: number;
  regularMarketPrice: number;
  regularMarketDayHigh?: number;
  regularMarketDayRange?: string;
  currency: string;
  regularMarketDayLow?: number;
  regularMarketVolume?: number;
  regularMarketPreviousClose: number;
  bid?: number;
  ask?: number;
  bidSize?: number;
  askSize?: number;
  market: string;
  messageBoardId: string;
  fullExchangeName: string;
  longName: string;
  financialCurrency?: string;
  regularMarketOpen?: number;
  averageDailyVolume3Month: number;
  averageDailyVolume10Day: number;
  fiftyTwoWeekLowChange: number;
  fiftyTwoWeekLowChangePercent: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekHighChange: number;
  fiftyTwoWeekHighChangePercent: number;
  fiftyTwoWeekChangePercent: number;
  earningsTimestamp?: number;
  earningsTimestampStart?: number;
  earningsTimestampEnd?: number;
  trailingAnnualDividendRate?: number;
  trailingAnnualDividendYield?: number;
  marketState: string;
  epsTrailingTwelveMonths?: number;
  epsForward?: number;
  epsCurrentYear?: number;
  priceEpsCurrentYear?: number;
  sharesOutstanding?: number;
  bookValue?: number;
  fiftyDayAverage: number;
  fiftyDayAverageChange: number;
  fiftyDayAverageChangePercent: number;
  twoHundredDayAverage: number;
  twoHundredDayAverageChange: number;
  twoHundredDayAverageChangePercent: number;
  marketCap?: number;
  forwardPE?: number;
  priceToBook?: number;
  sourceInterval: number;
  exchangeDataDelayedBy: number;
  exchangeTimezoneName: string;
  exchangeTimezoneShortName: string;
  gmtOffSetMilliseconds: number;
  esgPopulated: boolean;
  tradeable: boolean;
  cryptoTradeable: boolean;
  exchange: string;
  fiftyTwoWeekLow: number;
  fiftyTwoWeekHigh: number;
  shortName: string;
  averageAnalystRating?: string;
  regularMarketChangePercent: number;
  symbol: string;
  dividendDate?: number;
  displayName?: string;
  trailingPE?: number;
  prevName?: string;
  nameChangeDate?: number;
  ipoExpectedDate?: number;
  dividendYield?: number;
  dividendRate?: number;
  yieldTTM?: number;
  peTTM?: number;
  annualReturnNavY3?: number;
  annualReturnNavY5?: number;
  ytdReturn?: number;
  trailingThreeMonthReturns?: number;
  netAssets?: number;
  netExpenseRatio?: number;
  hasPrePostMarketData?: boolean; // true
  corporateActions?: unknown[]; // []
  earningsCallTimestampStart?: Date; // 1739453400
  earningsCallTimestampEnd?: Date; //  1739453400
  isEarningsDateEstimate?: boolean; // true
  preMarketChange?: number; // -0.010000229,
  preMarketChangePercent?: number; // -0.34723017
  preMarketTime?: Date; // 1740480444
  preMarketPrice?: number; // 2.87
}

export type PredefinedScreenerModules =
  | "aggressive_small_caps"
  | "conservative_foreign_funds"
  | "day_gainers"
  | "day_losers"
  | "growth_technology_stocks"
  | "high_yield_bond"
  | "most_actives"
  | "most_shorted_stocks"
  | "portfolio_anchors"
  | "small_cap_gainers"
  | "solid_large_growth_funds"
  | "solid_midcap_growth_funds"
  | "top_mutual_funds"
  | "undervalued_growth_stocks"
  | "undervalued_large_caps";

const queryOptionsDefaults = {
  lang: "en-US",
  region: "US",
  scrIds: "day_gainers",
  count: 5,
};

export interface ScreenerOptions {
  lang?: string;
  region?: string;
  scrIds: PredefinedScreenerModules;
  count?: number;
}

export default function screener(
  this: ModuleThis,
  queryOptionsOverrides?: PredefinedScreenerModules | ScreenerOptions,
  moduleOptions?: ModuleOptionsWithValidateTrue,
): Promise<ScreenerResult>;

export default function screener(
  this: ModuleThis,
  queryOptionsOverrides?: PredefinedScreenerModules | ScreenerOptions,
  moduleOptions?: ModuleOptionsWithValidateFalse,
): Promise<unknown>;

export default function screener(
  this: ModuleThis,
  queryOptionsOverrides?: PredefinedScreenerModules | ScreenerOptions,
  moduleOptions?: ModuleOptions,
): Promise<unknown> {
  if (typeof queryOptionsOverrides === "string") {
    queryOptionsOverrides = { scrIds: queryOptionsOverrides };
  }

  return this._moduleExec({
    moduleName: "screener",
    query: {
      url: "https://${YF_QUERY_HOST}/v1/finance/screener/predefined/saved",
      definitions,
      schemaKey: "#/definitions/ScreenerOptions",
      defaults: queryOptionsDefaults,
      overrides: queryOptionsOverrides,
      needsCrumb: true,
    },
    result: {
      definitions,
      schemaKey: "#/definitions/ScreenerResult",
      // deno-lint-ignore no-explicit-any
      transformWith(result: any) {
        // console.log(result);
        if (!result.finance) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.finance.result[0];
      },
    },
    moduleOptions,
  });
}

// aggressive_small_caps
// conservative_foreign_funds
// day_gainers
// day_losers
// growth_technology_stocks
// high_yield_bond
// most_actives
// most_shorted_stocks
// portfolio_anchors
// small_cap_gainers
// solid_large_growth_funds
// solid_midcap_growth_funds
// top_mutual_funds
// undervalued_growth_stocks
// undervalued_large_caps
