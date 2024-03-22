import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {EventCreatorScreen, TimerListScreen} from './timer-logic';
import {
  useNavigation,
  type NavigationProp,
  type RouteProp,
} from '@react-navigation/native';
import {Button} from 'react-native';

export type StackNavigatorParamList = {
  TimerList: {};
  EventCreatorScreen: {
    eventId?: string;
  };
};

export type StackNavigatorProp<
  RouteName extends keyof StackNavigatorParamList,
> = NavigationProp<StackNavigatorParamList, RouteName>;

export type StackRouteProp<RouteName extends keyof StackNavigatorParamList> =
  RouteProp<StackNavigatorParamList, RouteName>;

export type StackNavigatorNavParams<
  RouteName extends keyof StackNavigatorParamList,
> = {
  navigation: StackNavigatorProp<RouteName>;
  route: StackRouteProp<RouteName>;
};

const StackNavigator = createNativeStackNavigator<StackNavigatorParamList>();

export const Navigator = ({}) => {
  const navigation = useNavigation<StackNavigatorProp<'TimerList'>>();
  const navigateToEventCreator = () => {
    navigation.navigate('EventCreatorScreen', {});
  };

  return (
    <StackNavigator.Navigator>
      <StackNavigator.Screen
        name="TimerList"
        component={TimerListScreen}
        options={{
          title: 'Главная',
          headerRight: () => (
            <Button title={'Создать'} onPress={navigateToEventCreator} />
          ),
        }}
      />
      <StackNavigator.Screen
        name="EventCreatorScreen"
        component={EventCreatorScreen}
        options={{
          title: 'Создать таймер',
        }}
      />
    </StackNavigator.Navigator>
  );
};
