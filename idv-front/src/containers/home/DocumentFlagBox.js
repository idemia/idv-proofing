import React, { memo, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import * as Styled from '@containers/home/style';

const DocumentFlagBox = ({ item, selectMethod }) => {
  const intl = useIntl();

  const printMethods = useMemo(() => {
    let out = '';
    item.methods.forEach(method => {
      out += `${intl.formatMessage({ id: method })}, `;
    });
    return out.replace(/,\s*$/, '');
  }, [item.methods]);

  const onClickHandler = useCallback(() => {
    selectMethod(item);
  }, [item]);

  return (
    <Styled.OptionsItem type="button" onClick={onClickHandler}>
      <Styled.OptionFlag className="emoji-flag">{item.flag}</Styled.OptionFlag>
      <Styled.OptionMethods>{printMethods}</Styled.OptionMethods>
    </Styled.OptionsItem>
  );
};

DocumentFlagBox.propTypes = {
  selectMethod: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default memo(DocumentFlagBox);
