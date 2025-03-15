import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import FarmerList from "./screens/FarmerList";
import FarmerDetail from "./screens/FarmerDetail";
import RegsiterFarmer from "./screens/RegsiterFarmer";
import ForgetPassword from "./screens/ForgotPassword";
import SearchFaarmers from "./screens/SearchFaarmers";
import GenerateFarmerData from "./screens/GenerateFarmerData";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
        <Stack.Screen name="FarmerList" component={FarmerList} options={{ headerShown: false }} />
        <Stack.Screen name="FarmerDetail" component={FarmerDetail} options={{ headerShown: false }} />
        <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false }} />
        <Stack.Screen name="RegsiterFarmer" component={RegsiterFarmer} options={{ headerShown: false }} />
        <Stack.Screen name="SearchFarmer" component={SearchFaarmers} options={{ headerShown: false }} />
        <Stack.Screen name="GenerateFarmerData" component={GenerateFarmerData} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
