// // // utils/downloadHandler.js
// // import RNFS from 'react-native-fs';
// // import { Alert, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

// // // Check if file exists at path
// // const fileExists = async (path) => {
// //   try {
// //     return await RNFS.exists(path);
// //   } catch (e) {
// //     console.log('Error checking if file exists:', e);
// //     return false;
// //   }
// // };

// // // Permission Request function with better error handling
// // export const requestStoragePermission = async () => {
// //   if (Platform.OS !== 'android') return true;
  
// //   try {
// //     // For Android 13+ (API 33+)
// //     if (parseInt(Platform.Version, 10) >= 33) {
// //       const permissions = [
// //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
// //         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
// //       ];
      
// //       const results = await PermissionsAndroid.requestMultiple(permissions);
      
// //       return (
// //         results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
// //         results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED
// //       );
// //     } 
// //     // For Android 12 and below
// //     else {
// //       const granted = await PermissionsAndroid.request(
// //         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
// //         {
// //           title: 'Storage Permission',
// //           message: 'App needs access to your storage to download images',
// //           buttonNeutral: 'Ask Me Later',
// //           buttonNegative: 'Cancel',
// //           buttonPositive: 'OK',
// //         }
// //       );
// //       return granted === PermissionsAndroid.RESULTS.GRANTED;
// //     }
// //   } catch (err) {
// //     console.warn('Permission request error:', err);
// //     return false;
// //   }
// // };

// // // Get a valid download path based on platform and Android version
// // const getDownloadPath = async (filename) => {
// //   if (Platform.OS === 'ios') {
// //     return `${RNFS.DocumentDirectoryPath}/${filename}`;
// //   }
  
// //   // For Android
// //   if (parseInt(Platform.Version, 10) >= 30) { // Android 11+
// //     // For Android 11+, use app-specific external storage
// //     return `${RNFS.ExternalDirectoryPath}/${filename}`;
// //   } else {
// //     // For older Android versions
// //     const dirs = [
// //       RNFS.DownloadDirectoryPath,
// //       RNFS.ExternalStorageDirectoryPath + '/Download',
// //       RNFS.ExternalDirectoryPath
// //     ];
    
// //     // Try to find a directory that exists and is writable
// //     for (const dir of dirs) {
// //       try {
// //         const exists = await RNFS.exists(dir);
// //         if (exists) {
// //           return `${dir}/${filename}`;
// //         }
// //       } catch (e) {
// //         console.log(`Directory ${dir} not accessible:`, e);
// //       }
// //     }
    
// //     // Default fallback
// //     return `${RNFS.ExternalDirectoryPath}/${filename}`;
// //   }
// // };

// // // Improved download handler function
// // export const handleDownload = async (uri) => {
// //   console.log("Starting download process for:", uri);
  
// //   try {
// //     // Show download starting toast
// //     if (Platform.OS === 'android') {
// //       ToastAndroid.show('Starting download...', ToastAndroid.SHORT);
// //     }
    
// //     // Request permissions
// //     const hasPermission = await requestStoragePermission();
// //     if (!hasPermission) {
// //       console.log("Permission Denied");
// //       Alert.alert(
// //         'Permission Denied', 
// //         'Storage permission is required for downloading files. Please enable it in app settings.'
// //       );
// //       return;
// //     }

// //     // Extract filename from URL
// //     let filename = uri.substring(uri.lastIndexOf('/') + 1);
    
// //     // Ensure filename has an extension
// //     if (!filename.includes('.')) {
// //       // Default to jpg for images without extension
// //       filename += '.jpg';
// //     }
    
// //     // Get appropriate download path
// //     const downloadPath = await getDownloadPath(filename);
// //     console.log(`Downloading to: ${downloadPath}`);
    
// //     // Check if file already exists
// //     const fileAlreadyExists = await fileExists(downloadPath);
// //     if (fileAlreadyExists) {
// //       console.log("File already exists, will be overwritten");
// //     }
    
// //     // Make sure the directory exists
// //     const downloadDir = downloadPath.substring(0, downloadPath.lastIndexOf('/'));
// //     await RNFS.mkdir(downloadDir, { NSURLIsExcludedFromBackupKey: true });

// //     // Start the download
// //     const { jobId, promise } = RNFS.downloadFile({
// //       fromUrl: uri,
// //       toFile: downloadPath,
// //       background: true,
// //       discretionary: true,
// //       progress: (res) => {
// //         const progress = res.bytesWritten / res.contentLength;
// //         // Show progress every 20%
// //         if (progress % 0.2 < 0.01) {
// //           console.log(`Download progress: ${(progress * 100).toFixed(0)}%`);
// //           if (Platform.OS === 'android') {
// //             ToastAndroid.show(`Download: ${(progress * 100).toFixed(0)}%`, ToastAndroid.SHORT);
// //           }
// //         }
// //       }
// //     });

// //     // Wait for download to complete
// //     const result = await promise;
// //     console.log("Download result:", result);

// //     // Check if file was downloaded successfully
// //     if (result.statusCode === 200) {
// //       const exists = await fileExists(downloadPath);
// //       if (exists) {
// //         console.log("Download completed successfully, file exists at path");
        
// //         // Show success notification
// //         if (Platform.OS === 'android') {
// //           ToastAndroid.show('Download completed!', ToastAndroid.LONG);
// //         }
        
// //         let displayPath;
// //         if (Platform.OS === 'android' && parseInt(Platform.Version, 10) >= 30) {
// //           displayPath = 'app\'s storage';
// //         } else if (Platform.OS === 'android') {
// //           displayPath = 'Downloads folder';
// //         } else {
// //           displayPath = 'app documents';
// //         }
        
// //         Alert.alert(
// //           'Downloaded Successfully!', 
// //           `Image saved to ${displayPath}.`
// //         );
        
// //         // For Android 11+, we need to use MediaStore API to make it visible
// //         // This is a simplified approach - just inform the user
// //         if (Platform.OS === 'android' && parseInt(Platform.Version, 10) >= 30) {
// //           Alert.alert(
// //             'Note',
// //             'On Android 11+, files are saved to app-specific storage. You can find it in File Manager > Internal Storage > Android > data > [your.app.package] > files'
// //           );
// //         }
        
// //         return true;
// //       } else {
// //         throw new Error("File not found after download");
// //       }
// //     } else {
// //       throw new Error(`Server returned status code ${result.statusCode}`);
// //     }
// //   } catch (error) {
// //     console.error("Download error:", error);
    
// //     // Show error notification
// //     if (Platform.OS === 'android') {
// //       ToastAndroid.show('Download failed!', ToastAndroid.LONG);
// //     }
    
// //     // Show detailed error message
// //     Alert.alert(
// //       'Download Failed', 
// //       `Could not download image: ${error.message || 'Unknown error'}\n\nPlease check your internet connection and try again.`
// //     );
    
// //     return false;
// //   }
// // };


// // utils/downloadHandler.js
// import RNFS from 'react-native-fs';
// import { Alert, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

// // Permission Request function specifically for Download folder access
// export const requestStoragePermission = async () => {
//   if (Platform.OS !== 'android') return true;
  
//   try {
//     // For Android 13+ (API 33+)
//     if (parseInt(Platform.Version, 10) >= 33) {
//       const permissions = [
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//         PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
//       ];
      
//       const results = await PermissionsAndroid.requestMultiple(permissions);
      
//       return (
//         results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
//         results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED
//       );
//     } 
//     // For Android 12 and below
//     else {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'App needs access to your storage to download images to your Download folder',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//   } catch (err) {
//     console.warn('Permission request error:', err);
//     return false;
//   }
// };

// // Function to determine correct download folder path
// const getDownloadFolderPath = async () => {
//   // For Android
//   if (Platform.OS === 'android') {
//     // Try the standard Download directory first
//     if (RNFS.DownloadDirectoryPath) {
//       return RNFS.DownloadDirectoryPath;
//     }
    
//     // Fallback options if the standard path isn't available
//     const fallbackPaths = [
//       `${RNFS.ExternalStorageDirectoryPath}/Download`,
//       `${RNFS.ExternalStorageDirectoryPath}/Downloads`,
//     ];
    
//     for (const path of fallbackPaths) {
//       try {
//         const exists = await RNFS.exists(path);
//         if (exists) {
//           return path;
//         }
//       } catch (e) {
//         console.log(`Path check error for ${path}:`, e);
//       }
//     }
    
//     // Last resort - try to create the Download directory
//     const downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download`;
//     try {
//       await RNFS.mkdir(downloadPath);
//       return downloadPath;
//     } catch (e) {
//       console.log('Error creating Download directory:', e);
//     }
//   }
  
//   // For iOS - we can't access the system Download folder, so use Documents
//   return RNFS.DocumentDirectoryPath;
// };

// // Improved download handler for all photos
// export const downloadAllPhotos = async (photoUrls) => {
//   // Request permissions first
//   const hasPermission = await requestStoragePermission();
//   if (!hasPermission) {
//     console.log("Permission Denied");
//     Alert.alert(
//       'Permission Denied', 
//       'Storage permission is required for downloading files to Download folder.'
//     );
//     return;
//   }
  
//   // Get the download folder path
//   const downloadFolder = await getDownloadFolderPath();
//   console.log(`Using download folder: ${downloadFolder}`);
  
//   if (Platform.OS === 'android') {
//     ToastAndroid.show(`Starting download of ${photoUrls.length} photos...`, ToastAndroid.SHORT);
//   }
  
//   // Track success and failures
//   let successCount = 0;
//   let failCount = 0;
  
//   // Download each photo
//   for (let i = 0; i < photoUrls.length; i++) {
//     const uri = photoUrls[i];
//     try {
//       // Extract filename from URL, handle URLs without clear filenames
//       let filename = uri.substring(uri.lastIndexOf('/') + 1);
      
//       // Clean up the filename and ensure it has an extension
//       filename = filename.split('?')[0]; // Remove query parameters
//       if (!filename.includes('.')) {
//         filename += '.jpg'; // Default extension
//       }
      
//       // Add timestamp to prevent overwrites
//       const timestamp = new Date().getTime();
//       const parts = filename.split('.');
//       const ext = parts.pop();
//       const name = parts.join('.');
//       const uniqueFilename = `${name}_${timestamp}.${ext}`;
      
//       const downloadPath = `${downloadFolder}/${uniqueFilename}`;
//       console.log(`Downloading ${i+1}/${photoUrls.length} to: ${downloadPath}`);
      
//       if (Platform.OS === 'android') {
//         ToastAndroid.show(`Downloading image ${i+1}/${photoUrls.length}...`, ToastAndroid.SHORT);
//       }
      
//       // Execute the download
//       const { promise } = RNFS.downloadFile({
//         fromUrl: uri,
//         toFile: downloadPath,
//         background: true,
//       });
      
//       const result = await promise;
      
//       if (result.statusCode === 200) {
//         console.log(`Download ${i+1} successful!`);
//         successCount++;
//       } else {
//         console.error(`Download ${i+1} failed with status: ${result.statusCode}`);
//         failCount++;
//       }
//     } catch (error) {
//       console.error(`Error downloading ${i+1}:`, error);
//       failCount++;
//     }
//   }
  
//   // Show final results
//   const message = `Downloaded ${successCount} of ${photoUrls.length} photos to Download folder.${failCount > 0 ? ` ${failCount} failed.` : ''}`;
  
//   if (Platform.OS === 'android') {
//     ToastAndroid.show(message, ToastAndroid.LONG);
//   }
  
//   Alert.alert(
//     'Download Complete', 
//     message
//   );
// };

// // Single photo download handler
// export const handleDownload = async (uri) => {
//   await downloadAllPhotos([uri]);
// };


// utils/downloadHandler.js
import RNFS from 'react-native-fs';
import { Alert, PermissionsAndroid, Platform, ToastAndroid } from 'react-native';

// Permission Request function with better error handling
export const requestStoragePermission = async () => {
  if (Platform.OS !== 'android') return true;
  
  try {
    // For Android 13+ (API 33+)
    if (parseInt(Platform.Version, 10) >= 33) {
      const permissions = [
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
      ];
      
      const results = await PermissionsAndroid.requestMultiple(permissions);
      
      return (
        results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] === PermissionsAndroid.RESULTS.GRANTED &&
        results[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] === PermissionsAndroid.RESULTS.GRANTED
      );
    } 
    // For Android 12 and below
    else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to your storage to download images',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  } catch (err) {
    console.warn('Permission request error:', err);
    return false;
  }
};

// Function to determine correct download folder path
const getDownloadFolderPath = async () => {
  // For Android
  if (Platform.OS === 'android') {
    // Try the standard Download directory first
    if (RNFS.DownloadDirectoryPath) {
      return RNFS.DownloadDirectoryPath;
    }
    
    // Fallback options if the standard path isn't available
    const fallbackPaths = [
      `${RNFS.ExternalStorageDirectoryPath}/Download`,
      `${RNFS.ExternalStorageDirectoryPath}/Downloads`,
    ];
    
    for (const path of fallbackPaths) {
      try {
        const exists = await RNFS.exists(path);
        if (exists) {
          return path;
        }
      } catch (e) {
        console.log(`Path check error for ${path}:`, e);
      }
    }
    
    // Last resort - try to create the Download directory
    const downloadPath = `${RNFS.ExternalStorageDirectoryPath}/Download`;
    try {
      await RNFS.mkdir(downloadPath);
      return downloadPath;
    } catch (e) {
      console.log('Error creating Download directory:', e);
    }
  }
  
  // For iOS - we can't access the system Download folder, so use Documents
  return RNFS.DocumentDirectoryPath;
};

// Create a unique filename to avoid overwriting
const createUniqueFilename = (baseFilename) => {
  // Extract name and extension
  let filename = baseFilename.split('?')[0]; // Remove query parameters
  if (!filename.includes('.')) {
    filename += '.jpg'; // Default extension
  }
  
  // Add timestamp to prevent overwrites
  const timestamp = new Date().getTime();
  const parts = filename.split('.');
  const ext = parts.pop();
  const name = parts.join('.');
  
  return `${name}_${timestamp}.${ext}`;
};

// Single photo download handler
export const handleDownload = async (uri) => {
  console.log("Starting download process for:", uri);
  
  // Request permissions
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log("Permission Denied");
    Alert.alert(
      'Permission Denied', 
      'Storage permission is required for downloading files.'
    );
    return;
  }

  try {
    // Show download starting toast
    if (Platform.OS === 'android') {
      ToastAndroid.show('Starting download...', ToastAndroid.SHORT);
    }
    
    // Extract filename from URL
    const baseFilename = uri.substring(uri.lastIndexOf('/') + 1);
    const uniqueFilename = createUniqueFilename(baseFilename);
    
    // Get download folder path
    const downloadFolder = await getDownloadFolderPath();
    const downloadPath = `${downloadFolder}/${uniqueFilename}`;
    
    console.log(`Downloading to: ${downloadPath}`);

    // Start the download
    const { jobId, promise } = RNFS.downloadFile({
      fromUrl: uri,
      toFile: downloadPath,
      background: true,
      discretionary: true,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
      }
    });

    // Wait for download to complete
    const result = await promise;
    console.log("Download complete!", result);

    if (result.statusCode === 200) {
      // Show success notification
      if (Platform.OS === 'android') {
        ToastAndroid.show('Download completed!', ToastAndroid.LONG);
      }
      
      Alert.alert(
        'Downloaded!', 
        `Image saved to Downloads folder.`
      );
      return true;
    } else {
      throw new Error(`Server returned status code ${result.statusCode}`);
    }
  } catch (error) {
    console.error("Download error:", error);
    
    // Show error notification
    if (Platform.OS === 'android') {
      ToastAndroid.show('Download failed!', ToastAndroid.LONG);
    }
    
    Alert.alert('Error', `Failed to download image: ${error.message}`);
    return false;
  }
};

// Download all photos
export const downloadAllPhotos = async (photoUrls) => {
  // Request permissions first
  const hasPermission = await requestStoragePermission();
  if (!hasPermission) {
    console.log("Permission Denied");
    Alert.alert(
      'Permission Denied', 
      'Storage permission is required for downloading files.'
    );
    return;
  }
  
  // Get the download folder path
  const downloadFolder = await getDownloadFolderPath();
  console.log(`Using download folder: ${downloadFolder}`);
  
  if (Platform.OS === 'android') {
    ToastAndroid.show(`Starting download of ${photoUrls.length} photos...`, ToastAndroid.SHORT);
  }
  
  // Track success and failures
  let successCount = 0;
  let failCount = 0;
  
  // Download each photo
  for (let i = 0; i < photoUrls.length; i++) {
    const uri = photoUrls[i];
    try {
      // Extract filename from URL
      const baseFilename = uri.substring(uri.lastIndexOf('/') + 1);
      const uniqueFilename = createUniqueFilename(baseFilename);
      
      const downloadPath = `${downloadFolder}/${uniqueFilename}`;
      console.log(`Downloading ${i+1}/${photoUrls.length} to: ${downloadPath}`);
      
      if (Platform.OS === 'android') {
        ToastAndroid.show(`Downloading image ${i+1}/${photoUrls.length}...`, ToastAndroid.SHORT);
      }
      
      // Execute the download
      const { promise } = RNFS.downloadFile({
        fromUrl: uri,
        toFile: downloadPath,
        background: true,
      });
      
      const result = await promise;
      
      if (result.statusCode === 200) {
        console.log(`Download ${i+1} successful!`);
        successCount++;
      } else {
        console.error(`Download ${i+1} failed with status: ${result.statusCode}`);
        failCount++;
      }
    } catch (error) {
      console.error(`Error downloading ${i+1}:`, error);
      failCount++;
    }
  }
  
  // Show final results
  const message = `Downloaded ${successCount} of ${photoUrls.length} photos to Download folder.${failCount > 0 ? ` ${failCount} failed.` : ''}`;
  
  if (Platform.OS === 'android') {
    ToastAndroid.show(message, ToastAndroid.LONG);
  }
  
  Alert.alert(
    'Download Complete', 
    message
  );
};