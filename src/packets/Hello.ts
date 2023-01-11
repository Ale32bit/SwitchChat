import {Data} from "./Data";

export interface Hello extends Data {
    guest: boolean,
    licenseOwner: string,
    capabilities: string[],
}