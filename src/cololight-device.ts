/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.*
 */

'use strict';

import { Adapter, Device, Property } from 'gateway-addon';
import { OnOffProperty } from './on-off-property';
import { BrightnessProperty } from './brightness-property';
import { ColorProperty } from './color-property';
import { Cololight } from './cololight';

export class CololightDevice extends Device {
    private onOffProperty: OnOffProperty;
    private brightnessProperty: BrightnessProperty;
    private colorProperty: ColorProperty;
    private lastBrightness = 100;

    constructor(adapter: Adapter, id: string, name: string, cololight: Cololight) {
        super(adapter, id);
        this['@type'] = ['Light'];
        this.name = name;

        this.onOffProperty = new OnOffProperty(this, async value => {
            if (value) {
                cololight.setBrightness(this.lastBrightness);
            } else {
                cololight.turnOff();
            }
        });

        this.addProperty(this.onOffProperty);

        this.brightnessProperty = new BrightnessProperty(this, async value => {
            this.lastBrightness = value;
            cololight.setBrightness(this.lastBrightness);
        });

        this.addProperty(this.brightnessProperty);

        this.colorProperty = new ColorProperty(this, async value => {
            cololight.setColor(value.replace('#', ''));
        });

        this.addProperty(this.colorProperty);
    }

    addProperty(property: Property) {
        this.properties.set(property.name, property);
    }
}
