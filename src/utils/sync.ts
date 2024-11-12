import { sync as _sync } from 'glob';
import fs from 'graceful-fs';

export default function sync(path: string): string[] {
  return _sync(path, {
    fs,
    absolute: true
  });
}