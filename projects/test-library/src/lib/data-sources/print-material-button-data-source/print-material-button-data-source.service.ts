import { Injectable,SimpleChanges,EventEmitter } from '@angular/core';

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
    PrintMaterialButtonDataSourceSettingsComponent
} from './print-material-button-data-source-settings/print-material-button-data-source-settings.component';

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
    name: $localize`:@@test-library/print-material-button-data-source#NAME:Print Material Button`,
    settingsComponent: {
        component: PrintMaterialButtonDataSourceSettingsComponent
    },

    inputs:{
        Materials:SimpleType.Object
    },

    outputs:{
        disabled:SimpleType.Boolean,
        message:SimpleType.String
    }

})
export class PrintMaterialButtonDataSource extends DataSourceGeneric implements DataSourceSettingsDef {

    public Materials: any;

    public disabled=new EventEmitter<boolean>();
    public message=new EventEmitter<string>();


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
        const materials = this.normalizeMaterials(this.Materials);
 
        // No selection
        if (materials.length === 0) {
            this.disabled.emit(true);
            this.message.emit("Please select a material before printing the document.");
            return;
        }
 
        // Multiple selection
        if (materials.length > 1) {
            this.disabled.emit(true);
            this.message.emit("Please select only one material for this print action.");
            return;
        }
 
        // Exactly one material
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