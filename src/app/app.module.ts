import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MesUIModule } from 'cmf-mes-ui';
import { MetadataRoutingModule } from 'cmf-core';
import { TestLibraryMetadataModule } from 'test-library/metadata';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        ServiceWorkerModule.register('ngsw-loader-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        MesUIModule.forRoot(),
        TestLibraryMetadataModule,
        MetadataRoutingModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
