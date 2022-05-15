import MainView from './components/MainView';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

export default function App() {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#37467D" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          fontWeight: "600",
        }}
        text2Style={{
          fontSize: 15,
          fontWeight: "600",
        }}
      />
    ),
  };

  return (
    <>
      <MainView />
      <Toast config={toastConfig} />
    </>
  );
}


