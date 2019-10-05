import fs from 'fs';
import os from 'os';

export default {
  get(namespacedKey) {
    const keyPath = namespacedKey.split('/');

    const keys = keyPath[keyPath.length - 1];
    const path = `${os.homedir()}/.gin/${keyPath.slice(0, keyPath.length - 1).join('/')}`;

    let config;
    let file = fs.readFileSync(path, 'utf8');
    config = JSON.parse(file);

    keys.split('.').forEach((key) => {
      if (config) config = config[key];
    });
    return config;
  },
};
