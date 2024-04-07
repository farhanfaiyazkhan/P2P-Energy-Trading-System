#include <WiFi.h>
#include <PubSubClient.h>

const char* ssid = "Farhan Khan_2G";
const char* password = "WWwi3SXegxHap1namhs8";
const char* mqtt_server = "192.168.0.102";
const char* light_topic = "room/light";
const char* current_topic = "room/current";
const int relayPin = 2;
const int currentSensorPin = 4;
const float sensitivity = 0.066;

WiFiClient espClient;
PubSubClient client(espClient);

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void callback(String topic, byte* message, unsigned int length) {
  Serial.print("Message arrived on topic: ");
  Serial.print(topic);
  Serial.print(". Message: ");
  String messageInfo;
  
  for (int i = 0; i < length; i++) {
    Serial.print((char)message[i]);
    messageInfo += (char)message[i];
  }
  Serial.println();

  if (topic == light_topic) {
    const int time = atoi(messageInfo.c_str());
    
    Serial.println("Turning ON");
    digitalWrite(relayPin, LOW);
    
    delay(time);
    
    Serial.println("Turning OFF");
    digitalWrite(relayPin, HIGH);
  }
  Serial.println();
}


void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESP32Client-";
    clientId += String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      client.subscribe(light_topic);
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}


void setup() {
  Serial.begin(115200);

  Serial.println("\033[2J\033[H");
  
  pinMode(relayPin, OUTPUT);
  pinMode(currentSensorPin, INPUT);
  
  digitalWrite(relayPin, LOW);


  setup_wifi();

  delay(10000);
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  int sensorValue = analogRead(currentSensorPin);
  float voltage = sensorValue * (3.3 / 4095);
  float current = voltage / sensitivity;
  float cR = 25 + random(0, 500) / 100.0;
  String currentStr = String(cR, 2);
  client.publish(current_topic, currentStr.c_str());

  delay(1000);
}
