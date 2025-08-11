import defaultOptions, { type YahooFinanceOptions } from "./lib/options.ts";
import yahooFinanceFetch from "./lib/yahooFinanceFetch.ts";
import moduleExec from "./lib/moduleExec.ts";
import Notices from "./lib/notices.ts";

export class YahooFinance {
  _opts: YahooFinanceOptions;
  _fetch: typeof yahooFinanceFetch;
  _moduleExec: typeof moduleExec;
  _notices: Notices;
  // XXX TODO remove
  _env: {
    URLSearchParams: typeof URLSearchParams;
    fetch: typeof fetch | null;
    fetchDevel?: () => typeof fetch;
  };
  _logObj: (obj: unknown, opts?: { depth?: number }) => void;

  constructor(options?: YahooFinanceOptions) {
    this._fetch = yahooFinanceFetch;
    this._moduleExec = moduleExec;
    // XXX TODO remove
    this._env = {
      URLSearchParams,
      fetch: null,
      fetchDevel: () => {
        // @ts-expect-error: later
        const fetchCache = this.fetchCache;
        if (!fetchCache) {
          throw new Error("`fetchDevel()` called, but `fetchCache` not set");
        }

        function fetchDevel(
          input: Parameters<typeof fetch>[0],
          init?: Parameters<typeof fetch>[1], // & { devel?: boolean | string },
        ): ReturnType<typeof fetch> {
          // @ts-expect-error: later
          const { devel, ..._init } = init || {};
          // console.log({ devel });
          if (typeof devel === "string") {
            fetchCache._once({ id: devel.replace(/\.json$/, "") });
          } else {
            throw new Error(
              "unexpected fetchDevel value: " + JSON.stringify(devel),
            );
          }

          return fetch(input, init);
        }
        return fetchDevel;
      },
    };

    if ("_createOpts" in this) {
      const createOpts = this._createOpts as Record<string, unknown>;
      /// XXX TODO mergeoptions from setGlobalConfig
      this._opts = {
        ...defaultOptions,
        ...(createOpts["_opts"] as YahooFinanceOptions),
        ...options,
      };
      if ("_allowAdditionalProps" in createOpts) {
        if (!this._opts.validation) this._opts.validation = {};
        this._opts.validation.allowAdditionalProps = false;
      }
    } else {
      /// XXX TODO mergeoptions from setGlobalConfig
      this._opts = { ...defaultOptions, ...options };
    }

    // The following rely on this._opts being set
    this._notices = new Notices(this);

    // deno-coverage-ignore-start
    // @ts-ignore: relevant for ts-json-schema-generator
    this._logObj = Deno.stdout.isTerminal()
      // deno-lint-ignore no-explicit-any
      ? (obj: any, opts?: { depth?: number }) =>
        this._opts.logger!.dir(obj, { depth: opts?.depth ?? 4, colors: true })
      // deno-lint-ignore no-explicit-any
      : (obj: any) => this._opts.logger!.info(JSON.stringify(obj, null, 2));
    // deno-coverage-ignore-stop
  }
}

// deno-lint-ignore no-explicit-any
type ModuleMethod = (...args: any[]) => any;

interface CreateYahooFinanceOptions {
  modules: Record<string, ModuleMethod>;
  _opts?: YahooFinanceOptions;
}

type YahooFinanceWithModules<T extends CreateYahooFinanceOptions> =
  & {
    new (options?: YahooFinanceOptions):
      & YahooFinance
      & {
        [K in keyof T["modules"]]: T["modules"][K];
      };
  }
  & {
    [K in keyof T["modules"]]: T["modules"][K];
  };

export default function createYahooFinance<T extends CreateYahooFinanceOptions>(
  createOpts: T,
): YahooFinanceWithModules<T> {
  const { modules, ...rest } = createOpts;
  Object.assign(YahooFinance.prototype, modules);
  Object.assign(YahooFinance.prototype, { _createOpts: rest });
  return YahooFinance as YahooFinanceWithModules<T> & {
    _createOpts: typeof rest;
  };
}
