## Description
This app includes two hungarian tv channels. Play live stream in external video player (Vlc, MxPlayer).
Also show the actual programme.
Features: multilanguage (hu, en), theme color picking, tv guide turning on/off, timeout limit for quering tv programme.
That's all folks! This is a practice project, no more!

## Requirements to build
- install NodeJs
- install npm
- install bower
```
npm install -g bower
```
- install cordova
```
npm install -g cordova
```
- install ionic
```
npm install -g ionic
```
- install andoid Sdk
- add ANDROID_HOME (Sdk) enviroment variable and tools path (Sdk/tools) to PATH enviroment variable

## Building
- add platform (android)
```
ionic platform android
```
- Add webintent plugin. To install the plugin, use the Cordova CLI and enter the following:
```
cordova plugin add https://github.com/Initsogar/cordova-webintent.git
```
- Confirm that the following is in your res/xml/config.xml file:
```
<plugin name="WebIntent" value="com.borismus.webintent.WebIntent" />
```
- Emulate or...
```
ionic emulate android.
```
- Run on device (usb connection needed)
```
ionic run android
```
- Or just build an apk.
```
ionic build android
```

## Possible errors handlings
- Not working in browser when testing it with `ionic serve -l` command:
  Open `www/js/services.js` (line 10) and comment out `"/android_asset/www/resource/channels.json"` and uncommit `"/resource/channels.json";`. 
- When using run or emulate command get an error about android target api not found.
  Don't worry just install the needed Android platform tool in android sdk.
