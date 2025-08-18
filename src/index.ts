import createYahooFinance from "./createYahooFinance.ts";
import modules from "./modules/index.ts";
import quoteCombine from "./other/quoteCombine.ts";

const YahooFinance = createYahooFinance({
  modules: { ...modules, quoteCombine },
});
export default YahooFinance;
