import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";

function Tab1() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.titleText}>Tab 1</Text>
    </View>
  );
}

function Tab2() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.titleText}>Tab 2</Text>
    </View>
  );
}

function MyTabBar({ state, descriptors, navigation }) {
  return (
    <View
      style={{
        flexDirection: "row",
        padding: "1rem",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1 }}
          >
            <Text
              style={{
                color: isFocused ? "#673ab7" : "#222",
                textAlign: "center",
                fontSize: "1.5rem"
              }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Tabs() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      tabBar={(props) => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Tab 1" component={Tab1} />
      <Tab.Screen name="Tab 2" component={Tab2} />
    </Tab.Navigator>
  );
}

function Joke({ route }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text style={styles.titleText}>{route.params.joke}</Text>
    </View>
  );
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent({ navigation, ...props }) {
  const makeRequest = async () => {
    const resp = await fetch(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=racist,sexist"
    );
    const data = await resp.json();
    alert(data.setup);
    navigation.navigate("Joke", { joke: data.delivery });
  };
  return (
    <DrawerContentScrollView {...props}>
      {/* <DrawerItemList {...props} /> */}
      <DrawerItem
        label="Tell me a joke"
        onPress={makeRequest}
        labelStyle={styles.jokeButton}
      />
    </DrawerContentScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Tabs" component={Tabs} />
        <Drawer.Screen name="Joke" component={Joke} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    padding: "1rem",
  },
  jokeButton: {
    fontSize: 30,
    boxShadow: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
    backgroundColor: "black",
    color: "white",
    textAlign: "center",
    borderRadius: ".25rem",
    padding: ".5rem",
  },
});
