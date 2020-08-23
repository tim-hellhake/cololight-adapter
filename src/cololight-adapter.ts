/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { randomBytes } from 'crypto';
import { Adapter, Database } from 'gateway-addon';
import { Cololight } from './cololight';
import { CololightDevice } from './cololight-device';

export class CololightAdapter extends Adapter {
  constructor(addonManager: any, manifest: any) {
    super(addonManager, CololightAdapter.name, manifest.id);
    addonManager.addAdapter(this);
    this.createCololights(manifest);
  }

  private async createCololights(manifest: any) {
    const cololights = await this.loadCololights(manifest);

    if (cololights && cololights.length > 0) {
      for (const cololightConfig of cololights) {
        const {
          id,
          address,
          port
        } = cololightConfig;

        console.log(`Creating device for cololight at ${address}:${port}`);
        const cololight = new Cololight(address, port || 8900);
        const cololightDevice = new CololightDevice(this, id, `Cololight (${address})`, cololight);
        this.handleDeviceAdded(cololightDevice);
      }
    } else {
      console.log('No cololights configured');
    }
  }

  private async loadCololights(manifest: any) {
    const db = new Database(manifest.name);
    await db.open();
    const config = await db.loadConfig();

    if (config.cololights) {
      for (const cololight of config.cololights) {
        const {
          address,
          port
        } = cololight;

        if (!cololight.id) {
          cololight.id = `${randomBytes(16).toString('hex')}`;
          console.log(`Adding id for device at ${address}:${port}`);
        }
      }
    }

    await db.saveConfig(config);

    return config.cololights;
  }
}
