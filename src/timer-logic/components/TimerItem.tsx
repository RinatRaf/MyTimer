import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {VisibleTimerEvent} from '..';
import {observer} from 'mobx-react-lite';
import {Gesture, GestureDetector, State} from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';

type TimerItemProps = {
  event: VisibleTimerEvent;
  onDelete: (title: string) => void;
  navigateToEventEditor: (eventId: string) => void;
};

const BUTTON_MARGIN = 8;
const ICON_SIZE = 24;

const AnimatedIcon = Animated.createAnimatedComponent(Icon);

export const TimerItem = observer(
  ({event, onDelete, navigateToEventEditor}: TimerItemProps) => {
    const dragX = useSharedValue(0);
    const {width} = useWindowDimensions();
    const eventId = event.id;
    const gesture = Gesture.Pan()
      .onChange(event => {
        if (event.translationX > 0) {
          return;
        }
        if (dragX.value === 0 && event.changeX > 0) {
          return;
        }
        dragX.value = event.translationX;
      })
      .onEnd(event => {
        console.log(width / 3);

        if (dragX.value <= -(width / 3)) {
          if (event.state === State.CANCELLED || event.state === State.FAILED) {
            return;
          }
          runOnJS(onDelete)(eventId);
        }
        dragX.value = withTiming(0);
      });
    const containerStyle = useAnimatedStyle(() => {
      return {
        transform: [{translateX: dragX.value}],
        flexDirection: 'row',
        flexWrap: 'nowrap',
      };
    });
    const rightButtonStyle = useAnimatedStyle(() => {
      const point = -BUTTON_MARGIN * 2 - ICON_SIZE;
      const translateX = interpolate(
        dragX.value,
        [point - 1, point, 0],
        [1, 0, 0],
      );

      return {
        width: ICON_SIZE,
        height: ICON_SIZE,
        transform: [
          {
            translateX: translateX,
          },
        ],
      };
    });

    const rightIconProps = useAnimatedStyle(() => {
      const third = width / 3;
      const scale = interpolate(
        dragX.value,
        [-width / 2, -third, 0],
        [1.2, 1, 1],
        Extrapolation.CLAMP,
      );

      return {
        transform: [
          {
            scale: scale,
          },
        ],
      };
    });

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View pointerEvents="box-none" style={[containerStyle]}>
          <View style={[styles.content, {width}]}>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{event.title}</Text>
              <Text>{event.timeLeftString}</Text>
            </View>
            <Button
              title="Изменить"
              onPress={() => {
                navigateToEventEditor(event.id);
              }}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              width: width,
              backgroundColor: 'red',
              height: 50,
              paddingLeft: BUTTON_MARGIN,
            }}>
            <Animated.View style={rightButtonStyle}>
              <AnimatedIcon
                size={ICON_SIZE}
                style={rightIconProps}
                name="trash-outline"
                color="white"
                backgroundColor="#f00"
              />
            </Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

const styles = StyleSheet.create({
  content: {
    height: 50,
    flexWrap: 'nowrap',
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
    flexBasis: '50%',
    overflow: 'hidden',
  },
});
