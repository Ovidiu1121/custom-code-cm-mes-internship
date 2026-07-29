import { EventEmitter, Injectable, SimpleChanges } from '@angular/core';
 
import {
    SimpleType,
    UtilService
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
    BulkTerminateMaterialsButtonDisableDataSourceSettingsComponent
} from './bulk-terminate-materials-button-disable-data-source-settings/bulk-terminate-materials-button-disable-data-source-settings.component';
 
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
    name: $localize`:@@test-library/bulk-terminate-materials-button-disable-data-source#NAME:Bulk Terminate Materials Button Disable`,
    settingsComponent: {
        component: BulkTerminateMaterialsButtonDisableDataSourceSettingsComponent
    },
 
    inputs: {
        Materials: SimpleType.Object
    },
 
    outputs: {
        disabled: SimpleType.Boolean,
        message: SimpleType.String
    }
})
export class BulkTerminateMaterialsButtonDisableDataSource extends DataSourceGeneric implements DataSourceSettingsDef {
 
    //#region Inputs
    public Materials: any;
 
 
    //#region Outputs
    public disabled = new EventEmitter<boolean>();
    public message = new EventEmitter<string>();
 
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
 
        console.log('Bulk terminate datasource input:', this.Materials);
 
        const materials = this.normalizeMaterials(this.Materials);
 
        if (materials.length === 0) {
            this.disabled.emit(true);
            this.message.emit("Please select at least one material before executing the bulk terminate action.");
            return;
        }
 
        // Check if any material is terminated
 
        const terminatedMaterials =
            materials.filter(material => material.UniversalState === 4);
 
        if (terminatedMaterials.length > 0) {
 
            const names = terminatedMaterials
                .map(material => material.Name)
                .join(", ");
 
            this.disabled.emit(true);
 
            this.message.emit(
                `Bulk terminate cannot be executed because these materials are already terminated: ${names}`
            );
 
            return;
        }
 
        // Everything is valid
        this.disabled.emit(false);
        this.message.emit("");
 
        return;
    }
 
    public override dsOnChanges(changes: SimpleChanges): void {
        if (changes && changes['Materials']) {
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