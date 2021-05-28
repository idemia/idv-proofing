import React, { useMemo } from 'react';
import { HEADER_TYPES } from '@components/Header/style';
import GetIdAnimation from '@assets/animations/doc-auth-anim-start.json';
import Wizard from '@components/Wizard';
import routes from '@routes';
import { inject, observer } from 'mobx-react';

const header = { type: HEADER_TYPES.LOCK };
const button = {
  title: 'instructions.got_one',
  navigateTo: { pathname: routes.root },
};

const GetYourId = ({ documentStore: { docType } }) => {
  const message = useMemo(
    () => ({
      heading: docType && `instructions.get_your.${docType}`,
    }),
    [docType],
  );
  return (
    <Wizard
      header={header}
      button={button}
      message={message}
      animation={GetIdAnimation}
    />
  );
};

export default inject('documentStore')(observer(GetYourId));
