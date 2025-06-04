import AntDesign from "@expo/vector-icons/AntDesign";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

import PhonePePaymentSDK from "react-native-phonepe-pg";

const environments = [
  { label: "SANDBOX", value: "SANDBOX" },
  { label: "PRODUCTION", value: "PRODUCTION" },
];

const PhonePeScreen = () => {
  const [requestBody, setRequestBody] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [merchantId, setMerchantId] = useState<string>("MUID" + Date.now());
  const [flowId, setFlowId] = useState<string>("Testing_Flow_" + Date.now());
  const [environmentDropDownValue, setEnvironmentValue] =
    useState("PRODUCTION");
  const [isFocus, setIsFocus] = useState(false);
  const [callbackURL, setCallbackURL] = useState<string>("reactDemoAppScheme");

  const initPhonePeSDK = () => {
    console.log("PhonePePaymentSDK", PhonePePaymentSDK);

    PhonePePaymentSDK.init(environmentDropDownValue, merchantId, flowId, true)
      .then((result) => {
        setMessage("Message: SDK Initialisation ->" + JSON.stringify(result));
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  };

  const handleStartTransaction = () => {
    PhonePePaymentSDK.startTransaction(requestBody, callbackURL)
      .then((a) => {
        setMessage(JSON.stringify(a));
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  };

  const getUPIAppsInstalled = () => {
    if (Platform.OS === "ios") {
      getUPIAppsInstalledForiOS();
    } else {
      PhonePePaymentSDK.getUpiAppsForAndroid()
        .then((a) => {
          console.log(a);
          setMessage(JSON.stringify(a));
        })
        .catch((error) => {
          setMessage("error:" + error.message);
        });
    }
  };

  const getUPIAppsInstalledForiOS = () => {
    PhonePePaymentSDK.getUPIAppsInstalledforIos()
      .then((a) => {
        setMessage(JSON.stringify(a));
      })
      .catch((error) => {
        setMessage("error:" + error.message);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Payment Gateway</Text>

          <Text style={styles.label}>Merchant ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Merchant ID"
            placeholderTextColor="gray"
            value={merchantId}
            onChangeText={setMerchantId}
          />

          <Text style={styles.label}>FLOW ID:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Flow ID"
            placeholderTextColor="gray"
            value={flowId}
            onChangeText={setFlowId}
          />

          <Text style={styles.label}>Environment:</Text>
          <Dropdown
            style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            data={environments}
            labelField="label"
            valueField="value"
            placeholder={!isFocus ? "Select environment" : "..."}
            value={environmentDropDownValue}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={(item) => {
              setEnvironmentValue(item.value);
              setIsFocus(false);
            }}
            renderLeftIcon={() => (
              <AntDesign
                style={styles.icon}
                color={isFocus ? "blue" : "black"}
                name="Safety"
                size={20}
              />
            )}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={() => initPhonePeSDK()}
          >
            <Text style={styles.buttonText}>Init SDK</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Request Body:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter request body"
            placeholderTextColor="gray"
            multiline
            numberOfLines={4}
            value={requestBody}
            onChangeText={setRequestBody}
          />

          <Text style={styles.label}>App Schema:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter app schema URL"
            placeholderTextColor="gray"
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleStartTransaction}
          >
            <Text style={styles.buttonText}>Start Transaction</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={getUPIAppsInstalled}>
            <Text style={styles.buttonText}>Check Installed Apps</Text>
          </TouchableOpacity>

          <Text style={styles.message}>MerchanId: {merchantId} </Text>
          <Text style={styles.message}>flowId: {flowId} </Text>
          <Text style={styles.message}>Request Body: {requestBody} </Text>
          <Text style={styles.message}>Message: {message} </Text>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: "#f9f9f9",
    marginTop: 4,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "gray",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "black",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  icon: {
    marginRight: 5,
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    borderRadius: 6,
    marginTop: 16,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  message: {
    marginTop: 20,
    fontSize: 14,
    color: "#333",
  },
});

export default PhonePeScreen;
