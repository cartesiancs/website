const MIXPANEL_TOKEN = "368d5a13ee869cacc30b696066ffee40";
const MIXPANEL_SRC = "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

type MixpanelStub = unknown[] & {
  __SV?: number;
  _i: unknown[];
  init: (token: string, config: Record<string, unknown>, name?: string) => void;
  [method: string]: unknown;
};

declare global {
  interface Window {
    mixpanel?: MixpanelStub;
  }
}

const STUB_METHODS =
  "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders start_session_recording stop_session_recording".split(
    " ",
  );

// The Vessel site used Mixpanel session recording before it moved under
// cartesiancs.com; only Vessel pages load it, and only once per visit.
// Calls made before the library arrives are queued on a stub, which the
// library replays when it loads.
export function loadVesselAnalytics() {
  if (LOCAL_HOSTS.has(window.location.hostname) || window.mixpanel) return;

  const stub = [] as unknown as MixpanelStub;
  stub._i = [];
  stub.__SV = 1.2;
  stub.people = [];
  for (const method of STUB_METHODS) {
    stub[method] = (...args: unknown[]) => {
      stub.push([method, ...args]);
    };
  }
  stub.init = (token, config, name) => {
    stub._i.push([token, config, name ?? "mixpanel"]);
  };
  window.mixpanel = stub;

  const script = document.createElement("script");
  script.async = true;
  script.src = MIXPANEL_SRC;
  document.head.appendChild(script);

  stub.init(MIXPANEL_TOKEN, { autocapture: false, record_sessions_percent: 100 });
}
