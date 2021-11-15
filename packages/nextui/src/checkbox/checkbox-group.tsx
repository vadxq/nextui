import React, { useEffect, useMemo, useState } from 'react';
import { CheckboxContext } from './checkbox-context';
import useWarning from '../use-warning';
import { NormalSizes, NormalColors } from '../utils/prop-types';
import { DefaultProps } from '../utils/default-props';
import useTheme from '../use-theme';
import { getSpacingsStyles } from '../utils/styles';
import withDefaults from '../utils/with-defaults';
import { __DEV__ } from '../utils/assertion';
import { getCheckboxSize } from './styles';

interface Props extends DefaultProps {
  value: string[];
  color?: NormalColors;
  textColor?: NormalColors;
  disabled?: boolean;
  size?: NormalSizes;
  onChange?: (values: string[]) => void;
  className?: string;
  row?: boolean;
}

const defaultProps = {
  color: 'primary' as NormalColors,
  textColor: 'default' as NormalColors,
  disabled: false,
  size: 'md' as NormalSizes | number,
  className: '',
  row: false
};

type NativeAttrs = Omit<React.HTMLAttributes<unknown>, keyof Props>;
export type CheckboxGroupProps = Props & typeof defaultProps & NativeAttrs;

const CheckboxGroup: React.FC<React.PropsWithChildren<CheckboxGroupProps>> = ({
  color,
  textColor,
  disabled,
  onChange,
  value,
  size,
  row,
  children,
  className,
  style,
  ...props
}) => {
  const [selfVal, setSelfVal] = useState<string[]>([]);
  if (!value && __DEV__) {
    value = [];
    useWarning('Props "value" is required.', 'Checkbox Group');
  }

  const theme = useTheme();

  const spacingStyle = getSpacingsStyles(theme, props);

  const updateState = (val: string, checked: boolean) => {
    const removed = selfVal.filter((v) => v !== val);
    const next = checked ? [...removed, val] : removed;
    setSelfVal(next);
    onChange && onChange(next);
  };

  const providerValue = useMemo(() => {
    return {
      updateState,
      color,
      textColor,
      disabledAll: disabled,
      inGroup: true,
      values: selfVal
    };
  }, [disabled, selfVal]);

  const fontSize = useMemo(() => getCheckboxSize(size), [size]);
  const groupGap = `calc(${fontSize} * 1)`;

  useEffect(() => {
    setSelfVal(value);
  }, [value.join(',')]);

  return (
    <CheckboxContext.Provider value={providerValue}>
      <div
        className={`nextui-checkbox-group ${className}`}
        role="group"
        style={{ ...style, ...spacingStyle }}
        {...props}
      >
        {children}
        <style jsx>{`
          .nextui-checkbox-group :global(.nextui-checkbox) {
            margin-top: ${row ? 0 : groupGap};
            margin-right: ${row ? groupGap : 0};
            --nextui-checkbox-size: ${fontSize};
          }
          .nextui-checkbox-group {
            display: flex;
            flex-direction: ${row ? 'row' : 'column'};
          }
        `}</style>
      </div>
    </CheckboxContext.Provider>
  );
};

export default withDefaults(CheckboxGroup, defaultProps);
