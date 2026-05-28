import {PermissionsAndroid, Platform} from 'react-native';

export const requestPhotoLibraryPermission = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Number(Platform.Version) >= 34) {
    const statuses = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VISUAL_USER_SELECTED,
    ]);

    return Object.values(statuses).some(
      status => status === PermissionsAndroid.RESULTS.GRANTED,
    );
  }

  if (Number(Platform.Version) >= 33) {
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
    );

    return status === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  );

  return status === PermissionsAndroid.RESULTS.GRANTED;
};
