import { Picker as RNPicker } from "@react-native-picker/picker";
import { View } from "react-native";

import { TOPIC_KEY, Topics } from "constants/topics";
import { createStyles } from "utils/theme";

interface Props {
  topics: Topics[];
  topic: TOPIC_KEY;
  onValueChange: (v: TOPIC_KEY) => void;
}

export function Picker({ topics, topic, onValueChange }: Props) {
  const s = useStyles();

  return (
    <View style={s.root}>
      <RNPicker
        selectedValue={topic}
        onValueChange={onValueChange}
        style={s.picker}
        itemStyle={s.item}
      >
        {topics.map((t) => (
          <RNPicker.Item key={t.key} label={t.label} value={t.key} />
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
