import React from 'react';
import { makeAutoObservable } from 'mobx';

export class ModalStore {
  modalShowed = false;

  modalContent = (<></>);

  modalTitle = 'modal.raw_json';

  constructor() {
    makeAutoObservable(this);
  }

  showModal = (content, title) => {
    if (content) this.modalContent = content;
    if (title) this.modalTitle = title;
    this.modalShowed = true;
  };

  hideModal = () => {
    this.modalShowed = false;
  };
}

export default new ModalStore();
