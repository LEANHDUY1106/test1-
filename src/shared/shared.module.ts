import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { AppSessionService } from './session/app-session.service';
//import { AuthGuard } from './auth/auth.guard';
import { MessageConfirmService } from './services/message-confirm.service';
import { MailPipe } from './pipes/mail.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
    ],
    declarations: [
        MailPipe
    ],
    exports: [
        MailPipe
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [
                AppSessionService
                , //AuthGuard
                , MessageConfirmService
            ]
        };
    }
}
