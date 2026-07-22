import { CanDeactivateFn } from '@angular/router';

import { CanComponentDeactivate } from './can-deactivate.interface';

export const unsavedChangesGuard:
CanDeactivateFn<CanComponentDeactivate> =

(component) => {

    return component.canDeactivate();

};