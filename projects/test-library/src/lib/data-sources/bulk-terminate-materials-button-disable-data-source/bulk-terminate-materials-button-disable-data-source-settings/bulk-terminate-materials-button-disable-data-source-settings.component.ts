import {
    ViewContainerRef,
    Component
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    CustomizableComponent,
} from 'cmf-core';

import {
    DataSourceSettingsDef,
    DataSourceSettingsModule
} from 'cmf-core-dashboards';

/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this Data Source Settings and what it is needed for.
 * Also describe all the properties that are configurable in the correspondent Data Source
 *
 * @description
 *
 * ## Bulk Terminate Materials Button Disable Data Source Settings Component
 *
 * ### Dependencies
 *
 * #### Components
 * * ComponentA : `package`
 * * ComponentB : `package`
 *
 * #### Services
 * * ServiceA : `package`
 * * ServiceB : `package`
 *
 * #### Directives
 * * DirectiveA : `package`
 * * DirectiveB : `package`
 *
 */
@Component({
    standalone: true,
    selector: 'test-library-bulk-terminate-materials-button-disable-data-source-settings',
    imports: [CommonModule, DataSourceSettingsModule],
    templateUrl: './bulk-terminate-materials-button-disable-data-source-settings.component.html',
    styleUrls: ['./bulk-terminate-materials-button-disable-data-source-settings.component.less']
})
export class BulkTerminateMaterialsButtonDisableDataSourceSettingsComponent extends CustomizableComponent {

    /**
     * The settings of the BulkTerminateMaterialsButtonDisableDataSource
     */
    public settings!: DataSourceSettingsDef;

    /**
     * Constructor
     */
    constructor(viewContainerRef: ViewContainerRef) {
        super(viewContainerRef);
    }

    /**
     * On settings loaded
     * @param settings the BulkTerminateMaterialsButtonDisableDataSource settings definition
     */
    public onLoadSettings(settings: DataSourceSettingsDef): void {
        this.settings = settings;
    }
}
