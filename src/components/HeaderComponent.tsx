import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { TimerIcon } from './icons/TimerIcon';
import { InfoIcon } from './icons/InfoIcon';

type Props = {
  title: string;
  showAddBtn?: boolean;
  onAddPress?: () => void;
  leftIcon?: 'i';
  rightIcon?: 'timer';
  onLeftPress?: () => void;
  onRightPress?: () => void;
};

export default function HeaderComponent({
  title,
  showAddBtn = false,
  onAddPress,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
}: Props) {
  return (
    <View style={styles.container}>

      {/* LEFT */}
      <View style={styles.side}>
        {leftIcon === 'i' && (
          <TouchableOpacity onPress={onLeftPress}>
            <InfoIcon />
          </TouchableOpacity>
        )}
      </View>

      {/* TITLE */}
      <Text style={styles.title}>{title}</Text>

      {/* RIGHT */}
      <View style={styles.side}>
        {rightIcon === 'timer' && (
          <TouchableOpacity onPress={onRightPress}>
            <TimerIcon />
          </TouchableOpacity>
        )}

        {showAddBtn && (
          <TouchableOpacity onPress={onAddPress}>
            <Text style={styles.iconText}>＋</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  side: {
    width: 40,
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'Cinzel',
    fontWeight: '600',
    fontSize: 18,
    color: '#FFFFFF',
    letterSpacing: 1.2,
  },
  iconText: {
    fontFamily: 'Inter Tight',
    fontWeight: '600',
    fontSize: 18,
    color: '#9BA4FF',
  },
});
