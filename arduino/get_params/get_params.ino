
#include <DHT11.h>

int pin=2;
DHT11 dht11(pin); 
void setup()
{
  Serial.begin(9600);      
  
}

void loop(){ 
  String json;
  int a=analogRead(A0);
  int b=analogRead(A1);
  float c,z;;
  dht11.read(c,z);
  int d=analogRead(A2);
  
  json="{\"ph\":";
  json+=a;
  json+=",\"luz\":";
  json+=b;
  json+=",\"temp\":";
  json+=c;
  json+=",\"level\":";
  json+=d;
  json+="}";
  Serial.println(json);
  delay(1000);
}
