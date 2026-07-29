import { EventEmitter, SimpleChanges,Injectable } from '@angular/core';

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
    EditMaterialButtonDisableDataSourceSettingsComponent
} from './edit-material-button-disable-data-source-settings/edit-material-button-disable-data-source-settings.component';

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
    name: $localize`:@@test-library/edit-material-button-disable-data-source#NAME:Edit Material Button Disable`,
    settingsComponent: {
        component: EditMaterialButtonDisableDataSourceSettingsComponent
    },

    inputs:{
        Materials:SimpleType.Object
    },

    outputs:{
        disabled: SimpleType.Boolean,
        message:SimpleType.String
    }


})
export class EditMaterialButtonDisableDataSource extends DataSourceGeneric implements DataSourceSettingsDef {

    public Materials: any;

    public disabled=new EventEmitter<boolean>();
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
    const materials = this.normalizeMaterials(this.Materials);

    let disabled: boolean;
    let message: string | null;

    if (materials.length === 0) {
        disabled = true;
        message = 'Please select at least one material before editing';
    } else if (materials.length > 1) {
        disabled = true;
        message = 'Edit action is allowed only when exactly one material is selected.';
    } else {
        disabled = false;
        message = null;
    }

    this.disabled.emit(disabled);
    this.message.emit(message);

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