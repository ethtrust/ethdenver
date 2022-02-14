import { read, Format, Encoding } from '@jkcfg/std';
import { info } from '@jkcfg/std/fs';

export const readConfigFile = async (filepath: string) =>
  await readFile(`config/${filepath}`);

export const readFile = async (filepath: string) =>
  await read(filepath, { format: Format.Raw, encoding: Encoding.String });

export const basename = (filepath: string) => info(filepath).name;

export interface IFileConfigMap {
  namespace: string;
  files: string[];
}

export type IMapping = { [key: string]: any };
