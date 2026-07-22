import { Component, inject } from '@angular/core';

import { Modal } from '../../core/services/modal';
@Component({

  selector:'app-confirm-modal',

  standalone:true,

  imports:[],

  templateUrl:'./confirm-modal.html',

  styleUrl:'./confirm-modal.css'

})

export class ConfirmModalComponent{

  modalService = inject(Modal);

}