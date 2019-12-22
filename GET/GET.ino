#include <ESP8266.h>
#include <Servo.h> //调用舵机函数库
#include "audio.h" //调用音频库

//预编译指令识别开发板
#ifdef ESP32
#error "This code is not recommended to run on the ESP32 platform! Please check your Tools->Board setting."
#endif

#if defined(__AVR_ATmega32U4__) || defined(__AVR_ATmega1284P__) || defined (__AVR_ATmega644P__) || defined(__AVR_ATmega128RFA1__)
#define EspSerial Serial1
#define UARTSPEED  115200
#endif

#if defined (__AVR_ATmega168__) || defined (__AVR_ATmega328__) || defined (__AVR_ATmega328P__)
#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); /* RX:D2, TX:D3 */

#define EspSerial mySerial
#define UARTSPEED  9600
#endif
//wifi信息
#define SSID        F("I'm a WIFI")
#define PASSWORD    F("llp22119250")

#define HOST_NAME   F("api.heclouds.com")//Onenet地址
#define HOST_PORT   (80)
char x1,x2;

static const byte  GETDATA[]  PROGMEM = {
  "GET /devices/577142245/datastreams?datastreams_id=data,data_1 HTTP/1.1\r\napi-key:i8SBhcxVxuKcQoU2RKK30P1YieU=\r\nHost: api.heclouds.com\r\nConnection: close\r\n\r\n"
};//"577142245"为设备ID
  //"data"、"data_1"为数据流名称
  //"i8SBhcxVxuKcQoU2RKK30P1YieU="为apiKey
  //一个空格都不能少哦

ESP8266 wifi(&EspSerial);

Servo myservo1;// 建立一个 Servo 物件
Servo myservo2;

void setup(void)
{
  audio_init(1,1,6);
  myservo2.attach(8);
  myservo1.attach(9);  // 将myservo接在 pin 9，初始化
  Serial.begin(115200);
  while (!Serial); // wait for Leonardo enumeration, others continue immediately
  Serial.print(F("setup begin\r\n"));
  delay(100);

  WifiInit(EspSerial, UARTSPEED);

  Serial.print(F("FW Version:"));
  Serial.println(wifi.getVersion().c_str());

  if (wifi.setOprToStationSoftAP()) {
    Serial.print(F("to station + softap ok\r\n"));
  } else {
    Serial.print(F("to station + softap err\r\n"));
  }

  if (wifi.joinAP(SSID, PASSWORD)) {
    Serial.print(F("Join AP success\r\n"));

    Serial.print(F("IP:"));
    Serial.println( wifi.getLocalIP().c_str());
  } else {
    Serial.print(F("Join AP failure\r\n"));
  }

  if (wifi.disableMUX()) {
    Serial.print(F("single ok\r\n"));
  } else {
    Serial.print(F("single err\r\n"));
  }

  Serial.print(F("setup end\r\n"));
}

void loop(void)
{
  if (wifi.createTCP(HOST_NAME, HOST_PORT)) {
    Serial.print(F("create tcp ok\r\n"));
  } else {
    Serial.print(F("create tcp err\r\n"));
  }

  wifi.sendFromFlash(GETDATA, sizeof(GETDATA)); //从Flash读取发送内容，节约内存

  uint8_t buffer[512] = {0};
  uint32_t len = wifi.recv(buffer, sizeof(buffer), 20000);
  if (len > 0) {
    Serial.print(F("Received:["));
    for (uint32_t i = 0; i < len; i++) {
      Serial.print((char)buffer[i]);
     }
    Serial.print(F("]\r\n"));
     x1=(char)buffer[301];
     x2=(char)buffer[415];//截取自己需要的数据（有时数据位置会不同）
     Serial.print(x1);//控制灯开关
     Serial.print(x2);//控制音频播放
 
  }

 

  if(x1=='1'){
      myservo1.write(40);
      myservo2.write(180);
      delay(1500);
  }
  else{
      myservo2.write(25 );
      myservo1.write(180);
      delay(1500);
  }//开关灯系统
  if(x2=='1'){
      audio_play();
      delay(5000);
  }
  else{
    audio_pause();
  };//音乐播放系统
}

