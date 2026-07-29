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
 * Selected Material To Product Id Converter Converter
 *
 * Please provide a meaningful description of this converter and how to use it
 *
 * ## Example
 *
 * ```html
 * {{obj | selectedMaterialToProductIdConverter}}
 * ```
 */
@Converter({
    name: $localize`:@@test-library/selected-material-to-product-id-converter#NAME:Selected Material To Product Id Converter Converter`,
    input: [],
    output: SimpleType.Long
})
@Pipe({
    standalone: true,
    name: 'selectedMaterialToProductIdConverter'
})
export class SelectedMaterialToProductIdConverterConverter implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        
      if (!value || !Array.isArray(value)) {
            return null;
        }
 
        const productIds = [...new Set(
            value
                .filter(m => m?.Product?.Id)
                .map(m => m.Product.Id)
        )];
 
        console.log("ProductIds:", productIds);
 
        return productIds;
    
    }
}
