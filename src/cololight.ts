import { createSocket } from 'dgram';

const cmdPrefix = '535a3030000000000020000000000000000000000000000000000100000000000000000004010301c';
const cmdOff = 'e1e'

const colorPrefix = '535a3030000000000023000000000000000000000000000000003f000000000000000000043f0602ff00'

export class Cololight {
    private readonly client = createSocket('udp4');

    constructor(private address: string, private port: number) {
    }

    public turnOff() {
        this.send(cmdPrefix + cmdOff);
    }

    public setBrightness(brightness: number) {
        this.send(cmdPrefix + 'f' + brightness.toString(16));
    }

    public setColor(color: string) {
        this.send(colorPrefix + color);
    }

    public send(hex: string) {
        const data = Buffer.from(hex, 'hex');

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                this.client.send(data, this.port, this.address, function (error) {
                    if (error) {
                        console.log(`Could not send command: ${error}`);
                    }
                });
            }, i * 20);
        }
    }
}
