import { Streamdeck } from '@rweich/streamdeck-ts';

import { isSettings } from './Settings';

const plugin = new Streamdeck().plugin();

/*
 * We only got one plugin instance, but there could be multiple actions.
 * So we need to keep track of the state of all actions based on their context.
 */

const ipAddressCache: Record<string, string> = {};
const volumeCache: Record<string, number> = {};

/*
 * Helper functions
 */

const getVolume = (context: string): number => volumeCache[context] || 0;

/*
 * Helper functions
 */

function changeIpAddress(ip_address: string, context: string): void {
  ipAddressCache[context] = ip_address;
  // plugin.setTitle(String(number), context);
  // plugin.setFeedback({ indicator: { value: ip_address }, value: ip_address }, context);
}

function changeVolume(volume: number, context: string): void {
  volumeCache[context] = volume;
  // plugin.setTitle(String(number), context);
  // plugin.setFeedback({ indicator: { value: ip_address }, value: ip_address }, context);
}

function saveSettings(context: string): void {
  plugin.setSettings(context, {
    ip_address: ipAddressCache[context] || '',
  });
}

/*
 * Bind listeners to all plugin events we want to be notified of
 *
 * 1st plugin lifecycle events ...
 */

// the first event we care about / that starts everything
plugin.on('willAppear', ({ context }) => {
  // request saved state
  plugin.getSettings(context);
  // display the initial state of the action (the initial background state comes from the manifest)
  changeVolume(getVolume(context), context);
});

// gets called after our getSettings request and whenever there are changes by the property inspector
plugin.on('didReceiveSettings', ({ context, settings }) => {
  if (isSettings(settings)) {
    changeVolume(Number(settings.volume), context);
    changeIpAddress(settings.ip_address, context);
  }
});

// reset our caches when an action gets removed
plugin.on('willDisappear', ({ context }) => {
  delete ipAddressCache[context];
});

/*
 * events for user interaction ...
 */

// increase or decrease the value on dial-rotate
plugin.on('dialRotate', ({ context, ticks }) => {
  changeVolume(getVolume(context) + ticks * volumeCache[context], context);
  saveSettings(context);
});

export default plugin;
