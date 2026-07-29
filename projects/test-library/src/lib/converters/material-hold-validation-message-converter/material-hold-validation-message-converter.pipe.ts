import {
    Pipe,
    PipeTransform
} from '@angular/core';
 
import {
    Converter
} from 'cmf-core-dashboards';
 
import {
    SimpleType,
} from 'cmf-core';
 
/**
 * Material Hold Validation Message Converter
 *
 * Please provide a meaningful description of this converter and how to use it
 *
 * ## Example
 *
 *
 * C:\CriticalManufacturing\CMInstallation\Cmf.Custom.HTML\projects\test-library\src\lib\material-hold-validation-message-converter\material-hold-validation-message-converter.pipe.ts
 * ```html
 * {{obj | materialHoldValidationMessage}}
 * ```
 */
@Converter({
    name: $localize`:@@test-library/material-hold-validation-message#NAME:Material Hold Validation Message Converter`,
    input: [],
    output: SimpleType.String
})
@Pipe({
    standalone: true,
    name: 'materialHoldValidationMessage'
})
export class MaterialHoldValidationMessageConverter implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        console.log("=== MaterialHoldValidationMessageConverter ===");
        console.log("Input:", value);
 
        if (!value) {
            return "";
        }
 
        // If someday the grid sends an array instead of one material
        if (Array.isArray(value)) {
            if (value.length === 0) {
                return "";
            }
 
            if (value.length > 1) {
                return "Hold action is allowed only when exactly one material is selected.";
            }
 
            value = value[0];
        }
 
        const universalState = value.UniversalState;
        const primaryQuantity = value.PrimaryQuantity;
 
        // UniversalState 4 = Terminated
        if (universalState === 4) {
            return "Hold action is not allowed because the selected material is terminated.";
        }
 
        if (primaryQuantity > 100) {
            return "Hold action is not allowed because the selected material quantity exceeds 100.";
        }
 
        return "";
 
    }
}