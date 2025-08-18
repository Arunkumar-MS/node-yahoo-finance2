import createYahooFinance, {
  type YahooFinanceWithModules,
} from "./createYahooFinance.ts";
import modules from "./modules/index.ts";
import quoteCombine from "./other/quoteCombine.ts";

const allModules = { ...modules, quoteCombine } as const;
const createOpts = { modules: allModules } as const;

const YahooFinance: YahooFinanceWithModules<typeof createOpts> =
  createYahooFinance(createOpts);

export default YahooFinance;
