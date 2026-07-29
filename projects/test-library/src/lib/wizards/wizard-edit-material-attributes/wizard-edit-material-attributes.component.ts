import {
    Component,
    forwardRef,
    inject,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {
    CommonModule
} from '@angular/common';

import {
    Cmf
} from 'cmf-lbos';

import {
    CustomizableComponent,
    HOST_VIEW_COMPONENT,
    UtilService,
    EntityTypeService,
} from 'cmf-core';

import {
    PageBag,
    Wizard,
    WizardEventArgs
} from 'cmf-core-controls';

import {
    TransactionWizardModule,
    TransactionWizard,
    TransactionEventArgs,
    PropertyEditorModule
} from 'cmf-core-business-controls';

/**
 * @whatItDoes
 *
 * Please provide a meaningful description of this component
 * Try to answer these questions:
 * * What is it?
 * * What it does?
 * * How does it behave with different sizes?
 * * Does it retrieve data from any external source (server, local database, text file, etc...)?
 *
 * @howToUse
 *
 * This component is used with the inputs and outputs mentioned below.
 *
 * Besides the description above, please complement it with a meaningful description of this component that answer these questions:
 * * How to use it?
 * * Where and When to use it?
 *
 * ### Inputs
 * `string` : **name** - The name of this component
 * `number` : **value** - The value of this component
 *
 * ### Outputs
 * `string` : **onNameChange** - When the name of the component change, this output emits the new name
 * `number` : **onValueChange** - When the value of the component change, this output emits the new value
 *
 * ### Example
 * To use the component, assume this HTML Template as an example:
 *
 * ```HTML
 * <test-library-wizard-edit-material-attributes></test-library-wizard-edit-material-attributes>
 * ```
 *
 * ### _NOTES_
 * (optional, Provide additional notes here)
 *
 * @description
 *
 * ## EditMaterialAttributesComponent Component
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
    selector: 'test-library-wizard-edit-material-attributes',
    imports: [CommonModule, TransactionWizardModule,PropertyEditorModule],
    templateUrl: './wizard-edit-material-attributes.component.html',
    styleUrls: ['./wizard-edit-material-attributes.component.less'],
    viewProviders: [{ provide: HOST_VIEW_COMPONENT, useExisting: forwardRef(() => WizardEditMaterialAttributesComponent) }]
})
export class WizardEditMaterialAttributesComponent extends CustomizableComponent implements OnInit, TransactionWizard {

    /**
     * The instance of the wizard
     */
    public instance: Cmf.Navigo.BusinessObjects.Material;

    public batchType: string = '';
    public packageType: string = '';
    public productionPriority: number | null = null;
    public qualityComment: string = '';


    /** Dependencies */
    protected util = inject(UtilService);
    protected entityTypes = inject(EntityTypeService);
    protected pageBag = inject(PageBag);

    /**
     * The wizard element
     */
    @ViewChild(Wizard, { static: true })
    protected _nestedWizard!: Wizard;

    /**
     * NgOnInit. Sets the basic wizard content according to the pageBag context.
     */
    public ngOnInit(): void {
    if (this.pageBag == null || this.pageBag.context == null) {
        throw new Error(
            $localize`:@@test-library/wizard-edit-material-attributes#MISSING_CONTEXT:Missing context`
        );
    }

    const contextValue = this.pageBag.context.instance;

    const selectedMaterials = Array.isArray(contextValue)
        ? contextValue
        : [contextValue];

    if (
        selectedMaterials.length !== 1 ||
        !this.util.instanceof(
            selectedMaterials[0],
            Cmf.Navigo.BusinessObjects.Material
        )
    ) {
        throw new Error(
            $localize`:@@test-library/wizard-edit-material-attributes#NO_INSTANCE_FOUND:Please select exactly one material`
        );
    }

    this.pageBag.context.instance = selectedMaterials[0];
}

    /**
     * Method that prepares the data for the wizard
     */
    public async prepareDataInput(): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput[]> {
        const inputs: Cmf.Foundation.BusinessOrchestration.BaseInput[] = [];

        const instanceInput = new Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.InputObjects.GetObjectByIdInput();
        instanceInput.IgnoreLastServiceId = true;
        instanceInput.Id = this.pageBag.context.instance.Id;
        instanceInput.Type = this.entityTypes.getEntityTypeNameFromInstance(this.pageBag.context.instance);
        instanceInput.LevelsToLoad = 1;
        inputs.push(instanceInput);

        const attributesInput =
        new Cmf.Navigo.BusinessOrchestration.MaterialManagement.InputObjects.LoadMaterialAttributesInput();

        attributesInput.IgnoreLastServiceId = true;
        attributesInput.Material = this.pageBag.context.instance;
        attributesInput.AttributeNames = [
             'BatchType',
             'PackageType',
             'ProductionPriority',
             'QualityComment'
        ];

        inputs.push(attributesInput);

        return inputs;
    }

    /**
     * Method that receive the data from prepareDataInput
     */
    public async handleDataOutput(
    outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[],
    wizardArgs?: WizardEventArgs
): Promise<void> {

    if (outputs != null && outputs.length >= 2) {
        const loadInstanceOutput =
            outputs[0] as Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.OutputObjects.GetObjectByIdOutput;

        const loadAttributesOutput =
            outputs[1] as Cmf.Navigo.BusinessOrchestration.MaterialManagement.OutputObjects.LoadMaterialAttributesOutput;

        this.instance = loadInstanceOutput.Instance;

        const attributes = loadAttributesOutput.Material?.Attributes;

        if (attributes != null) {
            this.batchType = attributes.get('BatchType') ?? '';
            this.packageType = attributes.get('PackageType') ?? '';
            this.qualityComment = attributes.get('QualityComment') ?? '';

            const priority = attributes.get('ProductionPriority');

            this.productionPriority =
                priority !== null && priority !== undefined
                    ? Number(priority)
                    : null;
        }
    }

    await this._nestedWizard.reEvaluateContextPreConditions(
        { instance: this.instance },
        true
    );
}

    /**
     * The wizard prepareTransactionInput method where we can append the input for the final wizard
     * @param args Current inputs where the user can append or simply resolve its own input.
     */
    public async prepareTransactionInput(
    args: TransactionEventArgs
): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {

    const input =
        new Cmf.Navigo.BusinessOrchestration.MaterialManagement.InputObjects.UpdateMaterialAttributesInput();

    input.IgnoreLastServiceId = true;
    input.Material = this.instance;
    input.Attributes = new Cmf.Foundation.BusinessObjects.AttributeCollection();

    input.Attributes.set('BatchType', this.batchType);
    input.Attributes.set('PackageType', this.packageType);
    input.Attributes.set('ProductionPriority', this.productionPriority);
    input.Attributes.set('QualityComment', this.qualityComment);

    return input;
}

    /**
     * The wizard hook for handling the above service call.
     * @param output output object, result of the input created in the prepareTransactionInput
     */
    public async handleTransactionOutput(output: Cmf.Foundation.BusinessOrchestration.BaseOutput): Promise<void> {
        return;
    }
}
