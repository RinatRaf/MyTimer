import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {VisibleTimerEvent} from '..';
import {observer} from 'mobx-react-lite';

type TimerItemProps = {
  event: VisibleTimerEvent;
  onDelete: (title: string) => void;
};

export const TimerItem = observer(({event, onDelete}: TimerItemProps) => {
  return (
    <View pointerEvents="box-none" style={styles.content}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{event.name}</Text>
        <Text>{event.timeLeftString}</Text>
      </View>
      <Button
        title="Удалить"
        onPress={() => {
          onDelete(event.name);
        }}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  content: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'black',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  textContainer: {
    flexBasis: '80%',
    overflow: 'hidden',
  },
});
