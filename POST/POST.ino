#include <Microduino_Tem_Hum.h>
Tem_Hum_S2 TempMonitor;

#include <U8glib.h>//OLED
U8GLIB_SSD1306_128X64 u8g(U8G_I2C_OPT_NONE); //设置OLED型号 

#include <SoftwareSerial.h>
SoftwareSerial mySerial(2, 3); /* RX:D3, TX:D2 */

#include <ESP8266.h>
#define EspSerial mySerial
#define UARTSPEED  9600
ESP8266 wifi(&EspSerial);                                    //定义一个ESP8266（wifi）的对象

#include <I2Cdev.h>          //调用库  

#define setFont_L u8g.setFont(u8g_font_7x13)
#define Light_PIN A2  //光照传感器接A2引脚

#define SSID        "I'm a WIFI" //热点名称
#define PASSWORD    "llp22119250"//WiFi密码
#define DEVICEID    "562268771" //OneNet上的设备ID
#define DEVICEID2   "577142245"
#define apiKey      "i8SBhcxVxuKcQoU2RKK30P1YieU=";//与设备绑定的APIKey

#define HOST_NAME   "api.heclouds.com"
#define HOST_PORT   (80)
#define INTERVAL_SENSOR   5000             //定义传感器采样时间间隔  597000
#define INTERVAL_NET      5000             //定义发送时间
                                 //调用库  


float sensor_tem,sensor_hum,sensor_lux; ;//基本数据
char  sensor_tem_c[7], sensor_hum_c[7], sensor_lux_c[7] ;    //换成char数组传输
char buf[10];

String jsonToSend,postString;                               //用于存储发送数据的字符串

unsigned long sensorlastTime = millis();
unsigned long net_time1 = millis();                          //数据上传服务器时间
unsigned long sensor_time = millis();                        //传感器采样时间计时器
                          
static const byte  GETDATA[]  PROGMEM = {
  "GET /devices/577142245/datastreams?datastream_ids=data,data_1 HTTP/1.1\r\napi-key:i8SBhcxVxuKcQoU2RKK30P1YieU=\r\nHost: api.heclouds.com\r\nConnection: close\r\n\r\n"
};

void setup(void)      
{         
    Serial.begin(9600);       //初始化串口波特率
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
   
   TempMonitor.begin();//传感器运行

}
void loop(void)      
{   
  if (sensor_time > millis())  sensor_time = millis();    
  if(millis() - sensor_time > INTERVAL_SENSOR)              //传感器采样时间间隔  
  {  
    getSensorData();                                        //读串口中的传感器数据
    sensor_time = millis();
  }   
  if (net_time1 > millis())  
      net_time1 = millis();
  if (millis() - net_time1 > INTERVAL_NET)                  //发送数据时间间隔
  {                
    updateSensorData();                                     //将数据上传到服务器的函数
    net_time1 = millis();
  }
  
  delay(1000);
 
}

void getSensorData()
{  
    //获取数据 
    sensor_tem = TempMonitor.getTemperature();  
    sensor_hum = TempMonitor.getHumidity();
    sensor_lux = analogRead(Light_PIN);   
    
    delay(1000);
    dtostrf(sensor_tem, 2, 1, sensor_tem_c);
    dtostrf(sensor_hum, 2, 1, sensor_hum_c);
    dtostrf(sensor_lux, 3, 1, sensor_lux_c);
    
    u8g.firstPage();//显示在LED上
 do {
   setFont_L;//选择字体
   u8g.setPrintPos(0, 10);//选择位置
   u8g.print("temperature:");//打印字符串
   u8g.setPrintPos(100, 10);
   u8g.print(sensor_tem);
   u8g.setPrintPos(0, 30);
   u8g.print("humidity:");
   u8g.setPrintPos(80,30);
   u8g.print(sensor_hum);
   u8g.setPrintPos(0, 50);
   u8g.print("light:");
   u8g.setPrintPos(80,50);
   u8g.print(sensor_lux);
 }while( u8g.nextPage() );
}
void updateSensorData() {
  if (wifi.createTCP(HOST_NAME, HOST_PORT)) { //建立TCP连接，如果失败，不能发送该数据
    Serial.print("create tcp ok\r\n");

    jsonToSend="{\"Temperature\":";
    dtostrf(sensor_tem,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"";
    jsonToSend+=",\"Humidity\":";
    dtostrf(sensor_hum,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"";
    jsonToSend+=",\"Light\":";
    dtostrf(sensor_lux,1,2,buf);
    jsonToSend+="\""+String(buf)+"\"}";

    postString="POST /devices/";
    postString+=DEVICEID;
    postString+="/datapoints?type=3 HTTP/1.1";
    postString+="\r\n";
    postString+="api-key:";
    postString+=apiKey;
    postString+="\r\n";
    postString+="Host:api.heclouds.com\r\n";
    postString+="Connection:close\r\n";
    postString+="Content-Length:";
    postString+=jsonToSend.length();
    postString+="\r\n";
    postString+="\r\n";
    postString+=jsonToSend;
    postString+="\r\n";
    postString+="\r\n";
    postString+="\r\n";

  const char *postArray = postString.c_str();                 //将str转化为char数组
  Serial.println(postArray);
  wifi.send((const uint8_t*)postArray, strlen(postArray));    //send发送命令，参数必须是这两种格式，尤其是(const uint8_t*)
  Serial.println("send success");   
   if (wifi.releaseTCP()) {
     Serial.print(F("release tcp ok\r\n"));
   } else {
     Serial.print(F("release tcp err\r\n"));
   }
   postArray = NULL;    //清空数组，等待下次传输数据
   delay(1000);
  }
   else 
  {
    Serial.print("create tcp err\r\n");
  }
  
 }



  
 

