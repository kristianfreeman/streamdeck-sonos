import { isSomething } from 'ts-type-guards';

export function isSettings(value: unknown): value is Settings {
  return (
    (value as Settings).hasOwnProperty('ip_address')
    && isSomething((value as Settings).ip_address)
    && (value as Settings).hasOwnProperty('volume')
    && isSomething((value as Settings).volume)
  );
}

export type Settings = {
  ip_address: string;
  volume: string;
};
