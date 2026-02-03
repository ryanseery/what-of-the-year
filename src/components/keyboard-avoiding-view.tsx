import { FC } from "react";
import {
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from "react-native";

const baseBehavior = Platform.OS === "ios" ? "padding" : "height";

export const KeyboardAvoidingView: FC<KeyboardAvoidingViewProps> = ({
  children,
  behavior = baseBehavior,
  ...rest
}) => {
  return (
    <RNKeyboardAvoidingView behavior={behavior} {...rest}>
      {children}
    </RNKeyboardAvoidingView>
  );
};
