import {Data} from "./Data";
import { User } from "../types";

export interface Hello extends Data {
    guest: boolean;
    licenseOwner: string;
    licenseOwnerUser?: User | null;
    capabilities: string[];
}
