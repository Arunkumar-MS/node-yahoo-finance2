import type {
  ModuleOptions,
  ModuleOptionsWithValidateFalse,
  ModuleOptionsWithValidateTrue,
  ModuleThis,
} from "../lib/moduleCommon.ts";

import { getTypedDefinitions } from "../lib/validate/index.ts";

import type {
  Quote,
  QuoteOptions,
  QuoteOptionsWithReturnArray,
  QuoteResponseArray,
} from "../modules/quote.ts";
import quote from "../modules/quote.ts";

import validateAndCoerceTypes from "../lib/validateAndCoerceTypes.ts";

import schema from "../modules/quote.schema.json" with { type: "json" };
const definitions = getTypedDefinitions(schema);

const DEBOUNCE_TIME = 50;

const slugMap = new Map();

export default function quoteCombine(
  this: ModuleThis,
  query: string,
  queryOptionsOverrides?: QuoteOptions,
  moduleOptions?: ModuleOptionsWithValidateTrue,
): Promise<Quote>;

export default function quoteCombine(
  this: ModuleThis,
  query: string,
  queryOptionsOverrides?: QuoteOptions,
  moduleOptions?: ModuleOptionsWithValidateFalse,
): Promise<unknown>;

export default function quoteCombine(
  this: ModuleThis,
  query: string,
  _queryOptionsOverrides: QuoteOptions = {},
  moduleOptions?: ModuleOptions,
): Promise<unknown> {
  const symbol = query;

  if (typeof symbol !== "string") {
    throw new Error(
      "quoteCombine expects a string query parameter, received: " +
        JSON.stringify(symbol, null, 2),
    );
  }

  if (
    _queryOptionsOverrides.return && _queryOptionsOverrides.return !== "array"
  ) {
    throw new Error("Can't specify other return types using quoteCombine()");
  }
  const queryOptionsOverrides =
    _queryOptionsOverrides as QuoteOptionsWithReturnArray;

  const validateOptions = !moduleOptions ||
    moduleOptions.validateOptions === undefined ||
    moduleOptions.validateOptions === true;

  try {
    validateAndCoerceTypes({
      source: "quoteCombine",
      type: "options",
      object: queryOptionsOverrides,
      definitions,
      schemaKey: "#/definitions/QuoteOptions",
      options: this._opts.validation,
      logger: this._opts.logger,
      logObj: this._logObj,
    });
  } catch (error) {
    if (validateOptions) throw error;
  }

  // Make sure we only combine requests with same options
  const slug = JSON.stringify(queryOptionsOverrides);

  let entry = slugMap.get(slug);
  if (!entry) {
    entry = {
      timeout: null,
      queryOptionsOverrides,
      symbols: new Map(),
    };
    slugMap.set(slug, entry);
  }

  if (entry.timeout) clearTimeout(entry.timeout);

  return new Promise((resolve, reject) => {
    let symbolPromiseCallbacks = entry.symbols.get(symbol);
    /* istanbul ignore else */
    if (!symbolPromiseCallbacks) {
      symbolPromiseCallbacks = [];
      entry.symbols.set(symbol, symbolPromiseCallbacks);
    }

    symbolPromiseCallbacks.push({ resolve, reject });

    entry.timeout = setTimeout(() => {
      slugMap.delete(slug);

      const symbols: string[] = Array.from(entry.symbols.keys());

      const thisQuote = quote.bind(this) as (
        symbols: string[],
        options?: QuoteOptionsWithReturnArray,
        moduleOptions?: ModuleOptionsWithValidateTrue,
      ) => Promise<QuoteResponseArray>;

      thisQuote(symbols, queryOptionsOverrides, {
        ...moduleOptions,
        validateResult: true,
      }).then((results) => {
        for (const result of results) {
          for (const promise of entry.symbols.get(result.symbol)) {
            promise.resolve(result);
            promise.resolved = true;
          }
        }

        // Check for symbols we asked for and didn't get back,
        // e.g. non-existant symbols (#150)
        for (const [_symbol, promises] of entry.symbols) {
          for (const promise of promises) {
            if (!promise.resolved) {
              promise.resolve(undefined);
            }
          }
        }
      }).catch((error) => {
        for (const symbolPromiseCallbacks of entry.symbols.values()) {
          for (const promise of symbolPromiseCallbacks) promise.reject(error);
        }
      });
    }, DEBOUNCE_TIME);
  });
}
