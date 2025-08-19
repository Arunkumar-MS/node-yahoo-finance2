import createYahooFinance, {
  type YahooFinanceWithModules,
} from "./createYahooFinance.ts";
import modules from "./modules/index.ts";
import quoteCombine from "./other/quoteCombine.ts";

const allModules = { ...modules, quoteCombine } as const;
const createOpts = { modules: allModules } as const;

/**
 * Yahoo Finance API client with all modules TODO
 */
const YahooFinance: YahooFinanceWithModules<typeof createOpts> =
  createYahooFinance(createOpts);

export default YahooFinance;
