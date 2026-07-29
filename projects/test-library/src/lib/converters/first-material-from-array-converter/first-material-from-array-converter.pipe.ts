import {
    Pipe,
    PipeTransform
} from '@angular/core';

import {
    Converter
} from 'cmf-core-dashboards';

import {
    SimpleType,
    ComplexType
} from 'cmf-core';

import {
    Cmf
} from 'cmf-lbos';

/**
 * First Material From Array Converter
 *
 * Please provide a meaningful description of this converter and how to use it
 *
 * ## Example
 *
 * ```html
 * {{obj | firstMaterialFromArray}}
 * ```
 */
@Converter({
    name: $localize`:@@test-library/first-material-from-array#NAME:First Material From Array Converter`,
    input: [],
    output: <ComplexType>{
        type: SimpleType.ReferenceType,
        referenceType: Cmf.Foundation.Common.ReferenceType.EntityType,
        referenceTypeName: 'Material'
    }
})
@Pipe({
    standalone: true,
    name: 'firstMaterialFromArray'
})
export class FirstMaterialFromArrayConverter implements PipeTransform {
    transform(value: any): any {
        if (!Array.isArray(value) || value.length === 0) {
            return null;
        }

        return value[0];
    }
}
