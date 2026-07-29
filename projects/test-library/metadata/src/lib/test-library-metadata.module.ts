import { NgModule } from '@angular/core';
import { MetadataLoader } from 'cmf-core';

import { TestLibraryMetadataService } from './test-library-metadata.service';

@NgModule({
    providers: [TestLibraryMetadataService]
})
export class TestLibraryMetadataModule {

    /**
     * Constructor
     */
    constructor(loader: MetadataLoader) {
        loader.loadMetadata(TestLibraryMetadataService);
    }
}