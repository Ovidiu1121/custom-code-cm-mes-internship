import {
    Component,
    forwardRef,
    inject,
    OnInit,
    ViewChild,
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
    LboService,
    SelectionMode
} from 'cmf-core';

import {
    PageBag,
    Wizard,
    WizardEventArgs,
    ComboBoxModule,
    DataGridModule,
    DataGridColumn
} from 'cmf-core-controls';

import {
    ColumnViewModule,
    ColumnViewModel,
    ColumnViewRemoveArgs
} from 'cmf-core-controls';

import {
    TransactionWizardModule,
    TransactionWizard,
    TransactionEventArgs,
    PropertyEditorModule
} from 'cmf-core-business-controls';

export interface ControlData {
    index: number,
    name: string,
}
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
 * <test-library-wizard-bulk-step-update></test-library-wizard-bulk-step-update>
 * ```
 *
 * ### _NOTES_
 * (optional, Provide additional notes here)
 *
 * @description
 *
 * ## BulkStepUpdateComponent Component
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
    selector: 'test-library-wizard-change-submaterials-flow-and-step',
    imports: [
        CommonModule,
        TransactionWizardModule,
        ComboBoxModule,
        PropertyEditorModule,
        DataGridModule,
        ColumnViewModule
    ],
    templateUrl: './wizard-change-submaterials-flow-and-step.component.html',
    styleUrls: ['./wizard-change-submaterials-flow-and-step.component.less'],
    viewProviders: [{ provide: HOST_VIEW_COMPONENT, useExisting: forwardRef(() => WizardChangeSubmaterialsFlowAndStepComponent) }]
})
export class WizardChangeSubmaterialsFlowAndStepComponent extends CustomizableComponent implements OnInit, TransactionWizard {

    /**
     * The instance of the wizard
     */
    public instance: Cmf.Navigo.BusinessObjects.Material;

    //Flows Combobox Attributes
    public flows: any[] = [];
    public selectedFlow: any = null;

    // Steps Combobox Attributes
    public steps: any[] = [];
    public selectedStep: any = null;

    // Data Grid Attributes
    public changeForAllSubmaterials: boolean = true;
    public columns: DataGridColumn[];
    public kendoDataSource: kendo.data.DataSource;
    public subMaterials: any[] = [];
    public selectedLines: any[] = [];
    public isPageable = true;
    public selectionMode = SelectionMode.Multiple;
    public columnViewModel: ColumnViewModel;

    /** Dependencies */
    protected util = inject(UtilService);
    protected entityTypes = inject(EntityTypeService);
    protected pageBag = inject(PageBag);

    protected lbo = inject(LboService);

    /**
     * The wizard element
     */
    @ViewChild(Wizard, { static: true })
    protected _nestedWizard!: Wizard;

    /**
     * NgOnInit. Sets the basic wizard content according to the pageBag context.
     */
    public async ngOnInit(): Promise<void> {
        this.instance = this.pageBag.context.instance;

    await this.loadFlows();

    this.initializeGrid();

    this.columnViewModel = {
    rootNode: {
        id: 'root',
        name: 'Selected Materials',
        value: '',
        noChildrenMsg: 'No materials selected',
        children: []
    }
};

    await this.loadSubMaterials();
    }

    private async loadFlows(): Promise<void> {

        const fieldCollection: Cmf.Foundation.BusinessObjects.QueryObject.FieldCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.FieldCollection();

        // Field: Id
        const field_Id: Cmf.Foundation.BusinessObjects.QueryObject.Field =
            new Cmf.Foundation.BusinessObjects.QueryObject.Field();

        field_Id.Alias = "Id";
        field_Id.ObjectName = "Flow";
        field_Id.ObjectAlias = "Flow_1";
        field_Id.IsUserAttribute = false;
        field_Id.Name = "Id";
        field_Id.Position = 0;
        field_Id.Sort = Cmf.Foundation.Common.FieldSort.NoSort;

        // Field: Name
        const field_Name: Cmf.Foundation.BusinessObjects.QueryObject.Field =
            new Cmf.Foundation.BusinessObjects.QueryObject.Field();

        field_Name.Alias = "Name";
        field_Name.ObjectName = "Flow";
        field_Name.ObjectAlias = "Flow_1";
        field_Name.IsUserAttribute = false;
        field_Name.Name = "Name";
        field_Name.Position = 1;
        field_Name.Sort = Cmf.Foundation.Common.FieldSort.Ascending;

        // Field: Universal State
        const field_UniversalState =
            new Cmf.Foundation.BusinessObjects.QueryObject.Field();

        field_UniversalState.Alias = "UniversalState";
        field_UniversalState.ObjectName = "Flow";
        field_UniversalState.ObjectAlias = "Flow_1";
        field_UniversalState.IsUserAttribute = false;
        field_UniversalState.Name = "UniversalState";
        field_UniversalState.Position = 2;
        field_UniversalState.Sort = Cmf.Foundation.Common.FieldSort.NoSort;

        fieldCollection.push(field_Id);
        fieldCollection.push(field_Name);
        fieldCollection.push(field_UniversalState);

        const filterCollection: Cmf.Foundation.BusinessObjects.QueryObject.FilterCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.FilterCollection();

        const effectiveFilter =
            new Cmf.Foundation.BusinessObjects.QueryObject.Filter();

        effectiveFilter.Name = "UniversalState";
        effectiveFilter.ObjectName = "Flow";
        effectiveFilter.ObjectAlias = "Flow_1";
        effectiveFilter.Operator =
            Cmf.Foundation.Common.FieldOperator.IsEqualTo;
        effectiveFilter.Value = 3;
        effectiveFilter.LogicalOperator =
            Cmf.Foundation.Common.LogicalOperator.Nothing;
        effectiveFilter.FilterType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.FilterType.Normal;

        filterCollection.push(effectiveFilter);

        const relationCollection: Cmf.Foundation.BusinessObjects.QueryObject.RelationCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.RelationCollection();

        const query: Cmf.Foundation.BusinessObjects.QueryObject.QueryObject =
            new Cmf.Foundation.BusinessObjects.QueryObject.QueryObject();

        query.Description = "";
        query.EntityTypeName = "Flow";
        query.Query = new Cmf.Foundation.BusinessObjects.QueryObject.Query();
        query.Query.Distinct = false;
        query.Query.Fields = fieldCollection;
        query.Query.Filters = filterCollection;
        query.Query.Relations = relationCollection;

        const executeQueryInput =
            new Cmf.Foundation.BusinessOrchestration.QueryManagement.InputObjects.ExecuteQueryInput();

        executeQueryInput.QueryObject = query;

        const executeQueryOutput: any = await this.lbo.call(executeQueryInput);

        console.log("Flows query output:", executeQueryOutput);

        const rows =
            executeQueryOutput?.NgpDataSet?.["T_Result"] ??
            executeQueryOutput?.NgpDataSet?.T_Result ??
            [];

        // Eliminate the duplications
        const uniqueFlows = new Map<string, any>();
        rows.forEach((row: any) => {
            const existing = uniqueFlows.get(row["Name"]);
            if (!existing || row["UniversalState"] === 3) {
                uniqueFlows.set(
                    row["Name"],
                    {
                        Id: row["Id"],
                        Name: row["Name"],
                        UniversalState: row["UniversalState"]
                    }
                );
            }
        });
        this.flows = Array.from(uniqueFlows.values());

        console.log("Loaded flows:", this.flows);
    }

    private async loadSteps(flowName: string): Promise<void> {

        const filterCollection: Cmf.Foundation.BusinessObjects.QueryObject.FilterCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.FilterCollection();

        // Always true filter, copied from generated query
        const filter_0: Cmf.Foundation.BusinessObjects.QueryObject.Filter =
            new Cmf.Foundation.BusinessObjects.QueryObject.Filter();

        filter_0.ObjectName = "Flow";
        filter_0.ObjectAlias = "Step_FlowStep_SourceEntity_3";
        filter_0.Value = null;
        filter_0.LogicalOperator = Cmf.Foundation.Common.LogicalOperator.AND;
        filter_0.FilterType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.FilterType.AlwaysTrue;

        // Filter: Flow.Name = selected flow name
        const filter_1: Cmf.Foundation.BusinessObjects.QueryObject.Filter =
            new Cmf.Foundation.BusinessObjects.QueryObject.Filter();

        filter_1.Name = "Name";
        filter_1.ObjectName = "Flow";
        filter_1.ObjectAlias = "Step_FlowStep_SourceEntity_3";
        filter_1.Operator = Cmf.Foundation.Common.FieldOperator.IsEqualTo;

        // IMPORTANT: here we use the selected flow name directly
        filter_1.Value = flowName;

        filter_1.LogicalOperator = Cmf.Foundation.Common.LogicalOperator.AND;
        filter_1.FilterType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.FilterType.Normal;

        // Filter: Flow.UniversalState = Effective
        const filter_2: Cmf.Foundation.BusinessObjects.QueryObject.Filter =
            new Cmf.Foundation.BusinessObjects.QueryObject.Filter();

        filter_2.Name = "UniversalState";
        filter_2.ObjectName = "Flow";
        filter_2.ObjectAlias = "Step_FlowStep_SourceEntity_3";
        filter_2.Operator = Cmf.Foundation.Common.FieldOperator.IsEqualTo;

        // Effective state
        filter_2.Value = Cmf.Foundation.Common.Base.UniversalState.Effective;
        // If this gives compile error, use:
        // filter_2.Value = 3;

        filter_2.LogicalOperator = Cmf.Foundation.Common.LogicalOperator.Nothing;
        filter_2.FilterType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.FilterType.Normal;

        filterCollection.push(filter_0);
        filterCollection.push(filter_1);
        filterCollection.push(filter_2);

        const fieldCollection: Cmf.Foundation.BusinessObjects.QueryObject.FieldCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.FieldCollection();

        // Step Id
        const field_0: Cmf.Foundation.BusinessObjects.QueryObject.Field =
            new Cmf.Foundation.BusinessObjects.QueryObject.Field();

        field_0.Alias = "Id";
        field_0.ObjectName = "Step";
        field_0.ObjectAlias = "Step_1";
        field_0.IsUserAttribute = false;
        field_0.Name = "Id";
        field_0.Position = 0;
        field_0.Sort = Cmf.Foundation.Common.FieldSort.NoSort;

        // Step Name
        const field_1: Cmf.Foundation.BusinessObjects.QueryObject.Field =
            new Cmf.Foundation.BusinessObjects.QueryObject.Field();

        field_1.Alias = "Name";
        field_1.ObjectName = "Step";
        field_1.ObjectAlias = "Step_1";
        field_1.IsUserAttribute = false;
        field_1.Name = "Name";
        field_1.Position = 1;
        field_1.Sort = Cmf.Foundation.Common.FieldSort.NoSort;

        fieldCollection.push(field_0);
        fieldCollection.push(field_1);

        const relationCollection: Cmf.Foundation.BusinessObjects.QueryObject.RelationCollection =
            new Cmf.Foundation.BusinessObjects.QueryObject.RelationCollection();

        // Relation: Flow -> Step using FlowStep relation
        const relation_0: Cmf.Foundation.BusinessObjects.QueryObject.Relation =
            new Cmf.Foundation.BusinessObjects.QueryObject.Relation();

        relation_0.Alias = "Step_FlowStep_2";
        relation_0.IsRelation = true;
        relation_0.Name = "FlowStep";

        relation_0.SourceEntity = "Flow";
        relation_0.SourceEntityAlias = "Step_FlowStep_SourceEntity_3";
        relation_0.SourceJoinType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.JoinType.InnerJoin;
        relation_0.SourceProperty = "Id";

        relation_0.TargetEntity = "Step";
        relation_0.TargetEntityAlias = "Step_1";
        relation_0.TargetJoinType =
            Cmf.Foundation.BusinessObjects.QueryObject.Enums.JoinType.InnerJoin;
        relation_0.TargetProperty = "Id";

        relationCollection.push(relation_0);

        const query: Cmf.Foundation.BusinessObjects.QueryObject.QueryObject =
            new Cmf.Foundation.BusinessObjects.QueryObject.QueryObject();

        query.Description = "";
        query.EntityTypeName = "Step";
        query.Name = "GetStepsQuery";
        query.Query = new Cmf.Foundation.BusinessObjects.QueryObject.Query();
        query.Query.Distinct = true;
        query.Query.Filters = filterCollection;
        query.Query.Fields = fieldCollection;
        query.Query.Relations = relationCollection;

        const executeQueryInput =
            new Cmf.Foundation.BusinessOrchestration.QueryManagement.InputObjects.ExecuteQueryInput();

        executeQueryInput.QueryObject = query;

        const executeQueryOutput: any = await this.lbo.call(executeQueryInput);

        const rows =
            executeQueryOutput?.NgpDataSet?.["T_Result"] ??
            executeQueryOutput?.NgpDataSet?.T_Result ??
            [];

        this.steps = rows.map((row: any) => ({
            Id: row["Id"],
            Name: row["Name"]
        }));

        console.log("Loaded steps:", this.steps);
    }

    private async loadSubMaterials(): Promise<void> {
    const input =
        new Cmf.Navigo.BusinessOrchestration.MaterialManagement
            .InputObjects.LoadMaterialChildrenInput();

    input.IgnoreLastServiceId = true;
    input.Material = this.instance;
    input.LevelsToLoad = 1;

    const output =
        await this.lbo.call(input) as
            Cmf.Navigo.BusinessOrchestration.MaterialManagement
                .OutputObjects.LoadMaterialChildrenOutput;

    const loadedMaterial: any = output.Material;

    const children =
        loadedMaterial?.SubMaterials ??
        loadedMaterial?.SubMaterialCollection ??
        [];

    this.subMaterials = Array.from(children).map((material: any) => ({
        Material: material,
        Id: material.Id,
        Name: material.Name,
        FlowName: material.Flow?.Name ?? '',
        StepName: material.Step?.Name ?? ''
    }));

    this.kendoDataSource = new kendo.data.DataSource({
        data: this.subMaterials,
        pageSize: 10
    });
}

    private initializeGrid(): void {

        this.columns = [
            {
                field: 'Name',
                title: 'Material'
            },
            {
                field: 'FlowName',
                title: 'Flow'
            },
            {
                field: 'StepName',
                title: 'Step'
            }
        ];

        this.kendoDataSource = new kendo.data.DataSource({
            data: this.subMaterials,
            pageSize: 10
        });
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
        inputs.push(instanceInput);

        return inputs;
    }

    /**
     * Method that receive the data from prepareDataInput
     */
    public async handleDataOutput(outputs: Cmf.Foundation.BusinessOrchestration.BaseOutput[], wizardArgs?: WizardEventArgs): Promise<void> {
        if (outputs != null && outputs.length >= 1) {
            const loadInstanceOutput =
                outputs[0] as Cmf.Foundation.BusinessOrchestration.GenericServiceManagement.OutputObjects.GetObjectByIdOutput;

            this.instance = loadInstanceOutput.Instance;
        }

        await this._nestedWizard.reEvaluateContextPreConditions({ instance: this.instance }, true);
    }

    /**
     * The wizard prepareTransactionInput method where we can append the input for the final wizard
     * @param args Current inputs where the user can append or simply resolve its own input.
     */
   public async prepareTransactionInput(
    _args: TransactionEventArgs
): Promise<Cmf.Foundation.BusinessOrchestration.BaseInput> {

    if (
        this.selectedFlow == null ||
        this.selectedStep == null ||
        this.selectedFlowPath == null
    ) {
        throw new Error('Flow and Step are required.');
    }

    const rowsToChange = this.changeForAllSubmaterials
        ? this.subMaterials
        : this.selectedLines;

    if (rowsToChange == null || rowsToChange.length === 0) {
        throw new Error('Select at least one submaterial.');
    }

    const materials =
        new Cmf.Navigo.BusinessObjects.MaterialCollection();

    rowsToChange.forEach((row: any) => {
        materials.push(row.Material ?? row);
    });

    const input =
        new Cmf.Navigo.BusinessOrchestration.MaterialManagement
            .InputObjects.ChangeMaterialsFlowAndStepInput();

    input.IgnoreLastServiceId = true;
    input.Materials = materials;
    input.FlowPath = this.selectedFlowPath;
    input.ForceQueuedState = false;

    return input;
}

    /**
     * The wizard hook for handling the above service call.
     * @param output output object, result of the input created in the prepareTransactionInput
     */
    public async handleTransactionOutput(output: Cmf.Foundation.BusinessOrchestration.BaseOutput): Promise<void> {
        return;
    }

    public submaterialsStepCondition = () => {
        return !this.changeForAllSubmaterials;
    };

    public async onFlowChanged(): Promise<void> {

        console.log("Selected Flow:", this.selectedFlow);

        this.selectedStep = null;
        this.steps = [];

        if (this.selectedFlow) {
            await this.loadSteps(this.selectedFlow.Name);
        }
    }
    public onGridSelectionChanged(): void {
    this.columnViewModel.rootNode.children =
        this.selectedLines.map((row: any) => ({
            id: row.Id,
            name: row.Name,
            value: `${row.FlowName} / ${row.StepName}`,
            canRemove: true,
            tag: row
        })) as any;
}

public onRemoveFromColumnView(event: ColumnViewRemoveArgs): void {
    const materialId = event.selectedRow.rootNode.id;

    this.selectedLines = this.selectedLines.filter(
        (row: any) => row.Id !== materialId
    );

    event.remove(true);
    this.onGridSelectionChanged();
}
}
