import {
    Pipe,
    PipeTransform
} from '@angular/core';
 
import {
    Converter,
} from 'cmf-core-dashboards';
 
import { Cmf } from 'cmf-lbos';
 
import {
    SimpleType,
    ComplexType,
    CollectionType
} from 'cmf-core';
 
/**
 * Material Description Converter Converter
 *
 * Please provide a meaningful description of this converter and how to use it
 *
 * ## Example
 *
 * ```html
 * {{obj | materialDescriptionConverter}}
 * ```
 */
@Converter({
    name: $localize`:@@test-library/material-description-converter#NAME:Material Description Converter Converter`,
    input: [<ComplexType>{
      collectionType: CollectionType.Array,
      type: SimpleType.ReferenceType,
      referenceType: Cmf.Foundation.Common.ReferenceType.EntityType,
      referenceTypeName: 'Material'
    }],
    output: <ComplexType>{
        // your output type here
        collectionType: CollectionType.None,
        type: SimpleType.String,
    }
})
@Pipe({
    standalone: true,
    name: 'materialDescriptionConverter'
})
export class MaterialDescriptionConverterConverter implements PipeTransform {
    transform(value: any, args: any[]): string {
        if (Array.isArray(value) && value.length > 0) {
            return value[0]?.Description ?? '-';
        }
        return '-';
    }
}
 
/*
export class MaterialDescriptionConverterConverter implements PipeTransform {
    transform(materials: any[]): string {
        if(!materials || materials.length == 0){
            return '-';
        }
        console.log(materials);
        return materials[0]?.Description ?? '-';
    }
}
 */