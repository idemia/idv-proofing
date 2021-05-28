import React from 'react';
import ReactDOM from 'react-dom';
import { inject, observer } from 'mobx-react';

import {
  ModalHeader,
  AbsolutePage,
  CloseButton,
} from '@components/Modal/style';
import { FormattedMessage } from 'react-intl';
import { CSSTransition } from 'react-transition-group';

import '@components/Modal/modalAnimation.css';

const Modal = ({
  modalStore: { modalShowed, modalContent, modalTitle, hideModal },
}) =>
  ReactDOM.createPortal(
    <CSSTransition
      in={modalShowed}
      classNames="modal"
      timeout={400}
      unmountOnExit
    >
      <AbsolutePage>
        <ModalHeader>
          <CloseButton
            src="/images/close.svg"
            alt="close"
            onClick={hideModal}
          />
          <FormattedMessage id={modalTitle} />
        </ModalHeader>
        {modalContent}
      </AbsolutePage>
    </CSSTransition>,
    document.getElementById('modal'),
  );

export default inject('modalStore')(observer(Modal));
