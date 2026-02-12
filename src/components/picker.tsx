import WheelPicker from "@quidone/react-native-wheel-picker";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import { Platform, type ViewStyle } from "react-native";

import { createStyles } from "utils/theme";

interface PickerItem {
  value: string | number;
  label: string;
}

interface Props<T extends PickerItem> {
  data: T[];
  value: T;
  onValueChange: (v: T) => void;
  testID?: string;
}

export function Picker<T extends PickerItem>({ data, value, onValueChange, testID }: Props<T>) {
  const s = useStyles();

  const handleValueChanging = ({ item }: { item: PickerItem }) => {
    Haptics.selectionAsync();
    if (Platform.OS === "web") {
      const match = data.find((d) => d.value === item.value);
      if (match) onValueChange(match);
    }
  };

  const handleValueChanged = ({ item }: { item: PickerItem }) => {
    const match = data.find((d) => d.value === item.value);
    if (match) onValueChange(match);
  };

  return (
    <WheelPicker
      testID={testID}
      data={data}
      value={value.value}
      onValueChanging={handleValueChanging}
      onValueChanged={handleValueChanged}
      itemHeight={88}
      visibleItemCount={1}
      width="100%"
      itemTextStyle={s.item}
      style={s.picker}
    />
  );
}

const useStyles = createStyles((t) => ({
  item: {
    fontSize: t.text.size.title,
    fontWeight: t.text.weight.bold,
    color: t.colors.primary,
  },
  picker: {
    backgroundColor: t.colors.background,
    ...Platform.select({
      web: {
        cursor: "ns-resize",
      } as unknown as ViewStyle,
    }),
  },
}));
