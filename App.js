import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RNCamera } from 'react-native-camera';
import CameraRoll from '@react-native-community/cameraroll';
import RNFetchBlob from 'rn-fetch-blob';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native';

const maxDuration = 5;
const baseURL = 'https://friendschallenge.webredirect.org/api/v1/';
const url = 'files/';

export default function App() {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const hasAndroidPermission = useCallback(async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  }, []);

  const recordVideo = async (camera) => {
    try {
      setIsRecording(true);

      const options = {
        quality: RNCamera.Constants.VideoQuality['480p'],
        maxDuration: 5,
      };
      
      const data = await camera.recordAsync(options);
      setVideo(data);
      setIsRecording(false);
      if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
        return;
      }
  
      console.warn(data.uri);
      //CameraRoll.save(data.uri);

    } catch(error) {
      console.warn('error', error);
    
      setVideo(null);
      setIsRecording(false);

      Alert.alert('Ocurrio un error!!, vuelve a grabrar');
    }
  };

  const upladingVideo =  async () =>  {
    console.warn('video', video);
    /*const data = new FormData();
    data.append('file', RNFetchBlob.wrap(uri));
    data.append('file', {
      name: 'file',
      filename: 'file.mp4',
      type: 'video/mp4',
      uri,
      data: RNFetchBlob.wrap(uri) ,
    });
  
    try {
      let response = await fetch( `${api_config.baseURL}${url}`, {
          method: 'post',
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': token,
          },
          body: data
      });
      //console.log('try', response);
      return await response.json();
    }
    catch (error) {
        console.log('error response : ' + error);
        return error;
    }*/
  
    setLoading(true);
    const rnfetchfile = RNFetchBlob.wrap(video.uri);
    const token = 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImEyYjkxODJiMWI0NmNiN2ZjN2MzMTFlZTgwMjFhZDY1MmVlMjc2MjIiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5kcsOpcyBBbGJlcnRvIEdhbGxhcmRvIFlzbGEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDQuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy03OGFlT0FKSzdHVS9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNuVFpTV1ZMYzdCcFVQQkt4dThRUUQ2aUIxRUl3L3M5Ni1jL3Bob3RvLmpwZyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mcmllbmRzLWNoYWxsZW5nZS00OGYwOSIsImF1ZCI6ImZyaWVuZHMtY2hhbGxlbmdlLTQ4ZjA5IiwiYXV0aF90aW1lIjoxNjExMjgzMzk0LCJ1c2VyX2lkIjoiQUliOFRFdktrZVdyWmhnaERKd29ueDRqMDhzMSIsInN1YiI6IkFJYjhURXZLa2VXclpoZ2hESndvbng0ajA4czEiLCJpYXQiOjE2MTE0NTU4OTIsImV4cCI6MTYxMTQ1OTQ5MiwiZW1haWwiOiJhbmRyZXNnYWxsYXJkb3lzbGFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMDgwNzY0NjQ2MDc1Nzg3OTA0NjEiXSwiZW1haWwiOlsiYW5kcmVzZ2FsbGFyZG95c2xhQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.xKLnn309BrhPWHDHVuuuMgth26gPYT8qRBmBOkY9UPp5k-5AIowsvw97-N-A8Oj1qQQFolQqCjiwe4qSXhS06eoubgInA5cbHXqIfhTwgyK1FV0OxEMk2iyoxs2YWPRVcLuTByMSX4XpTualNNVj75KEChAKwcqXK2ztOLEdQr07bqkUmWV1DaTKyaJMN3ayZqsluzn76JEoHN8sgou-9H-iMpFxcgbeZx107ifjfi_BJOHjm-8JWldSgylZ8sCTugl-J5BqMV5kteSa5skTAQpKX9aiIpnhV45TjcZyXIOBrGrXrLfJ-yJ3bmdIA6L9EWJAN6nKi7YpL0qv5LWpAg';
   
    RNFetchBlob.fetch('POST', `${baseURL}${url}`, {
        Authorization: token,
        'Content-Type': 'multipart/form-data',
      },[
          { 
          
            data: rnfetchfile,
            type: 'video/mp4',
            filename: 'video.mp4',
            name: 'file', 
          }
      ]).then(async (response) => {
          console.warn('response first', response)
          return await response.json();
      })
      .then(response => {
        console.log('response', response)
        setLoading(false);
      })
      .catch((err) => {
        console.log('error original', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    (async () => {
    await hasAndroidPermission(); 
    })()
  }, [hasAndroidPermission]);



  return (
    <View style={styles.container}>
       <RNCamera
            style={styles.preview}
            useNativeZoom={true}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            {({ camera, status, recordAudioPermissionStatus }) => {
          
              return (
                <View style={styles.previewContainer}>
                  <View style={{ padding: 10 }}>
                    {video === null && <TouchableOpacity 
                    onPress={() => recordVideo(camera)}
                    style={{
                      backgroundColor: 'blue', 
                      alignItems:'center',
                      borderRadius: 5,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      width: 200,
                    }}>
                      <Text style={{color: 'white'}}>
                       {isRecording ? 'grabando...' : 'grabar video'}
                      </Text>
                    </TouchableOpacity>}
                    {video !== null && <TouchableOpacity 
                    onPress={upladingVideo}
                    style={{
                      backgroundColor: 'green', 
                      alignItems:'center',
                      borderRadius: 5,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      width: 200,
                    }}>
                      <Text style={{color: 'white'}}>
                       {loading ? 'enviando...' : 'enviar video'}
                      </Text>
                    </TouchableOpacity>}
                  </View>
                </View>
              );
            }}
          </RNCamera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    // justifyContent: 'flex-end',
    // alignItems: 'center',
  },
});
