import { Button } from '/@/components/ui/atomic-components';
import { CollectionsApi } from '/@/data/collections';
import { inlineIconsMap } from '/@/data/collections/iconActions/inlineIconsMap';
import { useOnActionClick } from '/@/data/collections/iconActions/useOnActionClick';
import { getIconActionOfCollection } from '/@/data/collections/iconActions/utils';
import type { Icon } from '/@/data/icons';
import type { FC } from 'react';
import { useState } from 'react';
import { GlobalHotKeys } from 'react-hotkeys';
import { platformBasedText } from '/@/utils/platformText';
import { useQuery } from 'react-query';

const keyMap = {
  COLLECTION_FIRST_ACTION: ['cmd+shift+c', 'ctrl+shift+c'],
};

export const IconActionsButton: FC<React.PropsWithChildren<{
  icon: Icon;
}>> = ({ icon }) => {
  const [intermText, setIntermText] = useState('');

  const { data: collection } = useQuery(['icon-collection', icon.collectionId], () => CollectionsApi.find(icon.collectionId));
  const iconActions = getIconActionOfCollection(collection);

  const onActionClick = useOnActionClick();

  const onActionBtnClick = () => {
    onActionClick({
      actionObj: iconActions[0],
      icon,
    });

    let text = 'DONE!';
    if (iconActions[0].action.includes('copy')) {
      text = 'COPIED!';
    }
    setIntermText(text);
    setTimeout(() => {
      setIntermText('');
    }, 1500);
  };

  const handlers = {
    COLLECTION_FIRST_ACTION: () => onActionBtnClick(),
  };

  if (iconActions[0]) {
    return (
      <div>
        <GlobalHotKeys keyMap={keyMap} handlers={handlers} allowChanges />

        <Button type="primary" className="w-full" onClick={onActionBtnClick}>
          {intermText && intermText}
          {!intermText && (
            <>
              <div className="mr-2">{inlineIconsMap[iconActions[0].icon]}</div>
              <div>{iconActions[0].name}</div>
              &nbsp;
              <span className="text-xs">
                (
                {platformBasedText({
                  mac: '⌘⇧C',
                  win: 'Ctrl+Shift+c',
                  linux: 'Ctrl+Shift+c',
                })}
                )
              </span>
            </>
          )}
        </Button>
      </div>
    );
  }

  return <></>;
};
