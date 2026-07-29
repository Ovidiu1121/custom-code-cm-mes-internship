import { EventEmitter, SimpleChanges, Injectable } from '@angular/core';
 
import {
    UtilService,
    SimpleType
} from 'cmf-core';
 
import {
    TreatTransactionOutput as DataSourceExecutionOutput
} from 'cmf-core-business-controls';
 
import {
    DataSource,
    DataSourceGeneric,
    DataSourceSettingsDef
} from 'cmf-core-dashboards';
 
import {
    HoldMaterialButtonDisableDataSourceSettingsComponent
} from './hold-material-button-disable-data-source-settings/hold-material-button-disable-data-source-settings.component';
 
/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this DataSource.
 * Try to answer these questions:
 * * What is it?
 * * What it does?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 *
 * @howToUse
 *
 * The DataSource is used in an UIPage with the inputs and outputs mentioned below.
 *
 * Besides the description above, please complement it with a meaningful description of this component that answer these questions:
 * * How to use it?
 * * Where and When to use it?
 *
 * ### DataSource Settings Inputs
 * * `string` : **value** _(default)_ - Settings Input description
 *
 * ### DataSource Inputs
 * * `string` : **value** _(default)_ - Input description
 *
 * ### DataSource Outputs
 * * `string` : **value** _(default)_ - Output description
 */
@Injectable()
@DataSource({
    name: $localize`:@@test-library/hold-material-button-disable-data-source#NAME:Hold Material Button Disable`,
    settingsComponent: {
        component: HoldMaterialButtonDisableDataSourceSettingsComponent
    },
 
    inputs: {
        Materials: SimpleType.Object
    },
 
    outputs: {
        disabled: SimpleType.Boolean
    }
})
export class HoldMaterialButtonDisableDataSource extends DataSourceGeneric implements DataSourceSettingsDef {
 
    //#region Inputs
    public Materials: any;
 
 
    //#region Outputs
    public disabled = new EventEmitter<boolean>();
 
    /**
     * Constructor
     */
    constructor(util: UtilService) {
        super(util);
    }
 
    /**
     * This method gathers all the logic to fetch data for this data source
     */
    public async execute(): Promise<DataSourceExecutionOutput | void> {
        // Please change the next line to execute what this data source requires
       
        console.log('Hold validation datasource input:', this.Materials);
 
        const materials = this.normalizeMaterials(this.Materials);
 
        if (materials.length === 0) {
            this.disabled.emit(true);
            return;
        }
 
 
        if (materials.length > 1) {
            this.disabled.emit(true);
            return;
        }
 
        const material = materials[0];
 
        // b. Not terminated
        if (material.UniversalState === 4) {
            this.disabled.emit(true);
            return;
        }
 
        // c. Quantity does not exceed 100
        if (material.PrimaryQuantity > 100) {
            this.disabled.emit(true);
            return;
        }
 
        // Valid material
        this.disabled.emit(false);
        return;
    }
 
    public override dsOnChanges(changes: SimpleChanges): void {
            if (changes && changes['Materials']){
                this.debounceExecute();
            }
        }
   
        private normalizeMaterials(value: any): any[] {
   
            if (!value) {
                return [];
            }
   
            if (Array.isArray(value)) {
                return value.filter(material => material != null);
            }
   
            return [value];
        }
}