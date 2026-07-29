import {
    Injectable
} from '@angular/core';

import {
    RouteConfig,
    PackageMetadata,
    Action,
    MenuGroup,
    MenuItem,
    ActionButton,
    ActionButtonGroup,
    EntityTypeMetadata,
    PackageInfo, ActionMode,
    ComplexType,
    SimpleType,
    ActionBar,
    ActionBarElementType,
    EntityTypeBasicInfoProperties
} from 'cmf-core';

import {
    Cmf
} from 'cmf-lbos';

@Injectable()
export class TestLibraryMetadataService extends PackageMetadata {

    /**
     * Package Info
     */
    public override get packageInfo(): PackageInfo {
        return {
            name: 'test-library',
            loader: () => import(
                /* webpackExports: [
                    "MyConverterConverter",
                    "BooleanToIntegerConverter",
                    "MaterialHoldValidationMessageConverter",
                    "BulkTerminateMaterialsButtonDisableDataSource",
                    "HoldMaterialButtonDisableDataSource",
                    "SelectedMaterialToProductIdConverter",
                    "SelectedMaterialToWizardConverterConverter",
                    "EditMaterialButtonDisableDataSource",
                    "PrintMaterialButtonDisableDataSource"
                ] */
                'test-library'),
            converters: [
                'MyConverterConverter',
                'BooleanToIntegerConverter',
                'MaterialHoldValidationMessageConverter',
                'SelectedMaterialToProductIdConverter',
                'SelectedMaterialToWizardConverterConverter'
            ],
            widgets: [],
            dataSources: [
                'BulkTerminateMaterialsButtonDisableDataSource',
                'HoldMaterialButtonDisableDataSource',
                'EditMaterialButtonDisableDataSource',
                'PrintMaterialButtonDisableDataSource'
            ],
            components: [
                'WizardMaterialAttributesEditComponent',
                'WizardChangeSubmaterialsFlowAndStepComponent'
            ],
        };
    }

    /**
     * Action Button Groups
     */
    public override get actionButtonGroups(): ActionButtonGroup[] {
        return [];
    }

    /**
     * Action Buttons
     */
    public override get actionButtons(): ActionButton[] {
        return [
            {
                id: 'Custom.Material.EditAttributes.Button',
                actionId: 'Custom.Material.EditAttributes',
                title: 'Edit Material Attributes',
                iconClass: 'icon-core-st-lg-edit',
                onBuildContext: this.buildEditAttributesContext.bind(this)
            },
            {
                id: "BulkStepUpdateButton",
                actionId: "Material.BulkStepUpdate",
                title: "Bulk Step Update",
                iconClass: "icon-core-st-lg-edit",
                onBuildContext: this.buildBulkStepUpdateContext.bind(this)
            }
        ];
    }

    /**
     * Actions
     */
    public override get actions(): Action[] {
        return [{
            id: 'Material.AttributesEdit',
            loadComponent: () => import(
                /* webpackExports: "WizardMaterialAttributesEditComponent" */
                'test-library').then(m => m.WizardChangeSubmaterialsFlowAndStepComponent),
            mode: ActionMode.ModalPage,
            inputs: {/*
                instance: <ComplexType>{
                    type: SimpleType.ReferenceType,
                    referenceType: Cmf.Foundation.Common.ReferenceType.EntityType,
                    referenceTypeName: 'Material'
                }*/
            }
        },
        {
            id: 'Material.BulkStepUpdate',
            loadComponent: () => import(
                /* webpackExports: "WizardBulkStepUpdateComponent" */
                'test-library').then(m => m.WizardChangeSubmaterialsFlowAndStepComponent),
            mode: ActionMode.ModalPage
        }
        ];
    }

    public override get actionBars(): ActionBar[] {
        return [
            {
                id: 'cmf.core.business.controls.entityPage.Material',
                elementsToAdd: [
                    {
                        type: ActionBarElementType.ACTION_BUTTON,
                        id: 'BulkStepUpdateButton'
                    }
                ]
            }
        ]
    }

    /**
     * Menu Groups
     */
    public override get menuGroups(): MenuGroup[] {
        return [];
    }

    /**
     * Menu Items
     */
    public override get menuItems(): MenuItem[] {
        return [];
    }

    /**
     * Entity Types
     */
    public override get entityTypes(): EntityTypeMetadata[] {
        return [
        {
            name: 'Material',

            entityBasicInfoCreator: async (
                material: Cmf.Navigo.BusinessObjects.Material
            ): Promise<EntityTypeBasicInfoProperties> => {

                return {
                    headerProperties: [],
                    bodyProperties: []
                };
            }
        }
    ];
    }

    /**
     * Routes
     */
    public override get routes(): RouteConfig[] {
        return [];
    }


    private async buildEditAttributesContext(context: any): Promise<any> {
        const newContext: any = {};

        const selectedMaterial = context?.instance ?? context?.material;

        if (selectedMaterial) {
            newContext.instance = selectedMaterial;
        }

        return newContext;
    }

    private async buildBulkStepUpdateContext(
        context: any
    ): Promise<any> {

        console.log("Action Context:", context);

        const sourceComponent = Object.getOwnPropertySymbols(context)
            .map(s => context[s])
            .find(v => v?._entity || v?.epEntity);

        console.log("SourceComponent:", sourceComponent);

        return {
            instance: sourceComponent?.epEntity ?? sourceComponent?._entity
        };
    }
}
