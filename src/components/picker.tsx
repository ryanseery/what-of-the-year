import { Picker as RNPicker } from "@react-native-picker/picker";
import { View } from "react-native";

import { createStyles } from "utils/theme";

interface PickerItem {
  key: string | number;
  label: string;
}

interface Props<T extends PickerItem> {
  data: T[];
  value: T;
  onValueChange: (v: T) => void;
}

export function Picker<T extends PickerItem>({ data, value, onValueChange }: Props<T>) {
  const s = useStyles();

  const onChange = (key: T["key"]) => {
    const item = data.find((d) => d.key === key);
    if (item) onValueChange(item);
  };

  return (
    <View style={s.root}>
      <RNPicker<T["key"]>
        selectedValue={value.key}
        onValueChange={onChange}
        style={s.picker}
        itemStyle={s.item}
      >
        {data.map((d) => (
          <RNPicker.Item key={d.key} label={d.label} value={d.key} />
        ))}
      </RNPicker>
    </View>
  );
}

const useStyles = createStyles((t) => ({
  root: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: t.spacing.md,
  },
  pickerContainer: {
    width: "100%",
    overflow: "hidden",
  },
  item: {
    fontSize: 72,
    fontWeight: t.text.weight.bold,
    color: t.colors.primary,
    height: 88,
  },
  picker: {
    width: "100%",
    height: 120,
    backgroundColor: t.colors.background,
    color: t.colors.primary,
  },
}));
